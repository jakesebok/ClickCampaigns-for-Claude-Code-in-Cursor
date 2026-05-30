import Link from "next/link";
import { workWithMeSchemaGraph } from "@/lib/schema";

const ALFRED_APP_URL = "https://alfredai.coach";

export const metadata = {
  title: "Work With Me | Growth and Performance Coaching with Jake Sebok",
  description:
    "Two ways in. Take the free VAPI™ assessment, or apply for the Aligned Power Program: Jake Sebok’s flagship 12-month, 1:1 coaching for entrepreneurs.",
  alternates: { canonical: "/work-with-me" },
};

const offerings = [
  {
    title: "Free VAPI™ Assessment",
    description:
      "72 statements. About 12 minutes. See where you are strong, where you are stretched, and what deserves attention next. Use the same email as your portal or ALFRED account to unlock your personalized 28-day plan.",
    cta: "Take the VAPI™ · Free",
    href: "/assessment",
    free: true,
  },
  {
    title: "Aligned Power Program",
    description:
      "My flagship 12-month, 1:1, high-touch growth and performance coaching experience for entrepreneurs ready to build a business that fits their life and ambition. Customized to you. Application required and personally reviewed.",
    cta: "Apply for the Program",
    href: "/work-with-me/apply",
    featured: true,
  },
];

