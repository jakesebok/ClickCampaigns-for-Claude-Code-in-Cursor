import Link from "next/link";
import Image from "next/image";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { SocialLinks } from "@/components/SocialLinks";
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
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
                <span className="lg:flex lg:items-center lg:gap-2">
                  <span className="hidden lg:block w-3.5 h-0.5 bg-ap-accent rounded flex-shrink-0" />
                  <span>Values-Aligned Performance</span>
                  <span className="block lg:inline lg:before:content-['_·_']">
                    <span className="lg:hidden">with Jake Sebok</span>
                    <span className="hidden lg:inline">Jake Sebok</span>
                  </span>
                </span>
              </p>
              <h1 className="font-outfit font-extrabold text-5xl sm:text-5xl lg:text-6xl text-[#1e3055] leading-[0.93] tracking-tight mb-6">
                Stop building
                <br />
                <span className="text-[#1e3055] sm:hidden">someone else&apos;s</span>
                <span className="hidden sm:inline text-gradient-accent">someone else&apos;s</span>
                <br />
                success.
              </h1>
              <p className="font-semibold text-xl text-ap-mid leading-relaxed mb-8">
                Inconsistent execution and low motivation aren&apos;t proof you need to grind harder. They&apos;re signs you&apos;re building the wrong thing. When what you build matches who you are, effort becomes momentum and your impact finally catches up to your ambition.
              </p>
              <div className="flex flex-wrap gap-3 items-stretch">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all min-w-[220px]"
                >
                  Take the VAPI™
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-pill border-[1.5px] border-ap-border text-ap-primary font-semibold text-base tracking-wider hover:border-ap-accent hover:text-gradient-accent transition-all min-w-[220px]"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            {/* Right column — quote on orange (desktop only) */}
            <div className="hidden lg:flex items-center justify-end">
              <div className="space-y-4 max-w-[280px] text-right">
                <div className="w-10 h-0.5 bg-white/35 ml-auto" />
                <p className="font-semibold italic text-xl text-white leading-snug">
                  &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you naturally&nbsp;are.&rdquo;
                </p>
                <div className="flex items-center justify-end gap-3">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/30 flex-shrink-0">
                    <Image
                      src="/images/jake/MMC Profile.jpeg"
                      alt="Jake Sebok"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <p className="text-sm text-white/65">— Jake Sebok, MCPC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Trusted By strip — single row on desktop; full-width label + 6 chips on mobile */}
        <div className="relative z-10 w-full border-t-2 border-ap-accent bg-white">
          {/* Mobile: Trusted by full width, then 6 chips */}
          <div className="lg:hidden">
            <div className="px-4 py-3 text-center border-b border-ap-border w-full">
              <span className="font-semibold text-ap-muted text-xs uppercase tracking-wider">Trusted by</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 [&>*:nth-child(2n)]:border-r-0 [&>*:nth-child(n+5)]:border-b-0">
              {["Doctors", "Coaches", "Healers", "Bodyworkers", "Creators", "Founders"].map((label) => (
                <div key={label} className="px-4 py-3 text-center border-b border-r border-ap-border">
                  <span className="font-semibold text-ap-primary text-xs sm:text-base">{label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: single row */}
          <div className="hidden lg:flex flex-wrap w-full">
            <div className="px-6 py-5 text-center border-r border-ap-border flex-1 min-w-0">
              <span className="font-semibold text-ap-muted text-base uppercase tracking-wider">Trusted by</span>
            </div>
            <div className="px-6 py-5 text-center border-r border-ap-border flex-1 min-w-0">
              <span className="font-semibold text-ap-primary text-base">Doctors</span>
            </div>
            <div className="px-6 py-5 text-center border-r border-ap-border flex-1 min-w-0">
              <span className="font-semibold text-ap-primary text-base">Coaches</span>
            </div>
            <div className="px-6 py-5 text-center border-r border-ap-border flex-1 min-w-0">
              <span className="font-semibold text-ap-primary text-base">Healers</span>
            </div>
            <div className="px-6 py-5 text-center border-r border-ap-border flex-1 min-w-0">
              <span className="font-semibold text-ap-primary text-base">Bodyworkers</span>
            </div>
            <div className="px-6 py-5 text-center flex-1 min-w-0">
              <span className="font-semibold text-ap-primary text-base">Creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Empathy — pain-accentuating, gap-identifying */}
      <section className="py-20 sm:py-28 bg-ap-bg">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Cost of Success
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            From the outside, it looks like success. But you know the <span className="text-gradient-accent">cost</span>.
          </h2>
          <div className="mb-12 max-w-2xl">
            <p className="text-ap-mid text-xl font-semibold md:whitespace-nowrap">
              For impact-driven founders who are done white-knuckling their way to the next level.
            </p>
            <h3 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mt-4">
              Does this sound familiar?
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                You&apos;re the bottleneck. Strategist, doer, fixer, all of it. You tell yourself it&apos;s temporary, but it&apos;s been &ldquo;temporary&rdquo; for years. The business runs on you, and you&apos;re running on fumes.
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
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                At work, you&apos;re thinking about your family. With your family, you&apos;re thinking about work. You&apos;re never fully anywhere, and the guilt is loud at 2am. The business is bleeding into the life you built it for.
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
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Plan. Start. Stall. Repeat. You know exactly what to do. You just can&apos;t make yourself do it. You&apos;ve tried the discipline fixes. They didn&apos;t stick.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Quote + thumbnail — mobile only, between Cost of Success and The Truth */}
      <div className="lg:hidden relative z-10 bg-ap-primary border-t border-ap-border px-5 py-8">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-10 h-0.5 bg-white/40 rounded" />
          <p className="font-semibold italic text-xl text-white leading-snug">
            &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you naturally&nbsp;are.&rdquo;
          </p>
          <div className="flex items-center gap-3 justify-end sm:justify-start">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/30 flex-shrink-0">
              <Image
                src="/images/jake/MMC Profile.jpeg"
                alt="Jake Sebok"
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            </div>
            <p className="text-sm text-white/80">— Jake Sebok, MCPC</p>
          </div>
        </div>
      </div>

      {/* The Reframe — alignment, not discipline */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Truth
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
            It isn&apos;t a strategy problem. It&apos;s not even a discipline problem. It&apos;s an <span className="text-gradient-accent">alignment</span> problem.
          </h2>
          <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-8 max-w-2xl">
            Your business might be growing, but it&apos;s growing in a direction that quietly conflicts with what you actually want. And when success competes with your true values, your body treats growth like a threat. It slams on the brakes. The cycle repeats: overthinking, overworking, under-fulfillment. Burnout.
          </p>
          <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 sm:p-10 mb-8">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-ap-primary/35 font-bold leading-snug mb-6 tracking-tight">
              But when what you&apos;re building matches who you actually are, <span className="text-gradient-accent">execution stops being a war</span> with yourself.
            </p>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed">
              Decisions get clean. Energy comes back. Growth becomes repeatable, not accidental. I help impact-driven leaders end that war so their business scales their income and their impact, and supports a life they&apos;re excited to wake up to every morning.
            </p>
          </div>
        </div>
      </section>

      {/* The Work — solution */}
      <section className="py-20 sm:py-28 bg-ap-bg">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Work
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            Optimize for <span className="text-gradient-accent">alignment</span>, not output.
          </h2>
          <p className="text-ap-mid text-xl font-semibold mb-12 max-w-2xl">
            More effort won&apos;t fix it. More strategy won&apos;t either. When your mind, your body, and your direction aren&apos;t working together, effort becomes resistance. That changes here. Take your first steps on the path from the <span className="text-gradient-accent">cage</span> to the life you actually want.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Know exactly what&apos;s holding you back and the path to get where you want to go. No more wondering which step to take next. No more wasting energy on strategies that won&apos;t work. You&apos;ll know exactly which moves will make the difference.
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
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Turn self-sabotage into momentum. Identify your blocks and turn them into allies. This is the moment we pour rocket fuel on your business, lowering your defenses and amplifying your output.
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
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Live the dream you identified. Be the person you want to be. Your average Tuesday becomes something the current version of you would dream of.
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
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
                You Don&apos;t Have to Choose
              </p>
              <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
                Have it all. <span className="text-gradient-accent">Really.</span>
              </h2>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-6">
                Stop chasing the carrot at the end of the stick when what you really wanted was the apple that&apos;s right in front of you.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-6">
                Some say you&apos;ll have to miss ball games and dance recitals to build something big. I reject that. You shouldn&apos;t have to compromise what you actually care about, what actually matters to you, to build a business that&apos;s supposed to support your life.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-6">
                When you fuel yourself with what you actually value, success stops being a threat. You end the war between your work and your life. And you start moving forward with greater enthusiasm, <span className="text-gradient-accent font-semibold">because you&apos;re no longer fighting yourself.</span>
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

      {/* Testimonials — carousel (full width) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            What People Say
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            What happens when alignment replaces the grind.
          </h2>
        </div>
        <div className="w-full overflow-hidden">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="mt-8 text-center">
            <Link
              href="/client-stories"
              className="inline-flex items-center gap-2 text-gradient-accent font-semibold text-base border-2 border-ap-accent/50 hover:border-ap-accent hover:bg-ap-accent/5 px-6 py-3 rounded-pill transition-all"
            >
              Read Marshall&apos;s story: from dreading work to excited every day
              <svg className="w-4 h-4 flex-shrink-0 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* How to Get Started — three steps, full lane */}
      <section className="relative py-20 sm:py-28 bg-ap-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ap-primary via-ap-primary-2 to-ap-primary" aria-hidden />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-ap-accent" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ap-accent" aria-hidden />
        <div className="relative max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            How to Get Started
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-6">
            Three steps. <span className="text-gradient-accent">Your pace.</span>
          </h2>
          <p className="text-white/80 text-lg font-semibold max-w-2xl mb-8">
            Start with the free assessment. Get clarity. Then choose your path.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-ap-accent/40 hover:bg-white/[0.08] transition-all">
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ap-accent flex items-center justify-center font-outfit font-bold text-xl text-white shadow-lg shadow-ap-accent/40">1</div>
                <h3 className="font-outfit font-semibold text-lg text-white pb-0.5">Take the VAPI™</h3>
              </div>
              <p className="text-white/75 text-base font-medium leading-relaxed">The VAPI™ measures your experience across 12 life and business domains. 72 statements, ~12 minutes. You get your Founder Archetype, your pattern driver, and a clear picture of where you&apos;re strong and where to focus next—with a personalized 28-day My Plan when you use the same email as your free portal or ALFRED account.</p>
            </div>
            <div className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-ap-accent/40 hover:bg-white/[0.08] transition-all">
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ap-accent flex items-center justify-center font-outfit font-bold text-xl text-white shadow-lg shadow-ap-accent/40">2</div>
                <h3 className="font-outfit font-semibold text-lg text-white pb-0.5">Get your results</h3>
              </div>
              <p className="text-white/75 text-base font-medium leading-relaxed">Scores for every domain, your full Founder Archetype profile, your pattern driver, and your top three priorities—plus your 28-day My Plan (same email as portal or ALFRED). Tailored to your pattern—no generic advice. Save as PDF or retake over time to track progress.</p>
            </div>
            <div className="group flex flex-col p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-ap-accent/40 hover:bg-white/[0.08] transition-all">
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ap-accent flex items-center justify-center font-outfit font-bold text-xl text-white shadow-lg shadow-ap-accent/40">3</div>
                <h3 className="font-outfit font-semibold text-lg text-white pb-0.5">Take Action</h3>
              </div>
              <p className="text-white/75 text-base font-medium leading-relaxed">Workshops, community, intensives, group coaching. Many entry points—from low-commitment to high-touch. Find the right fit for where you are.</p>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/assessment"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
            >
              Take the VAPI™
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Orange rule */}
      <div className="h-0.5 bg-ap-accent" />

      {/* Outcomes — by the end of our work together */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Outcome
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch mb-12">
            <div className="lg:col-span-7 order-1 flex flex-col">
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            By the end of our work together, you will have:
          </h2>
          <p className="text-ap-mid text-xl font-semibold mb-8 max-w-2xl">
            Not a list of tactics. A fundamental shift in how you run your business and your life.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">Extreme clarity about WHAT you&apos;re building and WHY</h3>
                <p className="text-ap-mid text-xl font-semibold leading-relaxed">So you stop chasing opportunities that drain you and start making moves that compound.</p>
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
                <p className="text-ap-mid text-xl font-semibold leading-relaxed">To make everything else easier or unnecessary.</p>
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
                <p className="text-ap-mid text-xl font-semibold leading-relaxed">No forcing it with willpower.</p>
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
                <p className="text-ap-mid text-xl font-semibold leading-relaxed">With real boundaries and a calendar that breathes.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ap-accent/15 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">Energy and vitality you haven&apos;t felt in years</h3>
                <p className="text-ap-mid text-xl font-semibold leading-relaxed">Because you&apos;re finally doing the work only YOU can do.</p>
              </div>
            </div>
          </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 order-2 self-stretch xl:translate-x-[calc(50vw-540px-1.5rem)]">
              <div className="relative aspect-[4/5] rounded-l-[20px] overflow-hidden shadow-xl">
                <Image
                  src="/images/jake/jake-ideal-end-state.png"
                  alt="Jake Sebok"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
          {/* Is it worth it? — client outcomes (no unfounded stats) */}
          <div className="mb-12 p-8 sm:p-10 bg-ap-bg rounded-[20px] border border-ap-border">
            <p className="font-outfit font-semibold text-ap-primary mb-6">In the first 30 days, clients report:</p>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <span className="text-ap-accent mt-1">•</span>
                <span className="text-ap-mid text-lg font-semibold">Significantly greater clarity and confidence about what they&apos;re building and why</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-ap-accent mt-1">•</span>
                <span className="text-ap-mid text-lg font-semibold">Feeling less overwhelmed and more intentional</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-ap-accent mt-1">•</span>
                <span className="text-ap-mid text-lg font-semibold">Taking more productive action that directly impacts their bottom line</span>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <p className="text-ap-mid text-xl font-semibold mb-4">Ready to see where you stand?</p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Link
                href="/assessment"
                className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
              >
                Take the VAPI™
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-ap-muted text-sm">or</span>
              <Link
                href="/work-with-me"
                className="text-gradient-accent font-semibold text-sm hover:underline"
              >
                explore how it works
              </Link>
            </div>
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
                Ready to stop building the <span className="text-gradient-accent">cage</span>?
              </h2>
              <p className="text-ap-muted text-xl font-semibold max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. 72 questions. ~12 minutes.
                Discover your Founder Archetype, pattern driver, and where you stand across 12 domains—with a personalized 28-day My Plan when you use the same email as your portal or ALFRED account.
                <span className="block mt-2 text-white/90 font-medium">Free. No payment required.</span>
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
                >
                  Take the VAPI™
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center px-8 py-4 rounded-pill border-[1.5px] border-white/60 text-white font-semibold text-base tracking-wider hover:bg-white/10 transition-all"
                >
                  See All Offerings
                </Link>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20 text-center">
                <p className="text-sm font-semibold text-white/80 mb-3">Follow along</p>
                <SocialLinks variant="footer" className="justify-center [&_a]:text-white/70 [&_a:hover]:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
