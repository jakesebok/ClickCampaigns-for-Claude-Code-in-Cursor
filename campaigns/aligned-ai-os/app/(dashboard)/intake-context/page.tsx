"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const REVENUE_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "Pre-revenue", label: "Pre-revenue" },
  { value: "Under $100K", label: "Under $100K" },
  { value: "$100K - $500K", label: "$100K - $500K" },
  { value: "$500K - $1M", label: "$500K - $1M" },
  { value: "$1M - $5M", label: "$1M - $5M" },
  { value: "$5M+", label: "$5M+" },
];

const TEAM_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "Just me", label: "Just me" },
  { value: "2-3", label: "2-3" },
  { value: "4-10", label: "4-10" },
  { value: "11-25", label: "11-25" },
  { value: "25+", label: "25+" },
];

const LIFE_STAGE_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "Single, no children", label: "Single, no children" },
  { value: "Partnered, no children", label: "Partnered, no children" },
  { value: "Young children at home (under 12)", label: "Young children at home (under 12)" },
  { value: "Older children at home (12+)", label: "Older children at home (12+)" },
  { value: "Empty nest / children are adults", label: "Empty nest / children are adults" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const TIME_IN_BUSINESS_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "Less than 1 year", label: "Less than 1 year" },
  { value: "1-3 years", label: "1-3 years" },
  { value: "3-7 years", label: "3-7 years" },
  { value: "7+ years", label: "7+ years" },
];

const CHALLENGE_OPTIONS = [
  { value: "", label: "Select one..." },
  { value: "Growth (not enough revenue or clients)", label: "Growth (not enough revenue or clients)" },
  { value: "Profitability (revenue exists but margins are thin)", label: "Profitability (revenue exists but margins are thin)" },
  { value: "Time freedom (business demands too much of me)", label: "Time freedom (business demands too much of me)" },
  { value: "Clarity (not sure where to focus)", label: "Clarity (not sure where to focus)" },
  { value: "Burnout (running on empty)", label: "Burnout (running on empty)" },
  { value: "Transition (changing my model, offer, or direction)", label: "Transition (changing my model, offer, or direction)" },
];

type ContextualProfile = {
  revenueStage?: string;
  teamSize?: string;
  lifeStage?: string;
  timeInBusiness?: string;
  primaryChallenge?: string;
};

export default function IntakeContextPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContextualProfile>({
    revenueStage: "",
    teamSize: "",
    lifeStage: "",
    timeInBusiness: "",
    primaryChallenge: "",
  });

  const handleChange = (field: keyof ContextualProfile) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextualProfile: {
            revenueStage: form.revenueStage || undefined,
            teamSize: form.teamSize || undefined,
            lifeStage: form.lifeStage || undefined,
            timeInBusiness: form.timeInBusiness || undefined,
            primaryChallenge: form.primaryChallenge || undefined,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">About You</h1>
          <p className="text-sm text-muted-foreground">
            A few quick questions so we can personalize your experience. Changes apply to future assessments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="revenue-stage" className="block text-sm font-medium text-foreground mb-1">
              What is your current annual business revenue?
            </label>
            <select
              id="revenue-stage"
              value={form.revenueStage}
              onChange={handleChange("revenueStage")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {REVENUE_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="team-size" className="block text-sm font-medium text-foreground mb-1">
              How many people work in your business (including you)?
            </label>
            <select
              id="team-size"
              value={form.teamSize}
              onChange={handleChange("teamSize")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {TEAM_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="life-stage" className="block text-sm font-medium text-foreground mb-1">
              Which best describes your current life stage?
            </label>
            <select
              id="life-stage"
              value={form.lifeStage}
              onChange={handleChange("lifeStage")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {LIFE_STAGE_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="time-in-business" className="block text-sm font-medium text-foreground mb-1">
              How long have you been running your current business?
            </label>
            <select
              id="time-in-business"
              value={form.timeInBusiness}
              onChange={handleChange("timeInBusiness")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {TIME_IN_BUSINESS_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="primary-challenge" className="block text-sm font-medium text-foreground mb-1">
              What is the single biggest challenge you&apos;re facing right now?
            </label>
            <select
              id="primary-challenge"
              value={form.primaryChallenge}
              onChange={handleChange("primaryChallenge")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {CHALLENGE_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
