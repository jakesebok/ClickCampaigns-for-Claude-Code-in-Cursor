"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ARCHETYPES_FULL } from "@/lib/vapi/archetypes-full";
import {
  ARCHETYPE_LIBRARY_CONTENT,
  ARCHETYPE_LIBRARY_EMPTY_RESULTS_BANNER,
  ARCHETYPE_LIBRARY_FOOTER_HEADING,
  ARCHETYPE_LIBRARY_FOOTER_TEXT,
  ARCHETYPE_LIBRARY_ORDER,
  ARCHETYPE_LIBRARY_SUBTITLE,
  ARCHETYPE_LIBRARY_TITLE,
  getArchetypeSectionId,
} from "@/lib/vapi/archetype-library";
import {
  ARCHETYPE_ACCENT_COLORS,
  getArchetypeIcon,
} from "@/lib/vapi/archetype-icons";
import type { VapiArchetype } from "@/lib/vapi/scoring";
import { DRIVER_CONTENT, type VapiDriverName } from "@/lib/vapi/drivers";
import { getDriverSectionId } from "@/lib/vapi/driver-library";

type LibraryResult = {
  id: string;
  archetype: string | null;
  createdAt: string;
};

function asArchetypeName(
  value: string | null | undefined
): VapiArchetype | null {
  return value && value in ARCHETYPES_FULL ? (value as VapiArchetype) : null;
}

