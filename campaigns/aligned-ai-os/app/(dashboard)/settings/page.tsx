"use client";

import { useState, useEffect } from "react";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Bell, CreditCard, Upload, ExternalLink, RefreshCw, Loader2, Check, BarChart3, Sun, Moon } from "lucide-react";
import {
  isPushSupported,
  getPermissionStatus,
  requestPermission,
  subscribe,
  unsubscribe,
  subscriptionToJson,
} from "@/lib/push-client";

type ContextualProfile = {
  revenueStage?: string;
  teamSize?: string;
  lifeStage?: string;
  timeInBusiness?: string;
  primaryChallenge?: string;
};

type UserSettings = {
  name: string;
  email: string;
  phone: string;
  smsEnabled: boolean;
  smsTime: string;
  timezone: string;
  tier: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  onboardingComplete: boolean;
  contextualProfile: ContextualProfile | null;
  isAdmin?: boolean;
};

const REVENUE_OPTIONS = ["", "Pre-revenue", "Under $100K", "$100K - $500K", "$500K - $1M", "$1M - $5M", "$5M+"];
const TEAM_OPTIONS = ["", "Just me", "2-3", "4-10", "11-25", "25+"];
const LIFE_STAGE_OPTIONS = ["", "Single, no children", "Partnered, no children", "Young children at home (under 12)", "Older children at home (12+)", "Empty nest / children are adults", "Prefer not to say"];
const TIME_OPTIONS = ["", "Less than 1 year", "1-3 years", "3-7 years", "7+ years"];
const CHALLENGE_OPTIONS = ["", "Growth (not enough revenue or clients)", "Profitability (revenue exists but margins are thin)", "Time freedom (business demands too much of me)", "Clarity (not sure where to focus)", "Burnout (running on empty)", "Transition (changing my model, offer, or direction)"];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  function setThemeValue(t: "light" | "dark") {
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("ap-theme", t);
      const host = window.location.hostname;
      if (/alignedpower\.coach$/.test(host)) {
        document.cookie = `ap-theme=${t}; path=/; max-age=31536000; domain=.alignedpower.coach`;
      } else if (/vap\.coach$/.test(host)) {
        document.cookie = `ap-theme=${t}; path=/; max-age=31536000; domain=.vap.coach`;
      }
    } catch {}
    setTheme(t);
  }
  return [theme, setThemeValue] as const;
}

