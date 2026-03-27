import Link from "next/link";
import Image from "next/image";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Check } from "lucide-react";

const featureList = [
  "Coaching chat that remembers what matters to you",
  "Decision support grounded in your priorities and limits",
  "Goals, numbers, and weekly sales targets kept in the room",
  "Guided prompts for planning, reflection, and hard decisions",
  "A weekly priority you can actually defend",
  "Weekly check-ins that catch drift early",
  "Morning nudges when you want them",
  "A living dashboard for what matters this season",
  "Updates as your priorities and constraints change",
  "Desktop, phone, and tablet access",
];

const plans = [
  {
    name: "Monthly",
    price: "$39",
    period: "/month",
    description: "Full product. Cancel anytime.",
    cta: "Start My 7-Day Trial",
    href: "/api/checkout?plan=monthly",
    highlight: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/year",
    description: "Save 25% if ALFRED is becoming part of your weekly rhythm.",
    cta: "Start My 7-Day Trial",
    href: "/api/checkout?plan=annual",
    highlight: true,
    badge: "Best value",
  },
];

const tiers = [
  {
    tier: "Strategic Alignment Intensive",
    trial: "30 days of ALFRED",
    context: "Build your priorities, numbers, and constraints live, then keep coaching from what you created in the room.",
    note: "Quarterly Intensive attendees get 30 days of access included with their workshop enrollment.",
  },
  {
    tier: "Aligned Power Accelerator",
    trial: "12 months of ALFRED",
    context: "Long-term coaching clients get extended access because ALFRED becomes part of the operating system.",
    note: "Included with Accelerator enrollment.",
  },
];

const pricingPills = ["7-day trial", "No upsell maze", "Full product access"];

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
              alt="Aligned Freedom Coach"
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
            You are not paying for a funnel of add-ons. You are paying for a trusted advisor in your pocket who helps
            you protect your priorities and make the next right move when the week gets loud.
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

              <ul className="mt-6 space-y-3">
                {featureList.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="leading-relaxed text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

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

        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/72 p-8 sm:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Extended Access
            </p>
            <h2 className="mb-3 font-serif text-2xl font-bold sm:text-3xl">
              Longer access if you come through Jake&apos;s programs.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              If you build your foundation with Jake live, ALFRED gets more context faster. That is why the trial window
              is longer for Intensive attendees and Accelerator clients.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <article key={tier.tier} className="rounded-[22px] border border-border bg-background/90 p-5">
                <h3 className="font-semibold text-foreground">{tier.tier}</h3>
                <p className="mt-2 text-sm font-semibold text-accent">{tier.trial}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tier.context}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{tier.note}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
