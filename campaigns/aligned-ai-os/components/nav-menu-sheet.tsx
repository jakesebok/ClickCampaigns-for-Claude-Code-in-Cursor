"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Target,
  ClipboardCheck,
  FileText,
  Activity,
  Settings,
  BarChart3,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
  { href: "/scorecard", label: "6Cs Scorecard", icon: ClipboardCheck },
  { href: "/assessment", label: "Take Assessment", icon: Activity },
  { href: "/one-thing", label: "Vital Action", icon: Target },
  { href: "/priorities", label: "Priorities", icon: BarChart3 },
  { href: "/blueprint", label: "Blueprint", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavMenuSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open menu"
      >
        <MoreHorizontal className="h-5 w-5" />
        <span>More</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-2xl bg-card border-t border-border shadow-xl max-h-[70vh] overflow-y-auto safe-area-bottom animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">Menu</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent/10 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-accent" />
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3 mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
