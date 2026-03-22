"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useMediaLg } from "@/lib/hooks/use-media-lg";
import { cn } from "@/lib/utils";
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
import {
  chatQueryUrl,
  buildDriverCoachPrompt,
  buildAlignedMomentumCoachPrompt,
} from "@/lib/chat-deep-links";

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

type MobileDriverFocus = typeof ALIGNED_MOMENTUM_NAME | VapiDriverName;

function DriverBrowseLink({
  driver,
  isLg,
  onPick,
}: {
  driver: VapiDriverName;
  isLg: boolean;
  onPick: (d: VapiDriverName) => void;
}) {
  if (isLg) {
    return (
      <a
        href={`#${getDriverSectionId(driver)}`}
        className="font-semibold text-accent hover:underline"
      >
        {driver}
      </a>
    );
  }
  return (
    <button
      type="button"
      className="font-semibold text-accent hover:underline"
      onClick={() => onPick(driver)}
    >
      {driver}
    </button>
  );
}

function StateBrowseLink({
  name,
  isLg,
  onPick,
}: {
  name: typeof ALIGNED_MOMENTUM_NAME;
  isLg: boolean;
  onPick: (key: typeof ALIGNED_MOMENTUM_NAME) => void;
}) {
  if (isLg) {
    return (
      <a
        href={`#${getDriverSectionId(name)}`}
        className="font-semibold text-accent hover:underline"
      >
        {name}
      </a>
    );
  }
  return (
    <button
      type="button"
      className="font-semibold text-accent hover:underline"
      onClick={() => onPick(name)}
    >
      {name}
    </button>
  );
}

