"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

const whatStaysLive = [
  "Your coaching history and recent conversations",
  "Your priorities, plans, and weekly rhythm",
  "Your dashboard, planning tools, and check-ins",
  "The same full product on desktop, phone, and tablet",
];

const plans = [
  {
    name: "Monthly",
    price: "$39",
    period: "/month",
    description: "Best if you want flexibility.",
    bestFor: "Keep ALFRED live without a longer commitment.",
    planId: "monthly",
    highlight: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/year",
    description: "Best if ALFRED is already part of your week.",
    bestFor: "Save 25% and keep the same full product live all year.",
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
        const trialEndsAt = data.trialEndsAt ? new Date(data.trialEndsAt) : null;
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (state === "active") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <LogoOnDarkGlow size="lg">
            <Image
              src="/logo-apos.png"
              alt="ALFRED"
              width={280}
              height={77}
              className="logo-on-dark-img h-12 w-auto sm:h-14"
              priority
            />
          </LogoOnDarkGlow>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to app
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {state === "trial" ? (
            <>
              <h1 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Keep your coaching live.
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Your free trial ends in{" "}
                <strong className="text-foreground">
                  {daysLeft} day{daysLeft === 1 ? "" : "s"}
                </strong>
                . Add your payment method now so your priorities, history, and coaching stay uninterrupted. You will not
                be charged until the trial ends.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Nothing new to set up. You are simply choosing whether to keep the coaching live.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Pick up where you left off.
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Choose monthly or annual to keep ALFRED, your dashboard, and your coaching history live. Less than the
                cost of one coaching hour per month.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Nothing resets. You are picking the billing rhythm that fits.
              </p>
            </>
          )}
        </div>

        <div className="mx-auto mb-12 max-w-3xl rounded-[28px] border border-border bg-card/72 p-8 sm:p-10">
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            What Stays Live
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {whatStaysLive.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span className="leading-relaxed text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[24px] p-8 ${
                plan.highlight ? "border-2 border-accent bg-card shadow-[0_28px_60px_-38px_rgba(255,107,26,0.28)]" : "border border-border bg-card/88"
              }`}
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs text-accent-foreground">
                  {plan.badge}
                </div>
              ) : null}
              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="font-serif text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
                <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Best For
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.bestFor}</p>
                </div>
              </div>

              <a
                href={`/api/checkout?plan=${plan.planId}&from=subscribe`}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-medium transition-colors ${
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

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Both plans keep the same product live. The only difference is billing cadence.
        </p>
      </div>
    </div>
  );
}