function ArchetypeAnchor({ archetype }: { archetype: VapiArchetype }) {
  return (
    <a
      href={`#${getArchetypeSectionId(archetype)}`}
      className="font-semibold text-accent hover:underline"
    >
      {archetype}
    </a>
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderCommonDrivers(commonDrivers: string) {
  const driverNames = Object.keys(DRIVER_CONTENT) as VapiDriverName[];
  const sortedDriverNames = [...driverNames].sort((a, b) => b.length - a.length);
  const matcher = new RegExp(
    `(${sortedDriverNames.map(escapeRegex).join("|")})`,
    "g"
  );
  const parts = commonDrivers.split(matcher).filter(Boolean);

  return parts.map((part, index) => {
    if (part in DRIVER_CONTENT) {
      const driver = part as VapiDriverName;
      return (
        <Link
          key={`${driver}-${index}`}
          href={`/drivers#${getDriverSectionId(driver)}`}
          className="font-semibold text-accent hover:underline"
        >
          {driver}
        </Link>
      );
    }

    return <Fragment key={`text-${index}`}>{part}</Fragment>;
  });
}

export default function ArchetypesPage() {
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
            archetype?: string | null;
            createdAt: string;
          }) => ({
            id: row.id,
            archetype: row.archetype || null,
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

  const currentArchetype = useMemo(
    () => asArchetypeName(latestResult?.archetype),
    [latestResult]
  );

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Archetype Library" />
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent">
              Archetype Library
            </p>
            <h1 className="mt-3 text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl">
              {ARCHETYPE_LIBRARY_TITLE}
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {ARCHETYPE_LIBRARY_SUBTITLE}
            </p>
            {loading ? (
              <div className="mt-6 rounded-2xl border border-border bg-background/70 px-5 py-4 text-sm text-muted-foreground">
                Loading your latest archetype profile...
              </div>
            ) : currentArchetype ? (
              <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 px-5 py-4 text-sm leading-relaxed text-foreground">
                Your current archetype:{" "}
                <ArchetypeAnchor archetype={currentArchetype} />.
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-background/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {ARCHETYPE_LIBRARY_EMPTY_RESULTS_BANNER}
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
                {ARCHETYPE_LIBRARY_ORDER.map((archetype) => {
                  const accent = ARCHETYPE_ACCENT_COLORS[archetype];
                  const ArchetypeIcon = getArchetypeIcon(archetype);
                  const isCurrent = archetype === currentArchetype;
                  return (
                    <a
                      key={`mobile-${archetype}`}
                      href={`#${getArchetypeSectionId(archetype)}`}
                      className="flex min-w-[220px] items-center gap-3 rounded-2xl border bg-card/80 px-4 py-3 shadow-sm transition-colors hover:border-accent/30"
                      style={{
                        borderColor: isCurrent ? `${accent}55` : undefined,
                        backgroundColor: isCurrent ? `${accent}16` : undefined,
                      }}
                    >
                      <ArchetypeIcon
                        className="h-6 w-6 shrink-0"
                        style={{ color: accent }}
                      />
                      <span
                        className="text-sm leading-snug text-foreground"
                        style={{ fontWeight: isCurrent ? 700 : 500 }}
                      >
                        {archetype}
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
                  All Archetypes
                </p>
                <nav className="space-y-2">
                  {ARCHETYPE_LIBRARY_ORDER.map((archetype) => {
                    const accent = ARCHETYPE_ACCENT_COLORS[archetype];
                    const ArchetypeIcon = getArchetypeIcon(archetype);
                    const isCurrent = archetype === currentArchetype;
                    return (
                      <a
                        key={archetype}
                        href={`#${getArchetypeSectionId(archetype)}`}
                        className="flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors hover:border-accent/30"
                        style={{
                          borderColor: isCurrent ? `${accent}55` : undefined,
                          backgroundColor: isCurrent ? `${accent}16` : undefined,
                        }}
                      >
                        <ArchetypeIcon
                          className="h-6 w-6 shrink-0"
                          style={{ color: accent }}
                        />
                        <span
                          className="text-sm leading-snug text-foreground"
                          style={{ fontWeight: isCurrent ? 700 : 500 }}
                        >
                          {archetype}
                        </span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="space-y-8">
              {ARCHETYPE_LIBRARY_ORDER.map((archetype) => {
                const full = ARCHETYPES_FULL[archetype];
                const extras = ARCHETYPE_LIBRARY_CONTENT[archetype];
                const accent = ARCHETYPE_ACCENT_COLORS[archetype];
                const ArchetypeIcon = getArchetypeIcon(archetype);
                const isCurrent = archetype === currentArchetype;

                return (
                  <section
                    key={archetype}
                    id={getArchetypeSectionId(archetype)}
                    className="scroll-mt-24 rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8"
                    style={{
                      backgroundImage: `linear-gradient(180deg, ${accent}12 0%, transparent 32%)`,
                    }}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border"
                        style={{
                          backgroundColor: `${accent}14`,
                          borderColor: `${accent}33`,
                        }}
                      >
                        <ArchetypeIcon
                          className="h-12 w-12"
                          style={{ color: accent }}
                        />
                      </div>
                      <div className="min-w-0 space-y-3">
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
                          {archetype}
                        </h2>
                        <p className="text-sm italic leading-relaxed text-muted-foreground sm:text-base">
                          {full.tagline}
                        </p>
                      </div>
                    </div>

                    {isCurrent && (
                      <div
                        className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={{
                          backgroundColor: `${accent}16`,
                          borderColor: `${accent}33`,
                          color: accent,
                        }}
                      >
                        This is your current operating pattern.
                      </div>
                    )}

                    <div className="mt-8 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          The Pattern
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {full.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Your Strength
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {full.strength}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Your Shadow
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {full.shadow}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          The Constraint
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {full.constraint}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Your Growth Path
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {full.growthPath}
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
                          {full.programPhase}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          How to Know If This Is You
                        </h3>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.howToKnowThisIsYou.map((item) => (
                            <li key={`${archetype}-is-${item}`} className="flex gap-3">
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
                            <li
                              key={`${archetype}-isnt-${item}`}
                              className="flex gap-3"
                            >
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
                          Sit with these questions honestly. Write your answers
                          somewhere private.
                        </p>
                        <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.reflectionPrompts.map((prompt, index) => (
                            <li
                              key={`${archetype}-prompt-${index}`}
                              className="flex gap-3"
                            >
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
                          How This Relates to Other Archetypes
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {extras.relationshipToOtherArchetypes}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Drivers Most Often Seen With This Archetype
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {renderCommonDrivers(extras.commonDrivers)}
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
              {ARCHETYPE_LIBRARY_FOOTER_HEADING}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {ARCHETYPE_LIBRARY_FOOTER_TEXT}
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
                href="/drivers"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                Explore the 9 Driver Patterns <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
