import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { SocialLinks } from "@/components/SocialLinks";
import { EditorialFAQ } from "@/components/EditorialFAQ";
import { testimonials } from "@/lib/testimonials";
import {
  homeSchemaGraph,
  breadcrumbList,
  faqSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Growth and Performance Coaching for Entrepreneurs | Jake Sebok",
  description:
    "Master Certified Coach Jake Sebok helps founders build businesses that scale income, impact, and life. Start with the free VAPI™ assessment.",
  alternates: {
    canonical: "https://jakesebok.com/",
  },
  openGraph: {
    title: "Growth and Performance Coaching for Entrepreneurs | Jake Sebok",
    description:
      "Master Certified Coach Jake Sebok helps founders build businesses that scale income, impact, and life. Start with the free VAPI™ assessment.",
    url: "https://jakesebok.com/",
    type: "website",
  },
};

/**
 * Wave 6 (SEO/AEO deep audit) consolidated all home-page schemas into the
 * shared graph in `lib/schema.ts`. The FAQPage schema below mirrors the
 * exact questions and answers rendered in the EditorialFAQ component, so AI
 * engines can quote them verbatim.
 */
const homeFaqSchema = faqSchema([
  {
    question: "Is the VAPI™ actually free, or is this a soft sell?",
    answer:
      "Free. No card, no upsell wall. You take 72 statements, see your scores across 12 domains, and get a personalized 28-day plan to act on the result. Use the same email as your portal or ALFRED account to unlock the plan. If, after seeing your map, you want to talk about the 12-month program, you apply. If not, you keep the plan.",
  },
  {
    question: "Who is the Aligned Power Program actually for?",
    answer:
      "Founders who have already proven they can build, and now want to do it without paying for the growth with their health, their family, or their sense of self. Impact-driven, values-aligned, done with the grind. It is not for people looking for a tactical playbook, a quick mindset hack, or a group program. It is 1:1, customized, application-only, and a real commitment on both sides.",
  },
  {
    question:
      "Why is this application-based instead of just letting me book a call?",
    answer:
      "Two reasons. First, my calendar is finite, so I want the time we spend together to land on the right fit, not on a sales conversation we both regret. Second, the application itself is diagnostic. It tells me where you are stuck, what you have tried, and what you are willing to change. I read every one personally. If we are a fit, I respond with the next step. If we are not, I tell you why and where you might be better served.",
  },
  {
    question:
      "How is this different from the executive-coach pages I keep seeing?",
    answer:
      "Most coaching pages stack adjectives. World-class, transformational, master-certified. I have the credentials, but the work is not in the brochure language. It is in how we look at the parts of your business that you have been quietly avoiding, and the parts of your life you have been paying with to keep the business alive. You can also try ALFRED, the app I built so the clarity from our work travels with you into the hard weeks.",
  },
  {
    question: "What does the first 30 days actually look like?",
    answer:
      "You take the VAPI™ and we use your map to choose the first three places to focus. We meet 1:1 in deep-work sessions, and I am available between sessions for the moments that do not wait for the calendar. Most clients describe the first month as clearer priorities, less reactive execution, and a noticeable drop in inner conflict. The goal is not a list of tactics. It is a fundamental shift in how you run the business and how you carry yourself inside it.",
  },
]);

