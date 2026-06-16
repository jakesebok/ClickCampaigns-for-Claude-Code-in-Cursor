"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the global site chrome (header, footer, floating CTA) on every route
 * EXCEPT the standalone, full-screen routes in BARE_ROUTES. /card is the
 * digital business card: it owns the whole viewport and brings its own layout,
 * so it opts out of all chrome. The pieces are passed in as elements so they
 * stay server/client components as authored; only this thin gate is client-side
 * (for usePathname). The LocalCraft tracking pixel + scroll helpers stay in the
 * layout OUTSIDE this gate, so they keep firing on /card too.
 */
const BARE_ROUTES = new Set(["/card"]);

export function SiteFrame({
  header,
  footer,
  chrome,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  chrome?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (BARE_ROUTES.has(pathname)) return <>{children}</>;
  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
      {chrome}
    </>
  );
}
