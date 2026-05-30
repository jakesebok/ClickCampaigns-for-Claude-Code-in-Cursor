import Link from "next/link";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/lib/testimonials";
import { testimonialsSchemaGraph } from "@/lib/schema";

export const metadata = {
  title: "Coaching Testimonials | Real Founders Working With Jake Sebok",
  description:
    "What chiropractors, coaches, healers, and founders say about working with Jake Sebok. Real transformation, real results, in their own words.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(testimonialsSchemaGraph()) }}
      />
    <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 bg-ap-bg overflow-hidden">
      <div
        className="pointer-events-none hidden lg:block absolute top-0 right-0 lg:h-full lg:w-[38%] bg-ap-accent/10"
        style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div
        className="lg:hidden pointer-events-none absolute top-0 right-0 w-[58%] h-full bg-ap-accent"
        style={{ clipPath: "polygon(72% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-6 hero-halo">
        <span className="hero-quote-mark hero-quote-mark--drift" aria-hidden>&ldquo;</span>
        <p className="relative font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4 eyebrow-chapter">
          <span>What People Say</span>
        </p>
        <h1 className="relative font-outfit font-bold text-[2.25rem] sm:text-5xl text-ap-primary leading-tight mb-6 [text-wrap:balance]">
          Real{" "}
          <em className="not-italic text-gradient-accent">transformation</em>.{" "}
          Real results.
        </h1>
        <p className="text-xl font-semibold text-ap-mid max-w-2xl mb-12">
          Entrepreneurs who&apos;ve worked with me share what changed: clarity,
          confidence, and businesses that finally feel like extensions of who
          they are.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-reveal>
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              data-reveal
              data-reveal-delay={(i % 3) + 1}
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>

        <div className="terminal-cta mt-16" data-reveal data-reveal-delay="3">
          <p className="terminal-cta__line">
            Want results like these? See <em>your</em> map first.
          </p>
          <Link
            href="/assessment"
            className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
          >
            Take the VAPI&trade;
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <div className="cta-trust">
            <span className="cta-trust__item cta-trust__item--accent">Free, no card</span>
            <span className="cta-trust__dot" aria-hidden />
            <span className="cta-trust__item">12 minutes</span>
            <span className="cta-trust__dot" aria-hidden />
            <Link
              href="/work-with-me/apply"
              className="cta-trust__item text-gradient-accent hover:underline font-semibold"
            >
              Or apply for 1:1 coaching →
            </Link>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
