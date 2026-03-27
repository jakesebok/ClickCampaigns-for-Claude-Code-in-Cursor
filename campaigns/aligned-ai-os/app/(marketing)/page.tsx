import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  Compass,
  Crosshair,
  MessageSquare,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const AlfredLandingDemoSection = dynamic(
  () =>
    import("@/components/alfred-landing-demo-section").then((m) => ({
      default: m.AlfredLandingDemoSection,
    })),
  {
    loading: () => (
      <div className="dark border-y border-accent/25 bg-[hsl(222_36%_7%)] py-24 text-center text-sm text-muted-foreground">
        Loading interactive preview...
      </div>
    ),
  }
);

const heroPills = [
  "Protects priorities",
  "Cleaner decisions",
  "Works everywhere",
];

const whatAlfredDoes = [
  {
    title: "Stops the drift",
    body: "When the week gets reactive, he pulls you back to the few things that actually matter.",
    icon: Shield,
  },
  {
    title: "Sorts yes, no, or not now",
    body: "He helps you tell the difference between a real opportunity and a distraction wearing a good outfit.",
    icon: Compass,
  },
  {
    title: "Keeps real life in the room",
    body: "He weighs your priorities against your calendar, your energy, your family reality, and your actual limits.",
    icon: Users,
  },
  {
    title: "Catches breakdown early",
    body: "Your weekly check-ins make it easier to spot drift before a hard week becomes a lost month.",
    icon: CheckCircle2,
  },
];

const whyItLands = [
  {
    title: "He knows what matters to you",
    body: "Your priorities, values, and the kind of life you are trying to build are part of the coaching, not an afterthought.",
    icon: Star,
  },
  {
    title: "He knows the game you are actually playing",
    body: "Your goals, numbers, and weekly sales targets stay in the room, so advice is grounded in the business you are actually running.",
    icon: BarChart3,
  },
  {
    title: "He knows what your life can hold",
    body: "Your time, energy, boundaries, and real constraints shape the answer before you ever see it.",
    icon: Brain,
  },
];

const weeklyRhythm = [
  { icon: Crosshair, label: "Clarity", desc: "Do I know what matters most right now?" },
  { icon: Shield, label: "Coherence", desc: "Do my actions still match what I said I wanted?" },
  { icon: Sparkles, label: "Capacity", desc: "Can my life and nervous system actually hold this week?" },
  { icon: Star, label: "Confidence", desc: "Am I keeping my word to myself?" },
  { icon: ArrowRight, label: "Courage", desc: "Am I doing the hard right thing or staying busy instead?" },
  { icon: Users, label: "Connection", desc: "Am I staying present with the people who matter most?" },
];

const insideApp = [
  {
    icon: CalendarDays,
    title: "Weekly planning prompts that hold the line",
    description:
      "Build a week you can actually defend when meetings, sales, family, and life all collide.",
  },
  {
    icon: MessageSquare,
    title: "A coach you can text like a human",
    description:
      "Ask messy questions in plain language. He still answers from your real priorities, numbers, and limits.",
  },
  {
    icon: Brain,
    title: "Voice when you need to think out loud",
    description:
      "Use live voice sessions when typing is too tidy for the truth you actually need to hear.",
  },
  {
    icon: BarChart3,
    title: "Assessment results that become a real plan",
    description:
      "See where you are strong, where you are leaking energy, and what to focus on next.",
  },
  {
    icon: Bell,
    title: "Morning nudges and weekly check-ins",
    description:
      "Stay close to what matters without turning your life into one more noisy app.",
  },
  {
    icon: Smartphone,
    title: "Your coach wherever the week happens",
    description:
      "Desktop, phone, or tablet. ALFRED stays available when the decision is actually happening.",
  },
];

