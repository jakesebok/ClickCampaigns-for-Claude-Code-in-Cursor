"use client";

import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

/**
 * Full-width “product theater” band: reads as its own chapter vs the light hero (not another pale strip).
 * `dark` scopes shadcn tokens so copy + `app-dark` explorer stay legible on slate.
 */
export function AlfredLandingDemoSection() {
  return (
    <section
      id="product-tour"
      className="dark scroll-mt-20 relative overflow-hidden border-y border-accent/25 bg-[hsl(222_36%_7%)] py-16 text-foreground shadow-[inset_0_1px_0_0_hsl(21_100%_55%/0.12)] md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-25%,hsl(21_100%_55%/0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Inside the app
          </p>
          <h2 className="mb-3 font-outfit text-2xl font-bold text-foreground sm:text-3xl">
            Explore ALFRED before you sign in
          </h2>
          <p className="text-lg font-medium leading-relaxed text-muted-foreground">
            Interactive preview: dashboard, Coach, Voice, results, My Plan (28-day sprint from VAPI), drivers, and the
            screens behind More—same rhythm as the live product. Auto-advance begins once you scroll this section into
            view so you always start on the first stop. Pause anytime or use the dots to jump. Hover the phone to freeze
            the tour while you tap around.
          </p>
        </div>
        <AlfredFeatureExplorer embed="app-dark" />
      </div>
    </section>
  );
}
