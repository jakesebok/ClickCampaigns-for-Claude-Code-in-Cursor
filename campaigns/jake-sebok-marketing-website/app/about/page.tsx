import Link from "next/link";
import Image from "next/image";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SocialLinks } from "@/components/SocialLinks";
import { testimonials } from "@/lib/testimonials";
import { aboutSchemaGraph } from "@/lib/schema";

export const metadata = {
  title: "About Jake Sebok | Values-Aligned Performance Coach",
  description:
    "Master Certified Coach Jake Sebok helps entrepreneurs build businesses that fit their lives, not just their ambition. The story behind the program.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchemaGraph()) }}
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
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4 eyebrow-chapter">
            <span>The Story · Ch 01</span>
          </p>
          <h1 className="font-outfit font-bold text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] text-ap-primary leading-[1.02] tracking-tight mb-6 [text-wrap:balance]">
            Hey,{" "}
            <em className="font-cormorant italic font-semibold tracking-tight text-gradient-accent">I&apos;m</em>{" "}
            Jake Sebok.
          </h1>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-8 max-w-[58ch]">
            Master Certified Professional Coach, founder, full-time dad to three amazing kids.
          </p>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start" data-reveal data-reveal-delay="1">
            <div>
              <div className="hero-image relative aspect-[4/5]">
                <Image
                  src="/images/jake/jacob-sebok-laughing.jpeg"
                  alt="Jake Sebok laughing in natural daylight, head turned mid-conversation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-ap-primary mb-3">Connect with me</p>
                <SocialLinks variant="contact" />
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                By 33, I had achieved a lot. Six figures. Number two in my
                company. I built a team and scaled revenue 20x in just nine
                months. From the outside, checking all those boxes looked like
                success.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                Inside, I was burned out, anxious, and disconnected from
                everything I said mattered most. I was giving my family the
                scraps and grinding toward a version of &ldquo;more&rdquo; that
                I didn&apos;t even want. And the worst part? I knew something
                was wrong. I just couldn&apos;t stop.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                That experience became my wake-up call. I got clear on my true
                values and rebuilt my life and work around what actually
                matters. Now I help impact-driven founders and leaders do the
                same.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                I&apos;m here to be relentlessly honest and fully committed to
                helping you build what only you can build. This isn&apos;t just coaching. It&apos;s a
                partnership to help you reconnect with your why and unlock your
                highest performance without sacrificing what matters most.
              </p>
              <p className="font-semibold text-lg text-ap-primary">
                Believe me, friends. Your best days are ahead. Let&apos;s do this
                together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 sm:py-20 bg-white" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            Credentials
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-10">
            I didn&apos;t learn this from a textbook. I lived it.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8">
              <h3 className="font-outfit font-semibold text-ap-primary mb-4">
                Trained at the highest level
              </h3>
              <ul className="space-y-2 text-ap-mid text-xl font-semibold mb-4">
                <li>• Master Certified Professional Coach (MCPC)</li>
                <li>• Certified Professional Life Coach (CPLC)</li>
                <li>• NLP Practitioner</li>
                <li>• CrossFit Level 2 Coach</li>
              </ul>
              <p className="text-xl font-semibold text-ap-muted">
                ICF-accredited. The International Coaching Federation sets the global standard for coaching ethics, competence, and training—so you know you&apos;re working with someone who&apos;s been rigorously vetted.
              </p>
            </div>
            <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8">
              <h3 className="font-outfit font-semibold text-ap-primary mb-4">
                Proven in the arena
              </h3>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-4">
                Leadership roles across multiple industries. Built a team and scaled internal revenue 20x in nine months. Drove multi-million dollar growth for clients. I&apos;ve always prioritized people over metrics, and the results followed.
              </p>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                My approach blends real results with deep humanity. I&apos;m not an observer of this path. I&apos;ve walked it, fallen into the traps, and found my way out. Now I help others do the same.
              </p>
            </div>
          </div>

          {/* How I Work */}
          <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 sm:p-10 mb-12">
            <h3 className="font-semibold text-ap-primary mb-4">
              I coach the whole human being, not just the business
            </h3>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-4">
              Most business problems look strategic from the outside and personal from the inside. I help you surface
              the real conflict, name what the current version of success is costing you, and rebuild from what
              actually fits. The tools include deep coaching, parts work, and values work, but the point is simple:
              execution stops feeling like a fight with yourself.
            </p>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed">
              This is sustainable performance. You do not need a peak that wrecks the rest of your life. You need your
              work, relationships, health, and ambition pulling in the same direction.
            </p>
          </div>

          {/* Foundations */}
          <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 sm:p-10">
            <h3 className="font-semibold text-ap-primary mb-4">
              Built on thinkers who understood the human journey
            </h3>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed">
              Howard Thurman. Joseph Campbell. Carl Jung. Brené Brown. Thinkers who understood that real change is not
              just tactical, it is identity-level. I use what is useful from that lineage to help you let an old
              version of success die and build from something truer.
            </p>
          </div>
        </div>
      </section>

      {/* Three pillars — equal-weight card row (Goldsmith hub pattern).
          The three nouns Jake's whole practice rotates around: growth that
          doesn't shrink the rest of life, authenticity that's earned not
          performed, alignment between work and the life it's supposed to
          fund. No featured card, no color hierarchy, no size differential. */}
      <section className="py-16 sm:py-20 bg-ap-bg" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 eyebrow-chapter">
            <span>What I Work On · Three Pillars</span>
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-3 [text-wrap:balance]">
            Three words. The work rotates around them.
          </h2>
          <p className="text-ap-mid text-lg sm:text-xl font-semibold leading-relaxed mb-12 max-w-[62ch]">
            Not a framework. Not a five-step process. The three nouns I keep coming back to with every founder I work
            with, because the real work is at their intersection.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="pillar-card" data-reveal data-reveal-delay="1">
              <span className="pillar-card__label">Pillar 01</span>
              <p className="pillar-card__name">
                Growth
                <strong>that scales income, impact, and life</strong>
              </p>
              <p className="pillar-card__body">
                The kind that doesn&apos;t make you trade away the rest of your life to access it. Cleaner decisions,
                stronger execution, a business that funds the life it was built to fund.
              </p>
            </div>
            <div className="pillar-card" data-reveal data-reveal-delay="2">
              <span className="pillar-card__label">Pillar 02</span>
              <p className="pillar-card__name">
                Authenticity
                <strong>earned, not performed</strong>
              </p>
              <p className="pillar-card__body">
                Who you are at your most honest, deployed as a business strategy. The version of you your team trusts,
                your clients buy from, and your family recognizes at the end of the day.
              </p>
            </div>
            <div className="pillar-card" data-reveal data-reveal-delay="3">
              <span className="pillar-card__label">Pillar 03</span>
              <p className="pillar-card__name">
                Alignment
                <strong>between what you say and what you do</strong>
              </p>
              <p className="pillar-card__body">
                Your work, your relationships, your health, and your ambition all pulling in the same direction.
                Execution stops feeling like a fight with yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20" data-reveal>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            Proof
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            Transformation isn&apos;t theoretical. Here&apos;s what clients say when the work is done.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.slice(0, 2).map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/client-stories"
              className="inline-flex items-center gap-2 text-gradient-accent font-semibold text-base border-2 border-ap-accent/50 hover:border-ap-accent hover:bg-ap-accent/5 px-6 py-3 rounded-pill transition-all"
            >
              See Marshall&apos;s full story: from dreading work to excited every day
              <svg className="w-4 h-4 flex-shrink-0 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/work-with-me"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
            >
              Work With Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