export default function WorkWithMePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workWithMeSchemaGraph()) }}
      />
      {/* Hero — subtle orange geometric */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none hidden lg:block absolute top-0 right-0 lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div
          className="lg:hidden pointer-events-none absolute top-0 inset-x-0 h-[35%] bg-gradient-to-br from-ap-accent/10 via-ap-accent/3 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-6 hero-halo">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent eyebrow-chapter">
              <span>How We Work</span>
            </p>
            <span className="hero-eyebrow-badge">Free entry</span>
            <span className="hero-eyebrow-badge hero-eyebrow-badge--muted">By application</span>
          </div>
          <h1 className="font-outfit font-bold text-[2.25rem] sm:text-5xl text-ap-primary leading-tight mb-6 [text-wrap:balance]">
            Two ways{" "}
            <em className="font-cormorant italic font-semibold tracking-tight">in</em>.{" "}
            <span className="text-gradient-accent">Your pace.</span>
          </h1>
          <p className="text-xl font-semibold text-ap-mid max-w-[64ch]">
            Start with the free VAPI&trade; Assessment to see where you are strong, where you are stuck, and what needs
            attention first. When you are ready for deeper work, apply for the Aligned Power Program: 12 months of 1:1,
            high-touch coaching built around your business, your values, and the life you actually want to live.
          </p>
        </div>
      </section>

      {/* Offerings grid */}
      <section className="py-8 sm:py-12" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {offerings.map((offer) => (
              <div
                key={offer.title}
                className={`lift-card flex flex-col h-full rounded-[20px] border p-8 ${
                  offer.featured
                    ? "lift-card--on-dark bg-ap-primary text-white border-ap-primary"
                    : "bg-white border-ap-border hover:border-ap-accent/50"
                }`}
              >
                {offer.free && (
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 bg-ap-accent/20 text-ap-accent">
                    Free
                  </span>
                )}
                <h2
                  className={`font-outfit font-semibold text-xl mb-3 ${
                    offer.featured ? "text-white" : "text-ap-primary"
                  }`}
                >
                  {offer.title}
                </h2>
                <p
                  className={`flex-1 text-xl font-semibold leading-relaxed mb-6 ${
                    offer.featured ? "text-white/80" : "text-ap-mid"
                  }`}
                >
                  {offer.description}
                </p>
                <Link
                  href={offer.href}
                  className={`mt-auto inline-flex items-center gap-2 font-semibold text-sm ${
                    offer.featured
                      ? "text-gradient-accent hover:text-ap-accent-2"
                      : "text-gradient-accent hover:underline"
                  }`}
                >
                  {offer.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALFRED — separate from program cards (product bridge, not another “offering” tile) */}
      <section className="py-12 sm:py-16 bg-ap-off border-y border-ap-border" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="max-w-[800px] mx-auto rounded-[24px] border border-ap-border bg-white p-8 sm:p-10 sm:flex sm:items-center sm:gap-10 sm:justify-between">
            <div className="mb-8 sm:mb-0">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
                Aligned Freedom Coach
              </p>
              <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary leading-tight mb-4">
                Need your commitment to survive past the moment of clarity?
              </h2>
              <p className="text-lg font-semibold text-ap-mid leading-relaxed">
                <strong className="text-ap-primary">ALFRED</strong> is the only app I sell. It keeps your priorities,
                commitments, and key context close when the week gets loud, so the clarity you found in a good moment
                does not disappear in a tired one. Different offer than what is above. Same standard.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 sm:min-w-[200px]">
              <Link
                href="/who-is-alfred"
                className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-sm px-6 py-3.5 rounded-pill text-center"
              >
                See How ALFRED Fits
              </Link>
              <a
                href={ALFRED_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-pill border-[1.5px] border-ap-border text-ap-primary hover:border-ap-accent hover:text-gradient-accent transition-all"
              >
                Open ALFRED
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison cross-walk — Free VAPI™ vs Aligned Power Program.
          Editorial table, not a SaaS pricing matrix. Accent dot on the program
          column signals "this is the deeper engagement"; muted dot on the
          assessment column signals "this is the open door." Both legitimate. */}
      <section className="py-12 sm:py-16 bg-white" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 eyebrow-chapter">
            <span>Cross-walk</span>
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-3 [text-wrap:balance]">
            What you get at each door.
          </h2>
          <p className="text-ap-mid text-lg sm:text-xl font-semibold leading-relaxed mb-8 max-w-[64ch]">
            Two ways in, side by side. No upsell pressure: many founders take the assessment, get the 28-day plan, and
            never need anything else from me. Some are ready for the full year and apply.
          </p>
          <div className="compare-rows">
            <div className="compare-rows__header">VAPI&trade; · Free assessment</div>
            <div className="compare-rows__header compare-rows__header--accent">Aligned Power Program · By application</div>

            <div className="compare-rows__cell">72 statements, about 12 minutes</div>
            <div className="compare-rows__cell compare-rows__cell--accent">12 months of 1:1, high-touch coaching with Jake</div>

            <div className="compare-rows__cell">Map across 12 domains of your business and life</div>
            <div className="compare-rows__cell compare-rows__cell--accent">Customized to your business, your values, the life you want</div>

            <div className="compare-rows__cell">Personalized 28-day plan based on your scores</div>
            <div className="compare-rows__cell compare-rows__cell--accent">Real-time recalibration as your business and life shift</div>

            <div className="compare-rows__cell">Email follow-up nudges to keep the plan alive</div>
            <div className="compare-rows__cell compare-rows__cell--accent">Direct access to Jake between sessions for high-stakes calls</div>

            <div className="compare-rows__cell">Free. No application. Take it whenever.</div>
            <div className="compare-rows__cell compare-rows__cell--accent">Application required and personally reviewed</div>
          </div>
        </div>
      </section>

      {/* Contrarian disqualifier — Litvin "Why You Shouldn't Work With Me"
          pattern. The act of repelling the wrong-fit client signals
          selectivity. Paired with the for-card so the inversion lands as
          confidence, not snark. */}
      <section className="py-16 sm:py-20 bg-ap-bg" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 eyebrow-chapter">
            <span>Before you apply</span>
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-3 [text-wrap:balance]">
            This program isn&apos;t for everyone. <em className="font-cormorant italic font-semibold text-gradient-accent">On purpose.</em>
          </h2>
          <p className="text-ap-mid text-lg sm:text-xl font-semibold leading-relaxed mb-12 max-w-[64ch]">
            Saying yes to the wrong people is a disservice to everyone, including them. Here is who I am built for and
            who I am not. Read both columns. If the right one fits, apply with confidence.
          </p>
          <div className="disqualifier-grid">
            <div className="disqualifier-card disqualifier-card--for" data-reveal data-reveal-delay="1">
              <p className="disqualifier-card__eyebrow">
                <span>This is for you if</span>
              </p>
              <p className="disqualifier-card__title">
                You&apos;re a founder who&apos;s succeeded at <em>too high a cost</em>.
              </p>
              <ul className="disqualifier-card__list">
                <li>You have already built something real. The growth question now is sustainability, not survival.</li>
                <li>You suspect your business is running on a version of you that doesn&apos;t fit who you actually are.</li>
                <li>You are willing to look at the personal side of business decisions, not just the spreadsheet side.</li>
                <li>You can sit with hard feedback without needing to win the conversation.</li>
                <li>A year is not too long if the work changes who you become inside the year.</li>
              </ul>
            </div>
            <div className="disqualifier-card disqualifier-card--not" data-reveal data-reveal-delay="2">
              <p className="disqualifier-card__eyebrow">
                <span>This isn&apos;t for you if</span>
              </p>
              <p className="disqualifier-card__title">
                You want a tactic kit and a <em>fast exit</em>.
              </p>
              <ul className="disqualifier-card__list">
                <li>You are looking for marketing scripts, funnel templates, or a 30-day revenue hack.</li>
                <li>You expect the coach to do the work for you instead of with you.</li>
                <li>You are unwilling to question the business model you already have if it is what is in the way.</li>
                <li>You are in survival-stage and need cash flow this week. The program is built for sustained work, not crisis triage.</li>
                <li>You want a brand-name coach for the optics. The work is not visible from the outside.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ALL IN CTA — exclusive opportunity */}
      <section className="py-20 sm:py-28 bg-ap-primary" data-reveal>
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 text-center">
          <div className="border-t-2 border-ap-accent pt-16 sm:pt-20">
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
              Exclusive Opportunity
            </p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Ready to go <span className="text-gradient-accent">ALL IN</span>?
            </h2>
            <p className="text-white/80 text-xl font-semibold mb-10 max-w-xl mx-auto">
              The Aligned Power Program is my flagship 12-month, 1:1 coaching experience for entrepreneurs who are done
              with half-measures. High-touch. Customized to you. Application required and personally reviewed. This is
              for founders ready to build a business that feels like an extension of who they actually are.
            </p>
            <Link
              href="/work-with-me/apply"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all hover:bg-ap-accent-2"
            >
              Apply for the Aligned Power Program
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="cta-trust cta-trust--on-dark mt-6">
              <span className="cta-trust__item cta-trust__item--accent text-white">Read personally by Jake</span>
              <span className="cta-trust__dot" aria-hidden />
              <span className="cta-trust__item">Reply in 5 to 7 business days</span>
              <span className="cta-trust__dot" aria-hidden />
              <span className="cta-trust__item">1:1, by application only</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
