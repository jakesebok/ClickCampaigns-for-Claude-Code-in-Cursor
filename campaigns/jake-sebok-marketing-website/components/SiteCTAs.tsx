"use client";

/**
 * SiteCTAs — desktop-only floating conversion pill.
 *
 *   - .floating-cta : bottom-right pill on desktop (≥ md). One ask: Take the VAPI™.
 *     Fades in after the user has scrolled past the hero (~600px), and stays hidden
 *     on intake / form / thank-you / who-is-alfred routes where a primary CTA is
 *     already dominant on-screen, so the pill never competes with the page's own button.
 *
 *   Mobile sticky bar removed per operator request — felt nag-y on small screens and
 *   ate into the editorial layout. Mobile conversion now lives in the in-flow CTAs.
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
  );
}
