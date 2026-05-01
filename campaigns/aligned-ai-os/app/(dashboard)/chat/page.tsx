"use client";

import {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Send, Loader2, Mic, ChevronLeft, MessageSquare, Sparkles, Pencil, Check, X } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import ReactMarkdown from "react-markdown";
import { SUGGESTED_QUESTIONS } from "@/lib/ai/prompts";
import { ONBOARDING_SECTIONS, TOTAL_SECTIONS, getSectionByIndex } from "@/lib/ai/onboarding-sections";
import type { OnboardingState } from "@/lib/db/schema";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Internal kickoff message used so Alfred can speak first in guided flows.
// Persisted to DB so resumes work, but filtered out of the visible chat.
const ONBOARDING_KICKOFF_USER_MESSAGE = "[Begin guided onboarding]";

function ChatPageInner() {
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("mode") === "onboarding";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [onboardingInitState, setOnboardingInitState] = useState<"idle" | "loading" | "ready" | "error">(
    isOnboarding ? "loading" : "idle"
  );
  const [onboardingState, setOnboardingState] = useState<OnboardingState | null>(null);
  const [reviseModalOpen, setReviseModalOpen] = useState(false);
  const [finalizedNotice, setFinalizedNotice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const conversationIdRef = useRef<string | null>(null);
  const urlPromptConsumed = useRef(false);
  const onboardingInitStarted = useRef(false);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // When Alfred finalizes onboarding, the server has already generated the
  // Blueprints and flipped onboardingComplete. Show a brief notice, then drop
  // the user into the regular coaching chat (no ?mode=onboarding).
  useEffect(() => {
    if (!onboardingState?.finalized || finalizedNotice) return;
    setFinalizedNotice(true);
    const t = window.setTimeout(() => {
      window.location.href = "/chat";
    }, 4500);
    return () => window.clearTimeout(t);
  }, [onboardingState?.finalized, finalizedNotice]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(
    async (content?: string, opts?: { kickoff?: boolean }) => {
      if (isStreaming) return;
      const isKickoff = opts?.kickoff === true;
      const messageContent = isKickoff
        ? ""
        : content !== undefined
          ? content.trim()
          : input.trim();
      if (!isKickoff && !messageContent) return;

      setInput("");
      setShowSuggestions(false);
      setIsStreaming(true);

      const userMessage: Message | null = isKickoff
        ? null
        : {
            id: crypto.randomUUID(),
            role: "user",
            content: messageContent,
          };

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      const prior = messagesRef.current;

      setMessages((prev) =>
        userMessage ? [...prev, userMessage, assistantMessage] : [...prev, assistantMessage]
      );

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: isKickoff
              ? []
              : [...prior, userMessage!].map((m) => ({
                  role: m.role,
                  content: m.content,
                })),
            conversationId: conversationIdRef.current,
            kickoff: isKickoff,
          }),
        });

        if (!response.ok) {
          let errMsg = "Chat request failed";
          try {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
          } catch {
            const text = await response.text();
            if (text) errMsg = text;
          }
          throw new Error(errMsg);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response stream");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      last.content += parsed.text;
                    }
                    return updated;
                  });
                }
                if (parsed.state) {
                  // Server emits a final state frame after the stream so the
                  // progress indicator and finalized handler can react without
                  // a separate fetch.
                  setOnboardingState(parsed.state as OnboardingState);
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            last.content =
              "I'm having trouble connecting right now. Please try again in a moment.";
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [input, isStreaming]
  );

  useEffect(() => {
    if (urlPromptConsumed.current) return;
    if (isOnboarding) return; // onboarding has its own init flow
    const raw = searchParams.get("q") ?? searchParams.get("prompt");
    if (!raw?.trim()) return;
    urlPromptConsumed.current = true;
    let text: string;
    try {
      text = decodeURIComponent(raw.replace(/\+/g, " "));
    } catch {
      text = raw;
    }
    setShowSuggestions(false);
    const t = window.setTimeout(() => {
      void handleSubmit(text);
    }, 0);
    return () => window.clearTimeout(t);
  }, [searchParams, handleSubmit, isOnboarding]);

  // Onboarding init: find or create the user's onboarding conversation,
  // load any prior messages, and trigger Alfred's first message if empty.
  useEffect(() => {
    if (!isOnboarding) return;
    if (onboardingInitStarted.current) return;
    onboardingInitStarted.current = true;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/onboarding/start", { method: "POST" });
        if (!res.ok) throw new Error("Failed to initialize onboarding");
        const data = (await res.json()) as {
          conversationId: string;
          messages: { role: "user" | "assistant"; content: string }[];
          state: OnboardingState;
        };
        if (cancelled) return;

        setConversationId(data.conversationId);
        conversationIdRef.current = data.conversationId;
        setOnboardingState(data.state);

        // Hydrate prior messages, filtering out the internal kickoff message.
        const visible = data.messages
          .filter((m) => m.content !== ONBOARDING_KICKOFF_USER_MESSAGE)
          .map((m) => ({
            id: crypto.randomUUID(),
            role: m.role,
            content: m.content,
          }));
        setMessages(visible);
        setShowSuggestions(false);
        setOnboardingInitState("ready");

        // If no real conversation yet (or only the hidden kickoff exists with no
        // assistant reply), have Alfred speak first.
        const hasAssistantReply = data.messages.some((m) => m.role === "assistant");
        if (!hasAssistantReply) {
          // Slight defer so React commits the conversationId before we fetch.
          setTimeout(() => {
            void handleSubmit(undefined, { kickoff: true });
          }, 50);
        }
      } catch {
        if (!cancelled) setOnboardingInitState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOnboarding, handleSubmit]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-semibold">ALFRED</h1>
            {isOnboarding && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/15 text-primary">
                <Sparkles className="h-3 w-3" />
                Onboarding
              </span>
            )}
          </div>
          {isOnboarding && onboardingState ? (
            <OnboardingProgress state={onboardingState} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {isOnboarding
                ? "Building your Alignment Blueprints, one question at a time"
                : "Values-aligned guidance, personalized to you"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isOnboarding && onboardingState && hasAnyCompletedSection(onboardingState) && (
            <button
              type="button"
              onClick={() => setReviseModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              title="Revise a captured section"
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Revise</span>
            </button>
          )}
          {!isOnboarding && <NotificationBell />}
          {!isOnboarding && (
            <Link
              href="/voice"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              title="Switch to voice session"
            >
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </Link>
          )}
        </div>
      </header>

      {isOnboarding && reviseModalOpen && onboardingState && (
        <ReviseSectionModal
          state={onboardingState}
          onClose={() => setReviseModalOpen(false)}
          onPick={async (sectionId) => {
            setReviseModalOpen(false);
            try {
              const res = await fetch("/api/onboarding/revise-section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sectionId }),
              });
              if (!res.ok) throw new Error("revise endpoint failed");
              const data = (await res.json()) as { triggerMessage: string };
              await handleSubmit(data.triggerMessage);
            } catch {
              // Surface a soft error in chat — same pattern as the regular catch.
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content:
                    "I couldn't open that section to revise. Please try again in a moment.",
                },
              ]);
            }
          }}
        />
      )}

      {isOnboarding && finalizedNotice && (
        <div className="border-b border-border bg-primary/10 px-6 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm text-foreground">
            <span className="font-semibold">Onboarding complete.</span>{" "}
            <span className="text-muted-foreground">
              Your Alignment Blueprints have been generated. Taking you to the regular chat in a moment…
            </span>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin"
      >
        {isOnboarding && messages.length === 0 && (
          <div className="max-w-xl mx-auto pt-12 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              {onboardingInitState === "error" ? (
                <MessageSquare className="h-6 w-6 text-destructive" />
              ) : (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold mb-2">
                {onboardingInitState === "error"
                  ? "Could not start onboarding"
                  : "Preparing your guided onboarding"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {onboardingInitState === "error"
                  ? "Refresh the page to try again, or upload your worksheets instead."
                  : "Alfred is getting ready to walk you through five short sections. This will take about 10–15 minutes."}
              </p>
            </div>
          </div>
        )}

        {!isOnboarding && messages.length === 0 && showSuggestions && (
          <div className="max-w-2xl mx-auto space-y-8 pt-8">
            {!selectedCategory ? (
              <>
                <div className="flex justify-start">
                  <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-card border border-border">
                    <p className="text-sm">
                      Hi, I&apos;m <span className="font-semibold">ALFRED</span>,
                      your Aligned Freedom Coach. What would you like to work on
                      today?
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((cat) => (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => setSelectedCategory(cat.category)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-accent/10 hover:border-accent/30 text-sm font-medium transition-colors"
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <h2 className="text-lg font-semibold">{selectedCategory}</h2>
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.find(
                    (c) => c.category === selectedCategory
                  )?.prompts.map((p) => (
                    <button
                      key={p.prompt}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        void handleSubmit(p.prompt);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-accent/10 hover:border-accent/30 text-sm transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-border hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Something else
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content || "..."}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your coach anything..."
              rows={1}
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!input.trim() || isStreaming}
            className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function hasAnyCompletedSection(state: OnboardingState | null | undefined): boolean {
  if (!state) return false;
  return ONBOARDING_SECTIONS.some((s) => state.sections[s.id]?.status === "complete");
}

function OnboardingProgress({ state }: { state: OnboardingState }) {
  const completed = ONBOARDING_SECTIONS.filter((s) => state.sections[s.id]?.status === "complete").length;
  const currentIdx = Math.min(state.currentSection, TOTAL_SECTIONS);
  const currentSection = getSectionByIndex(currentIdx);
  const label = state.finalized
    ? "All sections complete"
    : state.readyToWrap
      ? "Ready to finalize"
      : currentSection
        ? `Section ${currentIdx} of ${TOTAL_SECTIONS}: ${currentSection.label}`
        : `Section ${currentIdx} of ${TOTAL_SECTIONS}`;

  return (
    <div className="mt-1 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1.5" aria-label={`${completed} of ${TOTAL_SECTIONS} sections complete`}>
        {ONBOARDING_SECTIONS.map((section, i) => {
          const isComplete = state.sections[section.id]?.status === "complete";
          const isCurrent = !state.finalized && !isComplete && i + 1 === currentIdx;
          return (
            <div
              key={section.id}
              className={[
                "h-1.5 flex-1 rounded-full transition-colors",
                isComplete
                  ? "bg-primary"
                  : isCurrent
                    ? "bg-primary/40"
                    : "bg-border",
              ].join(" ")}
              title={`${section.label}${isComplete ? " — captured" : isCurrent ? " — in progress" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ReviseSectionModal({
  state,
  onClose,
  onPick,
}: {
  state: OnboardingState;
  onClose: () => void;
  onPick: (sectionId: string) => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Revise a section</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pick a section to revisit. Alfred will show you what&apos;s captured and walk you through changing it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 -m-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="p-3 space-y-2">
          {ONBOARDING_SECTIONS.map((section) => {
            const captured = state.sections[section.id];
            const isComplete = captured?.status === "complete";
            return (
              <li key={section.id}>
                <button
                  type="button"
                  disabled={!isComplete}
                  onClick={() => onPick(section.id)}
                  className={[
                    "w-full text-left rounded-xl border p-4 transition-colors",
                    isComplete
                      ? "border-border hover:border-primary hover:bg-accent/5 cursor-pointer"
                      : "border-border/50 opacity-60 cursor-not-allowed",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{section.label}</span>
                    {isComplete && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <Check className="h-3 w-3" />
                        Captured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{section.description}</p>
                  {captured?.summary ? (
                    <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                      {captured.summary}
                    </p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground">
                      Not yet captured. Finish this section in the chat first.
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-full items-center justify-center text-muted-foreground text-sm">
          Loading coach…
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
