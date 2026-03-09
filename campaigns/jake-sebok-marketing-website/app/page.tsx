import Link from "next/link";
import Image from "next/image";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { testimonials } from "@/lib/testimonials";

export default function HomePage() {
  return (
    <>
      {/* Hero — diagonal orange, punchy headline */}
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
        {/* Ghost words on orange */}
        <span className="absolute top-[120px] right-[15%] z-20 font-cormorant font-bold italic text-[clamp(72px,9vw,140px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Alive.
        </span>
        <span className="absolute top-[58%] right-[22%] -translate-y-1/2 z-20 font-cormorant font-bold italic text-[clamp(72px,9vw,140px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Free.
        </span>
        <span className="absolute bottom-[140px] right-[8%] z-20 font-cormorant font-bold italic text-[clamp(72px,9vw,140px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Clear.
        </span>
        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center max-w-[1080px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="max-w-xl">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-primary mb-4 flex items-center gap-2">
                <span className="w-3.5 h-0.5 bg-ap-accent rounded" />
                Values-Aligned Performance · Jake Sebok
              </p>
              <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1e3055] leading-[0.93] tracking-tight mb-6">
                Stop building
                <br />
                <span className="text-ap-accent">someone else&apos;s</span>
                <br />
                success.
              </h1>
              <p className="font-semibold text-base text-ap-mid leading-relaxed mb-6">
                You don&apos;t have a discipline problem. You have an alignment problem. This isn&apos;t &ldquo;peak performance&rdquo;—peaks imply valleys. This is sustainable high performance, fueled by what you actually want—not what you think you should want.
              </p>
              {/* Quote above CTAs */}
              <div className="space-y-4 mb-8">
                <div className="w-10 h-0.5 bg-ap-accent/40 rounded" />
                <p className="font-semibold italic text-xl text-ap-primary leading-snug">
                  &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you actually&nbsp;are.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-ap-accent/30 flex-shrink-0">
                    <Image
                      src="/images/jake/MMC Profile.jpeg"
                      alt="Jake Sebok"
                      fill
                      className="object-cover"
                      sizes="64px"
                      priority
                    />
                  </div>
                  <p className="text-sm text-ap-mid">— Jake Sebok, MCPC</p>
                </div>
              </div>
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
            {/* Right column — Jake image on orange */}
            <div className="hidden lg:flex justify-end items-center">
              <div className="relative w-72 h-80 rounded-[20px] overflow-hidden shadow-xl ring-2 ring-white/20">
                <Image
                  src="/images/jake/MMC Profile.jpeg"
                  alt="Jake Sebok"
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Trusted By — full-width chip, then 6 items */}
        <div className="relative z-10 w-full border-t-2 border-ap-accent bg-white">
          <div className="px-4 py-3 sm:py-4 text-center border-b border-ap-border">
            <span className="font-semibold text-ap-muted text-xs sm:text-base uppercase tracking-wider">Trusted by</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 border-t-0 border-ap-border">
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex items-center justify-center">
              <span className="font-semibold text-ap-primary text-xs sm:text-base">Doctors</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex items-center justify-center">
              <span className="font-semibold text-ap-primary text-xs sm:text-base">Coaches</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex items-center justify-center">
              <span className="font-semibold text-ap-primary text-xs sm:text-base">Healers</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex items-center justify-center">
              <span className="font-semibold text-ap-primary text-xs sm:text-base">Bodyworkers</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex items-center justify-center">
              <span className="font-semibold text-ap-primary text-xs sm:text-base">Creators</span>
            </div>
            <div className="px-4 py-3 sm:py-5 sm:px-6 text-center flex items-center justify-center">
              <span className="font-semibold text-ap-primary text-xs sm:text-base">Entrepreneurs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Empathy — pain-accentuating, gap-identifying */}
      <section className="py-20 sm:py-28 bg-ap-bg">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            The Cost of Success
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            From the outside, it looks like success. But you know the <span className="text-ap-accent">cost</span>.
          </h2>
          <p className="text-ap-mid mb-12 max-w-2xl">
            For impact-driven founders who are done white-knuckling their way to the next level—does this sound familiar?
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-ap-mid/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ap-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">
                The Grind
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                You&apos;re the bottleneck. Strategist, doer, fixer—all of it. You tell yourself it&apos;s temporary, but it&apos;s been &ldquo;temporary&rdquo; for years. The business runs on you, and you&apos;re running on fumes.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-ap-mid/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ap-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">
                The Guilt
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                At work, you&apos;re thinking about your family. With your family, you&apos;re thinking about work. You&apos;re never fully anywhere—and the guilt is loud at 2am. The business is bleeding into the life you built it for.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-ap-mid/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ap-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">
                The Loop
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Plan. Start. Stall. Repeat. You know exactly what to do. You just can&apos;t make yourself do it—and you&apos;ve tried the discipline fixes. They didn&apos;t stick.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* The Reframe — alignment, not discipline */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            Here&apos;s the Truth
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
            You don&apos;t have a strategy problem. Or a discipline problem.
            <br className="hidden lg:block" />
            You have an <span className="text-ap-accent">alignment</span> problem.
          </h2>
          <p className="text-ap-mid text-lg leading-relaxed mb-8 max-w-2xl">
            Your business might be growing—but it&apos;s growing in a direction that quietly conflicts with what you actually want. And when success competes with your true values, your body treats growth like a threat. It slams on the brakes. The cycle repeats: overthinking, overworking, under-fulfillment. Burnout.
          </p>
          <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 sm:p-10 mb-8">
            <p className="text-ap-mid text-lg leading-relaxed">
              But when what you&apos;re building matches who you actually are, execution stops being a war with yourself. Decisions get clean. Energy comes back. Growth becomes repeatable, not accidental. I help impact-driven leaders end that war so their business scales their income and their impact—and supports a life they&apos;re excited to wake up to every morning.
            </p>
          </div>
          <p className="font-semibold text-xl text-ap-primary">
            That&apos;s the work—and here&apos;s how we get there.
          </p>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* The Work — solution */}
      <section className="py-20 sm:py-28 bg-ap-bg">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            The Work
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            Don&apos;t optimize for output. Optimize for <span className="text-ap-accent">alignment</span>.
          </h2>
          <p className="text-ap-mid mb-12 max-w-2xl">
            It doesn&apos;t have to stay this way. Awareness, Internal Alignment, and Embodied Execution—the path from the <span className="text-ap-accent">cage</span> to the life you actually want.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-ap-mid/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ap-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">
                Awareness
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Know exactly what&apos;s holding you back—and the path to get there. No more wondering which step to take next. No more wasting energy on strategies that won&apos;t work. You&apos;ll know which move leads where you want to go.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-ap-mid/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ap-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">
                Internal Alignment
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Turn self-sabotage into momentum. Identify your blocks and turn them into allies. This is the moment we pour rocket fuel on your business—lowering your defenses and amplifying your output.
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-ap-mid/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-ap-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">
                Embodied Execution
              </h3>
              <p className="text-ap-mid text-sm leading-relaxed">
                Live the dream you identified. Be the person you want to be. Your average Tuesday becomes something the current version of you would look forward to—not tolerate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Have it all — reject the trade-off */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-xl">
                <Image
                  src="/images/jake/jake-and-son.png"
                  alt="Jake Sebok with his son"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
                You Don&apos;t Have to Choose
              </p>
              <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
                Have it all. <span className="text-ap-accent">Really.</span>
              </h2>
              <p className="text-ap-mid text-lg leading-relaxed mb-6">
                Some say you&apos;ll have to miss ball games and dance recitals to build something big. I reject that. You shouldn&apos;t have to compromise what you actually care about—what actually matters to you—to build a business that&apos;s supposed to support your life.
              </p>
              <p className="text-ap-mid text-lg leading-relaxed mb-6">
                When you fuel yourself with what you actually value, success stops being a threat. You end the war between your work and your life. And you start moving forward with greater enthusiasm—because you&apos;re no longer fighting yourself.
              </p>
              <p className="font-semibold text-lg text-ap-primary">
                No trade-offs. The work we do together is built on that belief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Outcomes — by the end of our work together */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            The Outcome
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            By the end of our work together, you will:
          </h2>
          <p className="text-ap-mid mb-8 max-w-2xl">
            Not a list of tactics. A fundamental shift in how you run your business and your life.
          </p>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch mb-12">
            <div className="lg:col-span-8 order-1">
          <div className="space-y-6">
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">Extreme clarity about WHAT you&apos;re building and WHY</h3>
                <p className="text-ap-mid text-sm leading-relaxed">So you stop chasing opportunities that drain you and start making moves that compound.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">Clarity on your greatest constraints and the single most valuable levers to pull</h3>
                <p className="text-ap-mid text-sm leading-relaxed">To make everything else easier or unnecessary.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">Trust in yourself to execute consistently on a plan you believe in</h3>
                <p className="text-ap-mid text-sm leading-relaxed">No forcing it with willpower.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">A business that supports your life instead of consuming it</h3>
                <p className="text-ap-mid text-sm leading-relaxed">With real boundaries and a calendar that breathes.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">Healthier, sharper, and more energized than you have in years</h3>
                <p className="text-ap-mid text-sm leading-relaxed">Because you&apos;re finally doing the work only YOU can do.</p>
              </div>
            </div>
          </div>
            </div>
            <div className="hidden lg:block lg:col-span-4 order-2">
              <div className="relative h-full min-h-[480px] rounded-[20px] overflow-hidden shadow-xl">
                <Image
                  src="/images/jake/jake-ideal-end-state.png"
                  alt="Jake Sebok"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p className="text-ap-mid text-sm mb-4">Ready to see where you stand?</p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Link
                href="/assessment"
                className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-xs tracking-wider px-6 py-3 rounded-pill transition-all"
              >
                Take the VAPI™
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-ap-muted text-sm">or</span>
              <Link
                href="/work-with-me"
                className="text-ap-accent font-semibold text-sm hover:underline"
              >
                explore how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Testimonials — carousel */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            What People Say
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            What happens when alignment replaces the grind.
          </h2>
        </div>
        <div className="px-5 sm:px-6 lg:w-screen lg:relative lg:left-1/2 lg:-ml-[50vw] lg:px-6">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="mt-8 text-center">
            <Link
              href="/case-studies"
              className="text-ap-accent font-semibold text-sm hover:underline"
            >
              Read Marshall&apos;s story — from dreading work to excited every day →
            </Link>
          </div>
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
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8 opacity-90">
                <Image src="/images/certifications/icf.png" alt="International Coaching Federation" width={100} height={40} className="h-8 w-auto object-contain" />
                <Image src="/images/certifications/cplc.png" alt="Certified Professional Life Coach" width={56} height={56} className="h-10 w-auto object-contain" />
                <Image src="/images/certifications/mcpc.png" alt="Master Certified Professional Coach" width={56} height={56} className="h-10 w-auto object-contain" />
              </div>
              <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-6">
                Ready to stop building the <span className="text-ap-accent">cage</span>?
              </h2>
              <p className="text-ap-muted text-lg max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. 72 questions. ~12 minutes.
                An honest snapshot of where you stand across 12 domains.
                <span className="block mt-2 text-white/90 font-medium">Free. No payment required.</span>
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
