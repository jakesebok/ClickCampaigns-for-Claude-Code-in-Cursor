import Link from "next/link";
import type { Metadata } from "next";

const ALFRED_APP_URL = "https://alfredai.coach";

const ogDescription =
  "Aligned Freedom Coach (ALFRED) is the only app Jake sells: AI coaching wired to your VAPI™ results, Founder Archetype, dysfunction pattern, weekly 6Cs, Vital Actions, and Aligned AIOS context—so alignment survives real life.";

export const metadata: Metadata = {
  title: "Aligned Freedom Coach (ALFRED) — Coaching That Remembers Your Scores | Jake Sebok",
  description: ogDescription,
  alternates: {
    canonical: "/who-is-alfred",
  },
  openGraph: {
    title: "Aligned Freedom Coach (ALFRED) — Coaching That Remembers Your Scores",
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
    title: "Aligned Freedom Coach (ALFRED)",
    description: ogDescription,
    images: ["/images/logo-jake-sebok-horizontal.png"],
  },
};

const intelligenceItems = [
  {
    title: "VAPI™ snapshot",
    body: "Your composite score, three arenas (Personal, Relationships, Business), and twelve domains—so advice is weighted to what you said actually matters.",
  },
  {
    title: "Founder Archetype",
    body: "Structural read on how your arenas interact—not a personality quiz. The coach knows whether you’re building fast, drifting, or protecting what’s sacred.",
  },
  {
    title: "Primary dysfunction pattern",
    body: "The story you default to under stress (achievement, pleasing, fog, scattered focus, and more). Named so you can catch it earlier—not so you can shame yourself harder.",
  },
  {
    title: "Weekly 6Cs scorecard",
    body: "Clarity, Coherence, Capacity, Confidence, Courage, Connection—rated and reflected so your week has a spine, not just a task list.",
  },
  {
    title: "Vital Action",
    body: "One honest commitment that connects values to revenue and life design. The app keeps it visible when everything else is noisy.",
  },
  {
    title: "Aligned AIOS context",
    body: "If you’ve done Strategic Clarity (Accelerator Phase II or the Intensive), your master prompt and blueprint live here too—same mission, persistent memory.",
  },
];

const dailyItems = [
  {
    title: "Coaching chat",
    body: "Ask hard questions in plain language. Get answers that already know your bottlenecks—not generic hustle scripts.",
  },
  {
    title: "Alignment Blueprint",
    body: "Your strategic context, viewable in one place. Less re-pasting worksheets. More forward motion.",
  },
  {
    title: "Morning SMS (optional)",
    body: "A nudge that meets you where you are—without turning your life into a productivity performance.",
  },
];

