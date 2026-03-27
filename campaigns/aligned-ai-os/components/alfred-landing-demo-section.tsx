"use client";

import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

/**
 * Full-width “product theater” band: same deep blue gradient treatment as the
 * “This is not a generic chat coach” section on jakesebok.com/who-is-alfred.
 * `dark` scopes shadcn tokens so copy + `app-dark` explorer stay legible.
 */
export function AlfredLandingDemoSection() {
  return (
    <section
      id="product-tour"
      className="dark scroll-mt-20 relative overflow-x-hidden overflow-y-visible py-16 text-foreground [overflow-anchor:none] md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ap-primary via-ap-primary-2 to-[#2d3d52]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-0.5 bg-ap-accent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-0.5 bg-ap-accent" aria-hidden />
      <div className="relative z-10 mx-auto max-w-[1100px] px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Interactive Preview
          </p>
          <h2 className="mb-3 font-outfit text-2xl font-bold text-foreground sm:text-3xl">
            See how ALFRED helps a founder get the week back
          </h2>
          <p className="mb-3 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
            This is a sample account. Watch how he keeps priorities visible, spots drift early, and helps make cleaner
            decisions when the week gets loud.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Real screens
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Sample data
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Tap pause to explore
            </span>
          </div>
        </div>
        <AlfredFeatureExplorer embed="app-dark" hidePreviewDisclaimer />
      </div>
    </section>
  );
}
