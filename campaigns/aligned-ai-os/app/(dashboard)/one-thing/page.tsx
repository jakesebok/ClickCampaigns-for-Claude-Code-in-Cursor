"use client";

import { useState, useEffect } from "react";
import { Target, Check, ChevronRight, Calendar } from "lucide-react";

type WeeklyOneThing = {
  id: string;
  oneThing: string;
  lane: string;
  midWeekCheckIn: string | null;
  endOfWeekReflection: string | null;
  completed: boolean;
  weekStart: string;
};

export default function OneThingPage() {
  const [currentWeek, setCurrentWeek] = useState<WeeklyOneThing | null>(null);
  const [history, setHistory] = useState<WeeklyOneThing[]>([]);
  const [newOneThing, setNewOneThing] = useState("");
  const [newLane, setNewLane] = useState("Business / Money");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/one-thing")
      .then((r) => r.json())
      .then((data) => {
        setCurrentWeek(data.current);
        setHistory(data.history || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSetOneThing() {
    if (!newOneThing.trim()) return;

    const res = await fetch("/api/one-thing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oneThing: newOneThing, lane: newLane }),
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentWeek(data);
      setNewOneThing("");
    }
  }

  const lanes = [
    "Business / Money",
    "Home / Relationships",
    "Impact / Cause Worth Playing For",
    "Self / Skills",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">Your Vital Action</h1>
        <p className="text-sm text-muted-foreground">
          The single move that makes everything else easier or unnecessary
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Current Week */}
          {currentWeek ? (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">This Week</h2>
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentWeek.lane}
                </span>
              </div>

              <p className="text-lg font-serif">{currentWeek.oneThing}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2">
                    Mid-Week Check-In
                  </h3>
                  {currentWeek.midWeekCheckIn ? (
                    <p className="text-sm">{currentWeek.midWeekCheckIn}</p>
                  ) : (
                    <button className="text-sm text-primary hover:underline">
                      Add check-in
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-border p-4">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2">
                    End of Week Reflection
                  </h3>
                  {currentWeek.endOfWeekReflection ? (
                    <p className="text-sm">{currentWeek.endOfWeekReflection}</p>
                  ) : (
                    <button className="text-sm text-primary hover:underline">
                      Add reflection
                    </button>
                  )}
                </div>
              </div>

              {!currentWeek.completed && (
                <button
                  onClick={async () => {
                    await fetch(`/api/one-thing/${currentWeek.id}/complete`, {
                      method: "POST",
                    });
                    setCurrentWeek({ ...currentWeek, completed: true });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 text-sm transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Mark Complete
                </button>
              )}

              {currentWeek.completed && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <Check className="h-4 w-4" />
                  Completed
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Set Your Vital Action</h2>
              </div>

              <p className="text-sm text-muted-foreground">
                What&apos;s your Vital Action this week—the single aligned move that, by doing it,
                makes everything else easier or unnecessary?
              </p>

              <div className="space-y-3">
                <select
                  value={newLane}
                  onChange={(e) => setNewLane(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {lanes.map((lane) => (
                    <option key={lane} value={lane}>
                      {lane}
                    </option>
                  ))}
                </select>

                <textarea
                  value={newOneThing}
                  onChange={(e) => setNewOneThing(e.target.value)}
                  placeholder="My Vital Action this week is..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <button
                  onClick={handleSetOneThing}
                  disabled={!newOneThing.trim()}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  Set My Vital Action
                </button>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Previous Weeks
              </h2>
              {history.map((week) => (
                <div
                  key={week.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-4"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${week.completed ? "bg-green-500" : "bg-muted-foreground"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{week.oneThing}</p>
                    <p className="text-xs text-muted-foreground">{week.lane}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(week.weekStart).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
