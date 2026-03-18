"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getScorecardWindow, isDateInScorecardWindow } from "@/lib/scorecard-window";

export function NotificationBell() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const win = getScorecardWindow();
    if (!win.canSubmit) {
      setAvailable(false);
      return;
    }
    fetch("/api/scorecard")
      .then((r) => r.json())
      .then((data) => {
        const entries = [
          ...(data.currentWeek ? [data.currentWeek] : []),
          ...(data.entries || []),
        ];
        const submittedThisWindow = entries.some((entry: { createdAt: string }) =>
          isDateInScorecardWindow(entry.createdAt, {
            opensAt: win.opensAt,
            closesAt: win.closesAt,
          })
        );
        setAvailable(!submittedThisWindow);
      })
      .catch(() => setAvailable(false));
  }, []);

  return (
    <Link
      href="/scorecard"
      className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors shrink-0"
      aria-label={available ? "6Cs scorecard available to fill out" : "6Cs scorecard"}
    >
      <Bell className="h-5 w-5" />
      {available && (
        <span
          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"
          aria-hidden
        />
      )}
    </Link>
  );
}
