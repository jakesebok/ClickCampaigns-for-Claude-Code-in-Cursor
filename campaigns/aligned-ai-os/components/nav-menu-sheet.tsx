"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  ClipboardCheck,
  FileText,
  Activity,
  Settings,
  BarChart3,
  X,
  BookOpen,
  Brain,
  ListChecks,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const staticMenuItems = [
  { href: "/scorecard", label: "6Cs Scorecard", icon: ClipboardCheck },
  { href: "/my-plan", label: "My Plan", icon: ListChecks },
  { href: "/priorities", label: "Priorities", icon: BarChart3 },
  { href: "/blueprint", label: "Blueprint", icon: FileText },
];

const exploreMenuItems = [
  { href: "/archetypes", label: "Archetype Library", icon: BookOpen },
  { href: "/drivers", label: "Driver Library", icon: Brain },
];

export function NavMenuSheet() {
  const [open, setOpen] = useState(false);
  const [hasAssessmentResults, setHasAssessmentResults] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/vapi")
      .then((r) => r.json())
      .then((data) => setHasAssessmentResults((data.results?.length ?? 0) > 0))
      .catch(() => setHasAssessmentResults(false));
  }, []);

  const assessmentItem = {
    href: hasAssessmentResults ? "/assessment/results" : "/assessment",
    label: hasAssessmentResults ? "Assessment Results" : "Take Assessment",
    icon: Activity,
  };

  const menuItems = [
    staticMenuItems[0],
    assessmentItem,
    ...staticMenuItems.slice(1),
  ];

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
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Explore
                </p>
              </div>
              {exploreMenuItems.map((item) => (
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
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-3 mt-4 pt-4 border-t border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-xl"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/settings";
                }}
              >
                <span>Settings</span>
                <Settings className="h-4 w-4 text-accent" />
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
