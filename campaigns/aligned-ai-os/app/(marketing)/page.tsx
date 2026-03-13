import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Target,
  BarChart3,
  MessageSquare,
  Smartphone,
  Bell,
  CheckCircle2,
  Star,
  Crosshair,
  Link2,
  BatteryCharging,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Image
          src="/logo-apos.png"
          alt="APOS"
          width={160}
          height={44}
          className="h-9 w-auto"
        />
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          {/* Auth buttons are in root layout header */}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-sm text-muted-foreground mb-8">
          <Star className="h-3.5 w-3.5" />
          Built on the Strategic Clarity framework
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
          An AI coach that
          <br />
          <span className="text-gradient-accent">actually knows you.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Your values. Your goals. Your real constraints. APOS turns your
          deepest clarity into a personalized AI coach that keeps you focused,
          aligned, and growing — without burning out.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="https://jakesebok.com/work-with-me/strategic-intensives"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground hover:bg-card transition-colors"
          >
            Attend the Workshop
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-4">
            Not another generic chatbot.
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            Most AI gives you generic advice because it doesn&apos;t know you.
            APOS is different. It knows your core values, your revenue
            targets, your capacity constraints, and the person you&apos;re
            becoming. Every answer is personalized.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Build your context",
                description:
                  "Upload your Strategic Clarity worksheets from the Intensive or answer guided questions. Your AI coach learns your values, goals, WHY, and real business numbers.",
                icon: Target,
              },
              {
                step: "02",
                title: "Get personalized coaching",
                description:
                  "Ask anything — weekly planning, strategy, sales, mindset. Every answer is filtered through your values and scored against your real capacity.",
                icon: MessageSquare,
              },
              {
                step: "03",
                title: "Stay aligned daily",
                description:
                  "Morning SMS prompts, weekly ONE THING tracking, 6Cs scorecard. Your coach keeps you focused on what actually matters to you.",
                icon: Bell,
              },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="text-xs font-medium text-muted-foreground">
                  STEP {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6Cs Section */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-4">
            Track your alignment weekly.
          </h2>
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12">
            The 6Cs Scorecard measures what matters — not just output.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Crosshair, label: "Clarity", desc: "Do I know what matters most?" },
              { icon: Link2, label: "Coherence", desc: "Do my actions match my values?" },
              { icon: BatteryCharging, label: "Capacity", desc: "Can my nervous system hold my life?" },
              { icon: ShieldCheck, label: "Confidence", desc: "Am I keeping my word to myself?" },
              { icon: Zap, label: "Courage", desc: "Am I doing the hard right thing?" },
              { icon: Users, label: "Connection", desc: "Am I present with the people who matter?" },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-3 rounded-xl border border-border p-5"
              >
                <c.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">{c.label}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">
            Everything you need to stay aligned.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Values-First Decision Filter",
                description:
                  "Every recommendation is scored against your core values. Your coach never suggests actions that violate what matters most.",
              },
              {
                icon: BarChart3,
                title: "Revenue Bridge Math",
                description:
                  "Your real numbers — Required Revenue, QCs per week, close rates — built into every strategy recommendation.",
              },
              {
                icon: Target,
                title: "ONE THING Tracking",
                description:
                  "Set your weekly domino. Get mid-week check-ins. End-of-week reflections. Stay focused on the move that matters most.",
              },
              {
                icon: Bell,
                title: "Morning SMS Prompts",
                description:
                  "A values-aligned prompt every morning. Set your intention before the inbox sets it for you.",
              },
              {
                icon: CheckCircle2,
                title: "6Cs Scorecard",
                description:
                  "Rate yourself weekly across Clarity, Coherence, Capacity, Confidence, Courage, and Connection.",
              },
              {
                icon: Smartphone,
                title: "Works Everywhere",
                description:
                  "Desktop, phone, tablet. Install it like an app. Your coach is always in your pocket.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border p-6 space-y-3"
              >
                <feature.icon className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop CTA */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-serif font-bold">
            Want the full experience?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join the quarterly Strategic Alignment Intensive ($497). Build your
            complete context document with expert guidance. Get 30 days of free
            APOS access — and an AI coach that knows you 10x deeper than the
            guided onboarding.
          </p>
          <Link
            href="https://jakesebok.com/work-with-me/strategic-intensives"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            Learn About the Intensive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-24 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-serif font-bold">
            Simple, aligned pricing.
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border p-8 space-y-4">
              <h3 className="font-semibold">Monthly</h3>
              <div className="text-4xl font-serif font-bold">
                $39
                <span className="text-lg text-muted-foreground font-normal">
                  /mo
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cancel anytime. Full access to all features.
              </p>
              <Link
                href="/sign-up"
                className="block w-full py-3 rounded-xl border border-border text-center text-sm hover:bg-secondary transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-accent p-8 space-y-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                Best value
              </div>
              <h3 className="font-semibold">Annual</h3>
              <div className="text-4xl font-serif font-bold">
                $349
                <span className="text-lg text-muted-foreground font-normal">
                  /yr
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Save 25%. That&apos;s less than $1/day for a personal AI coach.
              </p>
              <Link
                href="/sign-up?plan=annual"
                className="block w-full py-3 rounded-xl bg-accent text-accent-foreground text-center text-sm hover:bg-accent/90 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image
            src="/logo-apos.png"
            alt="APOS"
            width={120}
            height={34}
            className="h-7 w-auto opacity-60"
          />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link
              href="https://jakesebok.com/work-with-me/strategic-intensives"
              className="hover:text-foreground"
            >
              Workshop
            </Link>
            <a href="https://circle.so" className="hover:text-foreground">
              Community
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
