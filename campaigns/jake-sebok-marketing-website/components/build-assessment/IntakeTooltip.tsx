"use client";

import { HelpCircle } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

/**
 * Accessible hint: tap/click to reveal helper copy (mobile-friendly “tooltip”).
 * Icon stays on the first row; expanded copy appears below without shifting the button.
 */
export function IntakeTooltip({
  label,
  children,
  className = "",
  variant = "icon",
}: {
  /** Used for aria-label */
  label: string;
  children: ReactNode;
  className?: string;
  /** icon = help button only; inline = shows label text + button */
  variant?: "icon" | "inline";
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const button = (
    <button
      type="button"
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--ap-border)]/90 bg-white/90 text-[var(--ap-muted)] shadow-sm transition-colors hover:border-[var(--ap-accent)]/35 hover:text-[var(--ap-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-accent)]/35"
      aria-expanded={open}
      aria-controls={id}
      aria-label={`More detail: ${label}`}
      onClick={() => setOpen((o) => !o)}
    >
      <HelpCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
    </button>
  );

  return (
    <span className={`flex flex-col items-start gap-2 ${className}`}>
      {variant === "inline" ? (
        <span className="inline-flex items-center gap-1.5">
          <span>{label}</span>
          {button}
        </span>
      ) : (
        button
      )}
      {open && (
        <span
          id={id}
          role="tooltip"
          className="block w-full max-w-full rounded-2xl border border-[var(--ap-border)]/90 bg-[#FAFAFB] px-4 py-3 text-left text-[13px] leading-relaxed text-[var(--ap-secondary)] shadow-[0_4px_24px_-12px_rgba(14,22,36,0.15)]"
        >
          {children}
        </span>
      )}
    </span>
  );
}
