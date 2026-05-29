import Link from "next/link";
import { ApplyForm } from "./ApplyForm";

export const metadata = {
  title: "Apply for the Aligned Power Program | Jake Sebok",
  description:
    "Apply for the Aligned Power Program with Jake Sebok. A 12-month, 1:1, high-touch growth and performance coaching experience for entrepreneurs ready to build a business that fits their life and ambition.",
};

export default function ApplyPage() {
  return (
    <>
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
        <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6">
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ap-mid hover:text-gradient-accent mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Work With Me
          </Link>
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            Aligned Power Program
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
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <ApplyForm />

          <p className="mt-6 text-sm text-ap-muted">
            I review every application personally. You&apos;ll hear back within
            5–7 business days.
          </p>
        </div>
      </section>
    </>
  );
}
