import Link from "next/link";

export const metadata = {
  title: "Apply — Aligned Power Accelerator | Jake Sebok",
  description:
    "Apply for the Aligned Power Accelerator—a 12-month group coaching program for entrepreneurs ready to build a business that's an extension of who they are.",
};

export default function ApplyPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 bg-ap-bg">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <Link
            href="/work-with-me"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ap-mid hover:text-ap-accent mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Work With Me
          </Link>
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-3">
            Aligned Power Accelerator
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Apply for the 12-month program
          </h1>
          <p className="text-lg text-ap-mid">
            The Accelerator is for entrepreneurs who are ready to do the real
            work. I take a limited cohort each year. Tell me about yourself, your
            business, and why you want in.
          </p>
        </div>
      </section>

      {/* Application form */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
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
