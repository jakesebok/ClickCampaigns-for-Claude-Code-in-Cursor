"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Lightbulb, Target, X } from "lucide-react";

export const ALFRED_LS_VIEWED_MY_PLAN = "alfred_hasViewedMyPlan";
export const ALFRED_LS_DISMISS_REMINDER = "alfred_dismissedMyPlanReminder";

export function markAlfredMyPlanViewed() {
  try {
    localStorage.setItem(ALFRED_LS_VIEWED_MY_PLAN, "1");
  } catch {
    /* ignore */
  }
}

/** Large results-page callout (ALFRED app users are always signed in). */
export function MyPlanCalloutLargeApp() {
  return (
    <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-6 sm:p-8 shadow-lg mt-10 mb-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
          <Target className="h-7 w-7 text-accent" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Your 30-Day Action Plan Is Ready
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You&apos;ve just learned your Archetype, your Driver, and where you&apos;re strong and struggling
            across 12 domains. That&apos;s the diagnosis.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Now comes the prescription: a personalized 30-day plan that targets your highest-leverage growth
            area, with week-by-week actions, not just insight.
          </p>
          <Link
            href="/my-plan"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 sm:w-auto"
          >
            View My Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MyPlanInlineCalloutApp({
  variant,
  borderAccent,
}: {
  variant: "archetype" | "driver";
  borderAccent?: string;
}) {
  const title =
    variant === "archetype" ? "What to do with this?" : "This driver has a counter-move.";
  const body =
    variant === "archetype"
      ? "Your Archetype reveals patterns, but patterns can shift. Your personalized 30-day plan targets the specific domain holding you back."
      : "Your 30-day plan includes specific guidance for working with (not against) this pattern.";

  return (
    <div
      className={`mt-5 rounded-xl border border-border border-l-4 py-4 pl-4 pr-4 ${
        variant === "archetype" ? "bg-sky-500/5" : "bg-amber-500/5"
      }`}
      style={borderAccent ? { borderLeftColor: borderAccent } : undefined}
    >
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Lightbulb className="h-4 w-4 shrink-0 text-accent" />
        {title}
      </p>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <Link
        href="/my-plan"
        className="inline-flex w-full items-center justify-center gap-2 text-sm font-bold text-accent hover:underline sm:w-auto"
      >
        View My Plan
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function MyPlanDashboardReminder({ hasAssessment }: { hasAssessment: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasAssessment) return;
    try {
      if (localStorage.getItem(ALFRED_LS_VIEWED_MY_PLAN) === "1") return;
      if (localStorage.getItem(ALFRED_LS_DISMISS_REMINDER) === "1") return;
    } catch {
      return;
    }
    setOpen(true);
  }, [hasAssessment]);

  if (!open) return null;

  return (
    <div className="relative mb-6 rounded-2xl border-2 border-primary/20 bg-card p-5 pr-12 shadow-sm">
      <button
        type="button"
        className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label="Dismiss reminder"
        onClick={() => {
          try {
            localStorage.setItem(ALFRED_LS_DISMISS_REMINDER, "1");
          } catch {
            /* ignore */
          }
          setOpen(false);
        }}
      >
        <X className="h-5 w-5" />
      </button>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">My Plan</p>
      <h2 className="mb-2 text-lg font-bold text-foreground">Your 30-day plan is waiting</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Based on your assessment results, we&apos;ve created a personalized action plan for your growth edge.
      </p>
      <Link
        href="/my-plan"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 sm:w-auto"
      >
        View My Plan
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
