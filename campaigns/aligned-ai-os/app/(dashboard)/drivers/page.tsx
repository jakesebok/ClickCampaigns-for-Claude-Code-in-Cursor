"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  ALIGNED_MOMENTUM_CONTENT,
  ALIGNED_MOMENTUM_NAME,
  DRIVER_CONTENT,
  type VapiDriverName,
  type VapiDriverState,
} from "@/lib/vapi/drivers";
import {
  ALIGNED_MOMENTUM_LIBRARY_CONTENT,
  DRIVER_LIBRARY_DIVIDER_HEADING,
  DRIVER_LIBRARY_DIVIDER_TEXT,
  DRIVER_LIBRARY_CONTENT,
  DRIVER_LIBRARY_EMPTY_RESULTS_BANNER,
  DRIVER_LIBRARY_FOOTER_HEADING,
  DRIVER_LIBRARY_FOOTER_TEXT,
  DRIVER_LIBRARY_SUBTITLE,
  DRIVER_LIBRARY_TITLE,
  DRIVER_ORDER,
  getDriverSectionId,
} from "@/lib/vapi/driver-library";
import { DRIVER_ACCENT_COLORS, DriverIcon } from "@/lib/vapi/driver-icons";

type LibraryResult = {
  id: string;
  assignedDriver: string | null;
  secondaryDriver: string | null;
  driverState: VapiDriverState | null;
  createdAt: string;
};

function asDriverName(value: string | null | undefined): VapiDriverName | null {
  return value && value in DRIVER_CONTENT ? (value as VapiDriverName) : null;
}

function DriverAnchor({ driver }: { driver: VapiDriverName }) {
  return (
    <a href={`#${getDriverSectionId(driver)}`} className="font-semibold text-accent hover:underline">
      {driver}
    </a>
  );
}

function StateAnchor({ name }: { name: typeof ALIGNED_MOMENTUM_NAME }) {
  return (
    <a
      href={`#${getDriverSectionId(name)}`}
      className="font-semibold text-accent hover:underline"
    >
      {name}
    </a>
  );
}

