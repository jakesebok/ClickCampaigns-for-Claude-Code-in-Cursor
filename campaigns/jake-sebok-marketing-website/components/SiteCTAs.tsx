"use client";

/**
 * SiteCTAs — Wave 1 conversion architecture.
 *
 *   - .sticky-cta : bottom-pinned bar on mobile only (≤ md). Two pills: VAPI™ (primary)
 *     + Apply (secondary). Auto-hides on intake / form / thank-you / who-is-alfred pages
 *     where a primary CTA is already dominant on-screen, so the bar never competes
 *     with the page's own button. Respects iOS safe-area inset.
 *
 *   - .floating-cta : bottom-right pill on desktop (≥ md). One ask: Take the VAPI™.
 *     Fades in after the user has scrolled past the hero (~600px), and stays hidden
 *     on the same intake/form/thank-you routes for the same reason as above.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SUPPRESS_PREFIXES = [
  "/work-with-me/apply",
  "/build-your-assessment",
  "/contact",
  "/who-is-alfred",
  "/assessment",
];

function shouldSuppress(pathname: string | null): boolean {
  if (!pathname) return false;
  return SUPPRESS_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function SiteCTAs() {
  const pathname = usePathname();
  const [floatingVisible, setFloatingVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      setFloatingVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const hidden = shouldSuppress(pathname);

  return (
    <>
      <div
        className="sticky-cta"
        role="region"
        aria-label="Quick actions"
        data-hidden={hidden ? "true" : "false"}
      >
        <Link
          href="/assessment"
          className="sticky-cta__primary"
          aria-label="Take the free VAPI assessment"
        >
          Take the VAPI&trade;
        </Link>
        <Link
          href="/work-with-me/apply"
          className="sticky-cta__secondary"
          aria-label="Apply for the Aligned Power Program"
        >
          Apply
        </Link>
      </div>

      <Link
        href="/assessment"
        className="floating-cta"
        aria-label="Take the free VAPI assessment"
        data-visible={floatingVisible && !hidden ? "true" : "false"}
        data-hidden={hidden ? "true" : "false"}
      >
        Take the VAPI&trade;
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </>
  );
}
