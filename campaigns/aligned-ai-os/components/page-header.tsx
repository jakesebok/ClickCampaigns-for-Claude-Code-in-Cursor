"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <Link
        href="/settings"
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors shrink-0"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </header>
  );
}
