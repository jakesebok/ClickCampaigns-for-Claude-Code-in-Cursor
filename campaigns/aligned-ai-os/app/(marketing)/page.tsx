import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Compass,
  Crosshair,
  MessageSquare,
  Shield,
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
  "Protect priorities",
  "Cleaner decisions",
  "Card-free trial",
];

const whatAlfredDoes = [
  {
    title: "The urgent starts winning",
    body: "He helps you pull the week back to the few things that actually matter before urgency takes over everything.",
    icon: Shield,
  },
  {
    title: "A new opportunity shows up",
    body: "He helps you decide whether it deserves a yes, a later, or a clean no before it hijacks the week.",
    icon: Compass,
  },
  {
    title: "Real life changes the plan",
    body: "He weighs the work against your time, energy, family reality, and actual limits instead of pretending those do not matter.",
    icon: Users,
  },
  {
    title: "Something feels off",
    body: "Weekly check-ins make it easier to spot drift before one hard week turns into a lost month.",
    icon: CheckCircle2,
  },
];

const whyItLands = [
  {
    title: "What matters most right now",
    body: "Your priorities, values, and the life you are trying to protect stay in the room while he helps you decide.",
    icon: Star,
  },
  {
    title: "What you are trying to build",
    body: "Your goals, numbers, and this season of business shape the advice, so it fits the game you are actually playing.",
    icon: BarChart3,
  },
  {
    title: "What your life can actually hold",
    body: "Your time, boundaries, and real constraints are part of the answer before you ever see it.",
    icon: Brain,
  },
];

const weeklyRhythm = [
  { icon: Compass, label: "A new idea hits", desc: "He helps you decide if it deserves a yes, a later, or a no." },
  { icon: ArrowRight, label: "You need a hard yes or no", desc: "He helps you weigh the upside against the real cost to your time, focus, and energy." },
  { icon: Shield, label: "The week gets reactive", desc: "He helps you reset around what still matters instead of letting urgency run the whole week." },
  { icon: Crosshair, label: "You feel off but cannot name it", desc: "The weekly check-in gives you a cleaner read on where you are slipping and what needs repair first." },
  { icon: Sparkles, label: "Capacity is getting tight", desc: "He helps you see what your calendar and nervous system can actually hold before you overcommit again." },
  { icon: Users, label: "You need to reset fast", desc: "He gives you a way back into the week without shame, confusion, or starting from zero." },
];

const insideApp = [
  {
    icon: CalendarDays,
    title: "Weekly planning that holds up in real life",
    description:
      "Build a week you can actually defend when meetings, sales, family, and life all collide.",
  },
  {
    icon: MessageSquare,
    title: "Coaching chat grounded in your world",
    description:
      "Ask messy questions in plain language and get answers shaped by your priorities, goals, and limits.",
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
    icon: CheckCircle2,
    title: "Weekly check-ins that catch drift early",
    description:
      "Stay close to what matters without turning your life into one more noisy app.",
  },
];

const pricingPreview = [
  {
    name: "Monthly",
    price: "$39",
    period: "/mo",
    description: "Choose monthly after your card-free trial.",
    href: "/sign-up?plan=monthly",
    featured: false,
  },
  {
    name: "Annual",
    price: "$349",
    period: "/yr",
    description: "Choose annual after your trial and save 25%.",
    href: "/sign-up?plan=annual",
    featured: true,
    badge: "Best value",
  },
];

const buyingQuestions = [
  {
    question: "Do I need a card to start?",
    answer: "No. The 7-day trial is card-free.",
  },
  {
    question: "Do I get the full product in the trial?",
    answer: "Yes. The trial gives you full access, not a stripped-down demo tier.",
  },
  {
    question: "Who is this for?",
    answer: "Founders and operators carrying competing pressure who want help protecting priorities and making cleaner decisions.",
  },
  {
    question: "What if I am already in Jake's world?",
    answer: "Some programs include longer ALFRED access, but you do not need another offer to use ALFRED on his own.",
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
              ALFRED helps you protect what matters, make cleaner decisions, and stop losing the week to urgency.
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
                Start Card-Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#product-tour"
                className="inline-flex items-center justify-center gap-2 px-2 py-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                See the product tour
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-muted-foreground">
              Card-free 7-day trial. Full access from day one.
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
              make the next right move.
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
              Why It Works
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Before ALFRED answers, he already knows the shape of your week.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              That is why the advice feels more specific than blank-slate AI. He is not starting from today&apos;s question
              alone.
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
              Real Week Use Cases
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              How ALFRED helps when the week goes sideways.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              This is where the app earns its keep: when something changes, a decision gets messy, or you can feel drift
              starting.
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
              In The App
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              A simple toolset built around one job.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Keep what matters visible. Get coaching that fits your life. Make the next right move without starting from
              zero.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
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

      <section className="border-y border-border bg-card/70 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Start Here
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            Start with a card-free 7-day trial.
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Full access from day one. If ALFRED helps you protect priorities and make cleaner decisions, choose the plan
            you want after the trial.
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
                  Start Card-Free Trial
                </Link>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
            {buyingQuestions.map((item) => (
              <article key={item.question} className="rounded-[22px] border border-border bg-background/88 p-5">
                <h3 className="font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/pricing" className="font-medium text-accent hover:underline">
              See full pricing
            </Link>{" "}
            for plan details.
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
