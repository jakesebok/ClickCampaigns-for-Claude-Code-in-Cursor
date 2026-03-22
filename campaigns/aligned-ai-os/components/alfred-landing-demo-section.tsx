"use client";

import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

/**
 * Dark-band section so the explorer matches alfredai.coach’s shell (no white strip).
 * Typography uses the `app-dark` embed variant inside the explorer.
 */
export function AlfredLandingDemoSection() {
  return (
    <section
      id="product-tour"
      className="scroll-mt-20 border-y border-border bg-card/30 py-16 text-foreground md:py-24"
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Inside the app
          </p>
          <h2 className="mb-3 font-outfit text-2xl font-bold text-foreground sm:text-3xl">
            Explore ALFRED before you sign in
          </h2>
          <p className="text-lg font-medium leading-relaxed text-muted-foreground">
            Interactive preview: dashboard, Coach, Voice, results, drivers, and the screens behind More—same rhythm as
            the live product. The tour runs automatically; pause anytime or use the dots to jump. Hover the phone to
            freeze the tour while you tap around.
          </p>
        </div>
        <AlfredFeatureExplorer embed="app-dark" />
      </div>
    </section>
  );
}
