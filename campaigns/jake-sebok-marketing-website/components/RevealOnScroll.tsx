"use client";

import { useEffect } from "react";

/**
 * RevealOnScroll
 *
 * Mounts a single IntersectionObserver that watches every element on the
 * page with a `data-reveal` attribute. When the element enters the
 * viewport (with a small bottom margin so the reveal fires *before* the
 * section reaches the fold), it gets `data-reveal-shown="true"`, which
 * CSS uses to translate + fade it into rest.
 *
 * One observer per page is enough — observers are cheap and the
 * single-mount pattern keeps Lighthouse happy. Honors
 * `prefers-reduced-motion: reduce` (in that case the CSS already shows
 * elements opaque, but we also skip the observer so we never thrash).
 *
 * This component is also a hook-style insertion point — drop
 * `<RevealOnScroll />` inside a page that uses `data-reveal` attributes
 * on its sections, and the reveal wiring is taken care of.
 */
export function RevealOnScroll() {
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
  }, []);

  return null;
}
