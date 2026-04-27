import type { ReactNode } from "react";

type LogoOnDarkSize = "sm" | "md" | "lg";

const sizeClass: Record<LogoOnDarkSize, string> = {
  sm: "logo-on-dark--sm",
  md: "logo-on-dark--md",
  lg: "logo-on-dark--lg",
};

/**
 * Soft dual-layer orange halo + drop-shadow for full-color logos on dark UI
 * (Jake Sebok, VAPI, ALFRED). Styles live in app/globals.css.
 */
export function LogoOnDarkGlow({
  children,
  className = "",
  size = "sm",
}: {
  children: ReactNode;
  className?: string;
  size?: LogoOnDarkSize;
}) {
  return (
    <span className={`logo-on-dark-wrap ${sizeClass[size]} ${className}`.trim()}>
      <span className="logo-on-dark-glow-outer" aria-hidden />
      <span className="logo-on-dark-glow-inner" aria-hidden />
      {children}
    </span>
  );
}
