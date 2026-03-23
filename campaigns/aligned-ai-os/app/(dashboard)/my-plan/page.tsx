"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Loader2, ExternalLink } from "lucide-react";

type PlanContext = {
  whyItMatters?: string;
  usuallyIndicates?: string;
  hiddenCost?: string;
  leveragePoint?: string;
  howToKnow?: string;
};

type SprintRow = {
  id: string;
  primary_surface: string;
  coach_context: string | null;
  payload: {
    title?: string;
    summary?: string;
    focusDomain?: string;
    focusDomainLabel?: string;
    userLevel?: string;
    context?: PlanContext;
    driverModifier?: string;
    weeks?: {
      weekNumber: number;
      theme?: string;
      tasks?: { id: string; title: string; description?: string; completed?: boolean }[];
    }[];
    weekReflections?: Record<string, string>;
  };
};

export default function MyPlanPage() {
  const [sprint, setSprint] = useState<SprintRow | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/sprint/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        setSprint(data.sprint ?? null);
      })
      .catch(() => {
        setError("load_failed");
        setSprint(null);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const savePatch = useCallback(
    async (taskUpdates?: Record<string, boolean>, weekReflections?: Record<string, string>) => {
      await fetch("/api/sprint/patch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskUpdates, weekReflections }),
      });
    },
    []
  );

  if (sprint === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p>Loading your plan…</p>
      </div>
    );
  }

  if (error && !sprint) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <PageHeader title="My Plan" subtitle="We couldn’t load your sprint." />
        <p className="text-muted-foreground text-sm mt-4">Try again later or complete the VAPI in ALFRED.</p>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <PageHeader
          title="My Plan"
          subtitle="Complete the VAPI assessment in ALFRED to generate your 28-day sprint."
        />
        <Link
          href="/assessment"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          Take VAPI
        </Link>
      </div>
    );
  }

  if (sprint.primary_surface === "portal") {
    return (
      <div className="p-6 max-w-lg mx-auto text-center space-y-4">
        <PageHeader
          title="My Plan"
          subtitle="Your latest sprint is managed in the Aligned Performance Portal because you took VAPI there or on the marketing site."
        />
        <a
          href="https://portal.alignedpower.coach/my-plan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          Open portal My Plan
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    );
  }

  const payload = sprint.payload || {};
  const weeks = payload.weeks || [];
  const reflections = payload.weekReflections || {};
  const planCtx = payload.context || {};

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 border-b border-border px-4 py-4 md:px-8">
        <PageHeader
          title={payload.title || "My Plan"}
          subtitle={payload.summary || "Your 28-day focus from VAPI."}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-24 space-y-6">
        {planCtx.whyItMatters?.trim() ? (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm text-muted-foreground">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Why this focus</p>
            <p className="leading-relaxed whitespace-pre-wrap">{planCtx.whyItMatters.trim()}</p>
            {(planCtx.usuallyIndicates ||
              planCtx.hiddenCost ||
              planCtx.leveragePoint ||
              planCtx.howToKnow) && (
              <div className="space-y-3 border-t border-border pt-3">
                {planCtx.usuallyIndicates?.trim() ? (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">What this usually indicates</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{planCtx.usuallyIndicates.trim()}</p>
                  </div>
                ) : null}
                {planCtx.hiddenCost?.trim() ? (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Hidden cost</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{planCtx.hiddenCost.trim()}</p>
                  </div>
                ) : null}
                {planCtx.leveragePoint?.trim() ? (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Leverage point</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{planCtx.leveragePoint.trim()}</p>
                  </div>
                ) : null}
                {planCtx.howToKnow?.trim() ? (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">How you will know it is working</p>
                    <p className="leading-relaxed whitespace-pre-wrap">{planCtx.howToKnow.trim()}</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {payload.driverModifier?.trim() ? (
          <div className="rounded-xl border-2 border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-950 dark:text-amber-200 mb-2">
              A pattern to watch
            </p>
            <p className="text-sm text-amber-950 dark:text-amber-100 leading-relaxed whitespace-pre-wrap">
              {payload.driverModifier.trim()}
            </p>
          </div>
        ) : null}

        {sprint.coach_context?.trim() ? (
          <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              From your coach
            </p>
            <p className="text-sm whitespace-pre-wrap">{sprint.coach_context}</p>
          </div>
        ) : null}

        {weeks.map((w) => (
          <section
            key={w.weekNumber}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div>
              <h2 className="text-lg font-semibold">Week {w.weekNumber}</h2>
              {w.theme ? <p className="text-sm text-accent font-medium">{w.theme}</p> : null}
            </div>
            <ul className="space-y-2">
              {(w.tasks || []).map((t) => (
                <li key={t.id}>
                  <label className="flex gap-3 items-start cursor-pointer rounded-lg border border-border/80 p-3 hover:bg-accent/5">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-border accent-accent"
                      checked={!!t.completed}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setSprint((prev) => {
                          if (!prev) return prev;
                          const p = { ...prev, payload: { ...prev.payload, weeks: [...(prev.payload.weeks || [])] } };
                          const wi = p.payload.weeks!.findIndex((x) => x.weekNumber === w.weekNumber);
                          if (wi < 0) return prev;
                          const wk = { ...p.payload.weeks![wi], tasks: [...(p.payload.weeks![wi].tasks || [])] };
                          const ti = wk.tasks!.findIndex((x) => x.id === t.id);
                          if (ti >= 0) wk.tasks![ti] = { ...wk.tasks![ti], completed: next };
                          p.payload.weeks![wi] = wk;
                          return p;
                        });
                        void savePatch({ [t.id]: next });
                      }}
                    />
                    <span>
                      <span className="font-medium block">{t.title}</span>
                      {t.description ? (
                        <span className="text-sm text-muted-foreground">{t.description}</span>
                      ) : null}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Reflection
              </label>
              <textarea
                className="w-full min-h-[88px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
                defaultValue={reflections[String(w.weekNumber)] || ""}
                placeholder="What shifted this week?"
                onBlur={(e) => {
                  void savePatch(undefined, { [String(w.weekNumber)]: e.target.value });
                }}
              />
            </div>
          </section>
        ))}

        <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">Want the full ALFRED experience?</p>
          <a
            href="https://alfredai.coach"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold inline-flex items-center gap-1"
          >
            alfredai.coach <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
