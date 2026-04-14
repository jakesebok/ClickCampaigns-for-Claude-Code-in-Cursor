"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  DEFAULT_BUILD_INTAKE,
  type BuildIntakePayloadV1,
} from "@/lib/build-assessment-intake/types";
import { SixCDemoModal } from "./SixCDemoModal";
import {
  BUSINESS_GOAL_OPTIONS,
  OPTIONAL_MODULE_OPTIONS,
  READING_LEVEL_STOPS,
  RESULT_OUTPUT_OPTIONS,
  WHO_AUTHORS_OPTIONS,
} from "./intake-constants";

const STORAGE_KEY = "build-assessment-intake-draft-v1";

const STEP_ORDER = [
  "welcome",
  "proprietary",
  "audience",
  "constructs",
  "length",
  "modules",
  "scoring",
  "outputs",
  "voice",
  "plans",
  "auth",
  "coach",
  "brand",
  "integrations",
  "contact",
] as const;

type StepId = (typeof STEP_ORDER)[number];

function visibleSteps(data: BuildIntakePayloadV1): StepId[] {
  if (data.optionalSections.includes("auto_plans")) {
    return [...STEP_ORDER];
  }
  return STEP_ORDER.filter((s) => s !== "plans");
}

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Date.now().toString(36)}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

