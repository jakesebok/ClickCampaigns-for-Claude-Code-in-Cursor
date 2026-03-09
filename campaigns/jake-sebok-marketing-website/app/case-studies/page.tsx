import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Case Studies — Jake Sebok | Real Results from Values-Aligned Coaching",
  description:
    "See how Dr. Marshall Gevers went from dreading his business to working with clients of his dreams, charging more than he ever thought possible, and doing less grinding and more aligning.",
};

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
            Case Studies
          </p>
          <h1 className="font-cormorant font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Real results. Real transformation.
          </h1>
          <p className="text-xl text-ap-mid max-w-2xl leading-relaxed">
            These are the stories of entrepreneurs who chose alignment over the grind—and what happened when they did.
          </p>
        </div>
      </section>

      {/* Marshall Gevers — Featured Case Study */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-xl">
                <Image
                  src="/images/testimonials/Marshall.png"
                  alt="Dr. Marshall Gevers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="mt-6 p-6 rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent bg-ap-bg">
                <p className="font-cormorant font-semibold italic text-lg text-ap-primary mb-2">
                  &ldquo;I knew how to treat patients, but starting a business left me stuck and overthinking everything. Jake helped me cut through the noise, define a vision, and take confident action. What used to feel overwhelming now feels intentional—and it&apos;s directly translated into real business growth.&rdquo;
                </p>
                <p className="font-semibold text-ap-primary">— Dr. Marshall Gevers</p>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-2">
                  Featured Case Study
                </p>
                <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
                  From &ldquo;I hate owning a business&rdquo; to excited to go to work every day
                </h2>
                <p className="text-ap-mid text-lg leading-relaxed">
                  Dr. Marshall Gevers is a chiropractor who learned how to treat patients brilliantly—but had no training in how to run a business. He was spinning his wheels, paralyzed by options, and his standard answer whenever anyone asked was: <em>I love being a chiropractor. I hate owning a business.</em> He&apos;d been burned before. He was skeptical of coaching. He was running on fumes.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-lg text-ap-primary">
                  The transformation
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-6">
                    <h4 className="font-semibold text-ap-primary mb-2">Clients of his dreams</h4>
                    <p className="text-ap-mid text-sm leading-relaxed">
                      Marshall used to take whoever walked in—&ldquo;happy to take scraps,&rdquo; as he put it. Now he&apos;s crystal clear on his ideal client. When he works with them, he gets <em>excited</em>. It gives him energy for the rest of the day instead of draining him. The business restores him instead of depleting him.
                    </p>
                  </div>
                  <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-6">
                    <h4 className="font-semibold text-ap-primary mb-2">Excited to go to work</h4>
                    <p className="text-ap-mid text-sm leading-relaxed">
                      Before coaching: &ldquo;Oh gosh, I gotta go into work again.&rdquo; After: &ldquo;I&apos;m excited about coming into work every day.&rdquo; He went from not wanting to continue on the path to being excited for the next five years of business. The shift wasn&apos;t tactics—it was alignment.
                    </p>
                  </div>
                  <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-6">
                    <h4 className="font-semibold text-ap-primary mb-2">Charging more than he thought possible</h4>
                    <p className="text-ap-mid text-sm leading-relaxed">
                      He used to hate feeling like a salesman. He had a hard time asking people for things—felt like he was bothering them. We reframed it: he&apos;s not selling; he&apos;s helping. Now he doesn&apos;t feel intrusive. He feels like he&apos;s doing what he&apos;s supposed to do. He&apos;s reaching more people—and the revenue followed.
                    </p>
                  </div>
                  <div className="bg-ap-bg rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-6">
                    <h4 className="font-semibold text-ap-primary mb-2">Less grinding, more aligning</h4>
                    <p className="text-ap-mid text-sm leading-relaxed">
                      Before: a lot of things he dreaded doing, sapping his energy. He didn&apos;t want to do them outside of work. Now he does more networking and business development than ever—but it doesn&apos;t feel like work. When opportunities pop up outside work hours, he&apos;s excited. The business feels like an extension of him, not something he has to go do.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-[20px] bg-ap-primary text-white border-t-2 border-ap-accent">
                <p className="font-cormorant font-semibold italic text-xl mb-4">
                  &ldquo;The business now feels more like an extension of me than something I have to go do. I feel completely different. I&apos;m excited for the next five years of business rather than anxious about it.&rdquo;
                </p>
                <p className="text-white/80 text-sm">— Dr. Marshall Gevers</p>
              </div>

              <div className="pt-4">
                <Link
                  href="/work-with-me"
                  className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
                >
                  Start Your Transformation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Results — Thaddeus & Charul teasers */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            More Results
          </p>
          <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-ap-primary mb-12">
            Other entrepreneurs who chose alignment
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-ap-off flex-shrink-0">
                  <Image src="/images/testimonials/Thaddeus.png" alt="Thaddeus John" fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <h3 className="font-semibold text-ap-primary">Thaddeus John</h3>
                  <p className="text-sm text-ap-muted">Greater Clarity. Better Execution.</p>
                </div>
              </div>
              <p className="text-ap-mid text-sm leading-relaxed">
                &ldquo;I&apos;ve gotten more clients booked on my calendar in the past few weeks than I had in the previous six months before working with Jake. I have a deep understanding of what I&apos;m building and why it&apos;s important!&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent p-8 hover:border-ap-accent/50 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-ap-off flex-shrink-0">
                  <Image src="/images/testimonials/Charul.png" alt="Charul Patel" fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <h3 className="font-semibold text-ap-primary">Charul Patel</h3>
                  <p className="text-sm text-ap-muted">Jacob was so insightful!</p>
                </div>
              </div>
              <p className="text-ap-mid text-sm leading-relaxed">
                &ldquo;Jacob is an incredible Coach. His presence is calming, his demeanor is genuine, and he has a gift for bridging the gaps between challenges and solutions.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[20px] bg-ap-primary p-12 sm:p-16 text-center border-t-2 border-ap-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/20 to-transparent" />
            <div className="relative">
              <h2 className="font-cormorant font-bold text-3xl sm:text-4xl text-white mb-6">
                Ready to write your own case study?
              </h2>
              <p className="text-ap-muted text-lg max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. Get clarity on where you stand—then let&apos;s build something that feels like an extension of who you are.
              </p>
              <Link
                href="/assessment"
                className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
              >
                Take the VAPI™
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
