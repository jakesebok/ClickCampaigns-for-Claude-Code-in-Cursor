"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { RESULT_OUTPUT_OPTIONS } from "./intake-constants";

const LEGEND: { outputId: string; mapsTo: string }[] = [
  {
    outputId: "composite",
    mapsTo:
      "Overall score and tier beside the wheel (headline number). This is the single composite read clients see first.",
  },
  {
    outputId: "arenas",
    mapsTo:
      "The three arena cards (Personal, Relationships, Business). Each is an average of the domains underneath.",
  },
  {
    outputId: "domains",
    mapsTo:
      "Every pillar score in the domain detail section. VAPI™ uses twelve; yours can use different names but the same grain.",
  },
  {
    outputId: "wheel",
    mapsTo:
      "The interactive wheel in “Explore your score”—tap wedges to change the metric and story (still works in this preview).",
  },
  {
    outputId: "explore",
    mapsTo:
      "The whole Explore your score module: metric list + copy + interactive wheel together.",
  },
  {
    outputId: "libraries",
    mapsTo:
      "Pattern and driver libraries—archetype story and pattern driver sections below the scores.",
  },
  {
    outputId: "pdf",
    mapsTo:
      "Print / save as PDF from the results page (browser print styles).",
  },
];

/** Element IDs inside `/vapi/vapi-results.html` when loaded with `?vapiDemo=1` (set in page script). */
const DEMO_HIGHLIGHT_IDS: Record<string, string> = {
  composite: "vapi-demo-target-composite",
  arenas: "vapi-demo-target-arenas",
  domains: "vapi-demo-target-domains",
  wheel: "results-breakdown-wheel-outer",
  explore: "results-explore-section",
  libraries: "driver-section",
  pdf: "vapi-demo-target-pdf",
};

export function VapiResultsExampleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeLegend, setActiveLegend] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const postHighlight = useCallback((outputId: string | null) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const targetId = outputId ? DEMO_HIGHLIGHT_IDS[outputId] : null;
    win.postMessage(
      {
        type: "vapi-demo-highlight",
        targetId: targetId || "clear",
      },
      "*"
    );
  }, []);

  useEffect(() => {
    if (!open) {
      setActiveLegend(null);
      postHighlight(null);
    }
  }, [open, postHighlight]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6 bg-[#0E1624]/82 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vapi-example-title"
    >
      <div className="intake-modal-surface relative flex max-h-[min(96dvh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-[1.75rem] border border-white/20 bg-[var(--ap-bg)] shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.4)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--ap-border)]/80 bg-white/90 px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gradient-accent font-outfit mb-1">
              Real VAPI™ UI (sample data)
            </p>
            <h2
              id="vapi-example-title"
              className="font-cormorant text-xl sm:text-2xl font-bold text-[var(--ap-primary)] tracking-tight"
            >
              Where intake options show up on the results page
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--ap-secondary)] font-outfit leading-relaxed">
              This preview loads the same public results page used in production, seeded
              with stored sample scores. Tap a label on the right to spotlight that part of
              the page (the rest dims). Outbound links in the preview are disabled so this
              stays a visual walkthrough—the interactive wheel still works.
            </p>
            <p className="mt-2 text-xs text-[var(--ap-muted)] font-outfit">
              Prefer the live flow? Complete the real assessment from the Build Your
              Assessment entry (links are not active inside this preview).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-[var(--ap-muted)] transition-colors hover:bg-white hover:text-[var(--ap-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-accent)]/40"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid gap-0 lg:grid-cols-[1fr_min(340px,38%)] lg:gap-0">
            <div className="border-b border-[var(--ap-border)]/70 bg-[#0a0f18] lg:border-b-0 lg:border-r">
              <iframe
                ref={iframeRef}
                title="VAPI results example"
                src="/vapi/build-intake-results-bootstrap.html"
                className="h-[min(58dvh,520px)] w-full sm:h-[min(62vh,560px)] lg:h-[min(72vh,640px)]"
                loading="lazy"
                onLoad={() => postHighlight(activeLegend)}
              />
            </div>
            <aside className="bg-gradient-to-b from-white to-[#FAFAFB] p-5 sm:p-6 lg:max-h-[min(72vh,640px)] lg:overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ap-muted)] font-outfit mb-3">
                Intake vocabulary → on this page
              </p>
              <p className="text-xs text-[var(--ap-muted)] font-outfit mb-4 leading-relaxed">
                Tap to spotlight. The preview scrolls to that region and dims the rest.
              </p>
              <ul className="space-y-2">
                {LEGEND.map((row) => {
                  const opt = RESULT_OUTPUT_OPTIONS.find((o) => o.id === row.outputId);
                  const isActive = activeLegend === row.outputId;
                  return (
                    <li key={row.outputId}>
                      <button
                        type="button"
                        onClick={() => {
                          const next =
                            activeLegend === row.outputId ? null : row.outputId;
                          setActiveLegend(next);
                          postHighlight(next);
                        }}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? "border-[var(--ap-accent)] bg-[var(--ap-accent)]/10 ring-2 ring-[var(--ap-accent)]/25"
                            : "border-[var(--ap-border)]/80 bg-white/80 hover:border-[var(--ap-accent)]/40"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="mb-1 inline-block rounded-md bg-[var(--ap-accent)]/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ap-primary)] font-outfit">
                          {opt?.label ?? row.outputId}
                        </span>
                        <p className="text-[13px] leading-relaxed text-[var(--ap-secondary)] font-outfit mt-1">
                          {row.mapsTo}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
