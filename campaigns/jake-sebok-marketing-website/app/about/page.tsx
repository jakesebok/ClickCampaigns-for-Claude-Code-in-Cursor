import Link from "next/link";
import Image from "next/image";
import { TestimonialCard } from "@/components/TestimonialCard";
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
            The Story
          </p>
          <h1 className="font-cormorant font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-8">
            Hey, I&apos;m Jacob Sebok.
          </h1>
          <p className="text-xl text-ap-mid leading-relaxed mb-8 max-w-2xl whitespace-nowrap">
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
              <p className="text-ap-mid text-lg leading-relaxed">
                By 33, I had achieved a lot. Six figures. Number two in my
                company. I built a team and scaled revenue 20x in just nine
                months. From the outside, checking all those boxes looked like
                success.
              </p>
              <p className="text-ap-mid text-lg leading-relaxed">
                Inside, I was burned out, anxious, and disconnected from
                everything I said mattered most. I was giving my family the
                scraps and grinding toward a version of &ldquo;more&rdquo; that
                I didn&apos;t even want. And the worst part? I knew something
                was wrong. I just couldn&apos;t stop.
              </p>
              <p className="text-ap-mid text-lg leading-relaxed">
                That experience became my wake-up call. I got clear on my true
                values and rebuilt my life and work around what actually
                matters. Now I help impact-driven founders and leaders do the
                same.
              </p>
              <p className="text-ap-mid text-lg leading-relaxed">
                I&apos;m here to be relentlessly honest and fully committed to
                helping you build what only you can—as you bring your gifts to
                the world. This isn&apos;t just coaching. It&apos;s a
                partnership to help you reconnect with your why and unlock your
                highest performance without sacrificing what matters most.
              </p>
              <p className="font-cormorant font-semibold text-lg text-ap-primary">
                Believe me, friends—your best days are ahead. Let&apos;s do this
                together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            Credentials
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-10">
            I&apos;ve walked the path. I&apos;m not an observer—I&apos;m a
            survivor and thriver on it.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-ap-bg rounded-[20px] border border-ap-border p-8">
              <h3 className="font-semibold text-ap-primary mb-4">
                Certifications
              </h3>
              <ul className="space-y-2 text-ap-mid">
                <li>• Master Certified Professional Coach</li>
                <li>• Certified Professional Life Coach</li>
                <li>• NLP Practitioner</li>
                <li>• CrossFit Level 2 Coach</li>
              </ul>
            </div>
            <div className="bg-ap-bg rounded-[20px] border border-ap-border p-8">
              <h3 className="font-semibold text-ap-primary mb-4">
                Experience
              </h3>
              <p className="text-ap-mid leading-relaxed">
                Leadership roles across multiple industries. Scaled businesses to
                multi-million dollar revenue. Always prioritized people over
                metrics. My approach blends real results with deep humanity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            What Clients Say
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            Real transformation. Real results.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.slice(0, 2).map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/work-with-me"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
            >
              Work With Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