const pricingPreview = [
  {
    name: "Monthly",
    price: "$39",
    period: "/mo",
    description: "Full product. Cancel anytime.",
    href: "/sign-up?plan=monthly",
    featured: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/yr",
    description: "Save 25% if ALFRED is becoming part of your weekly rhythm.",
    href: "/sign-up?plan=annual",
    featured: true,
    badge: "Best value",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-accent">
            Pricing
          </Link>
          <Link href="/sign-in" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sign In
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-20 pt-12 sm:pt-16 lg:pb-24">
        <div
          className="pointer-events-none absolute -left-[18%] top-0 h-[520px] w-[min(58vw,760px)] rounded-full blur-[96px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,26,0.42) 0%, rgba(255,159,107,0.16) 42%, transparent 72%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[-12%] top-24 h-[440px] w-[min(42vw,520px)] opacity-[0.22]"
          style={{
            background:
              "linear-gradient(150deg, rgba(35,52,75,0.22) 0%, rgba(35,52,75,0.08) 38%, rgba(255,255,255,0) 100%)",
            clipPath: "polygon(20% 0%, 100% 8%, 80% 100%, 0% 84%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-accent" />
              For founders under real pressure
            </div>

            <h1 className="mb-5 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              An AI coach that
              <span className="block text-gradient-accent">actually knows you.</span>
            </h1>

            <p className="mb-3 text-base font-medium text-foreground/90 sm:text-lg">
              Your priorities. Your goals. Your real limits.
            </p>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              ALFRED keeps what matters in the room so you can make the next right move when the week gets loud.
            </p>

            <ul className="mb-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
              {heroPills.map((pill) => (
                <li
                  key={pill}
                  className="rounded-full border border-border bg-card/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {pill}
                </li>
              ))}
            </ul>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Start My 7-Day Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#product-tour"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/20 px-8 py-4 font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-accent/10"
              >
                Take the Product Tour
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-muted-foreground">
              7-day trial. No upsell maze. Works on desktop, phone, and tablet.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-border bg-card/72 p-8 shadow-[0_28px_80px_-56px_rgba(14,22,36,0.28)] sm:p-10 lg:p-12">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              What He Does
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Most founders don&apos;t need more ideas.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              They need help staying loyal to what matters when urgent problems, tempting opportunities, and real life
              all hit at once. ALFRED is the trusted advisor in your pocket who helps you protect your priorities and
              make the next right move. That is what he is built for.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whatAlfredDoes.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-border bg-background/92 p-6 shadow-[0_18px_42px_-34px_rgba(14,22,36,0.22)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-3 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AlfredLandingDemoSection />

      <section className="border-y border-border bg-card/70 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Why It Lands
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Why his advice feels different.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              ALFRED is not guessing from the question you typed today. He coaches from the bigger picture you build with
              him over time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {whyItLands.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-border bg-background/92 p-6 shadow-[0_18px_42px_-34px_rgba(14,22,36,0.2)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-3 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Weekly Reset
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              A weekly check-in that catches drift before the month is gone.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              ALFRED&apos;s weekly reset helps you see how you are actually operating, not just what you shipped. It turns
              vague stress into something you can name, track, and coach.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {weeklyRhythm.map((item) => (
              <article
                key={item.label}
                className="rounded-[22px] border border-border bg-card/40 p-5 transition-colors hover:border-accent/25"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12">
                  <item.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{item.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/70 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Inside ALFRED
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Everything in the app points back to what matters.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The point is not more features. The point is giving you a system that helps you stay clear, honest, and
              aligned when the week tries to pull you off-center.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insideApp.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-border bg-background/88 p-6 shadow-[0_18px_42px_-34px_rgba(14,22,36,0.2)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-3 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-accent/20 bg-[linear-gradient(145deg,rgba(255,107,26,0.08),rgba(255,255,255,0.96)_38%,rgba(255,247,240,0.92)_100%)] p-8 text-center shadow-[0_32px_90px_-56px_rgba(255,107,26,0.22)] sm:p-10 lg:p-12">
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Want The Full Experience?
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            Want ALFRED to know your world faster?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Join the Strategic Alignment Intensive. Build your priorities, numbers, boundaries, and weekly direction
            live, then bring 30 days of ALFRED home with you so the coaching starts from what you built in the room.
          </p>
          <Link
            href="https://jakesebokmarketingsite.vercel.app/work-with-me/strategic-intensives"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            See the Intensive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-card/70 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Pricing Preview
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            Simple pricing. One lane. Full product.
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            No upsell maze. No stripped-down tier. Just the full ALFRED experience for less than many founders spend on a
            single coaching hour.
          </p>

          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
            {pricingPreview.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[24px] p-8 ${
                  plan.featured ? "border-2 border-accent bg-background" : "border border-border bg-background/88"
                }`}
              >
                {plan.badge ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs text-accent-foreground">
                    {plan.badge}
                  </div>
                ) : null}
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-3 text-4xl font-bold text-foreground">
                  <span className="font-serif">{plan.price}</span>
                  <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
                <Link
                  href={plan.href}
                  className={`mt-6 block rounded-xl py-3 text-sm font-medium transition-colors ${
                    plan.featured
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "border border-border hover:bg-secondary"
                  }`}
                >
                  Start My 7-Day Trial
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/pricing" className="font-medium text-accent hover:underline">
              See full pricing
            </Link>{" "}
            for plan details and extended access through Jake&apos;s programs.
          </p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <LogoOnDarkGlow size="md">
            <Image
              src="/logo-apos.png"
              alt="ALFRED"
              width={220}
              height={60}
              className="logo-on-dark-img h-10 w-auto opacity-60 sm:h-11"
            />
          </LogoOnDarkGlow>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link
              href="https://jakesebokmarketingsite.vercel.app/work-with-me/strategic-intensives"
              className="hover:text-foreground"
            >
              Intensive
            </Link>
            <Link href="/sign-in" className="hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
