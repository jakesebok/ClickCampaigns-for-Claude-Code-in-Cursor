import Link from "next/link";

export const metadata = {
  title: "Work With Me — Jake Sebok",
  description:
    "Free VAPI Assessment, Aligned Freedom Workshop, Freedom Builders Community, Aligned Power Accelerator. Find the right entry point for your values-aligned journey.",
};

const offerings = [
  {
    title: "Free VAPI™ Assessment",
    description:
      "72 questions. ~12 minutes. An honest snapshot across 12 life and business domains. Get your personalized baseline and clarity on where to focus.",
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
            The best entry point is the free VAPI™ Assessment and the monthly
            Aligned Freedom Workshop. From there, you can join the free
            community, invest in intensives, or apply for the flagship
            Accelerator program.
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
                className={`rounded-[20px] border p-8 ${
                  offer.featured
                    ? "bg-ap-primary text-white border-ap-primary"
                    : "bg-white border-ap-border hover:border-ap-accent/50"
                } transition-colors`}
              >
                {offer.free && (
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider mb-4 text-gradient-accent">
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
                  className={`text-xl font-semibold leading-relaxed mb-6 ${
                    offer.featured ? "text-white/80" : "text-ap-mid"
                  }`}
                >
                  {offer.description}
                </p>
                <Link
                  href={offer.href}
                  className={`inline-flex items-center gap-2 font-semibold text-sm ${
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
