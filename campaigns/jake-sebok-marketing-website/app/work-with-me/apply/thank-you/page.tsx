import Link from "next/link";

export const metadata = {
  title: "Application Received | Jake Sebok",
  description:
    "Your application for the Aligned Power Program has been received. Jake personally reviews every application within 5 to 7 business days.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApplyThankYouPage() {
  return (
    <>
      {/* Hero — matches the apply page treatment */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none hidden lg:block absolute top-0 right-0 lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div
          className="lg:hidden pointer-events-none absolute top-0 right-0 w-[58%] h-full bg-ap-accent"
          style={{ clipPath: "polygon(72% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6 hero-halo">
          <div className="hero-receipt-mark" aria-hidden>
            <svg viewBox="0 0 24 24"><polyline points="5 12 10 17 19 7" /></svg>
          </div>
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 eyebrow-chapter">
            <span>Application Received</span>
          </p>
          <h1 className="font-outfit font-bold text-[2rem] sm:text-5xl text-ap-primary leading-tight mb-6 [text-wrap:balance]">
            <span className="block">Thank you.</span>
            <span className="block text-gradient-accent">
              I read every one{" "}
              <em className="not-italic text-gradient-accent">personally</em>.
            </span>
          </h1>
          <p className="text-xl font-semibold text-ap-mid">
            Your application for the Aligned Power Program is in. I do not outsource this part. Every application gets a
            close read from me, in my own time, with full attention to your story and what is at stake for you.
          </p>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-12 sm:py-16 bg-white" data-reveal>
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <div className="bg-ap-bg/50 border border-ap-border rounded-2xl p-6 sm:p-8" data-reveal data-reveal-delay="1">
            <h2 className="font-outfit font-bold text-2xl text-ap-primary mb-6">What happens next</h2>
            <ol className="space-y-5">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ap-accent/10 text-ap-accent font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  <p className="font-semibold text-ap-primary mb-1">I review your application.</p>
                  <p className="text-ap-mid">
                    Within 5 to 7 business days. If we are a fit, you will hear from me directly with next steps.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ap-accent/10 text-ap-accent font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  <p className="font-semibold text-ap-primary mb-1">We get on a call.</p>
                  <p className="text-ap-mid">
                    No pitch, no pressure. A real conversation about where you are, where you want to go, and whether
                    this program is the right vehicle to get you there.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ap-accent/10 text-ap-accent font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  <p className="font-semibold text-ap-primary mb-1">We decide together.</p>
                  <p className="text-ap-mid">
                    Either we move forward into the program, or I point you to whatever I think will actually serve you
                    next. Either way, you will leave the call with clarity.
                  </p>
                </div>
              </li>
            </ol>

            {/* Founder sign-off — second of two handwritten-script flourishes on the site.
                Anchored at the end of the receipt card so the "thank you" lands as a
                personal note from Jake, not a system-generated confirmation. */}
            <div className="signature-block mt-8 pt-6 border-t border-ap-border/60">
              <span className="signature-block__label">Talk soon</span>
              <span className="signature-script signature-script--sm" aria-label="Jake Sebok signature">
                Jake
              </span>
            </div>
          </div>

          <div className="mt-10" data-reveal data-reveal-delay="2">
            <p className="text-xs font-semibold text-ap-mid mb-4 uppercase tracking-[0.18em]">While you wait</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/who-is-alfred"
                className="group block bg-white border border-ap-border rounded-2xl p-5 hover:border-ap-accent transition-colors"
              >
                <p className="font-semibold text-ap-primary mb-1 group-hover:text-gradient-accent transition-colors">
                  Meet ALFRED
                </p>
                <p className="text-base text-ap-mid">
                  My AI coach. The same Aligned Power method, working with you between calls.
                </p>
              </Link>
              <Link
                href="/client-stories"
                className="group block bg-white border border-ap-border rounded-2xl p-5 hover:border-ap-accent transition-colors"
              >
                <p className="font-semibold text-ap-primary mb-1 group-hover:text-gradient-accent transition-colors">
                  Read client stories
                </p>
                <p className="text-base text-ap-mid">
                  Real stories from clients who built businesses that fit their lives.
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base font-semibold text-ap-mid hover:text-gradient-accent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