export function BuildIntakeWizard() {
  const router = useRouter();
  const reduceMotion = usePrefersReducedMotion();
  const [data, setData] = useState<BuildIntakePayloadV1>(DEFAULT_BUILD_INTAKE);
  const [stepId, setStepId] = useState<StepId>("welcome");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sixOpen, setSixOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<BuildIntakePayloadV1>;
        setData((d) => ({ ...d, ...parsed, version: 1 }));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, hydrated]);

  const steps = useMemo(() => visibleSteps(data), [data]);

  useEffect(() => {
    if (steps.includes(stepId)) return;
    if (stepId === "plans" && !data.optionalSections.includes("auto_plans")) {
      setStepId("auth");
      return;
    }
    setStepId("welcome");
  }, [steps, stepId, data.optionalSections]);
  const stepIndex = Math.max(0, steps.indexOf(stepId));
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const goNext = useCallback(() => {
    setError(null);
    const i = steps.indexOf(stepId);
    if (i < steps.length - 1) setStepId(steps[i + 1]);
  }, [stepId, steps]);

  const goBack = useCallback(() => {
    setError(null);
    const i = steps.indexOf(stepId);
    if (i > 0) setStepId(steps[i - 1]);
  }, [stepId, steps]);

  const set = useCallback(
    <K extends keyof BuildIntakePayloadV1>(key: K, value: BuildIntakePayloadV1[K]) => {
      setData((d) => ({ ...d, [key]: value }));
    },
    []
  );

  const toggleMulti = useCallback(
    (field: "businessGoals" | "optionalSections" | "resultsOutputs", id: string) => {
      setData((d) => {
        const arr = [...(d[field] as string[])];
        const ix = arr.indexOf(id);
        if (ix >= 0) arr.splice(ix, 1);
        else arr.push(id);
        return { ...d, [field]: arr };
      });
    },
    []
  );

  const submit = useCallback(async () => {
    setError(null);
    setSubmitting(true);
    const payload: BuildIntakePayloadV1 = {
      ...data,
      version: 1,
      wantsGeneratedPlans: data.optionalSections.includes("auto_plans"),
    };
    try {
      const res = await fetch("/api/build-assessment-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || json?.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.setItem(
          "buildYourAssessmentIntakeSummary",
          JSON.stringify({
            id: json.id,
            name: payload.contactName,
            email: payload.contactEmail,
            submittedAt: new Date().toISOString(),
            highlights: {
              goals: payload.businessGoals,
              modules: payload.optionalSections,
              rush: payload.rushSoonerThan30Days,
            },
            full: payload,
          })
        );
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      router.push("/build-your-assessment/complete");
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  }, [data, router]);

  if (!hydrated) {
    return (
      <div className="build-intake-canvas min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6">
        <div
          className={`h-11 w-11 rounded-full border-2 border-[var(--ap-border)] border-t-[var(--ap-accent)] ${reduceMotion ? "" : "animate-spin"}`}
          aria-hidden
        />
        <p className="text-sm text-[var(--ap-muted)] font-outfit tracking-wide text-center max-w-xs leading-relaxed">
          Preparing your intake experience…
        </p>
      </div>
    );
  }

  return (
    <div className="build-intake-canvas min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_-16px_rgba(14,22,36,0.12)]">
        <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-7 lg:px-10 pt-3.5 sm:pt-4 pb-3.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ap-muted)] font-outfit">
              Intake progress
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tabular-nums text-[var(--ap-primary)] font-outfit">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 sm:h-2.5 rounded-full bg-[var(--ap-border)]/95 intake-progress-glow overflow-hidden ring-1 ring-white/60">
            <div
              className="h-full rounded-full intake-progress-fill transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2.5 text-center text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--ap-muted)] font-outfit">
            Step {stepIndex + 1} of {steps.length}
          </p>
        </div>
      </header>

      <div className="flex-1 w-full max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-8 lg:px-10 pt-6 sm:pt-10 md:pt-12 pb-10 sm:pb-14">
        <div key={stepId} className={reduceMotion ? "" : "intake-step-animate"}>
          {stepId === "welcome" && (
            <WelcomeStep onNext={goNext} />
          )}
          {stepId === "proprietary" && (
            <ProprietaryStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "audience" && (
            <AudienceStep
              data={data}
              toggleMulti={toggleMulti}
              set={set}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {stepId === "constructs" && (
            <ConstructsStep data={data} setData={setData} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "length" && (
            <LengthScaleStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "modules" && (
            <ModulesStep
              data={data}
              toggleMulti={toggleMulti}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {stepId === "scoring" && (
            <ScoringStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "outputs" && (
            <OutputsStep
              data={data}
              toggleMulti={toggleMulti}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {stepId === "voice" && (
            <VoiceStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "plans" && (
            <PlansStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "auth" && (
            <AuthStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "coach" && (
            <CoachStep
              data={data}
              set={set}
              onNext={goNext}
              onBack={goBack}
              onOpenSix={() => setSixOpen(true)}
            />
          )}
          {stepId === "brand" && (
            <BrandStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "integrations" && (
            <IntegrationsStep data={data} set={set} onNext={goNext} onBack={goBack} />
          )}
          {stepId === "contact" && (
            <ContactStep
              data={data}
              set={set}
              onBack={goBack}
              onSubmit={submit}
              submitting={submitting}
              error={error}
            />
          )}
        </div>
      </div>

      <SixCDemoModal open={sixOpen} onClose={() => setSixOpen(false)} />
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center px-0 sm:px-2 md:px-4">
      <div className="mx-auto mb-6 h-px w-16 max-w-full bg-gradient-to-r from-transparent via-[var(--ap-accent)]/50 to-transparent sm:mb-8" />
      <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 sm:mb-4 font-outfit">
        Custom assessment + portal
      </p>
      <h1 className="font-cormorant text-[1.75rem] leading-[1.12] sm:text-4xl md:text-[2.75rem] md:leading-[1.08] font-bold text-[var(--ap-primary)] mb-4 sm:mb-5 max-w-xl md:max-w-2xl mx-auto tracking-tight">
        Build the same class of experience as VAPI™
      </h1>
      <p className="text-[var(--ap-secondary)] text-[15px] sm:text-base md:text-lg leading-relaxed mb-9 sm:mb-10 max-w-lg md:max-w-2xl mx-auto font-outfit">
        This intake mirrors how we scope serious work: one focused question at a
        time, with enough room for your methodology, your audience, and what you
        want clients to feel on the other side.
      </p>
      <button
        type="button"
        onClick={onNext}
        className="intake-nav-primary text-base px-11 py-4 sm:py-[1.125rem] shadow-xl shadow-[rgba(255,107,26,0.28)]"
      >
        Begin intake
        <ArrowRight className="w-5 h-5 shrink-0" aria-hidden />
      </button>
      <p className="mt-7 sm:mt-8 text-[11px] sm:text-xs text-[var(--ap-muted)] font-outfit max-w-sm mx-auto leading-relaxed">
        Roughly 12–18 minutes · Progress saves automatically if you refresh
      </p>
    </div>
  );
}

function ProprietaryStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title">
        Do you already have a formal system?
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit leading-relaxed">
        We mean named constructs, definitions, and how you measure them—not just a
        gut feel. If you do not yet, we can co-create one; that path is usually a
        larger scope and a different sequence of workshops.
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {(
          [
            [true, "Yes — I have proprietary constructs and metrics"],
            [false, "Not yet — I need help defining the model"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={String(val)}
            type="button"
            onClick={() => set("hasProprietarySystem", val)}
            className={`intake-choice ${
              data.hasProprietarySystem === val
                ? "intake-choice-active"
                : "intake-choice-default"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {data.hasProprietarySystem === true && (
        <label className="block mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
            Describe your system
          </span>
          <textarea
            value={data.proprietarySystemDescription}
            onChange={(e) => set("proprietarySystemDescription", e.target.value)}
            rows={5}
            className="mt-2 intake-field"
            placeholder="Domains, arenas, how scores combine, any pattern layer…"
          />
        </label>
      )}
      {data.hasProprietarySystem === false && (
        <label className="block mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
            What exists today?
          </span>
          <textarea
            value={data.proprietaryGapNotes}
            onChange={(e) => set("proprietaryGapNotes", e.target.value)}
            rows={4}
            className="mt-2 intake-field"
            placeholder="Notes, links, rough outlines — optional"
          />
        </label>
      )}
      <NavRow onBack={onBack} onNext={onNext} disableNext={data.hasProprietarySystem === null} />
    </div>
  );
}

function AudienceStep({
  data,
  toggleMulti,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  toggleMulti: (f: "businessGoals", id: string) => void;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-2 sm:!mb-3">
        Audience & job to be done
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-4 font-outfit">
        Select all that apply. We tag these on the backend so we know which parts
        of the build matter most.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {BUSINESS_GOAL_OPTIONS.map((g) => {
          const on = data.businessGoals.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => toggleMulti("businessGoals", g.id)}
              className={`intake-pill ${on ? "intake-pill-on" : "intake-pill-off"}`}
            >
              {g.label}
            </button>
          );
        })}
      </div>
      <label className="block mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Who takes this assessment?
        </span>
        <textarea
          value={data.audienceAndContext}
          onChange={(e) => set("audienceAndContext", e.target.value)}
          rows={3}
          className="mt-2 intake-field"
          placeholder="Role, industry, sophistication, language…"
        />
      </label>
      <label className="block mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          What decision should results feed?
        </span>
        <textarea
          value={data.jobToBeDoneNotes}
          onChange={(e) => set("jobToBeDoneNotes", e.target.value)}
          rows={3}
          className="mt-2 intake-field"
          placeholder="Coaching focus, offer routing, team rollout…"
        />
      </label>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        disableNext={data.businessGoals.length === 0}
      />
    </div>
  );
}

function ConstructsStep({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  setData: Dispatch<SetStateAction<BuildIntakePayloadV1>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const addArena = () => {
    setData((d) => ({
      ...d,
      constructTree: {
        arenas: [
          ...d.constructTree.arenas,
          { id: newId("arena"), name: "", domains: [] },
        ],
      },
    }));
  };

  const addDomain = (arenaId: string) => {
    setData((d) => ({
      ...d,
      constructTree: {
        arenas: d.constructTree.arenas.map((a) =>
          a.id !== arenaId
            ? a
            : {
                ...a,
                domains: [
                  ...a.domains,
                  { id: newId("dom"), name: "" },
                ],
              }
        ),
      },
    }));
  };

  const updateArena = (arenaId: string, name: string) => {
    setData((d) => ({
      ...d,
      constructTree: {
        arenas: d.constructTree.arenas.map((a) =>
          a.id === arenaId ? { ...a, name } : a
        ),
      },
    }));
  };

  const updateDomain = (arenaId: string, domainId: string, name: string) => {
    setData((d) => ({
      ...d,
      constructTree: {
        arenas: d.constructTree.arenas.map((a) =>
          a.id !== arenaId
            ? a
            : {
                ...a,
                domains: a.domains.map((x) =>
                  x.id === domainId ? { ...x, name } : x
                ),
              }
        ),
      },
    }));
  };

  const removeDomain = (arenaId: string, domainId: string) => {
    setData((d) => ({
      ...d,
      constructTree: {
        arenas: d.constructTree.arenas.map((a) =>
          a.id !== arenaId
            ? a
            : {
                ...a,
                domains: a.domains.filter((x) => x.id !== domainId),
              }
        ),
      },
    }));
  };

  const removeArena = (arenaId: string) => {
    setData((d) => ({
      ...d,
      constructTree: {
        arenas: d.constructTree.arenas.filter((a) => a.id !== arenaId),
      },
    }));
  };

  const valid =
    data.constructTree.arenas.length > 0 &&
    data.constructTree.arenas.every(
      (a) =>
        a.name.trim().length > 0 &&
        a.domains.length > 0 &&
        a.domains.every((d) => d.name.trim().length > 0)
    );

  return (
    <div>
      <h2 className="intake-section-title !mb-2 sm:!mb-3 flex flex-wrap items-center gap-2 md:gap-3">
        <Layers className="w-7 h-7 text-[var(--ap-accent)]" />
        Arenas & domains
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit leading-relaxed">
        Add an <strong>arena</strong> (big bucket), then add <strong>domains</strong>{" "}
        underneath. This mirrors how we structure scores and the wheel.
      </p>

      <div className="space-y-4 mb-6">
        {data.constructTree.arenas.map((arena) => (
          <div
            key={arena.id}
            className="rounded-2xl border border-[var(--ap-border)]/90 bg-white/95 p-4 sm:p-5 shadow-[0_8px_32px_-20px_rgba(14,22,36,0.1)] ring-1 ring-white/90"
          >
            <div className="flex items-start gap-2 mb-3">
              <ChevronRight className="w-5 h-5 text-[var(--ap-accent)] shrink-0 mt-1" />
              <input
                type="text"
                value={arena.name}
                onChange={(e) => updateArena(arena.id, e.target.value)}
                placeholder="Arena name (e.g. Mindset)"
                className="flex-1 intake-field py-2.5 font-semibold"
              />
              <button
                type="button"
                onClick={() => removeArena(arena.id)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-[var(--ap-muted)] hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Remove arena"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-6 space-y-2 border-l-2 border-[var(--ap-border)]/80 pl-4">
              {arena.domains.map((dom) => (
                <div key={dom.id} className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-[var(--ap-muted)] shrink-0" />
                  <input
                    type="text"
                    value={dom.name}
                    onChange={(e) =>
                      updateDomain(arena.id, dom.id, e.target.value)
                    }
                    placeholder="Domain / construct name"
                    className="flex-1 intake-field py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => removeDomain(arena.id, dom.id)}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-[var(--ap-muted)] hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Remove domain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addDomain(arena.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ap-accent)] font-outfit mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add domain
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addArena}
        className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[var(--ap-accent)]/50 px-4 py-2.5 text-sm font-semibold text-[var(--ap-accent)] font-outfit hover:bg-[#FFF3EE]"
      >
        <Plus className="w-4 h-4" />
        Add arena
      </button>

      <NavRow onBack={onBack} onNext={onNext} disableNext={!valid} />
    </div>
  );
}

function LengthScaleStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title">
        Length & response scale
      </h2>
      <div className="rounded-2xl border border-[var(--ap-border)]/90 bg-white/95 p-4 sm:p-5 mb-6 text-sm text-[var(--ap-secondary)] font-outfit leading-relaxed space-y-3 shadow-[0_4px_24px_-16px_rgba(14,22,36,0.08)] ring-1 ring-white/80">
        <p>
          <strong className="text-[var(--ap-primary)]">Shorter assessments</strong>{" "}
          reduce friction and lift completion rates. They also give less statistical
          confidence per construct.
        </p>
        <p>
          <strong className="text-[var(--ap-primary)]">Longer instruments</strong>{" "}
          support stronger segmentation and interpretation, but you will lose
          some people before the email gate. Expect better-qualified leads, not
          more volume.
        </p>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Target length
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {(
          [
            ["short", "Lean (~5–8 min)"],
            ["balanced", "Balanced (~10–15 min)"],
            ["comprehensive", "Deep (~18–30+ min)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => set("lengthPreference", id)}
            className={`intake-choice text-left font-medium ${
              data.lengthPreference === id
                ? "intake-choice-active"
                : "intake-choice-default"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Response scale (guidance)
      </p>
      <div className="rounded-2xl border border-[var(--ap-border)]/80 bg-gradient-to-br from-[#FAF9F7] to-[#F3F0EC] p-4 sm:p-5 mb-4 text-sm text-[var(--ap-secondary)] font-outfit space-y-2 ring-1 ring-white/90 shadow-inner">
        <p>
          A <strong>7-point Likert</strong> with reverse-keyed items is the default
          for psychometric-style confidence. <strong>5-point</strong> scales feel
          faster. <strong>Binary</strong> items are great for frictionless quizzes
          but limit nuance.
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        {(
          [
            ["sevenLikert", "7-point Likert (recommended default)"],
            ["fiveLikert", "5-point Likert"],
            ["binary", "Binary / yes-no"],
            ["mixed", "Mixed (we'll design with you)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => set("scalePreference", id)}
            className={`intake-choice text-left ${
              data.scalePreference === id
                ? "intake-choice-active"
                : "intake-choice-default"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        disableNext={!data.lengthPreference || !data.scalePreference}
      />
    </div>
  );
}

function ModulesStep({
  data,
  toggleMulti,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  toggleMulti: (f: "optionalSections", id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-2 sm:!mb-3">
        Modules beyond core assessment
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-4 font-outfit">
        Core delivery always includes a structured assessment flow and a results
        experience. Select add-ons you want scoped.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {OPTIONAL_MODULE_OPTIONS.map((m) => {
          const on = data.optionalSections.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMulti("optionalSections", m.id)}
              className={`intake-pill ${on ? "intake-pill-on" : "intake-pill-off"}`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <NavRow onBack={onBack} onNext={onNext} disableNext={false} />
    </div>
  );
}

function ScoringStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title">
        Scoring, matrix & patterns
      </h2>
      <label className="block mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Raw-score pipeline notes
        </span>
        <textarea
          value={data.scoringPipelineNotes}
          onChange={(e) => set("scoringPipelineNotes", e.target.value)}
          rows={4}
          placeholder="Weights, normalization, anything we must preserve from your methodology…"
          className="mt-2 intake-field"
        />
      </label>
      <label className="flex items-center gap-3 mb-4 cursor-pointer font-outfit text-sm">
        <input
          type="checkbox"
          checked={data.bandsTiersDiscussKickoff}
          onChange={(e) => set("bandsTiersDiscussKickoff", e.target.checked)}
          className="h-4 w-4 accent-[var(--ap-accent)]"
        />
        Band / tier names will need a working session (counts differ by product).
      </label>
      <div className="rounded-2xl border border-[var(--ap-border)] bg-white p-4 mb-4">
        <p className="text-sm text-[var(--ap-secondary)] font-outfit mb-3">
          A <strong>priority matrix</strong> crosses importance with performance so
          clients see what to protect versus what needs attention.
        </p>
        <label className="flex items-center gap-3 font-outfit text-sm">
          <input
            type="checkbox"
            checked={data.wantsPriorityMatrix}
            onChange={(e) => set("wantsPriorityMatrix", e.target.checked)}
            className="h-4 w-4 accent-[var(--ap-accent)]"
          />
          Include importance × performance matrix
        </label>
      </div>
      <div className="rounded-2xl border border-[var(--ap-border)] bg-white p-4 mb-4">
        <p className="text-sm text-[var(--ap-secondary)] font-outfit mb-3">
          A <strong>pattern layer</strong> (drivers, archetypes, profiles) sits on
          top of scores—optional but powerful when rules are clear.
        </p>
        <label className="flex items-center gap-3 font-outfit text-sm mb-2">
          <input
            type="checkbox"
            checked={data.wantsPatternLayer}
            onChange={(e) => set("wantsPatternLayer", e.target.checked)}
            className="h-4 w-4 accent-[var(--ap-accent)]"
          />
          Explore a pattern / driver / profile layer
        </label>
        {data.wantsPatternLayer && (
          <textarea
            value={data.patternLayerNotes}
            onChange={(e) => set("patternLayerNotes", e.target.value)}
            rows={3}
            placeholder="What should it detect? Any named patterns already?"
            className="mt-2 intake-field py-2.5"
          />
        )}
      </div>
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

function OutputsStep({
  data,
  toggleMulti,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  toggleMulti: (f: "resultsOutputs", id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-4 sm:!mb-5">
        Results page must include
      </h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {RESULT_OUTPUT_OPTIONS.map((m) => {
          const on = data.resultsOutputs.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMulti("resultsOutputs", m.id)}
              className={`intake-pill ${on ? "intake-pill-on" : "intake-pill-off"}`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        disableNext={data.resultsOutputs.length === 0}
      />
    </div>
  );
}

function VoiceStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const ri = Math.min(5, Math.max(0, data.readingLevelIndex));
  const stop = READING_LEVEL_STOPS[ri] ?? READING_LEVEL_STOPS[2];
  return (
    <div>
      <h2 className="intake-section-title !mb-4 sm:!mb-5">
        Voice & authorship
      </h2>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Reading level
      </p>
      <input
        type="range"
        min={0}
        max={5}
        value={data.readingLevelIndex}
        onChange={(e) => {
          const n = Math.min(5, Math.max(0, Number.parseInt(e.target.value, 10)));
          set("readingLevelIndex", n);
        }}
        className="w-full accent-[var(--ap-accent)] mb-2"
      />
      <div className="flex justify-between text-[10px] text-[var(--ap-muted)] font-outfit mb-2">
        <span>K–3</span>
        <span>Einstein</span>
      </div>
      <p className="text-sm font-semibold text-[var(--ap-primary)] font-outfit mb-6">
        {stop.short} — {stop.label}
      </p>
      <label className="block mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Interpretation depth
        </span>
        <textarea
          value={data.contentDepth}
          onChange={(e) => set("contentDepth", e.target.value)}
          rows={3}
          placeholder="Short blurbs vs long coaching-style narratives…"
          className="mt-2 intake-field"
        />
      </label>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Who authors copy?
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {WHO_AUTHORS_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => set("whoAuthors", o.id)}
            className={`intake-choice text-left ${
              data.whoAuthors === o.id
                ? "intake-choice-active"
                : "intake-choice-default"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <label className="block mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Libraries (drivers, FAQs, methodology pages)
        </span>
        <textarea
          value={data.librariesNotes}
          onChange={(e) => set("librariesNotes", e.target.value)}
          rows={3}
          className="mt-2 intake-field"
        />
      </label>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        disableNext={!data.whoAuthors}
      />
    </div>
  );
}

function PlansStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title">
        Generated plans
      </h2>
      <label className="block mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Cadence & shape
        </span>
        <textarea
          value={data.planCadenceNotes}
          onChange={(e) => set("planCadenceNotes", e.target.value)}
          rows={3}
          placeholder="28-day sprint, 12-week arc, weekly themes…"
          className="mt-2 intake-field"
        />
      </label>
      <label className="block mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          How should plans update on retakes?
        </span>
        <textarea
          value={data.planUpdateNotes}
          onChange={(e) => set("planUpdateNotes", e.target.value)}
          rows={3}
          className="mt-2 intake-field"
        />
      </label>
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

function AuthStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title">
        Accounts & auth
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-4 font-outfit leading-relaxed">
        Default for most engagements is{" "}
        <strong>Supabase Auth</strong> for the portal. If you need a richer consumer
        app experience, we may layer <strong>Clerk</strong> or similar—especially
        when you want turnkey OAuth and mobile-ready session handling.
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {(
          [
            ["supabase", "Supabase Auth (portal-first)"],
            ["clerk", "Clerk (app-forward)"],
            ["unsure", "Not sure — recommend in kickoff"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => set("authPreference", id)}
            className={`intake-choice text-left ${
              data.authPreference === id
                ? "intake-choice-active"
                : "intake-choice-default"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        disableNext={!data.authPreference}
      />
    </div>
  );
}

function CoachStep({
  data,
  set,
  onNext,
  onBack,
  onOpenSix,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenSix: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title">
        Coaching OS & ongoing scorecards
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-4 font-outfit leading-relaxed">
        Baseline scope includes coach and admin views unless you say otherwise. Tell
        us anything else you need on those surfaces.
      </p>
      <label className="block mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Extra coach / admin needs
        </span>
        <textarea
          value={data.coachDashboardExtras}
          onChange={(e) => set("coachDashboardExtras", e.target.value)}
          rows={3}
          placeholder="Exports, cohort views, white-label roles…"
          className="mt-2 intake-field"
        />
      </label>
      <div className="rounded-2xl border border-[var(--ap-border)] bg-[#FAF9F7] p-4 mb-4">
        <label className="flex items-start gap-3 font-outfit text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.interestedInLongitudinal}
            onChange={(e) =>
              set("interestedInLongitudinal", e.target.checked)
            }
            className="h-4 w-4 mt-0.5 accent-[var(--ap-accent)]"
          />
          <span>
            Interested in recurring performance metrics (6C-style rhythm, weekly
            pulses, trend lines on the dashboard).
          </span>
        </label>
        {data.interestedInLongitudinal && (
          <textarea
            value={data.longitudinalNotes}
            onChange={(e) => set("longitudinalNotes", e.target.value)}
            rows={2}
            placeholder="Optional context"
            className="mt-3 intake-field py-2.5"
          />
        )}
      </div>
      <button
        type="button"
        onClick={onOpenSix}
        className="mb-6 w-full rounded-2xl border-2 border-[var(--ap-accent)] bg-white px-4 py-4 text-left font-outfit shadow-sm hover:bg-[#FFF3EE] transition-colors"
      >
        <span className="text-sm font-bold text-[var(--ap-primary)] block mb-1">
          View interactive 6C demo
        </span>
        <span className="text-xs text-[var(--ap-secondary)]">
          Stays inside this page — shortened scorecard, Vital Action, dashboard-style
          scores.
        </span>
      </button>
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

function BrandStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-4 sm:!mb-5">
        Brand & legal
      </h2>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Logo URL (hosted file)
        </span>
        <input
          type="url"
          value={data.brandLogoUrl}
          onChange={(e) => set("brandLogoUrl", e.target.value)}
          className="mt-1 intake-field"
          placeholder="https://"
        />
      </label>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Colors
        </span>
        <textarea
          value={data.brandColorsNotes}
          onChange={(e) => set("brandColorsNotes", e.target.value)}
          rows={2}
          className="mt-1 intake-field py-2.5"
        />
      </label>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Typography
        </span>
        <textarea
          value={data.brandTypographyNotes}
          onChange={(e) => set("brandTypographyNotes", e.target.value)}
          rows={2}
          className="mt-1 intake-field py-2.5"
        />
      </label>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Theme
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["light", "dark", "both"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("brandTheme", t)}
            className={`intake-pill capitalize ${
              data.brandTheme === t ? "intake-pill-on" : "intake-pill-off"
            }`}
          >
            {t === "both" ? "Light & dark" : t}
          </button>
        ))}
      </div>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Privacy policy URL (required) *
        </span>
        <input
          type="url"
          required
          value={data.privacyPolicyUrl}
          onChange={(e) => set("privacyPolicyUrl", e.target.value)}
          className="mt-1 intake-field"
          placeholder="https://"
        />
      </label>
      <label className="block mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Terms URL (required) *
        </span>
        <input
          type="url"
          required
          value={data.termsUrl}
          onChange={(e) => set("termsUrl", e.target.value)}
          className="mt-1 intake-field"
          placeholder="https://"
        />
      </label>
      <p className="text-xs text-[var(--ap-muted)] font-outfit mb-4">
        You provide final legal pages. We do not draft them for you.
      </p>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        disableNext={
          !/^https?:\/\//i.test(data.privacyPolicyUrl.trim()) ||
          !/^https?:\/\//i.test(data.termsUrl.trim())
        }
      />
    </div>
  );
}

function IntegrationsStep({
  data,
  set,
  onNext,
  onBack,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-4 sm:!mb-5">
        Integrations & timeline
      </h2>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          CRM
        </span>
        <input
          value={data.crm}
          onChange={(e) => set("crm", e.target.value)}
          className="mt-1 intake-field"
        />
      </label>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Analytics
        </span>
        <input
          value={data.analytics}
          onChange={(e) => set("analytics", e.target.value)}
          className="mt-1 intake-field"
        />
      </label>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          LMS / course platform
        </span>
        <input
          value={data.lms}
          onChange={(e) => set("lms", e.target.value)}
          className="mt-1 intake-field"
        />
      </label>
      <label className="block mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Other integrations
        </span>
        <textarea
          value={data.otherIntegrations}
          onChange={(e) => set("otherIntegrations", e.target.value)}
          rows={2}
          className="mt-1 intake-field py-2.5"
        />
      </label>
      <div className="rounded-2xl border border-[var(--ap-border)] bg-white p-4 mb-4">
        <label className="flex items-start gap-3 font-outfit text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.rushSoonerThan30Days}
            onChange={(e) => set("rushSoonerThan30Days", e.target.checked)}
            className="h-4 w-4 mt-0.5 accent-[var(--ap-accent)]"
          />
          <span>I need this sooner than 30 days.</span>
        </label>
        {data.rushSoonerThan30Days && (
          <>
            <p className="mt-3 text-sm text-[var(--ap-secondary)] font-outfit leading-relaxed">
              A rush fee may apply depending on scope. We will confirm after review.
            </p>
            <textarea
              value={data.rushContextNotes}
              onChange={(e) => set("rushContextNotes", e.target.value)}
              rows={2}
              placeholder="Target date / launch event"
              className="mt-2 intake-field py-2.5"
            />
          </>
        )}
      </div>
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

function ContactStep({
  data,
  set,
  onBack,
  onSubmit,
  submitting,
  error,
}: {
  data: BuildIntakePayloadV1;
  set: <K extends keyof BuildIntakePayloadV1>(
    key: K,
    value: BuildIntakePayloadV1[K]
  ) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const valid =
    data.contactName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim());
  return (
    <div>
      <h2 className="intake-section-title">
        Last step — your details
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit">
        We will email you a copy of everything you submitted. Jake gets the full
        payload on his side for review.
      </p>
      <label className="block mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Full name
        </span>
        <input
          value={data.contactName}
          onChange={(e) => set("contactName", e.target.value)}
          className="mt-1 intake-field"
        />
      </label>
      <label className="block mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Email
        </span>
        <input
          type="email"
          value={data.contactEmail}
          onChange={(e) => set("contactEmail", e.target.value.trim().toLowerCase())}
          className="mt-1 intake-field"
        />
      </label>
      {error && (
        <p className="text-sm text-red-600 mb-4 font-outfit" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="intake-nav-secondary w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          Back
        </button>
        <button
          type="button"
          disabled={!valid || submitting}
          onClick={onSubmit}
          className="intake-nav-primary flex-1"
        >
          {submitting ? "Sending…" : "Submit intake"}
          {!submitting && <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

function NavRow({
  onBack,
  onNext,
  disableNext,
}: {
  onBack: () => void;
  onNext: () => void;
  disableNext?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center pt-6 sm:pt-8 border-t border-[var(--ap-border)]/60 mt-8 sm:mt-10">
      <button
        type="button"
        onClick={onBack}
        className="intake-nav-secondary w-full sm:w-auto shrink-0"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        className="intake-nav-primary flex-1 w-full sm:min-w-0"
      >
        Continue
        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
      </button>
    </div>
  );
}
