"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Loader2, ExternalLink } from "lucide-react";
import { markAlfredMyPlanViewed } from "@/components/my-plan-callouts";

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
  const lastSprintIdRef = useRef<string | null>(null);
  const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});
  const [reflectionStatus, setReflectionStatus] = useState<Record<string, string>>({});
  const reflectionTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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

  useEffect(() => {
    markAlfredMyPlanViewed();
  }, []);

  useEffect(() => {
    if (!sprint?.id) return;
    if (lastSprintIdRef.current !== sprint.id) {
      lastSprintIdRef.current = sprint.id;
      setReflectionDrafts(sprint.payload.weekReflections || {});
    }
  }, [sprint]);

  const savePatch = useCallback(
    async (taskUpdates?: Record<string, boolean>, weekReflections?: Record<string, string>) => {
      const res = await fetch("/api/sprint/patch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskUpdates, weekReflections }),
      });
      return res.ok;
    },
    []
  );

  const flushReflectionSave = useCallback(
    async (weekKey: string, value: string) => {
      setReflectionStatus((s) => ({ ...s, [weekKey]: "Saving…" }));
      const ok = await savePatch(undefined, { [weekKey]: value });
      setReflectionStatus((s) => ({
        ...s,
        [weekKey]: ok ? "Saved" : "Could not save",
      }));
      if (ok) {
        window.setTimeout(() => {
          setReflectionStatus((s) => (s[weekKey] === "Saved" ? { ...s, [weekKey]: "" } : s));
        }, 2200);
      }
    },
    [savePatch]
  );

  const scheduleReflectionSave = useCallback(
    (weekKey: string, value: string) => {
      const prev = reflectionTimers.current[weekKey];
      if (prev) window.clearTimeout(prev);
      setReflectionStatus((s) => ({ ...s, [weekKey]: "" }));
      reflectionTimers.current[weekKey] = window.setTimeout(() => {
        delete reflectionTimers.current[weekKey];
        void flushReflectionSave(weekKey, value);
      }, 850);
    },
    [flushReflectionSave]
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
          subtitle="Complete the VAPI assessment while signed in to generate your 28-day sprint. Your plan syncs across ALFRED and the Aligned Portal."
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

  const payload = sprint.payload || {};
  const weeks = payload.weeks || [];
  const serverReflections = payload.weekReflections || {};
  const planCtx = payload.context || {};

  const reflectionValue = (weekNum: number) => {
    const k = String(weekNum);
    return reflectionDrafts[k] !== undefined ? reflectionDrafts[k] : (serverReflections[k] ?? "");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 border-b border-border">
        <PageHeader
          variant="featured"
          title={payload.title || "My Plan"}
          subtitle={payload.summary || "Your 28-day focus from VAPI."}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-24">
        <div className="mx-auto max-w-3xl space-y-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">28-day sprint</p>

        {planCtx.whyItMatters?.trim() ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Why this focus</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.whyItMatters.trim()}</p>
            {(planCtx.usuallyIndicates ||
              planCtx.hiddenCost ||
              planCtx.leveragePoint ||
              planCtx.howToKnow) && (
              <div className="space-y-4 border-t border-border pt-4">
                {planCtx.usuallyIndicates?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">What this usually indicates</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.usuallyIndicates.trim()}</p>
                  </div>
                ) : null}
                {planCtx.hiddenCost?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">Hidden cost</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.hiddenCost.trim()}</p>
                  </div>
                ) : null}
                {planCtx.leveragePoint?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">Leverage point</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.leveragePoint.trim()}</p>
                  </div>
                ) : null}
                {planCtx.howToKnow?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">How you will know it is working</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.howToKnow.trim()}</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        ) : null}

        {payload.driverModifier?.trim() ? (
          <section className="rounded-2xl border border-border border-l-4 border-l-accent bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">A pattern to watch</h2>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {payload.driverModifier.trim()}
            </p>
          </section>
        ) : null}

        {sprint.coach_context?.trim() ? (
          <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">From your coach</h2>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{sprint.coach_context}</p>
          </section>
        ) : null}

        <div className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week by week</h2>
        {weeks.map((w) => (
          <section
            key={w.weekNumber}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 space-y-4"
          >
            <div className="border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">Week {w.weekNumber}</h3>
              {w.theme ? <p className="mt-1 text-base font-medium text-accent">{w.theme}</p> : null}
            </div>
            <ul className="space-y-2">
              {(w.tasks || []).map((t) => (
                <li key={t.id}>
                  <label className="flex gap-3 items-start cursor-pointer rounded-xl border border-border p-3.5 transition-colors hover:border-accent/40 hover:bg-accent/5">
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
            <div className="pt-1">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Reflection
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed"
                value={reflectionValue(w.weekNumber)}
                placeholder="What shifted this week?"
                onChange={(e) => {
                  const k = String(w.weekNumber);
                  const v = e.target.value;
                  setReflectionDrafts((s) => ({ ...s, [k]: v }));
                  scheduleReflectionSave(k, v);
                }}
                onBlur={(e) => {
                  const k = String(w.weekNumber);
                  const t = reflectionTimers.current[k];
                  if (t) {
                    window.clearTimeout(t);
                    delete reflectionTimers.current[k];
                  }
                  void flushReflectionSave(k, e.target.value);
                }}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="min-h-[1.25em] text-xs text-muted-foreground">
                  {reflectionStatus[String(w.weekNumber)] || ""}
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
                  onClick={() => {
                    const k = String(w.weekNumber);
                    const t = reflectionTimers.current[k];
                    if (t) {
                      window.clearTimeout(t);
                      delete reflectionTimers.current[k];
                    }
                    void flushReflectionSave(k, reflectionDrafts[k] ?? serverReflections[k] ?? "");
                  }}
                >
                  Save reflection
                </button>
              </div>
            </div>
          </section>
        ))}
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground sm:p-6">
          <p className="font-serif text-base font-semibold text-foreground mb-2">You&apos;re in the right place for follow-through</p>
          <p>
            Daily check-ins, Coach, and notifications live here in ALFRED—so this plan doesn&apos;t stall after Week 1.
            {sprint.primary_surface === "portal" ? (
              <>
                {" "}
                You can also open the same plan on the{" "}
                <a
                  href="https://portal.alignedpower.coach/my-plan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold inline-flex items-center gap-0.5"
                >
                  Aligned Portal
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                if you prefer a desktop view.
              </>
            ) : null}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
