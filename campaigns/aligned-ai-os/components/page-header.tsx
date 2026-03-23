"use client";

import { NotificationBell } from "@/components/notification-bell";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Larger title + subtitle for primary content pages (e.g. My Plan). */
  variant?: "compact" | "featured";
};

export function PageHeader({ title, subtitle, variant = "compact" }: PageHeaderProps) {
  const isFeatured = variant === "featured";
  return (
    <header
      className={`flex items-start justify-between gap-4 border-b border-border ${isFeatured ? "px-4 py-5 md:px-8 md:py-6" : "px-6 py-4"}`}
    >
      <div className="min-w-0 flex-1">
        <h1
          className={
            isFeatured
              ? "font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              : "text-lg font-semibold text-foreground"
          }
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={
              isFeatured
                ? "mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground"
                : "mt-0.5 text-sm text-muted-foreground"
            }
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="shrink-0 pt-0.5">
        <NotificationBell />
      </div>
    </header>
  );
}
