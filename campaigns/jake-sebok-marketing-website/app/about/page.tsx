import Link from "next/link";
import Image from "next/image";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SocialLinks } from "@/components/SocialLinks";
import { testimonials } from "@/lib/testimonials";

export const metadata = {
  title: "About Jake Sebok — Values-Aligned Performance Coach",
  description:
    "Jake Sebok helps entrepreneurs who feel trapped by their businesses rediscover their vision. Master Certified Coach, business owner, and full-time dad who chose alignment over the cage.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            The Story
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-8">
            Hey, I&apos;m Jake Sebok.
          </h1>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-8 max-w-2xl">
            Master Certified Professional Coach, founder, full-time dad to three amazing kids.
          </p>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-xl">
              <Image
                src="/images/jake/jacob-sebok-laughing.jpeg"
                alt="Jake Sebok"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
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
              <div className="pt-6">
                <p className="text-sm font-semibold text-ap-primary mb-3">Connect with me</p>
                <SocialLinks variant="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 sm:py-20 bg-white">
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
                <li>• NLP Practitioner (addresses the root cause of self-sabotage)</li>
                <li>• CrossFit Level 2 Coach</li>
              </ul>
              <p className="text-xl font-semibold text-ap-muted">
                ICF-accredited. Master Certified is the top tier, earned through hundreds of coaching hours and rigorous assessment.
              </p>
            </div>
            <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8">
              <h3 className="font-outfit font-semibold text-ap-primary mb-4">
                Proven in the arena
              </h3>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-4">
                Leadership roles across multiple industries. Built a team and scaled revenue 20x in nine months. Scaled businesses to multi-million dollar revenue. I&apos;ve always prioritized people over metrics, and the results followed.
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
              Where competitors optimize for output, I optimize for alignment. I use NLP-based parts work to address the root cause of self-sabotage. I build Alignment Blueprints from your actual values, not inherited or assumed ones. Milestone-based pricing shifts risk to me, not you.
            </p>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed">
              This isn&apos;t peak performance. It&apos;s sustainable performance, because peaks imply valleys and valleys carry a cost you were never willing to pay.
            </p>
          </div>

          {/* Foundations */}
          <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 sm:p-10">
            <h3 className="font-semibold text-ap-primary mb-4">
              Built on thinkers who understood the human journey
            </h3>
            <p className="text-ap-mid text-xl font-semibold leading-relaxed">
              Howard Thurman. Joseph Campbell&apos;s Hero&apos;s Journey. Carl Jung&apos;s psychology. Brené Brown&apos;s belonging work. I don&apos;t just coach tactics. I help you let go of old identities and return to the fire that was always yours.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
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
              href="/case-studies"
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
