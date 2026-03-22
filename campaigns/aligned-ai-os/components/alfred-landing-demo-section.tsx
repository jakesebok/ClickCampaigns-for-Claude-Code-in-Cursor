"use client";

import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

/**
 * Light “ap” band so explorer typography (ap-primary) stays readable on the
 * otherwise dark marketing shell.
 */
export function AlfredLandingDemoSection() {
  return (
    <section
      id="product-tour"
      className="scroll-mt-20 border-y border-ap-border bg-ap-bg py-16 text-ap-primary md:py-24"
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
            Inside the app
          </p>
          <h2 className="mb-3 font-outfit text-2xl font-bold text-ap-primary sm:text-3xl">
            Explore ALFRED before you sign in
          </h2>
          <p className="text-lg font-medium leading-relaxed text-ap-mid">
            Interactive preview: dashboard, Coach, Voice, results, drivers, and the screens behind More—same rhythm as
            the live product. The tour runs automatically; pause anytime or use the dots to jump.
          </p>
        </div>
        <AlfredFeatureExplorer />
      </div>
    </section>
  );
}