const homeBreadcrumb = breadcrumbList([{ name: "Home", path: "/" }]);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchemaGraph()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumb) }}
      />

      <section className="relative min-h-[85vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-ap-bg" />
        <div
          className="hidden lg:block absolute top-0 right-0 w-[42%] h-full bg-ap-accent"
          style={{ clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        <div
          className="hidden lg:block absolute bottom-0 right-0 w-[22%] h-[38%] bg-ap-accent-2 opacity-60"
          style={{ clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        <div className="lg:hidden absolute top-0 inset-x-0 h-[40%] bg-gradient-to-br from-ap-accent/12 via-ap-accent/4 to-transparent" aria-hidden />
        <span className="absolute top-[120px] right-[15%] z-20 font-cormorant font-bold italic text-[clamp(72px,9vw,140px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Alive.
        </span>
        <span className="absolute top-[58%] right-[22%] -translate-y-1/2 z-20 font-cormorant font-bold italic text-[clamp(72px,9vw,140px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Free.
        </span>
        <span className="absolute bottom-[140px] right-[8%] z-20 font-cormorant font-bold italic text-[clamp(72px,9vw,140px)] leading-[0.9] text-white/[0.04] select-none pointer-events-none tracking-tight hidden lg:inline">
          Clear.
        </span>
        <div className="relative z-10 flex-1 flex items-center max-w-[1080px] mx-auto px-5 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-12">
          <div className="grid lg:grid-cols-[1.55fr_1fr] gap-12 lg:gap-16 items-center w-full">
            <div className="max-w-2xl hero-halo">
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
              <h1 className="font-outfit font-extrabold text-[2.375rem] sm:text-5xl lg:text-6xl text-[#1e3055] leading-[1.02] sm:leading-[0.96] tracking-tight mb-6 [text-wrap:balance]">
                Build a business that scales your income, your impact, and{" "}
                <br className="hidden lg:inline" />
                <span className="text-gradient-accent">
                  your{" "}
                  <em className="font-cormorant italic font-semibold tracking-tight">life</em>.
                </span>
              </h1>
              <p className="font-semibold text-xl text-ap-mid leading-relaxed mb-8">
                You want clearer decisions, stronger execution, more energy, and a business that supports the life it
                was meant to fund. For founders who want more growth without shrinking the rest of life to make it
                happen.
              </p>
              <div className="flex flex-wrap gap-3 items-stretch">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-6 sm:px-8 py-4 rounded-pill transition-all sm:min-w-[240px]"
                >
                  Take the VAPI&trade;
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-4 rounded-pill border-[1.5px] border-ap-border text-ap-primary font-semibold text-base tracking-wider hover:border-ap-accent hover:text-gradient-accent transition-all sm:min-w-[200px]"
                >
                  See how we work
                </Link>
              </div>
              <p className="hero-cta-trust mt-4 font-outfit text-[13px] sm:text-sm font-semibold text-ap-mid">
                <span className="hero-cta-trust__chip" aria-hidden />
                <span>
                  Free. 12 minutes. <span className="text-ap-muted">For founders ready to invest in 12-month, application-based coaching.</span>
                </span>
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-end">
              <div className="founder-quote glass-card space-y-4 max-w-[280px] text-right">
                <div className="w-10 h-0.5 bg-white/35 ml-auto" />
                <p className="font-semibold italic text-xl text-white leading-snug translate-x-[28px]">
                  &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you
                  naturally&nbsp;are.&rdquo;
                </p>
                <div className="flex items-center justify-end gap-3 -translate-y-1.5">
                  <div className="framed-image framed-image--on-dark relative w-32 h-32 rounded-full ring-2 ring-white/30 flex-shrink-0 -translate-x-2 -translate-y-2">
                    <Image
                      src="/images/jake/MMC Profile.jpeg"
                      alt="Jake Sebok, Master Certified Professional Coach, head-and-shoulders portrait in warm light"
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                  <p className="text-sm text-white/65">Jake Sebok, MCPC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 w-full border-t-2 border-ap-accent bg-white">
          <div className="lg:hidden">
            <div className="px-4 py-3 text-center border-b border-ap-border w-full">
              <span className="font-semibold text-ap-muted text-[11px] uppercase tracking-[0.22em]">
                Trusted by
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 [&>*:nth-child(2n)]:border-r-0 [&>*:nth-child(n+5)]:border-b-0">
              {["Doctors", "Coaches", "Healers", "Bodyworkers", "Creators", "Founders"].map((label) => (
                <div key={label} className="audience-card px-4 py-3 text-center border-b border-r border-ap-border">
                  <span className="audience-card__label font-semibold text-ap-primary text-[15px] sm:text-base">{label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: continuous trust marquee with accent dots. Pauses on hover.
              Track is doubled for seamless scroll. The eyebrow label sits in the
              same track so it reads as one continuous editorial line. */}
          <div className="hidden lg:block trust-marquee py-5" aria-label="Trusted by Doctors, Coaches, Healers, Bodyworkers, Creators, Founders">
            <div className="trust-marquee__track" aria-hidden="false">
              <span className="trust-marquee__item trust-marquee__item--label">Trusted by</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Doctors</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Coaches</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Healers</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Bodyworkers</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Creators</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Founders</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
            </div>
            <div className="trust-marquee__track" aria-hidden="true">
              <span className="trust-marquee__item trust-marquee__item--label">Trusted by</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Doctors</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Coaches</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Healers</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Bodyworkers</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Creators</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
              <span className="trust-marquee__item">Founders</span>
              <span className="trust-marquee__dot" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <section className="py-20 sm:py-28 bg-ap-bg" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Cost of Success
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            From the outside, it looks like success. But you know the <span className="text-gradient-accent">cost</span>.
          </h2>
          <div className="mb-12 max-w-2xl">
            <p className="text-ap-mid text-xl font-semibold md:whitespace-nowrap">
              For impact-driven founders who are done with growth that costs too much.
            </p>
            <h3 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mt-4">Does this sound familiar?</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lift-card bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50">
              <div className="icon-circle w-14 h-14 mb-6 [border-radius:16px]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">The Grind</h3>
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                You&apos;re the bottleneck. Strategist, doer, fixer, all of it. You tell yourself it&apos;s temporary,
                but it&apos;s been &ldquo;temporary&rdquo; for years. The business runs on you, and you&apos;re running
                on fumes.
              </p>
            </div>
            <div className="lift-card bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50">
              <div className="icon-circle w-14 h-14 mb-6 [border-radius:16px]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">The Guilt</h3>
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                At work, you&apos;re thinking about your family. With your family, you&apos;re thinking about work.
                You&apos;re never fully anywhere, and the guilt is loud at 2am. The business is bleeding into the life
                you built it for.
              </p>
            </div>
            <div className="lift-card bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50">
              <div className="icon-circle w-14 h-14 mb-6 [border-radius:16px]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">The Loop</h3>
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Plan. Start. Stall. Repeat. You know exactly what to do. You just can&apos;t make yourself do it.
                You&apos;ve tried the discipline fixes. They didn&apos;t stick.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <div className="lg:hidden relative z-10 bg-ap-primary border-t border-ap-border px-5 py-8">
        <div className="founder-quote glass-card max-w-xl mx-auto space-y-4">
          <div className="w-10 h-0.5 bg-white/40 rounded" />
          <p className="font-semibold italic text-xl text-white leading-snug">
            &ldquo;Your business shouldn&apos;t be a beautiful prison. It should be the best expression of who you naturally&nbsp;are.&rdquo;
          </p>
          <div className="flex items-center gap-3 justify-end sm:justify-start">
            <div className="framed-image framed-image--on-dark relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-white/30 flex-shrink-0">
              <Image
                src="/images/jake/MMC Profile.jpeg"
                alt="Jake Sebok, Master Certified Professional Coach, head-and-shoulders portrait in warm light"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <p className="text-sm text-white/80">Jake Sebok, MCPC</p>
          </div>
        </div>
      </div>

      <section className="py-20 sm:py-28 bg-white" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Truth
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
            If discipline were the answer, you would already be there. The real problem is{" "}
            <span className="text-gradient-accent">alignment</span>.
          </h2>
          <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-8 max-w-2xl">
            Maybe your business is growing, but it&apos;s growing in a direction that quietly conflicts with what you
            actually want. When success competes with your true values, your body treats growth like a threat. It hits
            the brakes. The cycle repeats: overthinking, overworking, under-fulfillment. Burnout.
          </p>
          <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 sm:p-10 mb-8">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-ap-primary/35 font-bold leading-snug mb-6 tracking-tight">
              But when what you&apos;re building matches who you actually are,{" "}
              <span className="text-gradient-accent">execution stops being a war</span> with yourself.
            </p>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed">
              Decisions get clean. Energy comes back. Growth becomes repeatable, not accidental. I help impact-driven
              leaders end that war so their business scales their income and their impact, and supports a life
              they&apos;re excited to wake up to every morning.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-ap-bg" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            The Work
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            Optimize for <span className="text-gradient-accent">alignment</span>, not output.
          </h2>
          <p className="text-ap-mid text-xl font-semibold mb-12 max-w-2xl">
            More effort won&apos;t fix it. More strategy won&apos;t either. When your mind, your body, and your
            direction aren&apos;t working together, effort becomes resistance. That changes here. Take your first steps
            on the path from the <span className="text-gradient-accent">cage</span> to the life you actually want.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lift-card bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50">
              <div className="icon-circle w-14 h-14 mb-6 [border-radius:16px]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">See the real bottleneck</h3>
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Get clear on what is draining energy, where your business is fighting your life, and which next move
                actually matters. No more guessing. No more solving the wrong problem.
              </p>
            </div>
            <div className="lift-card bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50">
              <div className="icon-circle w-14 h-14 mb-6 [border-radius:16px]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">End the inner split</h3>
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                When one part of you wants growth and another part does not trust the cost, execution gets weird. We
                bring that conflict into the open so momentum stops leaking.
              </p>
            </div>
            <div className="lift-card bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50">
              <div className="icon-circle w-14 h-14 mb-6 [border-radius:16px]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3 className="font-outfit font-semibold text-lg text-ap-primary mb-3">Build a week you can hold</h3>
              <p className="text-ap-mid text-base font-medium leading-relaxed">
                Turn clarity into calendars, decisions, and commitments you can actually keep. No heroic Tuesday
                followed by a collapse on Thursday.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <section className="py-20 sm:py-28 bg-white" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="hidden lg:block lg:col-span-5">
              <div className="hero-image relative aspect-[4/5]">
                <Image
                  src="/images/jake/jake-and-son.png"
                  alt="Jake Sebok with his son, on a porch in afternoon light"
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
                Too many people will sell you the beautiful prison and call it ambition.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-6">
                I reject that. You should not have to miss ball games, dance recitals, your health, or your peace to
                build something meaningful. The business is supposed to support your life, not quietly eat it.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-6">
                When work fits your real values, success stops feeling like a threat. The war between your business and
                your life quiets down. You move with more energy,{" "}
                <span className="text-gradient-accent font-semibold">
                  because you&apos;re no longer building against yourself.
                </span>
              </p>
              <p className="font-semibold text-lg text-ap-primary">
                No trade-offs. The work we do together is built on that belief.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <section className="py-20 sm:py-28 bg-white" data-reveal>
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

      <div className="h-0.5 bg-ap-accent" />

      <section className="relative py-20 sm:py-28 bg-ap-primary text-white overflow-hidden" data-reveal>
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

          {/* Premium stat row — display-face numerals + accent bar + small-caps label.
              Real numbers only (VAPI architecture + program length). No fabricated
              social proof. Italic Cormorant numerals signal editorial weight. */}
          <div className="stat-row stat-row--four mt-6 mb-10 max-w-[820px]" aria-label="By the numbers">
            <div className="stat-card stat-card--on-dark" data-reveal data-reveal-delay="1">
              <div className="stat-card__numeral stat-card__numeral--accent">12</div>
              <div className="stat-card__label">Domains</div>
              <div className="stat-card__sub">Mapped in the VAPI&trade;</div>
            </div>
            <div className="stat-card stat-card--on-dark" data-reveal data-reveal-delay="2">
              <div className="stat-card__numeral">72</div>
              <div className="stat-card__label">Statements</div>
              <div className="stat-card__sub">Read in about 12 minutes</div>
            </div>
            <div className="stat-card stat-card--on-dark" data-reveal data-reveal-delay="2">
              <div className="stat-card__numeral">28</div>
              <div className="stat-card__label">Day Plan</div>
              <div className="stat-card__sub">Personalized to your scores</div>
            </div>
            <div className="stat-card stat-card--on-dark" data-reveal data-reveal-delay="3">
              <div className="stat-card__numeral stat-card__numeral--accent">12</div>
              <div className="stat-card__label">Month Program</div>
              <div className="stat-card__sub">1:1, by application only</div>
            </div>
          </div>
          <p className="text-white/80 text-lg font-semibold max-w-2xl mb-8">
            Start with the free assessment. Get your map. Then choose the level of support that fits.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lift-card lift-card--on-dark group flex flex-col p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-ap-accent/40 hover:bg-white/[0.08] transition-all">
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ap-accent flex items-center justify-center font-outfit font-bold text-xl text-white shadow-lg shadow-ap-accent/40">
                  1
                </div>
                <h3 className="font-outfit font-semibold text-lg text-white pb-0.5">Take the VAPI&trade;</h3>
              </div>
              <p className="text-white/75 text-base font-medium leading-relaxed">
                72 statements. About 12 minutes. Get a clear read on where you are strong, where you are stretched, and
                what deserves attention next.
              </p>
            </div>
            <div className="lift-card lift-card--on-dark group flex flex-col p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-ap-accent/40 hover:bg-white/[0.08] transition-all">
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ap-accent flex items-center justify-center font-outfit font-bold text-xl text-white shadow-lg shadow-ap-accent/40">
                  2
                </div>
                <h3 className="font-outfit font-semibold text-lg text-white pb-0.5">Get your results</h3>
              </div>
              <p className="text-white/75 text-base font-medium leading-relaxed">
                See your scores, top priorities, and deeper patterns. Use the same email as your portal or ALFRED
                account to unlock your 28-day plan. Save as PDF or retake over time.
              </p>
            </div>
            <div className="lift-card lift-card--on-dark group flex flex-col p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-ap-accent/40 hover:bg-white/[0.08] transition-all">
              <div className="flex gap-4 items-end mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ap-accent flex items-center justify-center font-outfit font-bold text-xl text-white shadow-lg shadow-ap-accent/40">
                  3
                </div>
                <h3 className="font-outfit font-semibold text-lg text-white pb-0.5">Commit to Growth</h3>
              </div>
              <p className="text-white/75 text-base font-medium leading-relaxed">
                Apply for 1:1 coaching in the Aligned Power Program when you&apos;re ready for high-touch, customized
                support that meets you exactly where you are.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              href="/assessment"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
            >
              Take the VAPI&trade;
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="cta-trust cta-trust--on-dark">
              <span className="cta-trust__item cta-trust__item--accent text-white">Free, no card</span>
              <span className="cta-trust__dot" aria-hidden />
              <span className="cta-trust__item">12 minutes</span>
              <span className="cta-trust__dot" aria-hidden />
              <span className="cta-trust__item">28-day plan from your scores</span>
            </div>
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <section className="py-20 sm:py-28 bg-white overflow-hidden" data-reveal>
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
                  <div className="icon-circle flex-shrink-0 w-10 h-10 mt-0.5">
                    <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                      Extreme clarity about WHAT you&apos;re building and WHY
                    </h3>
                    <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                      So you stop chasing opportunities that drain you and start making moves that compound.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="icon-circle flex-shrink-0 w-10 h-10 mt-0.5">
                    <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                      Clarity on your greatest constraints and the single most valuable levers to pull
                    </h3>
                    <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                      To make everything else easier or unnecessary.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="icon-circle flex-shrink-0 w-10 h-10 mt-0.5">
                    <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                      Trust in yourself to execute consistently on a plan you believe in
                    </h3>
                    <p className="text-ap-mid text-xl font-semibold leading-relaxed">No forcing it with willpower.</p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="icon-circle flex-shrink-0 w-10 h-10 mt-0.5">
                    <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                      A business that supports your life instead of consuming it
                    </h3>
                    <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                      With real boundaries and a calendar that breathes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="icon-circle flex-shrink-0 w-10 h-10 mt-0.5">
                    <svg className="w-5 h-5 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                      Energy and vitality you haven&apos;t felt in years
                    </h3>
                    <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                      Because you&apos;re finally doing the work only YOU can do.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-5 order-2 self-stretch items-stretch justify-start">
              <div className="hero-image relative aspect-[4/5] w-full max-w-[min(100%,420px)] [border-radius:20px_0_0_20px]">
                <Image
                  src="/images/jake/jake-ideal-end-state.png"
                  alt="Jake Sebok smiling at the camera, in a quiet bright workspace"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
            </div>
          </div>
          <div className="mb-12 p-8 sm:p-10 bg-ap-bg rounded-[20px] border border-ap-border">
            <p className="font-outfit font-semibold text-ap-primary mb-6">In the first 30 days, clients report:</p>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <span className="text-ap-accent mt-1">&bull;</span>
                <span className="text-ap-mid text-lg font-semibold">
                  Significantly greater clarity and confidence about what they&apos;re building and why
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-ap-accent mt-1">&bull;</span>
                <span className="text-ap-mid text-lg font-semibold">Feeling less overwhelmed and more intentional</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-ap-accent mt-1">&bull;</span>
                <span className="text-ap-mid text-lg font-semibold">
                  Taking more productive action that directly impacts their bottom line
                </span>
              </li>
            </ul>
          </div>

          <div className="terminal-cta mt-10">
            <p className="terminal-cta__line">
              Ready to see <em>where you stand</em>?
            </p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Link
                href="/assessment"
                className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
              >
                Take the VAPI&trade;
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-ap-muted text-sm">or</span>
              <Link href="/work-with-me/apply" className="text-gradient-accent font-semibold text-sm hover:underline">
                apply for the program
              </Link>
            </div>
            <div className="cta-trust">
              <span className="cta-trust__item cta-trust__item--accent">Free, no card</span>
              <span className="cta-trust__dot" aria-hidden />
              <span className="cta-trust__item">Master Certified Coach</span>
              <span className="cta-trust__dot" aria-hidden />
              <span className="cta-trust__item">Founders done with the grind</span>
            </div>
          </div>
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <section className="py-20 sm:py-28 bg-ap-bg" data-reveal>
        <div className="max-w-[820px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            Before You Take It
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-4">
            Common questions, <span className="text-gradient-accent">honestly answered</span>.
          </h2>
          <p className="text-ap-mid text-lg font-semibold mb-10 max-w-[60ch]">
            What founders ask me before they take the assessment or apply for the program. No pressure, no pitch.
          </p>
          <EditorialFAQ
            items={[
              {
                q: "Is the VAPI™ actually free, or is this a soft sell?",
                a: (
                  <>
                    <p>
                      Free. No card, no upsell wall. You take 72 statements, see your scores across 12 domains, and get
                      a personalized 28-day plan to act on the result. Use the same email as your portal or ALFRED
                      account to unlock the plan.
                    </p>
                    <p>
                      If, after seeing your map, you want to talk about the 12-month program, you apply. If not, you
                      keep the plan. I would rather you take real action on a small thing than buy a big thing for the
                      wrong reason.
                    </p>
                  </>
                ),
              },
              {
                q: "Who is the Aligned Power™ Program actually for?",
                a: (
                  <>
                    <p>
                      Founders who have already proven they can build, and now want to do it without paying for the
                      growth with their health, their family, or their sense of self. Impact-driven, values-aligned,
                      done with the grind.
                    </p>
                    <p>
                      It is not for people looking for a tactical playbook on Meta ads, a quick mindset hack, or a
                      group program. It is 1:1, customized, application-only, and a real commitment on both sides.
                    </p>
                  </>
                ),
              },
              {
                q: "Why is this application-based instead of just letting me book a call?",
                a: (
                  <>
                    <p>
                      Two reasons. First, my calendar is finite, so I want the time we spend together to land on the
                      right fit, not on a sales conversation we both regret. Second, the application itself is
                      diagnostic. It tells me where you are stuck, what you have tried, and what you are willing to
                      change.
                    </p>
                    <p>
                      I read every one personally. If we are a fit, I respond with the next step. If we are not, I tell
                      you why and where you might be better served.
                    </p>
                  </>
                ),
              },
              {
                q: "How is this different from the executive-coach pages I keep seeing?",
                a: (
                  <>
                    <p>
                      Most coaching pages stack adjectives. World-class, transformational, master-certified. I have the
                      credentials, but the work is not in the brochure language. It is in how we look at the parts of
                      your business that you have been quietly avoiding, and the parts of your life you have been
                      paying with to keep the business alive.
                    </p>
                    <p>
                      You can also try ALFRED, the app I built so the clarity from our work travels with you into the
                      hard weeks. That is a real product, not a marketing prop.
                    </p>
                  </>
                ),
              },
              {
                q: "What does the first 30 days actually look like?",
                a: (
                  <>
                    <p>
                      You take the VAPI&trade; and we use your map to choose the first three places to focus. We meet
                      1:1 in deep-work sessions, and I am available between sessions for the moments that do not wait
                      for the calendar. Most clients describe the first month as clearer priorities, less reactive
                      execution, and a noticeable drop in inner conflict.
                    </p>
                    <p>
                      The goal is not a list of tactics. It is a fundamental shift in how you run the business and how
                      you carry yourself inside it.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </div>
      </section>

      <div className="h-0.5 bg-ap-accent" />

      <section className="py-20 sm:py-28 bg-white" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[20px] bg-ap-primary p-12 sm:p-16 text-center border-t-2 border-ap-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/20 to-transparent" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8 opacity-90">
                <Image
                  src="/images/certifications/icf.png"
                  alt="International Coaching Federation member badge"
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/images/certifications/cplc.png"
                  alt="Certified Professional Life Coach credential badge"
                  width={56}
                  height={56}
                  className="h-10 w-auto object-contain"
                />
                <Image
                  src="/images/certifications/mcpc.png"
                  alt="Master Certified Professional Coach credential badge"
                  width={56}
                  height={56}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-6">
                Ready to stop building the <span className="text-gradient-accent">cage</span>?
              </h2>
              <p className="text-ap-muted text-xl font-semibold max-w-2xl mx-auto mb-10">
                Start with the free VAPI&trade; Assessment. In about 12 minutes, you&apos;ll see where you are strong, where
                you are stretched, and what to fix next. Use the same email as your portal or ALFRED account to unlock
                your personalized 28-day plan.
                <span className="block mt-2 text-white/90 font-medium">Free. No payment required.</span>
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
                >
                  Take the VAPI&trade;
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me/apply"
                  className="inline-flex items-center px-8 py-4 rounded-pill border-[1.5px] border-white/60 text-white font-semibold text-base tracking-wider hover:bg-white/10 transition-all"
                >
                  Apply for the Program
                </Link>
              </div>
              <div className="cta-trust cta-trust--on-dark mt-6 justify-center">
                <span className="cta-trust__item cta-trust__item--accent text-white">ICF Master Certified</span>
                <span className="cta-trust__dot" aria-hidden />
                <span className="cta-trust__item">Read personally by Jake</span>
                <span className="cta-trust__dot" aria-hidden />
                <span className="cta-trust__item">12-month engagement</span>
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
