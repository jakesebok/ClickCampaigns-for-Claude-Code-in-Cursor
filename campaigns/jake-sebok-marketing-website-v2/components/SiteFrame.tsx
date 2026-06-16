"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the global site chrome (header + footer) on every route EXCEPT the
 * standalone, full-screen routes in BARE_ROUTES. /card is the digital business
 * card: it owns the whole viewport and brings its own layout, so it opts out of
 * the header/footer. Header and Footer are passed in as elements so they stay
 * server components (only this thin gate is client-side, for usePathname).
 */
const BARE_ROUTES = new Set(["/card"]);

export function SiteFrame({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (BARE_ROUTES.has(pathname)) return <>{children}</>;
  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
