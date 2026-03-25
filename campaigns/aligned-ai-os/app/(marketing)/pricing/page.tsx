import Link from "next/link";
import Image from "next/image";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { FIRE_STARTER_COUNT } from "@/lib/ai/prompts";

const features = [
  "Personalized AI coaching chat (powered by Claude)",
  "Values-aligned decision filter",
  "The Revenue Bridge built in",
  `Fire Starters — ${FIRE_STARTER_COUNT} strategic prompts across 9 categories`,
  "Weekly Vital Action tracking",
  "6Cs Scorecard (Clarity, Coherence, Capacity, Confidence, Courage, Connection)",
  "Morning coach notifications",
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
    cta: "Start 7-Day Free Trial",
    href: "/api/checkout?plan=monthly",
    highlight: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/year",
    description: "Save 25%. Less than $1/day.",
    cta: "Start 7-Day Free Trial",
    href: "/api/checkout?plan=annual",
    highlight: true,
    badge: "Best value",
  },
];

const tiers = [
  {
    tier: "Strategic Alignment Intensive Attendees",
    trial: "30-day free Aligned Freedom Coach access",
    context: "Full Alignment Blueprints from live worksheets",
    note: "Attend the quarterly $497 Intensive and get 30 days of Aligned Freedom Coach free.",
  },
  {
    tier: "Aligned Power Coaching Clients",
    trial: "12 months free Aligned Freedom Coach access",
    context: "Full Alignment Blueprints from complete Strategic Clarity module",
    note: "Included with Aligned Power Accelerator enrollment.",
  },
];

export default async function PricingPage() {
  const { userId } = await auth();
  if (userId) redirect("/subscribe");

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/">
          <LogoOnDarkGlow size="md">
            <Image
              src="/logo-apos.png"
              alt="Aligned Freedom Coach"
              width={140}
              height={40}
              className="logo-on-dark-img h-8 w-auto"
            />
          </LogoOnDarkGlow>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold mb-4">
            Simple pricing. Real coaching.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Less than the cost of one coaching session per month. All features
            included. No upsells inside the app.
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 space-y-6 ${
                plan.highlight
                  ? "border-2 border-accent relative"
                  : "border border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
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
                href={plan.href}
                className={`block w-full py-3 rounded-xl text-center text-sm font-medium transition-colors ${
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

        {/* Extended Trials */}
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-serif font-bold text-center">
            Extended access for Intensive & coaching
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tiers.map((t) => (
              <div
                key={t.tier}
                className="rounded-xl border border-border p-5 space-y-2"
              >
                <h3 className="font-medium">{t.tier}</h3>
                <p className="text-sm text-accent font-medium">{t.trial}</p>
                <p className="text-xs text-muted-foreground">{t.context}</p>
                <p className="text-xs text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
