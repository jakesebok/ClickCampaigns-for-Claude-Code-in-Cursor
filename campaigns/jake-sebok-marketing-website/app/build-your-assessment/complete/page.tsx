"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Layers, Sparkles, ArrowRight } from "lucide-react";
import type { BuildIntakePayloadV1 } from "@/lib/build-assessment-intake/types";
import { OPTIONAL_MODULE_OPTIONS } from "@/components/build-assessment/intake-constants";

const MODULE_LABEL: Record<string, string> = Object.fromEntries(
  OPTIONAL_MODULE_OPTIONS.map((o) => [o.id, o.label])
);

type Summary = {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
  highlights: {
    goals: string[];
    modules: string[];
    rush: boolean;
  };
  full: BuildIntakePayloadV1;
};

export default function BuildAssessmentCompletePage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("buildYourAssessmentIntakeSummary");
      if (raw) setSummary(JSON.parse(raw) as Summary);
    } catch {
      setSummary(null);
    }
  }, []);

  if (!summary) {
    return (
      <div className="build-intake-canvas min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md build-complete-card p-8 sm:p-10">
          <p className="text-[var(--ap-secondary)] font-outfit leading-relaxed mb-6 text-[15px] sm:text-base">
            If you just submitted the intake, this page opens automatically. If you
            landed here without a session, start fresh:
          </p>
          <Link
            href="/build-your-assessment/intake"
            className="intake-nav-primary inline-flex w-full justify-center gap-2"
          >
            Start intake
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const p = summary.full;
  const arenaCount = p.constructTree.arenas.length;
  const domainCount = p.constructTree.arenas.reduce(
    (n, a) => n + a.domains.length,
    0
  );

  return (
    <div className="build-intake-canvas min-h-[calc(100dvh-5rem)]">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-14 md:py-16 pb-16 sm:pb-24">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center justify-center w-[4.25rem] h-[4.25rem] rounded-full bg-emerald-500/12 ring-4 ring-emerald-500/10 mb-5 sm:mb-6">
            <CheckCircle2
              className="w-[2.35rem] h-[2.35rem] text-emerald-600"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-gradient-accent mb-2 font-outfit">
            Received
          </p>
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[var(--ap-primary)] tracking-tight mb-4 max-w-2xl mx-auto">
            Your intake is in,{" "}
            {summary.name.trim().split(/\s+/)[0] || "there"}
          </h1>
          <p className="text-[var(--ap-secondary)] font-outfit max-w-xl md:max-w-2xl mx-auto text-[15px] sm:text-base leading-relaxed">
            You should get a confirmation email at{" "}
            <strong className="text-[var(--ap-primary)] font-semibold">
              {summary.email}
            </strong>{" "}
            with everything you submitted. Here is a snapshot of what we captured.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3 mb-8 sm:mb-10">
          <div className="build-complete-card md:col-span-1 flex flex-col justify-between min-h-[140px]">
            <Layers
              className="w-9 h-9 text-[var(--ap-accent)] mb-3"
              strokeWidth={1.5}
              aria-hidden
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)] font-outfit mb-1">
                Construct map
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[var(--ap-primary)] font-outfit tabular-nums tracking-tight">
                {arenaCount}{" "}
                <span className="text-base sm:text-lg font-semibold">arenas</span>
              </p>
              <p className="text-sm text-[var(--ap-secondary)] font-outfit mt-1.5">
                {domainCount} domains total
              </p>
            </div>
          </div>
          <div className="build-complete-card md:col-span-2">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles
                className="w-8 h-8 text-[var(--ap-accent)] shrink-0 mt-0.5"
                aria-hidden
              />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)] font-outfit mb-2">
                  Modules you flagged
                </p>
                <div className="flex flex-wrap gap-2">
                  {(summary.highlights.modules.length
                    ? summary.highlights.modules
                    : ["core_flow"]
                  ).map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-[var(--ap-bg)] border border-[var(--ap-border)]/90 px-3.5 py-1.5 text-xs font-medium text-[var(--ap-primary)] font-outfit shadow-sm"
                    >
                      {m === "core_flow"
                        ? "Core assessment + results"
                        : MODULE_LABEL[m] || m.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="build-complete-card overflow-hidden p-0 mb-10 sm:mb-12">
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--ap-border)]/80">
            <div className="p-6 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)] mb-2 font-outfit">
                Length & scale
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-[var(--ap-primary)] font-outfit capitalize leading-snug">
                {p.lengthPreference || "—"} · {p.scalePreference || "—"}
              </p>
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)] mb-2 font-outfit">
                Auth preference
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-[var(--ap-primary)] font-outfit capitalize leading-snug">
                {p.authPreference || "—"}
              </p>
            </div>
          </div>
          <div className="px-6 sm:px-7 py-5 border-t border-[var(--ap-border)]/70 bg-gradient-to-b from-[#FAFAFB] to-white/90">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)] mb-2 font-outfit">
              Rush timeline
            </p>
            <p className="text-sm text-[var(--ap-secondary)] font-outfit leading-relaxed">
              {summary.highlights.rush
                ? "You asked for faster than 30 days. We will confirm if a rush fee applies."
                : "Standard timeline conversation (anchor ~30 days)."}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="intake-nav-primary inline-flex gap-2 px-10 shadow-xl shadow-[rgba(255,107,26,0.22)]"
          >
            Book a conversation
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <p className="mt-6 text-[11px] sm:text-xs text-[var(--ap-muted)] font-outfit font-mono tracking-tight">
            Reference ID: {summary.id}
          </p>
        </div>
      </div>
    </div>
  );
}
