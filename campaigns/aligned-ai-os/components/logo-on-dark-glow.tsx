import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LogoOnDarkSize = "sm" | "md" | "lg";

const sizeClass: Record<LogoOnDarkSize, string> = {
  sm: "logo-on-dark--sm",
  md: "logo-on-dark--md",
  lg: "logo-on-dark--lg",
};

/** Full-color ALFRED logo on dark app shell — halo + drop-shadow (see app/globals.css). */
export function LogoOnDarkGlow({
  children,
  className,
  size = "sm",
}: {
  children: ReactNode;
  className?: string;
  size?: LogoOnDarkSize;
}) {
  return (
    <span className={cn("logo-on-dark-wrap", sizeClass[size], className)}>
      <span className="logo-on-dark-glow-outer" aria-hidden />
      <span className="logo-on-dark-glow-inner" aria-hidden />
      {children}
    </span>
  );
}
