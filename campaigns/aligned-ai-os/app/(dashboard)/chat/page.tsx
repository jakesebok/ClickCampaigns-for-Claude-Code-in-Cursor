"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Send, Loader2, Mic, ChevronLeft, MessageSquare } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import ReactMarkdown from "react-markdown";
import { SUGGESTED_QUESTIONS } from "@/lib/ai/prompts";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSubmit(content?: string) {
    const messageContent = content || input.trim();
    if (!messageContent || isStreaming) return;

    setInput("");
    setShowSuggestions(false);
    setIsStreaming(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
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
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (error) {
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
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold">ALFRED</h1>
          <p className="text-sm text-muted-foreground">
            Values-aligned guidance, personalized to you
          </p>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <Link
            href="/voice"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            title="Switch to voice session"
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin"
      >
        {messages.length === 0 && showSuggestions && (
          <div className="max-w-2xl mx-auto space-y-8 pt-8">
            {!selectedCategory ? (
              <>
                {/* Alfred's welcome message */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-card border border-border">
                    <p className="text-sm">
                      Hi, I&apos;m <span className="font-semibold">ALFRED</span>,
                      your Aligned Freedom Coach. What would you like to
                      work on today?
                    </p>
                  </div>
                </div>

                {/* Category buttons — tap to open prompt list */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((cat) => (
                    <button
                      key={cat.category}
                      onClick={() => setSelectedCategory(cat.category)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-accent/10 hover:border-accent/30 text-sm font-medium transition-colors"
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Prompt list for selected category — back button + prompts + Something else */
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <h2 className="text-lg font-semibold">
                  {selectedCategory}
                </h2>
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.find((c) => c.category === selectedCategory)?.prompts.map((p) => (
                    <button
                      key={p.prompt}
                      onClick={() => {
                        setSelectedCategory(null);
                        handleSubmit(p.prompt);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-accent/10 hover:border-accent/30 text-sm transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
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

      {/* Input */}
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
            onClick={() => handleSubmit()}
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