export default function DriversPage() {
  const [latestResult, setLatestResult] = useState<LibraryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFocus, setMobileFocus] = useState<MobileDriverFocus | null>(null);
  const isLg = useMediaLg();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const openMobileDriver = useCallback(
    (key: MobileDriverFocus) => {
      setMobileFocus(key);
      scrollToTop();
      window.history.replaceState(null, "", `#${getDriverSectionId(key)}`);
    },
    [scrollToTop]
  );

  const closeMobileDriver = useCallback(() => {
    setMobileFocus(null);
    scrollToTop();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    );
  }, [scrollToTop]);

  useEffect(() => {
    if (isLg) {
      setMobileFocus(null);
      return;
    }
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    if (hash === getDriverSectionId(ALIGNED_MOMENTUM_NAME)) {
      setMobileFocus(ALIGNED_MOMENTUM_NAME);
      return;
    }
    const driverMatch = DRIVER_ORDER.find((d) => getDriverSectionId(d) === hash);
    if (driverMatch) setMobileFocus(driverMatch);
  }, [isLg]);

  useEffect(() => {
    const onHash = () => {
      if (isLg) return;
      const h = window.location.hash.slice(1);
      if (!h) {
        setMobileFocus(null);
        return;
      }
      if (h === getDriverSectionId(ALIGNED_MOMENTUM_NAME)) {
        setMobileFocus(ALIGNED_MOMENTUM_NAME);
        return;
      }
      const driverMatch = DRIVER_ORDER.find((d) => getDriverSectionId(d) === h);
      if (driverMatch) setMobileFocus(driverMatch);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [isLg]);

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
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin",
          !isLg && mobileFocus ? "pt-0 -mt-px" : "pt-6"
        )}
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <section
            className={cn(
              "rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8",
              !isLg && mobileFocus && "hidden"
            )}
          >
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
              <div className="mt-6 space-y-3">
                <div
                  className="rounded-2xl border px-5 py-4 text-sm leading-relaxed text-foreground"
                  style={{
                    backgroundColor: `${alignedAccent}12`,
                    borderColor: `${alignedAccent}26`,
                  }}
                >
                  Your current state:{" "}
                  <StateBrowseLink
                    name={ALIGNED_MOMENTUM_NAME}
                    isLg={isLg}
                    onPick={openMobileDriver}
                  />
                  .
                </div>
                <Link
                  href={chatQueryUrl(buildAlignedMomentumCoachPrompt())}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  Coach on protecting momentum <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : primaryDriver ? (
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-accent/20 bg-accent/10 px-5 py-4 text-sm leading-relaxed text-foreground">
                  Your primary driver:{" "}
                  <DriverBrowseLink
                    driver={primaryDriver}
                    isLg={isLg}
                    onPick={openMobileDriver}
                  />
                  . Your secondary driver:{" "}
                  {secondaryDriver ? (
                    <DriverBrowseLink
                      driver={secondaryDriver}
                      isLg={isLg}
                      onPick={openMobileDriver}
                    />
                  ) : (
                    "None identified"
                  )}
                  .
                </div>
                <Link
                  href={chatQueryUrl(buildDriverCoachPrompt(primaryDriver))}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  Discuss this driver with Alfred <ArrowRight className="h-4 w-4" />
                </Link>
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

          {!isLg && !mobileFocus && (
            <div className="lg:hidden space-y-6">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-gradient-to-r from-accent/[0.07] via-transparent to-transparent px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Explore
                  </p>
                  <p className="mt-1 font-serif text-xl font-bold tracking-tight text-foreground">
                    Pick a pattern
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Full profiles open one at a time—use back to browse the rest.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openMobileDriver(ALIGNED_MOMENTUM_NAME)}
                  className="flex w-full items-start gap-4 border-b border-border bg-card p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
                  style={{
                    borderColor: isAlignedMomentum ? `${alignedAccent}44` : undefined,
                    backgroundColor: isAlignedMomentum ? `${alignedAccent}0D` : undefined,
                  }}
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
                    style={{
                      backgroundColor: `${alignedAccent}14`,
                      borderColor: `${alignedAccent}40`,
                    }}
                  >
                    <DriverIcon driver={ALIGNED_MOMENTUM_NAME} size={28} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold leading-snug text-foreground">
                        {ALIGNED_MOMENTUM_NAME}
                      </span>
                      <ChevronRight
                        className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {ALIGNED_MOMENTUM_CONTENT.tagline}
                    </p>
                    {isAlignedMomentum ? (
                      <span
                        className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          backgroundColor: `${alignedAccent}20`,
                          color: alignedAccent,
                        }}
                        >
                        Your state
                      </span>
                    ) : null}
                  </div>
                </button>
                <p className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Dysfunction patterns
                </p>
                <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
                  {DRIVER_ORDER.map((driverName) => {
                    const accent = DRIVER_ACCENT_COLORS[driverName];
                    const driver = DRIVER_CONTENT[driverName];
                    const isPrimary = driverName === primaryDriver;
                    const isSecondary = driverName === secondaryDriver;
                    return (
                      <button
                        key={`mobile-index-${driverName}`}
                        type="button"
                        onClick={() => openMobileDriver(driverName)}
                        className="flex w-full items-start gap-4 bg-card p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
                      >
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
                          style={{
                            backgroundColor: `${accent}14`,
                            borderColor: `${accent}40`,
                          }}
                        >
                          <DriverIcon driver={driverName} size={28} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold leading-snug text-foreground">
                              {driverName}
                            </span>
                            <ChevronRight
                              className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs italic leading-relaxed text-muted-foreground sm:text-sm">
                            {driver.tagline}
                          </p>
                          {isPrimary ? (
                            <span
                              className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                              style={{
                                backgroundColor: `${accent}20`,
                                color: accent,
                              }}
                            >
                              Primary
                            </span>
                          ) : null}
                          {!isPrimary && isSecondary ? (
                            <span
                              className="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                              style={{
                                backgroundColor: `${accent}14`,
                                color: accent,
                              }}
                            >
                              Secondary
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
              {!isLg && mobileFocus ? (
                <div className="sticky -top-px z-30 -mx-6 mb-0 flex items-center gap-2 border-b border-border bg-background px-6 py-3 lg:hidden">
                  <button
                    type="button"
                    onClick={closeMobileDriver}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                    All patterns
                  </button>
                </div>
              ) : null}
              <section
                id={getDriverSectionId(ALIGNED_MOMENTUM_NAME)}
                className={cn(
                  "scroll-mt-24 rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8",
                  !isLg && mobileFocus !== ALIGNED_MOMENTUM_NAME && "hidden"
                )}
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
                      How to Know If This Isn't You
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

              <div className="hidden rounded-3xl border border-border bg-background/50 px-6 py-5 text-center shadow-sm lg:block">
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
                    className={cn(
                      "scroll-mt-24 rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8",
                      !isLg && mobileFocus !== driverName && "hidden"
                    )}
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
                          How to Know If This Isn't You
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

                      {extras.commonArchetypes && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Common Archetypes
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {extras.commonArchetypes}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <section
            className={cn(
              "rounded-3xl border border-border bg-card/80 p-6 shadow-sm sm:p-8",
              !isLg && mobileFocus && "hidden"
            )}
          >
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
