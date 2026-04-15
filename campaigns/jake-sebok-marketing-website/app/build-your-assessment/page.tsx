import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function BuildYourAssessmentLandingPage() {
  return (
    <div className="build-intake-canvas min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100vh-6rem)]">
      <section className="max-w-3xl lg:max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ap-accent)]/25 bg-white/70 px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ap-primary)] font-outfit shadow-sm mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[var(--ap-accent)] shrink-0" aria-hidden />
          For coaches & founders
        </div>
        <h1 className="font-cormorant text-[2rem] leading-[1.08] sm:text-5xl md:text-6xl lg:text-[3.5rem] text-[var(--ap-primary)] font-bold tracking-tight mb-5 sm:mb-6 max-w-4xl mx-auto">
          Want an assessment{" "}
          <em className="text-gradient-accent-hero not-italic">experience</em> like
          mine?
        </h1>
        <div className="text-base sm:text-lg md:text-xl text-[var(--ap-secondary)] max-w-2xl md:max-w-3xl mx-auto leading-relaxed mb-9 sm:mb-10 font-outfit space-y-5 text-left sm:text-center">
          <p>
            The same pattern behind VAPI™: a serious instrument and a cinematic
            results experience. Many engagements start there and stay there.
          </p>
          <p>
            If you want to go further, we can also scope a{" "}
            <strong className="font-semibold text-[var(--ap-primary)]">
              custom client-facing app
            </strong>
            : a branded web experience clients log into, with history over time,
            your interpretation layer, coach-facing views where you need them,
            dashboards, and recurring scorecards when you are ready—all shaped to
            your constructs, not a generic template.
          </p>
          <p>
            Use this intake so we can quote and plan honestly—whether you need the
            core assessment and results first, or you already know you want the full
            app experience on the roadmap.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5 mb-12 sm:mb-14 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/build-your-assessment/intake"
            className="intake-nav-primary text-base px-10 py-4 sm:py-[1.125rem] shadow-xl shadow-[rgba(255,107,26,0.28)] w-full sm:w-auto inline-flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-2"
          >
            <span className="inline-flex items-center gap-2">
              Start the intake
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden />
            </span>
            <span className="text-[10px] sm:text-xs font-normal text-white/85 sm:hidden -mt-0.5">
              One question at a time · Auto-saves
            </span>
          </Link>
          <Link
            href="/assessment/start"
            className="text-sm font-semibold text-[var(--ap-muted)] hover:text-[var(--ap-primary)] transition-colors font-outfit py-3 sm:py-0 text-center sm:text-left"
          >
            Try the public VAPI™ first →
          </Link>
        </div>
        <div className="relative mx-auto max-w-lg md:max-w-xl build-intake-hero-card rounded-3xl border border-[var(--ap-border)]/80 bg-white/95 p-7 sm:p-9 md:p-10 text-left ring-1 ring-white/90">
          <div className="flex justify-center mb-5 sm:mb-6">
            <Image
              src="/images/vapi/vapi-logo.png"
              alt=""
              width={176}
              height={52}
              className="h-12 sm:h-14 w-auto opacity-95"
            />
          </div>
          <p className="text-sm sm:text-[15px] md:text-base text-[var(--ap-secondary)] font-outfit leading-relaxed">
            You are not buying a template off the shelf. You are commissioning a
            bespoke system: constructs, scoring, interpretation, and—when it makes
            sense for your offer—a client experience that can grow into portal,
            dashboards, and metrics aligned to how you coach.
          </p>
        </div>
      </section>
    </div>
  );
}
