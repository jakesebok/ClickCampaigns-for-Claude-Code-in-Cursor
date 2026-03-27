import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { LogoOnDarkGlow } from "@/components/logo-on-dark-glow";

// Parked landing page for the annual + Intensive offer. Leave this route unlinked
// until the next Strategic Alignment Intensive window is ready to open publicly.
const premiumPathEnabled = false;

const annualOnlyBullets = [
  "Card-free 7-day trial",
  "Choose annual only if ALFRED earns the place",
  "Best if you want the app on its own",
];

const premiumPathBullets = [
  "Annual ALFRED plus the next Strategic Alignment Intensive",
  "Best if you want to build the context ALFRED coaches from",
  "For founders who want the fastest path to getting the full value",
];

export default function PremiumPathPage() {
  if (!premiumPathEnabled) {
    redirect("/pricing");
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
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Back to pricing
          </Link>
        </div>
      </nav>

      <section className="px-6 pb-16 pt-12 sm:pt-16 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Annual Intent Upgrade
          </p>
          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Want the fastest path to getting the full value from ALFRED?
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Annual ALFRED is the simpler path. Annual ALFRED plus the next Strategic Alignment Intensive is the stronger
            path if you want to build the priorities, numbers, boundaries, and context ALFRED coaches from.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="rounded-[28px] border border-border bg-card/88 p-8">
            <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Annual Only
            </p>
            <h2 className="text-2xl font-semibold text-foreground">Keep it simple</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              Start your card-free trial, use ALFRED on his own, and choose annual if he earns a place in your weekly
              rhythm.
            </p>
            <div className="mt-6">
              <span className="font-serif text-4xl font-bold text-foreground">$349</span>
              <span className="text-muted-foreground">/year after trial</span>
            </div>
            <ul className="mt-6 space-y-3">
              {annualOnlyBullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up?plan=annual"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Start Annual Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-[28px] border-2 border-accent bg-card p-8 shadow-[0_28px_60px_-38px_rgba(255,107,26,0.28)]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Recommended
            </div>
            <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Premium Path
            </p>
            <h2 className="text-2xl font-semibold text-foreground">Annual + next Intensive</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              This is the stronger version if you want ALFRED to coach from sharper context faster. You build the
              strategic clarity first, then bring that into the app.
            </p>
            <ul className="mt-6 space-y-3">
              {premiumPathBullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up?plan=annual&upgrade=intensive"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Start Premium Path
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://jakesebokmarketingsite.vercel.app/work-with-me/strategic-intensives"
                className="inline-flex items-center justify-center text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                See the Intensive
              </Link>
            </div>
          </article>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[24px] border border-border bg-card/72 p-6 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The card-free trial still starts first. Then you decide whether to keep annual ALFRED on its own or take the
            deeper path into the next Intensive.
          </p>
        </div>
      </section>
    </div>
  );
}
