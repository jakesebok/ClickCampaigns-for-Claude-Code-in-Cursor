import Link from "next/link";

const ALFRED_APP_URL = "https://alfredai.coach";

export const metadata = {
  title: "Work With Me — Jake Sebok",
  description:
    "Free VAPI™ Assessment, Aligned Freedom Workshop, Freedom Builders, Strategic Alignment Intensives, communities, and the Aligned Power Accelerator. Plus Aligned Freedom Coach (ALFRED) for daily execution.",
};

const offerings = [
  {
    title: "Free VAPI™ Assessment",
    description:
      "72 questions. ~12 minutes. Discover your Founder Archetype and get an honest snapshot across 12 life and business domains. Get your personalized baseline and clarity on where to focus.",
    cta: "Take the Assessment",
    href: "/assessment",
    free: true,
  },
  {
    title: "Aligned Freedom Workshop",
    description:
      "90-minute monthly workshop. Get clarity, cut through the noise, and connect with a community of entrepreneurs who refuse to stay stuck.",
    cta: "Join the Next Workshop",
    href: "/work-with-me/freedom-workshop",
    free: true,
  },
  {
    title: "Freedom Builders Community",
    description:
      "Community with the Aligned Freedom Course. Learn at your own pace, connect with like-minded founders, and build the foundation for aligned growth.",
    cta: "Learn More",
    href: "/work-with-me/freedom-builders",
    free: true,
  },
  {
    title: "Strategic Alignment Intensives",
    description:
      "Quarterly deep-dive for owner-operators. Get strategic clarity and a clear path forward.",
    cta: "Learn More",
    href: "/work-with-me/strategic-intensives",
  },
  {
    title: "Aligned Leaders Community",
    description:
      "Ongoing support and accountability. Weekly calls, resources, and a cohort of aligned entrepreneurs.",
    cta: "Learn More",
    href: "/work-with-me/aligned-leaders",
  },
  {
    title: "Aligned Power Accelerator",
    description:
      "12-month group coaching program. The flagship experience for entrepreneurs ready to build a business that's an extension of who they are. Application required.",
    cta: "Apply Now",
    href: "/work-with-me/apply",
    featured: true,
  },
];

export default function WorkWithMePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 bg-cover bg-right"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800)" }}
      >
        <div className="absolute inset-0 bg-ap-bg/95" />
        <div className="relative max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            How We Work
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Your place. Your pace.
          </h1>
          <p className="text-xl font-semibold text-ap-mid max-w-2xl">
            The best entry point is the free VAPI™ Assessment, where you discover your Founder Archetype, and the monthly
            Aligned Freedom Workshop. From there, you can join the free community, invest in intensives, join paid
            communities, or apply for the flagship Accelerator program.
          </p>
        </div>
      </section>

      {/* Offerings grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {offerings.map((offer) => (
              <div
                key={offer.title}
                className={`flex flex-col h-full rounded-[20px] border p-8 ${
                  offer.featured
                    ? "bg-ap-primary text-white border-ap-primary"
                    : "bg-white border-ap-border hover:border-ap-accent/50"
                } transition-colors`}
              >
                {offer.free && (
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 bg-ap-accent/20 text-ap-accent">
                    Free
                  </span>
                )}
                <h3
                  className={`font-outfit font-semibold text-xl mb-3 ${
                    offer.featured ? "text-white" : "text-ap-primary"
                  }`}
                >
                  {offer.title}
                </h3>
                <p
                  className={`flex-1 text-xl font-semibold leading-relaxed mb-6 ${
                    offer.featured ? "text-white/80" : "text-ap-mid"
                  }`}
                >
                  {offer.description}
                </p>
                <Link
                  href={offer.href}
                  className={`mt-auto inline-flex items-center gap-2 font-semibold text-sm ${
                    offer.featured
                      ? "text-gradient-accent hover:text-ap-accent-2"
                      : "text-gradient-accent hover:underline"
                  }`}
                >
                  {offer.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALFRED — separate from program cards (product bridge, not another “offering” tile) */}
      <section className="py-12 sm:py-16 bg-ap-off border-y border-ap-border">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="max-w-[800px] mx-auto rounded-[24px] border border-ap-border bg-white p-8 sm:p-10 sm:flex sm:items-center sm:gap-10 sm:justify-between">
            <div className="mb-8 sm:mb-0">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
                Aligned Freedom Coach
              </p>
              <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary leading-tight mb-4">
                Need the work to survive the week—not just the workshop?
              </h2>
              <p className="text-lg font-semibold text-ap-mid leading-relaxed">
                <strong className="text-ap-primary">ALFRED</strong> is the only app I sell: coaching that keeps your
                VAPI™ results, Founder Archetype, weekly 6Cs, and Vital Action in the room when you&apos;re tired, busy,
                or tempted to say yes to the wrong thing. Different kind of offer than what&apos;s above—same alignment
                standard.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 sm:min-w-[200px]">
              <Link
                href="/who-is-alfred"
                className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-sm px-6 py-3.5 rounded-pill text-center"
              >
                How ALFRED fits
              </Link>
              <a
                href={ALFRED_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-pill border-[1.5px] border-ap-border text-ap-primary hover:border-ap-accent hover:text-gradient-accent transition-all"
              >
                Open the app
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ALL IN CTA — exclusive opportunity */}
      <section className="py-20 sm:py-28 bg-ap-primary">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 text-center">
          <div className="border-t-2 border-ap-accent pt-16 sm:pt-20">
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
              Exclusive Opportunity
            </p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Ready to go <span className="text-gradient-accent">ALL IN</span>?
            </h2>
            <p className="text-white/80 text-xl font-semibold mb-10 max-w-xl mx-auto">
              The Aligned Power Accelerator is my flagship 12-month program for entrepreneurs who are done with half-measures. Limited cohort. Application required. This is for those ready to build a business that&apos;s an extension of who they actually are.
            </p>
            <Link
              href="/work-with-me/apply"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all hover:bg-ap-accent-2"
            >
              Apply for the Accelerator
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