export default function SettingsPage() {
  const [theme, setThemeValue] = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [patchNotes, setPatchNotes] = useState("");
  const [patching, setPatching] = useState(false);
  const [patchSuccess, setPatchSuccess] = useState(false);
  const [patchError, setPatchError] = useState<string | null>(null);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{
    period: string;
    requestCount: number;
    inputTokens: number;
    outputTokens: number;
    cacheReadInputTokens: number;
    cacheHitRate: string | null;
    estimatedSavingsNote: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/usage?days=30")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
  }, []);

  useEffect(() => {
    isPushSupported().then(setPushSupported);
  }, []);

  useEffect(() => {
    if (!pushSupported) return;
    fetch("/api/push/status")
      .then((r) => r.json())
      .then((d) => setPushEnabled(!!d.subscribed))
      .catch(() => setPushEnabled(false));
  }, [pushSupported]);

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return null;
    const reg = await navigator.serviceWorker.register("/sw.js");
    const regWithReady = reg as unknown as { ready: Promise<ServiceWorkerRegistration> };
    if (regWithReady.ready) await regWithReady.ready;
    return reg;
  }

  async function handlePushToggle(enabled: boolean) {
    if (!pushSupported) return;
    setPushLoading(true);
    setPushError(null);
    try {
      if (enabled) {
        await registerServiceWorker();
        const perm = await requestPermission();
        if (perm !== "granted") {
          setPushError("Notification permission denied.");
          setPushLoading(false);
          return;
        }
        const sub = await subscribe();
        if (!sub) {
          setPushError("Could not subscribe. Check VAPID keys.");
          setPushLoading(false);
          return;
        }
        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionToJson(sub)),
        });
        if (!res.ok) throw new Error("Subscribe failed");
        setPushEnabled(true);
      } else {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        await unsubscribe();
        setPushEnabled(false);
      }
    } catch (e) {
      setPushError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPushLoading(false);
    }
  }

  async function updateSettings(updates: Partial<UserSettings>) {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      setSettings((prev) => (prev ? { ...prev, ...updates } : null));
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Appearance */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              Appearance
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose light or dark mode. Matches the portal dashboard style.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setThemeValue("light")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-colors ${
                  theme === "light" ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="font-medium">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeValue("dark")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-colors ${
                  theme === "dark" ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </section>

          {/* 6Cs Push Notifications */}
          {pushSupported && (
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" />
                6Cs Scorecard Reminders
              </h2>
              <p className="text-sm text-muted-foreground">
                Get a push notification when your weekly 6Cs scorecard is available (Friday–Sunday 12:05pm Eastern).
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Push notifications</span>
                <button
                  onClick={() => handlePushToggle(!pushEnabled)}
                  disabled={pushLoading}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${pushEnabled ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${pushEnabled ? "translate-x-5 left-0.5" : "left-0.5"}`}
                  />
                </button>
              </div>
              {pushLoading && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {pushEnabled ? "Subscribing..." : "Unsubscribing..."}
                </p>
              )}
              {pushError && (
                <p className="text-sm text-destructive">{pushError}</p>
              )}
            </section>
          )}

          {/* Account */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              Account
            </h2>
            <div className="flex items-center gap-4">
              <UserButton />
              <div>
                <p className="font-medium">{settings.name || settings.email}</p>
                <p className="text-sm text-muted-foreground">{settings.email}</p>
              </div>
            </div>
            <div className="pt-3">
              <SignOutButton>
                <button className="text-xs text-muted-foreground hover:text-destructive transition-colors underline">
                  Log out
                </button>
              </SignOutButton>
            </div>
          </section>

          {/* Morning coach notifications */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Morning coach notifications
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Morning nudge from your coach</p>
                <p className="text-xs text-muted-foreground">
                  Short, values-aligned prompts that engage you before the day runs away—in-app or via your configured
                  channels.
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({ smsEnabled: !settings.smsEnabled })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.smsEnabled ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${settings.smsEnabled ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
                />
              </button>
            </div>

            {settings.smsEnabled && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Preferred time
                    </label>
                    <input
                      type="time"
                      value={settings.smsTime}
                      onChange={(e) =>
                        updateSettings({ smsTime: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) =>
                        updateSettings({ timezone: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="America/New_York">Eastern</option>
                      <option value="America/Chicago">Central</option>
                      <option value="America/Denver">Mountain</option>
                      <option value="America/Los_Angeles">Pacific</option>
                      <option value="America/Anchorage">Alaska</option>
                      <option value="Pacific/Honolulu">Hawaii</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Subscription */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm capitalize">
                  {settings.subscriptionStatus.replace("_", " ")}
                </p>
                {settings.trialEndsAt && (
                  <p className="text-xs text-muted-foreground">
                    Trial ends{" "}
                    {new Date(settings.trialEndsAt).toLocaleDateString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground capitalize">
                  Tier: {settings.tier.replace("_", " ")}
                </p>
              </div>
              <a
                href="/api/billing/portal"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Manage billing
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </section>

          {/* About You */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold">About You</h2>
            <p className="text-sm text-muted-foreground">
              Updating these helps keep your assessment results personalized.
            </p>
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Annual business revenue</label>
                <select
                  value={settings.contextualProfile?.revenueStage ?? ""}
                  onChange={(e) =>
                    updateSettings({
                      contextualProfile: {
                        ...(settings.contextualProfile ?? {}),
                        revenueStage: e.target.value || undefined,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {REVENUE_OPTIONS.map((v) => (
                    <option key={v || "empty"} value={v}>{v || "Select..."}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Team size</label>
                <select
                  value={settings.contextualProfile?.teamSize ?? ""}
                  onChange={(e) =>
                    updateSettings({
                      contextualProfile: {
                        ...(settings.contextualProfile ?? {}),
                        teamSize: e.target.value || undefined,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {TEAM_OPTIONS.map((v) => (
                    <option key={v || "empty"} value={v}>{v || "Select..."}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Life stage</label>
                <select
                  value={settings.contextualProfile?.lifeStage ?? ""}
                  onChange={(e) =>
                    updateSettings({
                      contextualProfile: {
                        ...(settings.contextualProfile ?? {}),
                        lifeStage: e.target.value || undefined,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {LIFE_STAGE_OPTIONS.map((v) => (
                    <option key={v || "empty"} value={v}>{v || "Select..."}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Time in business</label>
                <select
                  value={settings.contextualProfile?.timeInBusiness ?? ""}
                  onChange={(e) =>
                    updateSettings({
                      contextualProfile: {
                        ...(settings.contextualProfile ?? {}),
                        timeInBusiness: e.target.value || undefined,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {TIME_OPTIONS.map((v) => (
                    <option key={v || "empty"} value={v}>{v || "Select..."}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Primary challenge</label>
                <select
                  value={settings.contextualProfile?.primaryChallenge ?? ""}
                  onChange={(e) =>
                    updateSettings({
                      contextualProfile: {
                        ...(settings.contextualProfile ?? {}),
                        primaryChallenge: e.target.value || undefined,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {CHALLENGE_OPTIONS.map((v) => (
                    <option key={v || "empty"} value={v}>{v || "Select..."}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Context / Onboarding */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Alignment Blueprints
            </h2>
            <p className="text-sm text-muted-foreground">
              {settings.onboardingComplete
                ? "Your Alignment Blueprints are loaded. Update them when something changes, or upload a new version to replace them entirely."
                : "Complete onboarding to build your Alignment Blueprints."}
            </p>
            <a
              href="/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
            >
              {settings.onboardingComplete
                ? "Replace Blueprints (Upload New)"
                : "Complete Onboarding"}
            </a>

            {settings.onboardingComplete && (
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4" />
                  Update Blueprints
                </h3>
                <p className="text-xs text-muted-foreground">
                  Something changed? Describe it in plain language. Your coach will update the right fields.
                </p>
                <textarea
                  value={patchNotes}
                  onChange={(e) => {
                    setPatchNotes(e.target.value);
                    setPatchSuccess(false);
                    setPatchError(null);
                  }}
                  placeholder="e.g., My Vital Action is now [X]. Target revenue is $Y. I refined my Driving Fire to..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={async () => {
                    if (!patchNotes.trim() || patching) return;
                    setPatching(true);
                    setPatchError(null);
                    setPatchSuccess(false);
                    try {
                      const res = await fetch("/api/context/patch", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ updateNotes: patchNotes.trim() }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Patch failed");
                      setPatchSuccess(true);
                      setPatchNotes("");
                    } catch (err) {
                      setPatchError(err instanceof Error ? err.message : "Something went wrong");
                    } finally {
                      setPatching(false);
                    }
                  }}
                  disabled={!patchNotes.trim() || patching}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {patching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Update Blueprints
                    </>
                  )}
                </button>
                {patchSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Blueprints updated. Your coach has the latest.
                  </p>
                )}
                {patchError && (
                  <p className="text-sm text-destructive">{patchError}</p>
                )}
              </div>
            )}
          </section>

          {/* API Usage (admin only) */}
          {settings.isAdmin && usage && (
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Chat Usage & Cache Savings
              </h2>
              <p className="text-sm text-muted-foreground">
                {usage.period}. Prompt caching reduces cost when your coach reuses context across turns.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Chat requests</p>
                  <p className="font-semibold">{usage.requestCount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Input tokens</p>
                  <p className="font-semibold">{usage.inputTokens.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Output tokens</p>
                  <p className="font-semibold">{usage.outputTokens.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Cache hit rate</p>
                  <p className="font-semibold">{usage.cacheHitRate ?? "—"}</p>
                </div>
              </div>
              {usage.estimatedSavingsNote && (
                <p className="text-xs text-muted-foreground">{usage.estimatedSavingsNote}</p>
              )}
            </section>
          )}

          {/* Community */}
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold">Community</h2>
            <a
              href="https://circle.so"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Open Aligned Power Community on Circle
              <ExternalLink className="h-3 w-3" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
