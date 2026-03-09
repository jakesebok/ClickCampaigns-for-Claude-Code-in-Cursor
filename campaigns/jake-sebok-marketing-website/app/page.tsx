import Link from "next/link";
import Image from "next/image";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/lib/testimonials";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
                Values-Aligned Performance
              </p>
              <h1 className="font-cormorant font-bold text-4xl sm:text-5xl lg:text-6xl text-ap-primary leading-[1.1] tracking-tight mb-6">
                Build a business that&apos;s an extension of who you are—not a
                cage you built around yourself.
              </h1>
              <p className="text-lg sm:text-xl text-ap-mid leading-relaxed mb-8 max-w-xl">
                I help entrepreneurs who feel trapped by the businesses they
                built rediscover the vision that ignited them—and construct
                something sustainable, values-driven, and fully alive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://portal.alignedpower.coach/assessment"
                  className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all shadow-lg shadow-ap-accent/25"
                >
                  Take the Free VAPI™ Assessment
                  <svg
                    className="w-5 h-5"
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
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-ap-primary font-semibold px-8 py-4 rounded-pill border-[1.5px] border-ap-primary hover:bg-ap-primary hover:text-white transition-all"
                >
                  Explore How We Work
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-2xl">
                <Image
                  src="/images/jake/jacob-sebok-laughing.jpeg"
                  alt="Jake Sebok"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ap-primary/30 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-ap-accent rounded-[20px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-ap-primary py-12">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-center text-ap-muted text-sm font-semibold uppercase tracking-wider mb-6">
            Trusted by entrepreneurs who refused to stay stuck
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-white/80">
            <span className="font-cormorant font-semibold">Chiropractors</span>
            <span className="font-cormorant font-semibold">Coaches</span>
            <span className="font-cormorant font-semibold">Healers</span>
            <span className="font-cormorant font-semibold">Service Professionals</span>
            <span className="font-cormorant font-semibold">Ex-Corporate Founders</span>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            The Work
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            I don&apos;t optimize for output. I optimize for alignment.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-[20px] border border-ap-border p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-ap-accent/15 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-ap-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-ap-primary mb-3">
                Awareness
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Surface what&apos;s actually going on—not what you think you
                should want. The VAPI™ Assessment gives you an honest baseline.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-ap-accent/15 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-ap-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-ap-primary mb-3">
                Internal Alignment
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                NLP-based parts work that turns self-sabotage into momentum. The
                business aligns with your nervous system so success and values
                point the same way.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-ap-accent/15 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-ap-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-ap-primary mb-3">
                Embodied Execution
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Sustainable growth that doesn&apos;t require you to abandon what
                you actually want. Progress that continues after coaching ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            What People Say
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            Real transformation. Real results.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-ap-accent font-semibold hover:underline"
            >
              Read more testimonials
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[20px] bg-ap-primary p-12 sm:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/20 to-transparent" />
            <div className="relative">
              <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-white mb-6">
                Ready to stop building the cage?
              </h2>
              <p className="text-ap-muted text-lg max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. 72 questions. ~12 minutes.
                An honest snapshot of where you stand across 12 domains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://portal.alignedpower.coach/assessment"
                  className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
                >
                  Take the VAPI™
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-8 py-4 rounded-pill border-[1.5px] border-white/60 hover:bg-white/10 transition-all"
                >
                  See All Offerings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
