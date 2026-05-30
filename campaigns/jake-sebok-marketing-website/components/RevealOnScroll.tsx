"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * RevealOnScroll
 *
 * Mounts an IntersectionObserver that watches every element on the
 * current page with a `data-reveal` attribute. When the element enters
 * the viewport (with a small bottom margin so the reveal fires *before*
 * the section reaches the fold), it gets `data-reveal-shown="true"`,
 * which CSS uses to translate + fade it into rest.
 *
 * MOUNT LOCATION: this lives in the root `app/layout.tsx`, which
 * persists across Next.js App Router client-side navigations. That
 * means a single observer set up at first paint would never see any
 * `data-reveal` elements added by a later route change — so those
 * elements stay frozen at their pre-reveal state (opacity:0 + translate).
 * Symptom: client-side nav to /about or /work-with-me showed text
 * outside reveal wrappers but kept all imagery + reveal-wrapped sections
 * invisible; a hard reload "fixed" it because the observer re-ran on
 * fresh mount.
 *
 * Fix: depend on `usePathname()` so the effect tears down and rebuilds
 * a fresh observer on every route change. Observers are cheap; this
 * is well within the budget.
 *
 * Honors `prefers-reduced-motion: reduce` (CSS also shows elements
 * opaque in that case, but the early return keeps us from thrashing).
 *
 * This component is also a hook-style insertion point — drop
 * `<RevealOnScroll />` inside a page that uses `data-reveal` attributes
 * on its sections, and the reveal wiring is taken care of.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      // Mark everything visible so authors don't have to special-case.
      const all = document.querySelectorAll<HTMLElement>("[data-reveal]");
      all.forEach((el) => el.setAttribute("data-reveal-shown", "true"));
      return;
    }

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute(
              "data-reveal-shown",
              "true",
            );
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.08,
      },
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  return null;
}
