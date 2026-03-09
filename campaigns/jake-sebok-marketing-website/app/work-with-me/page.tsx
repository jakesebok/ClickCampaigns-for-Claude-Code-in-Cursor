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
    href: "#accelerator-application",
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
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
            How We Work
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Start free. Go deeper when you&apos;re ready.
          </h1>
          <p className="text-lg text-ap-mid max-w-2xl">
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
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider mb-4 text-ap-accent">
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
                  className={`text-sm leading-relaxed mb-6 ${
                    offer.featured ? "text-white/80" : "text-ap-mid"
                  }`}
                >
                  {offer.description}
                </p>
                <Link
                  href={offer.href}
                  className={`inline-flex items-center gap-2 font-semibold text-sm ${
                    offer.featured
                      ? "text-ap-accent hover:text-ap-accent-2"
                      : "text-ap-accent hover:underline"
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

      {/* Accelerator Application */}
      <section
        id="accelerator-application"
        className="py-20 sm:py-28 bg-white"
      >
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            Aligned Power Accelerator
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary mb-6">
            Apply for the 12-month program
          </h2>
          <p className="text-ap-mid mb-10">
            The Accelerator is for entrepreneurs who are ready to do the real
            work. I take a limited cohort each year. Tell me about yourself, your
            business, and why you want in.
          </p>

          <form
            action="https://formspree.io/f/mojkjnev"
            method="POST"
            className="space-y-6"
          >
            <input type="hidden" name="_subject" value="Aligned Power Accelerator Application" />
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-ap-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ap-primary mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="business" className="block text-sm font-semibold text-ap-primary mb-2">
                Business / Role *
              </label>
              <input
                type="text"
                id="business"
                name="business"
                required
                placeholder="e.g. Chiropractor, Coach, Consultant"
                className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="revenue" className="block text-sm font-semibold text-ap-primary mb-2">
                Annual Revenue (approx.) *
              </label>
              <select
                id="revenue"
                name="revenue"
                required
                className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition"
              >
                <option value="">Select range</option>
                <option value="under-80k">Under $80K</option>
                <option value="80k-150k">$80K – $150K</option>
                <option value="150k-300k">$150K – $300K</option>
                <option value="300k-750k">$300K – $750K</option>
                <option value="750k-1m">$750K – $1M</option>
                <option value="over-1m">Over $1M</option>
              </select>
            </div>
            <div>
              <label htmlFor="why" className="block text-sm font-semibold text-ap-primary mb-2">
                Why do you want to join the Accelerator? What&apos;s at stake for you? *
              </label>
              <textarea
                id="why"
                name="why"
                required
                rows={5}
                placeholder="Tell me your story. What's not working? What would change if you had alignment between who you are and how you work?"
                className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition resize-none"
              />
            </div>
            <div>
              <button
                type="submit"
                className="cta-pill w-full sm:w-auto inline-flex items-center justify-center bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
              >
                Submit Application
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-ap-muted">
            I review every application personally. You&apos;ll hear back within
            5–7 business days.
          </p>
        </div>
      </section>
    </>
  );
}
