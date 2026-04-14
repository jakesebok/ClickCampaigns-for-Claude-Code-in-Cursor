import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Sparkles, Smartphone } from "lucide-react";

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
        <p className="text-base sm:text-lg md:text-xl text-[var(--ap-secondary)] max-w-2xl md:max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 font-outfit">
          The same pattern behind VAPI™: a serious instrument, a cinematic results
          experience, and room to grow into a{" "}
          <strong className="font-semibold text-[var(--ap-primary)]">
            custom client-facing app
          </strong>
          —portal history, coach views, dashboards, and ongoing scorecards when you
          are ready. Use this intake so we can scope the work honestly.
        </p>

        <div className="relative mx-auto max-w-2xl text-left rounded-3xl border-2 border-[var(--ap-accent)]/35 bg-gradient-to-br from-[#FFF8F3] via-white to-white p-7 sm:p-9 md:p-10 mb-10 sm:mb-12 shadow-[0_4px_24px_-8px_rgba(255,107,26,0.2),0_24px_48px_-28px_rgba(14,22,36,0.12)] ring-1 ring-[var(--ap-accent)]/15">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ap-accent)]/12 text-[var(--ap-accent)]">
              <Smartphone className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gradient-accent font-outfit mb-2">
                The big upsell
              </p>
              <h2 className="font-cormorant text-2xl sm:text-3xl md:text-[2rem] font-bold text-[var(--ap-primary)] tracking-tight mb-3">
                A custom app built for your practice—not a generic template
              </h2>
              <p className="text-sm sm:text-[15px] text-[var(--ap-secondary)] font-outfit leading-relaxed mb-5">
                Most tools stop at a quiz in a tab. The full vision is a branded web
                experience your clients log into: their history, your interpretation
                layer, and (when you want them) recurring metrics and coach-facing
                views—designed around your constructs, not ours.
              </p>
              <ul className="space-y-3 text-sm sm:text-[15px] text-[var(--ap-primary)] font-outfit">
                <li className="flex gap-3">
                  <LayoutDashboard
                    className="h-5 w-5 shrink-0 text-[var(--ap-accent)] mt-0.5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span>
                    <strong className="font-semibold">Client portal & dashboards</strong>{" "}
                    that feel like your brand, not a third-party widget bolted on.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Sparkles
                    className="h-5 w-5 shrink-0 text-[var(--ap-accent)] mt-0.5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span>
                    <strong className="font-semibold">Same VAPI™ DNA</strong>, scaled:
                    from standalone assessment to an app your clients actually live in.
                  </span>
                </li>
              </ul>
            </div>
          </div>
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
            bespoke system: constructs, scoring, interpretation, and—if you want
            them—a custom app with portal, dashboards, and recurring metrics aligned
            to how you coach.
          </p>
        </div>
      </section>
    </div>
  );
}
