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
import Link from "next/link";
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
import { IntakeTooltip } from "./IntakeTooltip";
import { SixCDemoModal } from "./SixCDemoModal";
import { VapiResultsExampleModal } from "./VapiResultsExampleModal";
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
  const [vapiExampleOpen, setVapiExampleOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<BuildIntakePayloadV1> & {
          authPreference?: string;
        };
        setData(() => {
          const base: BuildIntakePayloadV1 = {
            ...DEFAULT_BUILD_INTAKE,
            ...parsed,
            version: 1,
          };
          if (
            !base.hasAuthProvider &&
            parsed.authPreference === "supabase"
          ) {
            base.hasAuthProvider = "no";
          } else if (
            !base.hasAuthProvider &&
            (parsed.authPreference === "clerk" || parsed.authPreference === "unsure")
          ) {
            base.hasAuthProvider = "yes";
            if (!base.authProviderName) base.authProviderName = "See prior intake (Clerk/unsure)";
          }
          return base;
        });
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [stepId]);

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
    <div className="build-intake-canvas flex min-h-[100dvh] flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <header className="fixed left-0 right-0 top-0 z-[60] border-b border-white/70 bg-white/92 pt-[env(safe-area-inset-top)] shadow-[0_8px_32px_-16px_rgba(14,22,36,0.14)] backdrop-blur-xl">
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

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-10 pt-[calc(7.25rem+env(safe-area-inset-top))] sm:px-8 sm:pb-14 sm:pt-[calc(7.75rem+env(safe-area-inset-top))] md:pt-[calc(8.25rem+env(safe-area-inset-top))] lg:max-w-3xl lg:px-10">
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
              onOpenVapiExample={() => setVapiExampleOpen(true)}
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
              onOpenVapiExample={() => setVapiExampleOpen(true)}
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
      <VapiResultsExampleModal
        open={vapiExampleOpen}
        onClose={() => setVapiExampleOpen(false)}
      />
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
  onOpenVapiExample,
}: {
  data: BuildIntakePayloadV1;
  toggleMulti: (f: "optionalSections", id: string) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenVapiExample: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-2 sm:!mb-3">
        Modules beyond core assessment
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-4 font-outfit leading-relaxed">
        Core delivery always includes a structured assessment flow and a results
        experience. Everything below is optional scope you want priced and designed.
        The public VAPI™ on this site shows how several of these modules feel in
        production.
      </p>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={onOpenVapiExample}
          className="intake-nav-secondary w-full justify-center sm:w-auto"
        >
          See a real VAPI™ results page (sample data)
        </button>
        <Link
          href="/assessment/start"
          className="text-center text-sm font-semibold text-[var(--ap-accent)] underline-offset-2 hover:underline sm:text-left"
        >
          Or take the live assessment yourself →
        </Link>
      </div>
      <div className="space-y-4 mb-8">
        {OPTIONAL_MODULE_OPTIONS.map((m) => {
          const on = data.optionalSections.includes(m.id);
          return (
            <div
              key={m.id}
              className="rounded-2xl border border-[var(--ap-border)]/90 bg-white/90 p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleMulti("optionalSections", m.id)}
                className={`intake-pill mb-2 ${on ? "intake-pill-on" : "intake-pill-off"}`}
              >
                {m.label}
              </button>
              <p className="text-[13px] leading-relaxed text-[var(--ap-secondary)] font-outfit">
                {m.blurb}
              </p>
            </div>
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
      <label className="flex items-start gap-3 mb-4 cursor-pointer font-outfit">
        <input
          type="checkbox"
          checked={data.bandsTiersDiscussKickoff}
          onChange={(e) => set("bandsTiersDiscussKickoff", e.target.checked)}
          className="h-4 w-4 mt-1 shrink-0 accent-[var(--ap-accent)]"
        />
        <span className="text-sm text-[var(--ap-primary)] leading-relaxed">
          <span className="font-semibold block mb-1.5">
            Plan a kickoff call to name score bands or tiers
          </span>
          <span className="text-[var(--ap-secondary)] font-normal block text-[13px] sm:text-sm">
            “Bands” and “tiers” are the client-facing labels for ranges of scores—for
            example{" "}
            <em className="not-italic text-[var(--ap-primary)]/95">
              Low / Moderate / High
            </em>
            , three named stages like{" "}
            <em className="not-italic text-[var(--ap-primary)]/95">
              Calibrate → Accelerate → Scale
            </em>
            , or letter grades. How many levels you need (three vs. four vs. five)
            depends on your product, so we finalize names and counts on a live call
            instead of only from this intake.
          </span>
        </span>
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
  onOpenVapiExample,
}: {
  data: BuildIntakePayloadV1;
  toggleMulti: (f: "resultsOutputs", id: string) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenVapiExample: () => void;
}) {
  return (
    <div>
      <h2 className="intake-section-title !mb-4 sm:!mb-5">
        Results page must include
      </h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-4 font-outfit leading-relaxed">
        Choose everything clients should see on their results experience. Not sure
        what a label means? Open the annotated VAPI™ preview—each option below maps
        to a region on that real page.
      </p>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={onOpenVapiExample}
          className="intake-nav-secondary w-full justify-center sm:w-auto"
        >
          Open VAPI™ example with vocabulary labels
        </button>
        <Link
          href="/assessment/start"
          className="text-center text-sm font-semibold text-[var(--ap-accent)] underline-offset-2 hover:underline sm:text-left"
        >
          Take VAPI™ to feel the flow →
        </Link>
      </div>
      <div className="mb-8 space-y-4">
        {RESULT_OUTPUT_OPTIONS.map((m) => {
          const on = data.resultsOutputs.includes(m.id);
          return (
            <div
              key={m.id}
              className="rounded-2xl border border-[var(--ap-border)]/90 bg-white/95 p-4 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleMulti("resultsOutputs", m.id)}
                  className={`intake-pill ${on ? "intake-pill-on" : "intake-pill-off"}`}
                >
                  {m.label}
                </button>
                <IntakeTooltip label={m.label}>{m.hint}</IntakeTooltip>
              </div>
              <p className="pl-0.5 text-[13px] font-outfit leading-relaxed text-[var(--ap-secondary)]">
                {m.hint}
              </p>
            </div>
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
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit leading-relaxed">
        This step decides how dense the interpretation copy feels and what reference
        material we wire into the experience (pattern libraries, help articles, your
        methodology).
      </p>
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
          placeholder="Example: one tight paragraph per domain vs. long-form coaching narrative; where you want more story vs. more checklist."
          className="mt-2 intake-field"
        />
      </label>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Who authors copy?
      </p>
      <div className="flex flex-col gap-2 mb-6">
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
      <div className="rounded-2xl border border-[var(--ap-border)] bg-[#FAFAFB] p-4 sm:p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit mb-2">
          Supporting libraries & help content
        </p>
        <p className="text-[13px] text-[var(--ap-secondary)] font-outfit leading-relaxed mb-3">
          <strong className="text-[var(--ap-primary)]">Pattern libraries</strong> are
          curated narratives (similar to VAPI™ archetypes and drivers) that unlock
          based on scores.{" "}
          <strong className="text-[var(--ap-primary)]">FAQs</strong> are short help
          answers for common questions inside the app.{" "}
          <strong className="text-[var(--ap-primary)]">Methodology pages</strong> are
          longer “how to read this” articles you want linked from results. Paste
          links, upload plans, or describe what exists today.
        </p>
        <textarea
          value={data.librariesNotes}
          onChange={(e) => set("librariesNotes", e.target.value)}
          rows={4}
          placeholder="Example: Link to our Notion methodology hub. FAQs live in Intercom (we will export). Driver copy should mirror the tone in our course workbook…"
          className="intake-field"
        />
      </div>
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
  const needsProviderName = data.hasAuthProvider === "yes";
  const canContinue =
    data.hasAuthProvider !== "" &&
    (data.hasAuthProvider === "no" ||
      (data.hasAuthProvider === "yes" &&
        data.authProviderName.trim().length > 1));

  return (
    <div>
      <h2 className="intake-section-title">Accounts & sign-in</h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit leading-relaxed">
        We need to know whether you already pay for a login provider (Auth0, Clerk,
        Cognito, Firebase Auth, Stytch, etc.) or if we should recommend one during
        kickoff. You do not need to decide implementation details here—just the
        business reality.
      </p>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Do you already have an auth provider for this product?
      </p>
      <div className="mb-6 flex flex-col gap-2">
        {(
          [
            ["yes", "Yes — we already use one"],
            ["no", "No — please recommend at kickoff"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              set("hasAuthProvider", id);
              if (id === "no") set("authProviderName", "");
            }}
            className={`intake-choice text-left ${
              data.hasAuthProvider === id
                ? "intake-choice-active"
                : "intake-choice-default"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {needsProviderName && (
        <label className="mb-6 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
            Who powers sign-in today?
          </span>
          <input
            value={data.authProviderName}
            onChange={(e) => set("authProviderName", e.target.value)}
            className="mt-2 intake-field"
            placeholder="Example: Clerk (marketing site + app), Auth0 tenant “acme”, Google-only Firebase…"
          />
        </label>
      )}
      <NavRow onBack={onBack} onNext={onNext} disableNext={!canContinue} />
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
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit leading-relaxed">
        Baseline scope includes coach and admin views unless you say otherwise. Start
        with the interactive preview if recurring scorecards matter to you.
      </p>
      <button
        type="button"
        onClick={onOpenSix}
        className="mb-6 w-full rounded-2xl border-2 border-[var(--ap-accent)] bg-gradient-to-br from-[#FFF8F3] to-white px-4 py-5 text-left font-outfit shadow-md shadow-[rgba(255,107,26,0.12)] transition-colors hover:from-[#FFF3EE] hover:to-white"
      >
        <span className="text-sm font-bold text-[var(--ap-primary)] block mb-1">
          View interactive 6C demo (~60 seconds)
        </span>
        <span className="text-xs text-[var(--ap-secondary)] leading-relaxed">
          Opens as a full-screen overlay: Likert buttons, Vital Action, then a
          dashboard-style grid. Nothing leaves this browser session.
        </span>
      </button>
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
  const [pullingBrand, setPullingBrand] = useState(false);
  const [pullError, setPullError] = useState<string | null>(null);

  const pullFromSite = async () => {
    const raw = data.brandWebsiteUrl.trim();
    if (!/^https:\/\//i.test(raw)) {
      setPullError("Enter a full https:// URL first.");
      return;
    }
    setPullingBrand(true);
    setPullError(null);
    try {
      const res = await fetch("/api/extract-brand-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });
      const json = (await res.json()) as {
        colors?: string[];
        googleFonts?: string[];
        bodyFontGuess?: string | null;
        message?: string;
      };
      if (!res.ok) {
        setPullError(json.message || "Could not read that page. Paste hex codes manually.");
        return;
      }
      const colors = json.colors || [];
      if (colors[0]) set("brandColorPrimaryHex", colors[0]);
      if (colors[1]) set("brandColorSecondaryHex", colors[1]);
      if (colors[2]) set("brandColorAccentHex", colors[2]);
      const gf = json.googleFonts || [];
      if (gf[0] && !data.brandHeadlineFont) set("brandHeadlineFont", gf[0]);
      if (gf[1] && !data.brandBodyFont) set("brandBodyFont", gf[1]);
      else if (json.bodyFontGuess && !data.brandBodyFont)
        set("brandBodyFont", json.bodyFontGuess.split(",")[0].trim());
      if (colors.length) {
        set(
          "brandColorsNotes",
          (data.brandColorsNotes ? data.brandColorsNotes + "\n\n" : "") +
            `Auto-detected swatches (review): ${colors.slice(0, 6).join(", ")}`
        );
      }
    } catch {
      setPullError("Network error. Try again or paste colors manually.");
    } finally {
      setPullingBrand(false);
    }
  };

  return (
    <div>
      <h2 className="intake-section-title !mb-4 sm:!mb-5">Brand & presentation</h2>
      <p className="text-sm text-[var(--ap-secondary)] mb-6 font-outfit leading-relaxed">
        Legal pages are handled later so you are not blocked here. Focus on visuals:
        logos, hex codes, fonts, and theme.
      </p>

      <label className="mb-3 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Public website URL (for color & font hints)
        </span>
        <input
          type="url"
          value={data.brandWebsiteUrl}
          onChange={(e) => set("brandWebsiteUrl", e.target.value)}
          className="mt-1 intake-field"
          placeholder="https://"
        />
      </label>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={pullFromSite}
          disabled={pullingBrand}
          className="intake-nav-secondary w-full justify-center sm:w-auto disabled:opacity-50"
        >
          {pullingBrand ? "Scanning site…" : "Pull colors & fonts from site"}
        </button>
        <span className="text-xs text-[var(--ap-muted)] font-outfit">
          Best-effort parse (https only). Many sites block automated fetches; you can
          always paste manually.
        </span>
      </div>
      {pullError && (
        <p className="mb-4 text-sm text-red-600 font-outfit" role="alert">
          {pullError}
        </p>
      )}

      <label className="mb-3 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Logo file (direct URL)
        </span>
        <input
          type="url"
          value={data.brandLogoUrl}
          onChange={(e) => set("brandLogoUrl", e.target.value)}
          className="mt-1 intake-field"
          placeholder="https://cdn…/logo.svg"
        />
      </label>
      <label className="mb-6 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Or share a Drive link to logo / brand PDF
        </span>
        <input
          type="url"
          value={data.brandLogoDriveUrl}
          onChange={(e) => set("brandLogoDriveUrl", e.target.value)}
          className="mt-1 intake-field"
          placeholder="https://drive.google.com/…"
        />
      </label>

      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Hex colors
      </p>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {(
          [
            ["brandColorPrimaryHex", "Primary"],
            ["brandColorSecondaryHex", "Secondary"],
            ["brandColorAccentHex", "Accent"],
          ] as const
        ).map(([key, lab]) => (
          <label key={key} className="block">
            <span className="text-[11px] font-semibold text-[var(--ap-secondary)] font-outfit">
              {lab}
            </span>
            <input
              value={data[key]}
              onChange={(e) => set(key, e.target.value)}
              className="mt-1 intake-field font-mono text-sm"
              placeholder="#0E1624"
            />
          </label>
        ))}
      </div>
      <label className="mb-6 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Color notes (gradients, rules, “never use”)
        </span>
        <textarea
          value={data.brandColorsNotes}
          onChange={(e) => set("brandColorsNotes", e.target.value)}
          rows={2}
          className="mt-1 intake-field py-2.5"
        />
      </label>

      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2 font-outfit">
        Typography
      </p>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {(
          [
            ["brandHeadlineFont", "Headline / display"],
            ["brandBodyFont", "Body"],
            ["brandAccentFont", "Accent / quotes"],
          ] as const
        ).map(([key, lab]) => (
          <label key={key} className="block">
            <span className="text-[11px] font-semibold text-[var(--ap-secondary)] font-outfit">
              {lab}
            </span>
            <input
              value={data[key]}
              onChange={(e) => set(key, e.target.value)}
              className="mt-1 intake-field text-sm"
              placeholder="e.g. Cormorant Garamond"
            />
          </label>
        ))}
      </div>
      <label className="mb-6 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] font-outfit">
          Typography notes (licensing, fallbacks)
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
      <div className="mb-6 flex flex-wrap gap-2">
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

      <NavRow onBack={onBack} onNext={onNext} disableNext={false} />
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
