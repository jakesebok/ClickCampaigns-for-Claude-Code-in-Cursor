import Link from "next/link";
import Image from "next/image";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/lib/testimonials";

export const metadata = {
  title: "About Jake Sebok — Values-Aligned Performance Coach",
  description:
    "Jake Sebok helps entrepreneurs who feel trapped by their businesses rediscover their vision. Certified coach, NLP practitioner, and former corporate leader who chose alignment over the cage.",
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
            I wasn&apos;t failing at business. I was succeeding at the wrong one.
          </h1>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
              <Image
                src="/images/jake/MMC Profile.jpeg"
                alt="Jake Sebok"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-6">
              <p className="text-ap-mid text-lg leading-relaxed">
                Life was restrictive and unfulfilling. I felt trapped trading
                time for money, believing only relentless performance could
                guarantee security. Even as my career advanced, I was stuck in
                roles that looked impressive from the outside but felt
                suffocating from the inside—bound by golden handcuffs.
              </p>
              <p className="text-ap-mid text-lg leading-relaxed">
                When I finally started my own business, the thing I thought would
                set me free, I fell into the same trap wearing a different mask.
                I chased money over passion, overworked instead of
                over-delivering, and built something that looked like success but
                felt like a beautifully decorated prison.
              </p>
              <p className="text-ap-mid text-lg leading-relaxed">
                The turning point wasn&apos;t a strategy. It was a decision to
                be ruthlessly honest about what I actually wanted—and to pursue
                it immediately, without waiting for permission. When I started
                sharing my truth, something unexpected happened. Others
                recognized themselves in my story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-8">
            Life today
          </h2>
          <p className="text-ap-mid text-lg leading-relaxed max-w-3xl">
            Today I work exclusively with clients who share my values and my
            approach. I wake up with purpose, confidence, and a fire that
            doesn&apos;t burn out—because it&apos;s fueled by alignment, not
            adrenaline. I control my schedule, collaborate with people who
            inspire me, prioritize my family and my health, and live fully
            present. I am no longer postponing happiness until some future
            milestone gives me permission to enjoy it.
          </p>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            Credentials
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-10">
            I&apos;ve walked the path. I&apos;m not an observer—I&apos;m a
            survivor and thriver on it.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-[20px] border border-ap-border p-8">
              <h3 className="font-semibold text-ap-primary mb-4">
                Certifications
              </h3>
              <ul className="space-y-2 text-ap-mid">
                <li>• Certified Professional Life Coach</li>
                <li>• Master Certified Professional Coach</li>
                <li>• NLP Practitioner</li>
                <li>• CrossFit Level 2 Coach</li>
              </ul>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border p-8">
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
      <section className="py-16 sm:py-20 bg-white">
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
