"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import type { BuildIntakePayloadV1 } from "@/lib/build-assessment-intake/types";
import {
  OPTIONAL_MODULE_OPTIONS,
  RESULT_OUTPUT_OPTIONS,
  BUSINESS_GOAL_OPTIONS,
} from "@/components/build-assessment/intake-constants";

const MODULE_LABEL: Record<string, string> = Object.fromEntries(
  OPTIONAL_MODULE_OPTIONS.map((o) => [o.id, o.label])
);

const GOAL_LABEL: Record<string, string> = Object.fromEntries(
  BUSINESS_GOAL_OPTIONS.map((o) => [o.id, o.label])
);

const OUT_LABEL: Record<string, string> = Object.fromEntries(
  RESULT_OUTPUT_OPTIONS.map((o) => [o.id, o.label])
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

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className="build-complete-card group overflow-hidden p-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-cormorant text-lg font-bold text-[var(--ap-primary)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown className="h-5 w-5 shrink-0 text-[var(--ap-muted)] transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-[var(--ap-border)]/80 px-5 py-4 sm:px-6 sm:py-5">
        {children}
      </div>
    </details>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) {
  const empty =
    typeof value === "string" &&
    (!value || value.trim() === "" || value === "—");
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)] font-outfit mb-1">
        {label}
      </p>
      <div className="text-sm text-[var(--ap-primary)] font-outfit leading-relaxed whitespace-pre-wrap">
        {empty ? <span className="text-[var(--ap-muted)]">—</span> : value}
      </div>
    </div>
  );
}

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

  const p = summary?.full;

  const constructLines = useMemo(() => {
    if (!p) return [];
    const tree = p.constructTree;
    if (tree.structure === "flat") {
      return (tree.standaloneDomains || []).map(
        (d) => d.name || "Construct"
      );
    }
    return (tree.arenas || []).flatMap((a) =>
      a.domains.length
        ? a.domains.map(
            (d) =>
              `${a.name || "Arena"} → ${d.name || "Domain"}`
          )
        : [`${a.name || "Arena"} (no domains yet)`]
    );
  }, [p]);

  if (!summary || !p) {
    return (
      <div className="build-intake-canvas flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="build-complete-card max-w-md p-8 sm:p-10">
          <p className="mb-6 text-[15px] font-outfit leading-relaxed text-[var(--ap-secondary)] sm:text-base">
            If you just submitted the intake, this page opens automatically. If you
            landed here without a session, start fresh:
          </p>
          <Link
            href="/build-your-assessment/intake"
            className="intake-nav-primary inline-flex w-full justify-center gap-2"
          >
            Start intake
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const constructTreeFlat = p.constructTree.structure === "flat";
  const arenaCount = p.constructTree.arenas.length;
  const domainCount = p.constructTree.arenas.reduce(
    (n, a) => n + a.domains.length,
    0
  );
  const standaloneCount = (p.constructTree.standaloneDomains || []).length;

  const resultsPills = (p.resultsOutputs || []).map(
    (id) => OUT_LABEL[id] || id
  );
  const modulePills = (summary.highlights.modules.length
    ? summary.highlights.modules
    : p.optionalSections
  ).map((id) => MODULE_LABEL[id] || id.replace(/_/g, " "));
  const goalPills = (summary.highlights.goals || p.businessGoals || []).map(
    (id) => GOAL_LABEL[id] || id
  );

  return (
    <div className="build-intake-canvas min-h-[calc(100dvh-5rem)]">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:max-w-4xl sm:px-8 sm:py-14 md:py-16 lg:px-10 pb-16 sm:pb-24">
        <div className="mb-10 text-center sm:mb-12 md:mb-14">
          <div className="mb-5 inline-flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-emerald-500/12 ring-4 ring-emerald-500/10 sm:mb-6">
            <CheckCircle2
              className="h-[2.35rem] w-[2.35rem] text-emerald-600"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <p className="mb-2 font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-gradient-accent sm:text-[11px]">
            Received
          </p>
          <h1 className="mx-auto mb-4 max-w-2xl font-cormorant text-3xl font-bold tracking-tight text-[var(--ap-primary)] sm:text-4xl md:text-[2.75rem]">
            Your intake is in,{" "}
            {summary.name.trim().split(/\s+/)[0] || "there"}
          </h1>
          <p className="mx-auto max-w-2xl font-outfit text-[15px] leading-relaxed text-[var(--ap-secondary)] sm:text-base">
            Confirmation sent to{" "}
            <strong className="font-semibold text-[var(--ap-primary)]">
              {summary.email}
            </strong>
            . Below is the full record of what you submitted (expand each section).
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="build-complete-card flex min-h-[140px] flex-col justify-between sm:col-span-1">
            <Layers
              className="mb-3 h-9 w-9 text-[var(--ap-accent)]"
              strokeWidth={1.5}
              aria-hidden
            />
            <div>
              <p className="mb-1 font-outfit text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)]">
                Construct map
              </p>
              {constructTreeFlat ? (
                <>
                  <p className="font-outfit text-2xl font-bold tabular-nums tracking-tight text-[var(--ap-primary)] sm:text-3xl">
                    {standaloneCount}{" "}
                    <span className="text-base font-semibold sm:text-lg">
                      constructs
                    </span>
                  </p>
                  <p className="mt-1.5 font-outfit text-sm text-[var(--ap-secondary)]">
                    Flat framework (no parent arenas)
                  </p>
                </>
              ) : (
                <>
                  <p className="font-outfit text-2xl font-bold tabular-nums tracking-tight text-[var(--ap-primary)] sm:text-3xl">
                    {arenaCount}{" "}
                    <span className="text-base font-semibold sm:text-lg">
                      arenas
                    </span>
                  </p>
                  <p className="mt-1.5 font-outfit text-sm text-[var(--ap-secondary)]">
                    {domainCount} domains
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="build-complete-card sm:col-span-2">
            <Sparkles
              className="mb-3 mt-0.5 h-8 w-8 shrink-0 text-[var(--ap-accent)]"
              aria-hidden
            />
            <p className="mb-2 font-outfit text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ap-muted)]">
              Modules & results (summary)
            </p>
            <div className="flex flex-wrap gap-2">
              {modulePills.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-[var(--ap-border)]/90 bg-[var(--ap-bg)] px-3.5 py-1.5 font-outfit text-xs font-medium text-[var(--ap-primary)] shadow-sm"
                >
                  {m}
                </span>
              ))}
            </div>
            {resultsPills.length > 0 && (
              <p className="mt-3 font-outfit text-xs text-[var(--ap-secondary)]">
                Results page includes: {resultsPills.join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Section title="Contact" defaultOpen>
            <Field label="Name" value={p.contactName || summary.name} />
            <Field label="Email" value={p.contactEmail || summary.email} />
          </Section>

          <Section title="Business goals & audience">
            <Field
              label="Goals"
              value={goalPills.length ? goalPills.join(", ") : "—"}
            />
            <Field label="Audience & context" value={p.audienceAndContext} />
            <Field label="Job to be done / outcomes" value={p.jobToBeDoneNotes} />
          </Section>

          <Section title="Proprietary system">
            <Field
              label="Has proprietary system?"
              value={
                p.hasProprietarySystem === null
                  ? "—"
                  : p.hasProprietarySystem
                    ? "Yes"
                    : "No"
              }
            />
            <Field label="Description" value={p.proprietarySystemDescription} />
            <Field label="Gaps / notes" value={p.proprietaryGapNotes} />
          </Section>

          <Section title="Constructs">
            <Field
              label="Organization"
              value={
                constructTreeFlat
                  ? "Flat (constructs only, no parent arenas)"
                  : "Grouped (arenas contain domains)"
              }
            />
            {constructLines.length ? (
              <ul className="list-inside list-disc space-y-1 font-outfit text-sm text-[var(--ap-primary)]">
                {constructLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="font-outfit text-sm text-[var(--ap-muted)]">—</p>
            )}
          </Section>

          <Section title="Length & scale">
            <Field label="Length preference" value={p.lengthPreference || "—"} />
            <Field label="Scale type" value={p.scalePreference || "—"} />
          </Section>

          <Section title="Modules beyond core">
            <Field
              label="Selected modules"
              value={
                p.optionalSections?.length
                  ? p.optionalSections
                      .map((id) => MODULE_LABEL[id] || id)
                      .join(", ")
                  : "—"
              }
            />
          </Section>

          <Section title="Scoring & patterns">
            <Field label="Scoring pipeline notes" value={p.scoringPipelineNotes} />
            <Field
              label="Bands / tiers on kickoff call"
              value={p.bandsTiersDiscussKickoff ? "Yes" : "No"}
            />
            <Field
              label="Priority matrix"
              value={p.wantsPriorityMatrix ? "Yes" : "No"}
            />
            <Field
              label="Pattern / driver layer"
              value={p.wantsPatternLayer ? "Yes" : "No"}
            />
            <Field label="Pattern notes" value={p.patternLayerNotes} />
          </Section>

          <Section title="Results page outputs">
            <Field
              label="Must include"
              value={
                resultsPills.length ? resultsPills.join(", ") : "—"
              }
            />
          </Section>

          <Section title="Voice & libraries">
            <Field
              label="Reading level index"
              value={String(p.readingLevelIndex)}
            />
            <Field label="Interpretation depth" value={p.contentDepth} />
            <Field label="Who authors copy" value={p.whoAuthors || "—"} />
            <Field label="Libraries & help content" value={p.librariesNotes} />
          </Section>

          <Section title="Generated plans">
            <Field
              label="Wants generated plans"
              value={p.wantsGeneratedPlans ? "Yes" : "No"}
            />
            <Field label="Cadence & shape" value={p.planCadenceNotes} />
            <Field label="Plan update rules" value={p.planUpdateNotes} />
          </Section>

          <Section title="Sign-in & accounts">
            <Field
              label="Existing auth provider?"
              value={
                p.hasAuthProvider === "yes"
                  ? "Yes"
                  : p.hasAuthProvider === "no"
                    ? "No"
                    : "—"
              }
            />
            <Field label="Provider name" value={p.authProviderName} />
          </Section>

          <Section title="Coaching OS & longitudinal">
            <Field label="Coach / admin extras" value={p.coachDashboardExtras} />
            <Field
              label="Interested in longitudinal scorecards"
              value={p.interestedInLongitudinal ? "Yes" : "No"}
            />
            <Field label="Longitudinal notes" value={p.longitudinalNotes} />
          </Section>

          <Section title="Brand">
            <Field label="Website URL" value={p.brandWebsiteUrl} />
            <Field label="Logo URL" value={p.brandLogoUrl} />
            <Field label="Logo / assets (Drive)" value={p.brandLogoDriveUrl} />
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <Field label="Primary hex" value={p.brandColorPrimaryHex} />
              <Field label="Secondary hex" value={p.brandColorSecondaryHex} />
              <Field label="Accent hex" value={p.brandColorAccentHex} />
            </div>
            <Field label="Color notes" value={p.brandColorsNotes} />
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <Field label="Headline font" value={p.brandHeadlineFont} />
              <Field label="Body font" value={p.brandBodyFont} />
              <Field label="Accent font" value={p.brandAccentFont} />
            </div>
            <Field label="Typography notes" value={p.brandTypographyNotes} />
            <Field label="Theme" value={p.brandTheme || "—"} />
          </Section>

          <Section title="Integrations & timeline">
            <Field label="CRM" value={p.crm} />
            <Field label="Analytics" value={p.analytics} />
            <Field label="LMS" value={p.lms} />
            <Field label="Other integrations" value={p.otherIntegrations} />
            <Field
              label="Rush (sooner than 30 days)"
              value={p.rushSoonerThan30Days ? "Yes" : "No"}
            />
            <Field label="Rush context" value={p.rushContextNotes} />
          </Section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="intake-nav-primary inline-flex gap-2 px-10 shadow-xl shadow-[rgba(255,107,26,0.22)]"
          >
            Book a conversation
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <p className="mt-6 font-mono text-[11px] tracking-tight text-[var(--ap-muted)] sm:text-xs">
            Reference ID: {summary.id}
          </p>
        </div>
      </div>
    </div>
  );
}
