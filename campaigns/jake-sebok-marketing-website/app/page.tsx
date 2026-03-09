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
        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center max-w-[1080px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24">
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
            <div className="relative lg:hidden mt-8">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-xl max-w-sm mx-auto">
                <Image
                  src="/images/jake/jacob-sebok-laughing.jpeg"
                  alt="Jake Sebok"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ap-primary/30 to-transparent" />
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 flex items-center pr-8 pl-12">
                <div className="space-y-4">
                  <div className="w-10 h-0.5 bg-white/35" />
                  <p className="font-cormorant font-semibold italic text-xl text-white leading-snug max-w-[280px]">
                    &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you actually are.&rdquo;
                  </p>
                  <p className="text-sm text-white/65">— Jake Sebok, MCC</p>
                </div>
              </div>
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-2xl ml-auto w-[85%]">
                <Image
                  src="/images/jake/jacob-sebok-laughing.jpeg"
                  alt="Jake Sebok"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ap-primary/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
        {/* Trusted By strip — same style as stats, authority bar content */}
        <div className="relative z-10 border-t-2 border-ap-accent bg-white">
          <p className="text-center text-ap-muted text-xs font-semibold uppercase tracking-wider py-4 sm:py-5 px-4">
            Trusted by entrepreneurs who refused to stay stuck
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 border-t border-ap-border">
            <div className="px-3 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Chiropractors</span>
            </div>
            <div className="px-3 py-3 sm:py-5 sm:px-6 text-center border-b border-ap-border sm:border-b-0 sm:border-r">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Coaches</span>
            </div>
            <div className="px-3 py-3 sm:py-5 sm:px-6 text-center border-b border-r border-ap-border sm:border-b-0">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Healers</span>
            </div>
            <div className="px-3 py-3 sm:py-5 sm:px-6 text-center border-b border-ap-border sm:border-b-0 sm:border-r col-span-2 sm:col-span-1">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Service Professionals</span>
            </div>
            <div className="px-3 py-3 sm:py-5 sm:px-6 text-center col-span-2 sm:col-span-1">
              <span className="font-cormorant font-semibold text-ap-primary text-xs sm:text-base">Ex-Corporate Founders</span>
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
            <div className="bg-white rounded-[20px] border border-ap-border overflow-hidden hover:border-ap-accent/50 transition-colors">
              <div className="relative aspect-[16/10]">
                <Image
                  src="https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Business strategy and planning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="font-semibold text-lg text-ap-primary mb-3">
                  Awareness
                </h3>
                <p className="text-ap-mid text-sm leading-relaxed">
                  Surface what&apos;s actually going on—not what you think you
                  should want. The VAPI™ Assessment gives you an honest baseline.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border overflow-hidden hover:border-ap-accent/50 transition-colors">
              <div className="relative aspect-[16/10]">
                <Image
                  src="https://images.pexels.com/photos/5715847/pexels-photo-5715847.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Coaching and mindset"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="font-semibold text-lg text-ap-primary mb-3">
                  Internal Alignment
                </h3>
                <p className="text-ap-mid text-sm leading-relaxed">
                  NLP-based parts work that turns self-sabotage into momentum. The
                  business aligns with your nervous system so success and values
                  point the same way.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border overflow-hidden hover:border-ap-accent/50 transition-colors">
              <div className="relative aspect-[16/10]">
                <Image
                  src="https://images.pexels.com/photos/6804090/pexels-photo-6804090.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Execution and growth"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-8">
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
