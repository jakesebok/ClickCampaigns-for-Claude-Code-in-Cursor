"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Personalized AI coaching chat (powered by Claude)",
  "Values-aligned decision filter",
  "The Revenue Bridge built in",
  "50 High-Leverage Questions",
  "Weekly Vital Action tracking",
  "6Cs Scorecard (Clarity, Coherence, Capacity, Confidence, Courage, Connection)",
  "Daily SMS morning prompts",
  "Alignment Blueprint dashboard",
  "Alignment Blueprint updates (monthly)",
  "Works on desktop, phone, and tablet (PWA)",
];

const plans = [
  {
    name: "Monthly",
    price: "$39",
    period: "/month",
    description: "Full access. Cancel anytime.",
    planId: "monthly",
    highlight: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/year",
    description: "Save 25%. Less than $1/day.",
    planId: "annual",
    highlight: true,
    badge: "Best value",
  },
];

type SubscribeState = "loading" | "trial" | "expired" | "active";

export default function SubscribePage() {
  const router = useRouter();
  const [state, setState] = useState<SubscribeState>("loading");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          setState("expired");
          return;
        }
        const status = data.subscriptionStatus as string | undefined;
        const trialEndsAt = data.trialEndsAt
          ? new Date(data.trialEndsAt)
          : null;
        const now = Date.now();

        if (status === "active") {
          setState("active");
          router.replace("/dashboard");
          return;
        }

        if (trialEndsAt && trialEndsAt.getTime() > now) {
          setState("trial");
          const msLeft = trialEndsAt.getTime() - now;
          setDaysLeft(Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
        } else {
          setState("expired");
        }
      })
      .catch(() => setState("expired"));
  }, [router]);

  const ctaLabel =
    state === "trial"
      ? "Add payment method"
      : state === "expired"
        ? "Subscribe now"
        : "Choose plan";

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (state === "active") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/">
          <Image
            src="/logo-apos.png"
            alt="Aligned Freedom Coach"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to app
          </Link>
        </div>
      </nav>

      <div className="px-6 py-16 max-w-4xl mx-auto">
        {/* State-specific header */}
        <div className="text-center mb-12">
          {state === "trial" && (
            <>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                Add your payment method
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Your free trial ends in{" "}
                <strong className="text-foreground">
                  {daysLeft} day{daysLeft === 1 ? "" : "s"}
                </strong>
                . Add your payment method now to continue without interruption.
                You won&apos;t be charged until your trial ends.
              </p>
            </>
          )}
          {state === "expired" && (
            <>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                Your trial has ended
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Subscribe now to keep using ALFRED and your Alignment Blueprint.
                Less than the cost of one coaching session per month.
              </p>
            </>
          )}
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl px-8 py-8 space-y-6 ${
                plan.highlight
                  ? "border-2 border-accent relative"
                  : "border border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 px-3 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                  {plan.badge}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-serif font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={`/api/checkout?plan=${plan.planId}&from=subscribe`}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-center text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Cancel anytime. No long-term commitment.
        </p>
      </div>
    </div>
  );
}
