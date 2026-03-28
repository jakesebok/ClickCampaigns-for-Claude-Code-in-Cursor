import Link from "next/link";
import Image from "next/image";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Check } from "lucide-react";

const commonIncludes = [
  "Coaching chat grounded in what matters to you",
  "Planning, reflection, and decision support",
  "A weekly priority and check-in rhythm",
  "Desktop, phone, and tablet access",
];

const plans = [
  {
    name: "Monthly",
    price: "$39",
    period: "/month",
    description: "Stay flexible while you feel the rhythm.",
    bestFor: "Best if you want the full product without a longer commitment.",
    cta: "Start Card-Free Trial",
    href: "/sign-up?plan=monthly",
    highlight: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/year",
    description: "Save 25% if ALFRED is becoming part of your weekly rhythm.",
    bestFor: "Best if you already want ALFRED close every week.",
    cta: "Start Card-Free Trial",
    href: "/sign-up?plan=annual",
    // Premium-path offer parked until the next Intensive window is ready.
    // href: "/premium-path",
    // cta: "See Annual Path",
    highlight: true,
    badge: "Best value",
  },
];

const pricingPills = ["Card-free 7-day trial", "Same full product in both plans", "Choose your billing cadence later"];

export default async function PricingPage() {
  const { userId } = await auth();
  if (userId) redirect("/subscribe");

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
          <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
            Sign In
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 flex flex-wrap justify-center gap-2.5">
            {pricingPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-border bg-card/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {pill}
              </span>
            ))}
          </div>
          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Simple pricing.
            <span className="block text-gradient-accent">One lane. Full product.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Start with a card-free 7-day trial. Get the full product from day one. If ALFRED helps you protect
            priorities and make cleaner decisions, choose monthly or annual when the trial ends.
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-3xl gap-6 sm:grid-cols-2">
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
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-3">
                <span className="font-serif text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Best For
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.bestFor}</p>
              </div>

              <a
                href={plan.href}
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mx-auto mb-16 max-w-3xl rounded-[28px] border border-border bg-card/72 p-8 sm:p-10">
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Both Plans Include
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {commonIncludes.map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span className="leading-relaxed text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            The product is the same in both plans. The only difference is whether you want to pay month to month or
            keep ALFRED close for the full year at a lower effective rate.
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/72 p-8 sm:p-10">
          {/* Premium-path upsell parked until the next Intensive window is ready. */}
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Already In Jake&apos;s World?
          </p>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Some Jake programs include longer ALFRED access. That is additive, not required. ALFRED is built to stand
            on his own as a self-serve subscription.
          </p>
        </div>
      </div>
    </div>
  );
}
