"use client";

import { ChevronDown } from "lucide-react";
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
            Inside the app
          </p>
          <h2 className="mb-3 font-outfit text-2xl font-bold text-foreground sm:text-3xl">
            Explore ALFRED before you sign in
          </h2>
          <p className="mb-3 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
            Same rhythm as the live product: Dashboard, Coach, Voice, Results, My Plan, Drivers, and More.
          </p>
          <details className="group mx-auto w-full max-w-[720px]">
            <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <ChevronDown
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-200 ease-out -rotate-90 group-open:rotate-0"
              />
              Tour notes
            </summary>
            <p className="mt-3 text-left text-sm font-medium leading-relaxed text-muted-foreground">
              The tour runs through Dashboard, Coach, Voice, Results, My Plan (28-day sprint from VAPI), Drivers, and
              the screens behind More. Auto-advance starts when this section scrolls into view (you begin on the first
              stop). Pause anytime, use arrows or dots to jump, and hover the phone to freeze auto-advance while you tap
              around. Labels and layout match what subscribers use; coach replies here use illustrative sample context,
              while your signed-in account grounds answers in your assessment, blueprint, scorecard, and commitments.
            </p>
          </details>
        </div>
        <AlfredFeatureExplorer embed="app-dark" hidePreviewDisclaimer />
      </div>
    </section>
  );
}
