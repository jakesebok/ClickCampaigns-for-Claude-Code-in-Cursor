"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  Compass,
  Brain,
  Focus,
  Heart,
  Home,
  Users,
  Globe,
  Telescope,
  Rocket,
  Gauge,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { DOMAINS, SCALE_LABELS, SCALE_VALUES, IMPORTANCE_DOMAINS } from "@/lib/vapi/quiz-data";

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity,
  IA: Compass,
  ME: Brain,
  AF: Focus,
  RS: Heart,
  FA: Home,
  CO: Users,
  WI: Globe,
  VS: Telescope,
  EX: Rocket,
  OH: Gauge,
  EC: Leaf,
};

type Phase = "intro" | "quiz" | "importance" | "submitting";

export default function AssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [importance, setImportance] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentDomain = DOMAINS[currentDomainIdx];
  const domainAnswers = answers[currentDomain?.code] || [];
  const totalQuestions = DOMAINS.length * 6;
  const answeredCount = useMemo(
    () => Object.values(answers).reduce((sum, a) => sum + a.filter((v) => v > 0).length, 0),
    [answers]
  );

  const setAnswer = useCallback((domainCode: string, questionIdx: number, value: number) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      updated[domainCode] = [...(updated[domainCode] || [0, 0, 0, 0, 0, 0])];
      updated[domainCode][questionIdx] = value;
      return updated;
    });
  }, []);

  const allDomainAnswered = domainAnswers.length === 6 && domainAnswers.every((v) => v > 0);
  const allImportanceSet = DOMAINS.every((d) => (importance[d.code] || 0) > 0);

  function nextDomain() {
    if (currentDomainIdx < DOMAINS.length - 1) {
      setCurrentDomainIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPhase("importance");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function prevDomain() {
    if (currentDomainIdx > 0) {
      setCurrentDomainIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setPhase("submitting");
    setError("");

    try {
      const res = await fetch("/api/vapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, importance }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      router.push(`/assessment/results?id=${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("importance");
      setSubmitting(false);
    }
  }

  if (phase === "intro") {
    return (
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border">
          <h1 className="text-lg font-semibold">VAPI Assessment</h1>
          <p className="text-sm text-muted-foreground">
            Values-Aligned Performance Indicator&trade;
          </p>
        </header>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto py-8 space-y-8">
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10">
                <Activity className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-serif font-bold">
                Measure What Matters
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                The VAPI assesses 12 domains across your personal life,
                relationships, and business. It takes about 15 minutes and
                reveals exactly where you&apos;re aligned — and where you&apos;re not.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { arena: "Personal", count: 4, domains: "Physical Health, Inner Alignment, Mental/Emotional, Attention & Focus" },
                { arena: "Relationships", count: 4, domains: "Self, Family, Community, World/Impact" },
                { arena: "Business", count: 4, domains: "Vision/Strategy, Execution, Operations, Ecology" },
              ].map((a) => (
                <div
                  key={a.arena}
                  className="rounded-xl border border-border p-4 space-y-2"
                >
                  <h3 className="font-semibold">{a.arena}</h3>
                  <p className="text-xs text-muted-foreground">{a.domains}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border p-5 space-y-3 bg-secondary/30">
              <h3 className="font-medium">How it works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground shrink-0">1.</span>
                  72 statements — rate each from Strongly Agree to Strongly Disagree
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground shrink-0">2.</span>
                  Rate how important each domain is to you right now (1-10)
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground shrink-0">3.</span>
                  Get your scores, archetype, and priority matrix instantly
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPhase("quiz")}
              className="w-full py-3.5 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              Begin Assessment
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Scoring your assessment...</p>
        </div>
      </div>
    );
  }

  if (phase === "importance") {
    return (
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Importance Ratings</h1>
              <p className="text-sm text-muted-foreground">
                How important is each domain to you right now? (1-10)
              </p>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto space-y-8">
            {IMPORTANCE_DOMAINS.map((section) => (
              <div key={section.section} className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {section.section}
                </h2>
                {section.domains.map((d) => (
                  <div
                    key={d.code}
                    className="rounded-xl border border-border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {DOMAIN_ICONS[d.code] &&
                          (() => {
                            const Icon = DOMAIN_ICONS[d.code];
                            return <Icon className="h-4 w-4 text-accent" />;
                          })()}
                        <span className="font-medium text-sm">{d.label}</span>
                      </div>
                      {(importance[d.code] || 0) > 0 && (
                        <span className="text-sm font-medium text-accent">
                          {importance[d.code]}/10
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                        <button
                          key={v}
                          onClick={() =>
                            setImportance((prev) => ({ ...prev, [d.code]: v }))
                          }
                          className={`flex-1 h-9 rounded-md text-xs font-medium transition-colors ${
                            (importance[d.code] || 0) === v
                              ? "bg-accent text-accent-foreground"
                              : (importance[d.code] || 0) >= v
                                ? "bg-accent/20 text-accent"
                                : "bg-muted hover:bg-secondary"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPhase("quiz");
                  setCurrentDomainIdx(DOMAINS.length - 1);
                }}
                className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allImportanceSet || submitting}
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                See My Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = DOMAIN_ICONS[currentDomain.code];
  const arenaLabel =
    currentDomain.arena === "personal"
      ? "Personal"
      : currentDomain.arena === "relationships"
        ? "Relationships"
        : "Business";

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {arenaLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentDomainIdx + 1} / {DOMAINS.length}
              </span>
            </div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5 text-accent" />}
              {currentDomain.name}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              {answeredCount} / {totalQuestions}
            </div>
            <div className="w-32 h-1.5 bg-muted rounded-full mt-1">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{
                  width: `${(answeredCount / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentDomain.questions.map((question, qIdx) => (
            <div
              key={question.id}
              className="rounded-xl border border-border p-5 space-y-4"
            >
              <div className="flex gap-2">
                <span className="text-sm font-medium text-accent shrink-0">
                  {qIdx + 1}.
                </span>
                <p className="text-sm leading-relaxed">{question.text}</p>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {SCALE_VALUES.map((value, sIdx) => (
                  <button
                    key={value}
                    onClick={() => setAnswer(currentDomain.code, qIdx, value)}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-center transition-colors ${
                      domainAnswers[qIdx] === value
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted hover:bg-secondary"
                    }`}
                  >
                    <span className="text-xs font-medium">{value}</span>
                    <span className="text-[10px] leading-tight hidden sm:block">
                      {SCALE_LABELS[sIdx]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2 pb-4">
            <button
              onClick={prevDomain}
              disabled={currentDomainIdx === 0}
              className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-secondary disabled:opacity-30 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={nextDomain}
              disabled={!allDomainAnswered}
              className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {currentDomainIdx === DOMAINS.length - 1 ? "Rate Importance" : "Next Domain"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
