import Link from "next/link";
import { ApplyForm } from "./ApplyForm";
import { applySchemaGraph } from "@/lib/schema";

export const metadata = {
  title: "Apply for the Aligned Power Program | Jake Sebok",
  description:
    "Apply for Jake Sebok's flagship Aligned Power Program: 12 months of 1:1 high-touch coaching for founders ready to build a business that fits their life.",
  alternates: { canonical: "/work-with-me/apply" },
};

export default function ApplyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applySchemaGraph()) }}
      />
      {/* Hero — subtle orange geometric */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none hidden lg:block absolute top-0 right-0 lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div
          className="lg:hidden pointer-events-none absolute top-0 inset-x-0 h-[35%] bg-gradient-to-br from-ap-accent/10 via-ap-accent/3 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6 hero-halo">
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ap-mid hover:text-gradient-accent mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Work With Me
          </Link>
          <span className="hero-chapter-number" aria-hidden>01</span>
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 eyebrow-chapter">
            <span>Aligned Power Program · Entry</span>
          </p>
          <h1 className="font-outfit font-bold text-[2rem] sm:text-5xl text-ap-primary leading-tight mb-6 [text-wrap:balance]">
            Apply for the{" "}
            <em className="font-cormorant italic font-semibold tracking-tight text-gradient-accent">12-month</em>,{" "}
            1:1 program
          </h1>
          <p className="text-xl font-semibold text-ap-mid">
            The Aligned Power Program is my flagship 12-month, 1:1, high-touch coaching experience for entrepreneurs
            who are done succeeding in ways that cost too much. Every engagement is customized. Application required and
            personally reviewed. Tell me about your business, what is not working, and why now matters.
          </p>
        </div>
      </section>

      {/* Application form */}
      <section className="py-12 sm:py-16 bg-white" data-reveal>
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <div
            className="form-frame apply-form-frame"
            data-reveal
            data-reveal-delay="1"
            data-lc-source="apply_form_frame"
          >
            <div className="expectation-setter">
              <p className="expectation-setter__eyebrow">What happens after you apply</p>
              <p className="expectation-setter__line">
                <span className="expectation-setter__numeral">01</span>
                <span>
                  <strong>I read every application personally.</strong> No team, no screener, no template.
                </span>
              </p>
              <p className="expectation-setter__line">
                <span className="expectation-setter__numeral">02</span>
                <span>
                  <strong>You hear back in 5 to 7 business days</strong> either way.
                </span>
              </p>
              <p className="expectation-setter__line">
                <span className="expectation-setter__numeral">03</span>
                <span>
                  If we are a fit, the next step is a real <em>conversation</em>. If not, I tell you why.
                </span>
              </p>
            </div>
            <ApplyForm />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-sm font-semibold text-ap-muted" data-reveal data-reveal-delay="2">
            <span className="cta-trust__item cta-trust__item--accent text-ap-mid">By application only</span>
            <span className="cta-trust__dot" aria-hidden />
            <span>1:1, customized to you</span>
            <span className="cta-trust__dot" aria-hidden />
            <span>12-month engagement</span>
          </div>
        </div>
      </section>
    </>
  );
}