export default function WhoIsAlfredPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24 pb-14 sm:pb-20 bg-ap-bg">
        <div className="max-w-[800px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Aligned Freedom Coach
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-[2.75rem] text-ap-primary leading-[1.12] mb-6">
            The coach that still knows your VAPI™ when you&apos;re tired, busy, or about to say yes to the wrong thing.
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-ap-mid leading-relaxed mb-6">
            <strong className="text-ap-primary">ALFRED</strong> is{" "}
            <strong className="text-ap-primary">Aligned Freedom Coach</strong>—the only app I sell. It&apos;s where your
            assessment, archetype, pattern, weekly check-ins, and (when you have it) your{" "}
            <strong className="text-ap-primary">Aligned AIOS</strong> context stop being a PDF and start being a{" "}
            <em>daily relationship</em> with alignment.
          </p>
          <p className="text-lg font-medium text-ap-mid leading-relaxed mb-10">
            Generic AI gives you clever paragraphs. ALFRED gives you{" "}
            <strong className="text-ap-primary">coaching tethered to your real scores and commitments</strong>—so you
            don&apos;t have to re-explain your life every time you need help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <a
              href={ALFRED_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
            >
              Open Aligned Freedom Coach
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-pill border-[1.5px] border-ap-border text-ap-primary font-semibold text-base hover:border-ap-accent hover:text-gradient-accent transition-all"
            >
              Take VAPI™ first
            </Link>
          </div>
          <p className="text-ap-muted text-sm mt-4">
            {ALFRED_APP_URL.replace("https://", "")} · 7-day trial for new accounts; extended access for Intensive and
            Accelerator clients.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-ap-border">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-4 max-w-[720px]">
            Why another “AI coach” isn’t what you need
          </h2>
          <div className="max-w-[720px] space-y-5 text-ap-mid font-medium leading-relaxed text-lg">
            <p>
              You already have access to models that can sound wise for thirty seconds. The breakdown happens on{" "}
              <strong className="text-ap-primary">Wednesday</strong>, when you&apos;re depleted, your boundaries slip,
              and the chat has <strong className="text-ap-primary">zero memory</strong> of what you discovered about
              yourself last month.
            </p>
            <p>
              ALFRED exists for the gap between <em>insight</em> and <em>embodiment</em>—when you need someone in your
              corner who remembers that your Relationships arena is fragile, that your archetype skews toward
              over-performance, or that your Vital Action this week is the one thing that protects your health{" "}
              <em>and</em> your revenue.
            </p>
            <p className="text-ap-primary font-semibold">
              You&apos;re not broken for needing repetition. You&apos;re human. The app is the scaffold—not the savior.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-ap-bg">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            What stays in the room with you
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-10">
            This is the difference between “chat with AI” and{" "}
            <strong className="text-ap-primary">coaching with your actual baseline loaded</strong>.
          </p>
          <ul className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {intelligenceItems.map((item) => (
              <li
                key={item.title}
                className="bg-white rounded-[20px] border border-ap-border p-6 sm:p-7 shadow-sm"
              >
                <h3 className="font-outfit font-bold text-lg text-ap-primary mb-2">{item.title}</h3>
                <p className="text-ap-mid font-medium leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-ap-border">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            How it shows up in a real week
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-10">
            Simple surfaces. No gamified shame. Built for owner-operators who already have enough tabs open.
          </p>
          <ul className="grid sm:grid-cols-3 gap-6">
            {dailyItems.map((item) => (
              <li key={item.title} className="rounded-[16px] bg-ap-off border border-ap-border p-6">
                <h3 className="font-outfit font-bold text-base text-ap-primary mb-2">{item.title}</h3>
                <p className="text-sm text-ap-mid font-medium leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-ap-bg">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            Aligned AIOS vs ALFRED
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-8">
            Same north star. Different leverage. You might use both; most serious operators eventually want the app.
          </p>
          <div className="overflow-x-auto rounded-[20px] border border-ap-border bg-white">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-ap-border bg-ap-off">
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-primary"> </th>
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-primary">Aligned AIOS</th>
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-accent">ALFRED</th>
                </tr>
              </thead>
              <tbody className="text-ap-mid font-medium">
                <tr className="border-b border-ap-border">
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">What it is</td>
                  <td className="p-4 sm:p-5">Master prompt + blueprint from Strategic Clarity—runs in ChatGPT, Claude, Gemini, etc.</td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Dedicated app: persistent memory, scorecards, Vital Action, integrations with your assessment data.
                  </td>
                </tr>
                <tr className="border-b border-ap-border">
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Best for</td>
                  <td className="p-4 sm:p-5">“I want my favorite model to know my worksheets.”</td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    “I want alignment to survive my actual calendar—and I’m tired of re-pasting context.”
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Live VAPI™ + weekly rhythm</td>
                  <td className="p-4 sm:p-5">You bring what you paste; model doesn’t natively track your 6Cs week to week.</td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Built-in: VAPI™, archetype, pattern, 6Cs, Vital Action—updated as you use the product.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ap-muted mt-4 max-w-[720px]">
            Aligned AIOS is generated at the end of <strong className="text-ap-mid">Phase II (Strategic Clarity)</strong>{" "}
            in the Accelerator or in a <Link href="/work-with-me/strategic-intensives" className="text-gradient-accent font-semibold hover:underline">Strategic Alignment Intensive</Link>.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-ap-border">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Pricing that respects your attention
          </h2>
          <div className="space-y-5 text-ap-mid font-medium leading-relaxed text-lg">
            <p>
              ALFRED is priced like <strong className="text-ap-primary">less than a single coaching session per month</strong>{" "}
              with <strong className="text-ap-primary">everything included</strong>—no upsell maze inside the app. See
              current numbers on the{" "}
              <a
                href={`${ALFRED_APP_URL}/pricing`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient-accent font-semibold hover:underline"
              >
                pricing page
              </a>
              .
            </p>
            <p>
              <strong className="text-ap-primary">Strategic Alignment Intensive</strong> attendees and{" "}
              <strong className="text-ap-primary">Aligned Power Accelerator</strong> clients receive extended trial
              access via the codes shared in program—because the app is designed to extend what we build in the room, not
              replace it.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-ap-bg">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-12">
            <div>
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">Who this is for</h2>
              <ul className="space-y-3 text-ap-mid font-medium leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  Founders who already took VAPI™ and want execution support that respects the report—not generic tips.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  Operators balancing revenue pressure with values, health, and relationships.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  Anyone building or refreshing Aligned AIOS who wants that intelligence to live somewhere durable.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">Who it isn&apos;t for</h2>
              <ul className="space-y-3 text-ap-mid font-medium leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-ap-muted shrink-0">—</span>
                  Anyone looking for a magic button that builds the business without honest weekly choices.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-muted shrink-0">—</span>
                  People who won&apos;t engage with reflection—the 6Cs and Vital Action only work if you show up.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28 pt-4 bg-ap-bg">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <div className="bg-ap-off rounded-[20px] border border-ap-border p-8 sm:p-10 text-center">
            <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-3">
              The name &quot;ALFRED&quot;?
            </h2>
            <p className="text-ap-mid font-medium leading-relaxed mb-8">
              It&apos;s the acronym for <strong className="text-ap-primary">Al</strong>igned{" "}
              <strong className="text-ap-primary">Fre</strong>e<strong className="text-ap-primary">d</strong>om Coach—a
              handle with personality. Same product as <strong className="text-ap-primary">Aligned Freedom Coach</strong>
              . Pick whichever helps you actually open the app.
            </p>
            <p className="text-ap-mid font-medium mb-8">
              Not ready for the app yet? Start free:{" "}
              <Link href="/work-with-me/freedom-builders" className="text-gradient-accent font-semibold hover:underline">
                Freedom Builders + Aligned Freedom Course
              </Link>
              ,{" "}
              <Link href="/work-with-me/freedom-workshop" className="text-gradient-accent font-semibold hover:underline">
                monthly workshop
              </Link>
              , or{" "}
              <Link href="/work-with-me/apply" className="text-gradient-accent font-semibold hover:underline">
                apply to the Accelerator
              </Link>{" "}
              when you want the full container.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <a
                href={ALFRED_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-pill inline-flex items-center justify-center bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill"
              >
                Open Aligned Freedom Coach
              </a>
              <Link
                href="/work-with-me"
                className="inline-flex items-center justify-center px-6 py-4 rounded-pill border-[1.5px] border-ap-border text-ap-primary font-semibold hover:border-ap-accent transition-all"
              >
                All programs &amp; workshops
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
