"use client";

import { X } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  SIX_C_KEYS,
  SIX_C_META,
  type SixCKey,
  scorecardColor,
} from "./intake-constants";

type Phase = "intro" | "questions" | "vital" | "result";

const STORAGE_KEY = "build-assessment-sixc-demo-v1";

function likertToPct(a: number, b: number) {
  const avg = (a + b) / 2;
  return Math.round(((avg - 1) / 4) * 100);
}

export function SixCDemoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, [number, number]>>(
    () =>
      Object.fromEntries(
        SIX_C_KEYS.map((k) => [k, [3, 3] as [number, number]])
      ) as Record<SixCKey, [number, number]>
  );
  const [vital, setVital] = useState("");

  const currentKey = SIX_C_KEYS[idx];
  const meta = SIX_C_META[currentKey];

  const reset = useCallback(() => {
    setPhase("intro");
    setIdx(0);
    setAnswers(
      Object.fromEntries(
        SIX_C_KEYS.map((k) => [k, [3, 3] as [number, number]])
      ) as Record<SixCKey, [number, number]>
    );
    setVital("");
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const scores = useMemo(() => {
    const out: Record<string, number> = {};
    for (const k of SIX_C_KEYS) {
      const [a, b] = answers[k] || [3, 3];
      out[k] = likertToPct(a, b);
    }
    return out;
  }, [answers]);

  const finishDemo = useCallback(() => {
    const payload = { scores, vitalAction: vital.trim(), at: Date.now() };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    setPhase("result");
  }, [scores, vital]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!mounted || !open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-5 md:p-8 bg-[#0E1624]/78 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sixc-demo-title"
    >
      <div
        className="intake-modal-surface relative w-full max-h-[min(92dvh,920px)] sm:max-h-[90vh] sm:max-w-lg overflow-y-auto overscroll-contain rounded-t-[1.75rem] sm:rounded-3xl border border-white/25 bg-[var(--ap-bg)] shadow-[0_-12px_60px_-8px_rgba(0,0,0,0.35),0_25px_80px_-30px_rgba(0,0,0,0.45)] sm:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.35)] pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1" aria-hidden>
          <span className="h-1 w-12 rounded-full bg-[var(--ap-border)]" />
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-full text-[var(--ap-muted)] hover:bg-white/90 hover:text-[var(--ap-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-accent)]/40"
          aria-label="Close demo"
        >
          <X className="h-5 w-5" />
        </button>

        {phase === "intro" && (
          <div className="px-5 sm:px-8 pt-14 pb-9 sm:pt-10 sm:pb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-2">
              Interactive preview · ~60 seconds
            </p>
            <h2
              id="sixc-demo-title"
              className="font-cormorant text-2xl sm:text-[1.75rem] font-bold tracking-tight text-[var(--ap-primary)] mb-3 pr-10"
            >
              Try a shortened 6C scorecard
            </h2>
            <p className="text-[var(--ap-secondary)] text-sm leading-relaxed mb-4">
              Tap a rating from <strong className="text-[var(--ap-primary)]">1</strong>{" "}
              (not true) to <strong className="text-[var(--ap-primary)]">5</strong>{" "}
              (very true) for each line. Then add one Vital Action. This mirrors the
              live rhythm: short, repeatable, and visible on a dashboard.
            </p>
            <button
              type="button"
              onClick={() => setPhase("questions")}
              className="intake-nav-primary w-full sm:w-auto text-base px-10 py-4 shadow-xl shadow-[rgba(255,107,26,0.28)]"
            >
              Start interactive demo
            </button>
          </div>
        )}

        {phase === "questions" &&
          meta &&
          (() => {
            const CategoryIcon = meta.icon;
            const LikertRow = ({
              value,
              onChange,
            }: {
              value: number;
              onChange: (n: number) => void;
            }) => (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n)}
                    className={`min-h-[48px] min-w-[48px] rounded-xl border-2 px-3 text-sm font-bold font-outfit transition-all ${
                      value === n
                        ? "border-[var(--ap-accent)] bg-gradient-to-br from-[#FFF8F3] to-white text-[var(--ap-primary)] shadow-md"
                        : "border-[var(--ap-border)] bg-white/90 text-[var(--ap-secondary)] hover:border-[var(--ap-accent)]/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            );
            return (
              <div className="px-5 sm:px-8 pt-12 pb-8 sm:p-8 sm:pt-8">
                <p className="text-xs font-semibold text-[var(--ap-muted)] mb-1">
                  Category {idx + 1} of {SIX_C_KEYS.length}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <CategoryIcon
                    className="h-7 w-7 shrink-0"
                    style={{ color: scorecardColor(70) }}
                    aria-hidden
                  />
                  <h3 className="font-sans text-xl font-bold text-[var(--ap-primary)]">
                    {meta.label}
                  </h3>
                </div>
                <p className="text-sm text-[var(--ap-secondary)] mb-4">
                  For each line, how true is this for you right now?
                </p>
                <div className="space-y-5 mb-6">
                  <div>
                    <p className="text-sm font-medium text-[var(--ap-primary)] mb-2">
                      {meta.demoPair[0]}
                    </p>
                    <LikertRow
                      value={answers[currentKey][0]}
                      onChange={(n) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentKey]: [n, prev[currentKey][1]],
                        }))
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--ap-primary)] mb-2">
                      {meta.demoPair[1]}
                    </p>
                    <LikertRow
                      value={answers[currentKey][1]}
                      onChange={(n) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentKey]: [prev[currentKey][0], n],
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => setIdx((i) => i - 1)}
                      className="intake-nav-secondary w-full sm:w-auto"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      idx < SIX_C_KEYS.length - 1
                        ? setIdx((i) => i + 1)
                        : setPhase("vital")
                    }
                    className="intake-nav-primary flex-1 w-full"
                  >
                    {idx < SIX_C_KEYS.length - 1 ? "Next" : "Vital Action"}
                  </button>
                </div>
              </div>
            );
          })()}

        {phase === "vital" && (
          <div className="px-5 sm:px-8 pt-12 pb-8 sm:p-8 sm:pt-8">
            <h3 className="font-sans text-xl font-bold text-[var(--ap-primary)] mb-2">
              Vital Action
            </h3>
            <p className="text-sm text-[var(--ap-secondary)] mb-4">
              In production, clients name the one move that would raise their
              integrity across the week. Keep it one sentence.
            </p>
            <textarea
              value={vital}
              onChange={(e) => setVital(e.target.value)}
              rows={4}
              placeholder="Example: Block two hours Tuesday for the revenue task I keep avoiding."
              className="intake-field min-h-[120px]"
            />
            <div className="mt-5 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setPhase("questions")}
                className="intake-nav-secondary w-full sm:w-auto"
              >
                Back
              </button>
              <button
                type="button"
                onClick={finishDemo}
                disabled={vital.trim().length < 8}
                className="intake-nav-primary flex-1 w-full disabled:opacity-40"
              >
                Show my dashboard preview
              </button>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="px-5 sm:px-8 pt-12 pb-8 sm:p-8 sm:pt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-2">
              Dashboard preview
            </p>
            <h3 className="font-sans text-xl font-bold text-[var(--ap-primary)] mb-4">
              Your latest 6C snapshot (demo)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {SIX_C_KEYS.map((k) => {
                const pct = scores[k] ?? 0;
                const Icon = SIX_C_META[k].icon;
                const color = scorecardColor(pct);
                return (
                  <div
                    key={k}
                    className="flex flex-col items-center rounded-2xl border border-[var(--ap-border)]/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_4px_20px_-8px_rgba(14,22,36,0.1)] ring-1 ring-white/80"
                  >
                    <Icon
                      className="mb-1 h-7 w-7"
                      style={{ color }}
                      aria-hidden
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ap-primary)] mb-1">
                      {SIX_C_META[k].label}
                    </p>
                    <p
                      className="text-xl font-bold tabular-nums"
                      style={{ color }}
                    >
                      {pct}
                      <span
                        className="text-xs font-normal opacity-80"
                        style={{ color }}
                      >
                        %
                      </span>
                    </p>
                    <div className="mt-2 h-2 w-full rounded-full bg-[var(--ap-border)]/50 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl border border-[var(--ap-border)] bg-[#FAF9F7] p-4 mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-1">
                Vital Action
              </p>
              <p className="text-sm font-semibold leading-snug text-[var(--ap-primary)]">
                {vital.trim()}
              </p>
            </div>
            <p className="text-xs text-[var(--ap-muted)] leading-relaxed mb-4">
              In the live product, this block sits on the client dashboard. An
              email goes out when the scorecard window opens so it stays front
              and center during the week.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="intake-nav-primary w-full bg-[var(--ap-primary)] shadow-lg shadow-black/15 hover:opacity-[0.96]"
            >
              Close and return to intake
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
