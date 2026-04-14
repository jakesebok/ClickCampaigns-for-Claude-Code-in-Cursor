"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RESULT_OUTPUT_OPTIONS } from "./intake-constants";

const LEGEND: { outputId: string; mapsTo: string }[] = [
  {
    outputId: "composite",
    mapsTo:
      "Overall score and tier at the top (e.g. Functional, Dialed). This is your single headline number.",
  },
  {
    outputId: "arenas",
    mapsTo:
      "The three arena rows (Personal, Relationships, Business). Each is an average of the domains underneath it.",
  },
  {
    outputId: "domains",
    mapsTo:
      "Every pillar score in the wheel and in the breakdown. VAPI™ uses twelve domains; yours can use different names but the same idea.",
  },
  {
    outputId: "wheel",
    mapsTo:
      "The circular “alignment at a glance” graphic with twelve segments.",
  },
  {
    outputId: "explore",
    mapsTo:
      "The interactive explore-your-score area where clients tap a slice to read copy for that domain.",
  },
  {
    outputId: "libraries",
    mapsTo:
      "Pattern and driver libraries (archetype, driver narrative). Shown as rich sections below the scores.",
  },
  {
    outputId: "pdf",
    mapsTo:
      "Print / save as PDF from the results page (browser print styles).",
  },
];

export function VapiResultsExampleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
              with stored sample scores (not invented markup). Use the legend to connect
              each pill on the intake to what clients actually see.
            </p>
            <p className="mt-2 text-xs text-[var(--ap-muted)] font-outfit">
              Prefer the live flow?{" "}
              <Link
                href="/assessment/start"
                className="font-semibold text-[var(--ap-accent)] underline underline-offset-2 hover:opacity-90"
              >
                Take VAPI™
              </Link>
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
                title="VAPI results example"
                src="/vapi/build-intake-results-bootstrap.html"
                className="h-[min(58dvh,520px)] w-full sm:h-[min(62vh,560px)] lg:h-[min(72vh,640px)]"
                loading="lazy"
              />
            </div>
            <aside className="bg-gradient-to-b from-white to-[#FAFAFB] p-5 sm:p-6 lg:max-h-[min(72vh,640px)] lg:overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ap-muted)] font-outfit mb-3">
                Intake vocabulary → on this page
              </p>
              <ul className="space-y-4">
                {LEGEND.map((row) => {
                  const opt = RESULT_OUTPUT_OPTIONS.find((o) => o.id === row.outputId);
                  return (
                    <li key={row.outputId}>
                      <span className="mb-1 inline-block rounded-md bg-[var(--ap-accent)]/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ap-primary)] font-outfit">
                        {opt?.label ?? row.outputId}
                      </span>
                      <p className="text-[13px] leading-relaxed text-[var(--ap-secondary)] font-outfit">
                        {row.mapsTo}
                      </p>
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
