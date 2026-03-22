import Link from "next/link";
import type { Metadata } from "next";

const ALFRED_APP_URL = "https://alfredai.coach";

const ogDescription =
  "ALFRED is Aligned Freedom Coach—the app that holds your values, VAPI™ results, Vital Actions, and Aligned AIOS context. Learn why it exists and open the app at alfredai.coach.";

export const metadata: Metadata = {
  title: "Who is ALFRED? — Aligned Freedom Coach | Jake Sebok",
  description: ogDescription,
  alternates: {
    canonical: "/who-is-alfred",
  },
  openGraph: {
    title: "Who is ALFRED? — Aligned Freedom Coach | Jake Sebok",
    description: ogDescription,
    url: "https://jakesebok.com/who-is-alfred",
    siteName: "Jake Sebok",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo-jake-sebok-horizontal.png",
        width: 1200,
        height: 630,
        alt: "Jake Sebok — Aligned Freedom Coach (ALFRED)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Who is ALFRED? — Aligned Freedom Coach",
    description: ogDescription,
    images: ["/images/logo-jake-sebok-horizontal.png"],
  },
};

export default function WhoIsAlfredPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 bg-ap-bg">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Aligned Freedom Coach
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Who is ALFRED?
          </h1>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-6">
            ALFRED is <strong className="text-ap-primary">Aligned Freedom Coach</strong>—the same product, two names.
            The acronym is <strong className="text-ap-primary">AL</strong>igned <strong className="text-ap-primary">FRE</strong>e
            <strong className="text-ap-primary">D</strong>om Coach: a coach that stays aligned with{" "}
            <em>your</em> freedom, not a generic productivity bot.
          </p>
          <p className="text-lg font-medium text-ap-mid leading-relaxed mb-8">
            It&apos;s the only app Jake sells. Everything else—workshops, the Accelerator, the Strategic Alignment
            Intensive—feeds your clarity and your data. ALFRED is where that intelligence becomes daily.
          </p>
          <a
            href={ALFRED_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
          >
            Open Aligned Freedom Coach
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-ap-muted text-sm mt-3">
            {ALFRED_APP_URL.replace("https://", "")}
          </p>
        </div>
      </section>

      <section className="pb-12 sm:pb-16 bg-white border-y border-ap-border">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-12 sm:py-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Aligned AIOS vs ALFRED (same mission, different leverage)
          </h2>
          <div className="space-y-6 text-ap-mid font-medium leading-relaxed">
            <p>
              <strong className="text-ap-primary">Aligned AIOS</strong> is the master prompt + blueprint you generate at
              the end of Phase II (Strategic Clarity) in the Accelerator—or in the Strategic Alignment Intensive. It
              turns your favorite AI into a coach that knows your values, revenue math, and Vital Action.
            </p>
            <p>
              <strong className="text-ap-primary">ALFRED</strong> is that idea—<strong>on steroids</strong>. Inside the app
              you get coaching that also uses your{" "}
              <strong className="text-ap-primary">VAPI™ scores</strong>, your <strong className="text-ap-primary">Founder Archetype</strong>, your{" "}
              <strong className="text-ap-primary">primary dysfunction driver</strong> pattern, your weekly{" "}
              <strong className="text-ap-primary">6Cs</strong> scores, and your <strong className="text-ap-primary">Vital Actions</strong>—not
              just the worksheets you pasted last week.
            </p>
            <p>
              If Aligned AIOS is the operating system you can run in any chat window, ALFRED is the dedicated environment
              where alignment is persistent, scored, and accountable.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28 bg-ap-bg">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Why founders use it
          </h2>
          <ul className="space-y-4 text-xl font-semibold text-ap-mid mb-10">
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Stops you from violating your own values when you&apos;re tired
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Connects weekly actions to the revenue and life you actually said you wanted
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Keeps VAPI and Archetype context in the room—not generic advice
            </li>
          </ul>
          <div className="bg-ap-off rounded-[20px] border border-ap-border p-8 text-center">
            <p className="text-ap-mid font-medium mb-6">
              New to the ecosystem? Start with the free VAPI™ on this site—then come back when you&apos;re ready for
              daily execution inside ALFRED.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/assessment"
                className="cta-pill inline-flex items-center justify-center bg-ap-accent text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-pill"
              >
                Take the VAPI™ first
              </Link>
              <a
                href={ALFRED_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-pill border-[1.5px] border-ap-border text-ap-primary font-semibold text-sm sm:text-base hover:border-ap-accent hover:text-gradient-accent transition-all"
              >
                Open ALFRED
              </a>
            </div>
            <p className="text-ap-muted text-sm mt-6">
              <Link href="/work-with-me" className="text-gradient-accent font-semibold hover:underline">
                View all programs & workshops
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
