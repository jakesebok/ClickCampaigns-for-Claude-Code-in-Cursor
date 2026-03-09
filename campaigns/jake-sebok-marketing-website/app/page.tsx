import Link from "next/link";
import Image from "next/image";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { testimonials } from "@/lib/testimonials";

export default function HomePage() {
  return (
    <>
      {/* Hero — Slate & Spark style: diagonal orange, punchy headline, stats strip */}
      <section className="relative min-h-[85vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-ap-bg" />
        {/* Diagonal orange cut */}
        <div
          className="absolute top-0 right-0 w-[42%] h-full bg-ap-accent"
          style={{ clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[22%] h-[38%] bg-ap-accent-2 opacity-60"
          style={{ clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        {/* Ghost words on orange — Slate & Spark style */}
        <span className="absolute top-[120px] right-[15%] z-20 font-cormorant font-bold italic text-[clamp(48px,6vw,80px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Alive.
        </span>
        <span className="absolute top-[58%] right-[22%] -translate-y-1/2 z-20 font-cormorant font-bold italic text-[clamp(48px,6vw,80px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Free.
        </span>
        <span className="absolute bottom-[140px] right-[8%] z-20 font-cormorant font-bold italic text-[clamp(48px,6vw,80px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Clear.
        </span>
        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center max-w-[1080px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4 flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-ap-accent rounded" />
                Slate & Spark · Jake Sebok
              </p>
              <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ap-primary leading-[0.93] tracking-tight mb-6">
                Stop building
                <br />
                <span className="text-ap-accent">someone else&apos;s</span>
                <br />
                success.
              </h1>
              <p className="font-cormorant font-semibold text-base text-ap-mid leading-relaxed mb-8">
                You don&apos;t have a discipline problem. You have an alignment problem. When what you&apos;re building finally matches who you are—execution stops being a war with yourself.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-xs tracking-wider px-6 py-3 rounded-pill transition-all"
                >
                  Take the VAPI™
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center px-6 py-3 rounded-pill border-[1.5px] border-ap-border text-ap-primary font-medium text-xs tracking-wider hover:border-ap-accent hover:text-ap-accent transition-all"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            {/* Quote with circular thumbnail — right side on desktop (on orange), below on mobile */}
            <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="space-y-4 max-w-[280px] text-center lg:text-right">
                <div className="w-10 h-0.5 bg-ap-accent/40 lg:bg-white/35 mx-auto lg:ml-auto lg:mr-0" />
                <p className="font-cormorant font-semibold italic text-xl text-ap-primary lg:text-white leading-snug">
                  &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you actually are.&rdquo;
                </p>
                <div className="flex items-center justify-center lg:justify-end gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-ap-accent/30 lg:ring-white/30 flex-shrink-0">
                    <Image
                      src="/images/jake/jacob-sebok-laughing.jpeg"
                      alt="Jake Sebok"
                      fill
                      className="object-cover"
                      sizes="48px"
                      priority
                    />
                  </div>
                  <p className="text-sm text-ap-mid lg:text-white/65">— Jake Sebok, MCPC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Trusted By strip — single row, full width */}
        <div className="relative z-10 w-full border-t-2 border-ap-accent bg-white">
          <div className="flex flex-wrap w-full">
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0 flex-1 min-w-[50%] sm:min-w-0">
              <span className="font-cormorant font-semibold text-ap-muted text-xs sm:text-base uppercase tracking-wider">Trusted by</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0 flex-1 min-w-[50%] sm:min-w-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Doctors</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0 flex-1 min-w-[50%] sm:min-w-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Coaches</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0 flex-1 min-w-[50%] sm:min-w-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Healers</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0 flex-1 min-w-[50%] sm:min-w-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Bodyworkers</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex-1 min-w-[50%] sm:min-w-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule — Slate & Spark */}
      <div className="h-0.5 bg-ap-accent" />

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
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-ap-primary mb-3">
                Awareness
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Surface what&apos;s actually going on—not what you think you
                should want. I use awareness to help you see the gap between where you are and where you want to be—without the stories you&apos;ve been telling yourself.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
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

      {/* Testimonials — carousel */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            What People Say
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            Real transformation. Real results.
          </h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[20px] bg-ap-primary p-12 sm:p-16 text-center border-t-2 border-ap-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/20 to-transparent" />
            <div className="relative">
              <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-white mb-6">
                Ready to stop building the cage?
              </h2>
              <p className="text-ap-muted text-lg max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. 72 questions. ~12 minutes.
                An honest snapshot of where you stand across 12 domains.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-xs tracking-wider px-6 py-3 rounded-pill transition-all"
                >
                  Take the VAPI™
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center px-6 py-3 rounded-pill border-[1.5px] border-white/60 text-white font-medium text-xs tracking-wider hover:bg-white/10 transition-all"
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