export default function DriversPage() {
  const [latestResult, setLatestResult] = useState<LibraryResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/vapi");
        const payload = await response.json();
        const results = Array.isArray(payload?.results) ? payload.results : [];
        const normalized = results
          .map((row: {
            id: string;
            assignedDriver?: string | null;
            secondaryDriver?: string | null;
            driverState?: VapiDriverState | null;
            createdAt: string;
          }) => ({
            id: row.id,
            assignedDriver: row.assignedDriver || null,
            secondaryDriver: row.secondaryDriver || null,
            driverState: row.driverState || null,
            createdAt: row.createdAt,
          }))
          .sort(
            (a: LibraryResult, b: LibraryResult) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setLatestResult(normalized[0] ?? null);
      } catch {
        setLatestResult(null);
      }
    };

    load().finally(() => setLoading(false));
  }, []);

  const primaryDriver = useMemo(
    () => asDriverName(latestResult?.assignedDriver),
    [latestResult]
  );
  const secondaryDriver = useMemo(
    () => asDriverName(latestResult?.secondaryDriver),
    [latestResult]
  );
  const isAlignedMomentum = latestResult?.driverState === "aligned_momentum";
  const alignedAccent = DRIVER_ACCENT_COLORS[ALIGNED_MOMENTUM_NAME];

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Driver Library" />
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent">
              Driver Library
            </p>
            <h1 className="mt-3 text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl">
              {DRIVER_LIBRARY_TITLE}
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {DRIVER_LIBRARY_SUBTITLE}
            </p>
            {loading ? (
              <div className="mt-6 rounded-2xl border border-border bg-background/70 px-5 py-4 text-sm text-muted-foreground">
                Loading your latest driver profile...
              </div>
            ) : isAlignedMomentum ? (
              <div className="mt-6 rounded-2xl border px-5 py-4 text-sm leading-relaxed text-foreground"
                style={{
                  backgroundColor: `${alignedAccent}12`,
                  borderColor: `${alignedAccent}26`,
                }}
              >
                Your current state: <StateAnchor name={ALIGNED_MOMENTUM_NAME} />.
              </div>
            ) : primaryDriver ? (
              <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 px-5 py-4 text-sm leading-relaxed text-foreground">
                Your primary driver: <DriverAnchor driver={primaryDriver} />. Your secondary
                driver:{" "}
                {secondaryDriver ? (
                  <DriverAnchor driver={secondaryDriver} />
                ) : (
                  "None identified"
                )}
                .
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-background/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {DRIVER_LIBRARY_EMPTY_RESULTS_BANNER}
                </p>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  Take the Assessment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          <div className="space-y-4 lg:hidden">
            <div className="-mx-2 overflow-x-auto px-2 pb-1">
              <div className="flex min-w-max gap-3">
                <a
                  href={`#${getDriverSectionId(ALIGNED_MOMENTUM_NAME)}`}
                  className="flex min-w-[210px] items-center gap-3 rounded-2xl border bg-card/80 px-4 py-3 shadow-sm transition-colors hover:border-accent/30"
                  style={{
                    borderColor: isAlignedMomentum ? `${alignedAccent}55` : undefined,
                    backgroundColor: isAlignedMomentum ? `${alignedAccent}16` : undefined,
                  }}
                >
                  <DriverIcon driver={ALIGNED_MOMENTUM_NAME} size={24} />
                  <span
                    className="text-sm text-foreground"
                    style={{ fontWeight: isAlignedMomentum ? 700 : 500 }}
                  >
                    {ALIGNED_MOMENTUM_NAME}
                  </span>
                </a>
                <div className="flex items-center px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Dysfunction Drivers
                </div>
                {DRIVER_ORDER.map((driverName) => {
                  const accent = DRIVER_ACCENT_COLORS[driverName];
                  const isPrimary = driverName === primaryDriver;
                  const isSecondary = driverName === secondaryDriver;
                  return (
                    <a
                      key={`mobile-${driverName}`}
                      href={`#${getDriverSectionId(driverName)}`}
                      className="flex min-w-[210px] items-center gap-3 rounded-2xl border bg-card/80 px-4 py-3 shadow-sm transition-colors hover:border-accent/30"
                      style={{
                        borderColor: isPrimary
                          ? `${accent}55`
                          : isSecondary
                            ? `${accent}33`
                            : undefined,
                        backgroundColor: isPrimary
                          ? `${accent}16`
                          : isSecondary
                            ? `${accent}0D`
                            : undefined,
                      }}
                    >
                      <DriverIcon driver={driverName} size={24} />
                      <span className="text-sm font-medium text-foreground">
                        {driverName}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px,minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-6 rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
                <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  All Drivers
                </p>
                <nav className="space-y-2">
                  <a
                    href={`#${getDriverSectionId(ALIGNED_MOMENTUM_NAME)}`}
                    className="flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors hover:border-accent/30"
                    style={{
                      borderColor: isAlignedMomentum ? `${alignedAccent}55` : undefined,
                      backgroundColor: isAlignedMomentum ? `${alignedAccent}16` : undefined,
                    }}
                  >
                    <DriverIcon driver={ALIGNED_MOMENTUM_NAME} size={24} />
                    <span
                      className="text-sm leading-snug text-foreground"
                      style={{ fontWeight: isAlignedMomentum ? 700 : 500 }}
                    >
                      {ALIGNED_MOMENTUM_NAME}
                    </span>
                  </a>
                  <p className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Dysfunction Drivers
                  </p>
                  {DRIVER_ORDER.map((driverName) => {
                    const accent = DRIVER_ACCENT_COLORS[driverName];
                    const isPrimary = driverName === primaryDriver;
                    const isSecondary = driverName === secondaryDriver;
                    return (
                      <a
                        key={driverName}
                        href={`#${getDriverSectionId(driverName)}`}
                        className="flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors hover:border-accent/30"
                        style={{
                          borderColor: isPrimary
                            ? `${accent}55`
                            : isSecondary
                              ? `${accent}33`
                              : undefined,
                          backgroundColor: isPrimary
                            ? `${accent}16`
                            : isSecondary
                              ? `${accent}0D`
                              : undefined,
                        }}
                      >
                        <DriverIcon driver={driverName} size={24} />
                        <span
                          className="text-sm leading-snug text-foreground"
                          style={{ fontWeight: isPrimary ? 700 : isSecondary ? 600 : 500 }}
                        >
                          {driverName}
                        </span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="space-y-8">
              <section
                id={getDriverSectionId(ALIGNED_MOMENTUM_NAME)}
                className="scroll-mt-24 rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border"
                    style={{
                      backgroundColor: `${alignedAccent}14`,
                      borderColor: `${alignedAccent}33`,
                    }}
                  >
                    <DriverIcon driver={ALIGNED_MOMENTUM_NAME} size={80} />
                  </div>
                  <div className="min-w-0 space-y-3">
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
                      {ALIGNED_MOMENTUM_CONTENT.name}
                    </h2>
                    <p className="text-sm italic leading-relaxed text-muted-foreground">
                      {ALIGNED_MOMENTUM_CONTENT.tagline}
                    </p>
                    <blockquote className="text-xl font-serif italic leading-tight text-foreground sm:text-2xl">
                      &quot;{ALIGNED_MOMENTUM_CONTENT.coreState}&quot;
                    </blockquote>
                  </div>
                </div>

                {isAlignedMomentum && (
                  <div
                    className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
                    style={{
                      backgroundColor: `${alignedAccent}16`,
                      borderColor: `${alignedAccent}33`,
                      color: alignedAccent,
                    }}
                  >
                    This is your current state.
                  </div>
                )}

                <div className="mt-8 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      The State
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_CONTENT.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      How This Shows Up in Your Scores
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_CONTENT.howThisShowsUp}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      What This Makes Possible
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_CONTENT.whatThisMakesPossible}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      How to Protect It
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_CONTENT.howToProtectIt}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      How to Know If This Is You
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_LIBRARY_CONTENT.howToKnowThisIsYou.map((item) => (
                        <li key={`aligned-is-${item}`} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      How to Know If This Isn&apos;t You
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_LIBRARY_CONTENT.howToKnowThisIsntYou.map((item) => (
                        <li key={`aligned-isnt-${item}`} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Reflection Prompts
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      If this pattern resonates, sit with these questions. Don&apos;t rush.
                      Write your answers somewhere private.
                    </p>
                    <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_LIBRARY_CONTENT.reflectionPrompts.map((prompt, index) => (
                        <li key={`aligned-prompt-${index}`} className="flex gap-3">
                          <span className="font-semibold text-foreground">
                            {index + 1}.
                          </span>
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      How This Relates to Drivers
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {ALIGNED_MOMENTUM_LIBRARY_CONTENT.relationshipToOtherDrivers}
                    </p>
                  </div>
                </div>
              </section>

              <div className="rounded-3xl border border-border bg-background/50 px-6 py-5 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {DRIVER_LIBRARY_DIVIDER_HEADING}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {DRIVER_LIBRARY_DIVIDER_TEXT}
                </p>
              </div>

              {DRIVER_ORDER.map((driverName) => {
                const driver = DRIVER_CONTENT[driverName];
                const extras = DRIVER_LIBRARY_CONTENT[driverName];
                const accent = DRIVER_ACCENT_COLORS[driverName];
                const isPrimary = driverName === primaryDriver;
                const isSecondary = driverName === secondaryDriver;

                return (
                  <section
                    key={driverName}
                    id={getDriverSectionId(driverName)}
                    className="scroll-mt-24 rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border"
                        style={{
                          backgroundColor: `${accent}14`,
                          borderColor: `${accent}33`,
                        }}
                      >
                        <DriverIcon driver={driverName} size={80} />
                      </div>
                      <div className="min-w-0 space-y-3">
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
                          {driver.name}
                        </h2>
                        <blockquote className="text-xl font-serif italic leading-tight text-foreground sm:text-2xl">
                          &quot;{driver.coreBelief}&quot;
                        </blockquote>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Core fear:</span>{" "}
                          {driver.coreFear}
                        </p>
                        <p className="text-sm italic leading-relaxed text-muted-foreground">
                          {driver.tagline}
                        </p>
                      </div>
                    </div>

                    {isPrimary && (
                      <div
                        className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={{
                          backgroundColor: `${accent}16`,
                          borderColor: `${accent}33`,
                          color: accent,
                        }}
                      >
                        This is your primary driver pattern.
                      </div>
                    )}
                    {!isPrimary && isSecondary && (
                      <div
                        className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={{
                          backgroundColor: `${accent}0F`,
                          borderColor: `${accent}28`,
                          color: accent,
                        }}
                      >
                        This is your secondary driver pattern.
                      </div>
                    )}

                    <div className="mt-8 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          The Pattern
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {driver.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          How This Shows Up in Your Scores
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {driver.mechanism}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          What This Is Costing You
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {driver.whatItCosts}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          The Way Out
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {driver.theWayOut}
                        </p>
                      </div>

                      <div
                        className="rounded-2xl border px-5 py-4"
                        style={{
                          backgroundColor: `${accent}10`,
                          borderColor: `${accent}24`,
                        }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Where this gets addressed
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {driver.programPhase}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          How to Know If This Is You
                        </h3>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.howToKnowThisIsYou.map((item) => (
                            <li key={`${driverName}-is-${item}`} className="flex gap-3">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          How to Know If This Isn&apos;t You
                        </h3>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.howToKnowThisIsntYou.map((item) => (
                            <li key={`${driverName}-isnt-${item}`} className="flex gap-3">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Reflection Prompts
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          If this pattern resonates, sit with these questions. Don&apos;t rush.
                          Write your answers somewhere private.
                        </p>
                        <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.reflectionPrompts.map((prompt, index) => (
                            <li key={`${driverName}-prompt-${index}`} className="flex gap-3">
                              <span className="font-semibold text-foreground">
                                {index + 1}.
                              </span>
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          How This Relates to Other Patterns
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.relationshipToOtherDrivers}
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">
              {DRIVER_LIBRARY_FOOTER_HEADING}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {DRIVER_LIBRARY_FOOTER_TEXT}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="https://jakesebok.com/work-with-me"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90"
              >
                Learn About the Program <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                Retake the VAPI Assessment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/archetypes"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                Explore the 9 Founder Archetypes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
