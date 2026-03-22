import Link from "next/link";
import type { Metadata } from "next";
import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

const ALFRED_APP_URL = "https://alfredai.coach";

const ogDescription =
  "Aligned Freedom Coach (ALFRED): AI coaching that keeps your assessment, archetype, pattern, weekly check-ins, and strategic context alive in the room so accountability survives real life.";

export const metadata: Metadata = {
  title: "Aligned Freedom Coach (ALFRED): Coaching That Keeps Your Priorities Alive | Jake Sebok",
  description: ogDescription,
  alternates: {
    canonical: "/who-is-alfred",
  },
  openGraph: {
    title: "Aligned Freedom Coach (ALFRED): Coaching That Keeps Your Priorities Alive",
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
        alt: "Jake Sebok | Aligned Freedom Coach (ALFRED)",
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

const dailyItems = [
  {
    title: "Coaching chat",
    body: "Plain language when you’re stuck. Answers that already know your bottlenecks instead of recycled hustle advice.",
  },
  {
    title: "Alignment Blueprint",
    body: "Your strategic story in one place so you stop re-pasting the same context into a blank chat window.",
  },
  {
    title: "Morning SMS (optional)",
    body: "A short nudge that matches your pace, not a performance contest.",
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
            The coach that still knows your priorities when you&apos;re tired, busy, or about to say yes to the wrong
            thing.
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-ap-mid leading-relaxed mb-6">
            I built <span className="text-ap-primary">ALFRED</span> (Aligned Freedom Coach) because I wanted something
            that would challenge me and optimize for{" "}
            <span className="text-gradient-accent">what I actually want</span>, not whatever looks shiny at 11 p.m.
            Your assessment, archetype, pattern, weekly check-ins, and the mission, vision, and values work too many
            founders file away? Here they stay current, in the conversation, and in front of you when resolve runs thin.
          </p>
          <p className="text-lg font-medium text-ap-mid leading-relaxed mb-10">
            Generic AI hands you clever paragraphs. This is coaching tethered to your real commitments, so you are not
            re-explaining your life every time you need a steady voice.
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
            Not just another AI coach
          </h2>
          <div className="max-w-[720px] space-y-5 text-ap-mid font-medium leading-relaxed text-lg">
            <p>
              You already have models that can sound wise for thirty seconds. The crack shows up midweek, when energy
              dips, boundaries wobble, and the chat you opened has no memory of what you decided mattered last month.
            </p>
            <p>
              ALFRED is for the stretch between insight and follow-through: the voice that recalls where your
              relationships are stretched thin, how your archetype tends to over-correct, and the one commitment that
              protects both your health and your revenue this week.
            </p>
            <p>
              Repetition is not a character flaw. It is how humans stay honest. The app holds the frame so you can do the
              work.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-24 bg-ap-bg border-b border-ap-border overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            Who&apos;s in the room with you?
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-3">
            Every legendary operator had someone in the earpiece: calm, informed, unafraid to say the quiet part out
            loud. ALFRED is that steady presence for founders, minus the cave and the cape. A little wink, a lot of
            leverage.
          </p>
          <p className="text-sm text-ap-muted font-medium max-w-[720px] mb-12">
            Explore the phone: hover each panel on desktop to jump the tour. Pause anytime. On mobile, use the dots and
            arrows.
          </p>
          <AlfredFeatureExplorer />
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-ap-border">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            How it shows up in a real week
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-10">
            Simple surfaces. No shame scoreboards. Built for people who already have too many tabs open.
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
            Same north star. Different leverage. Many folks run both for a while; operators who want persistence usually
            land in the app.
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
                  <td className="p-4 sm:p-5">
                    Master prompt and blueprint from Strategic Clarity. Runs inside ChatGPT, Claude, Gemini, or similar.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    A dedicated app with memory, scorecards, Vital Action, and your assessment data wired in.
                  </td>
                </tr>
                <tr className="border-b border-ap-border">
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Best for</td>
                  <td className="p-4 sm:p-5">“I want my favorite model to know my worksheets.”</td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    “I want this to survive my real calendar without re-pasting context every night.”
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Live rhythm</td>
                  <td className="p-4 sm:p-5">You paste what you remember; the model does not track your week for you.</td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Built-in cadence: assessment, archetype, pattern, weekly check-ins, Vital Action, updated as you use
                    it.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ap-muted mt-4 max-w-[720px]">
            Aligned AIOS ships at the end of Phase II (Strategic Clarity) inside the Accelerator or through a{" "}
            <Link
              href="/work-with-me/strategic-intensives"
              className="text-gradient-accent font-semibold hover:underline"
            >
              Strategic Alignment Intensive
            </Link>
            .
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
              Priced under what most people pay for a single coaching session each month, with everything included and
              no upsell maze inside the app. Current numbers live on the{" "}
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
              Strategic Alignment Intensive attendees and Aligned Power Accelerator clients receive extended trial
              access through the codes shared in program, because the tool is meant to extend what gets built in the
              room, not replace it.
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
                  Founders who want execution support that respects their assessment and stated priorities, not generic
                  tips.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  Operators balancing revenue pressure with values, health, and relationships.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  Anyone who wants their strategic context to live somewhere durable, not in a drawer.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">Who it isn&apos;t for</h2>
              <ul className="space-y-3 text-ap-mid font-medium leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-ap-muted shrink-0">·</span>
                  Anyone expecting a magic button that builds the business without honest weekly choices.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-muted shrink-0">·</span>
                  People unwilling to engage reflection. The rhythm only works if you show up.
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
              Short for Aligned Freedom Coach: Al, Fre, Dom. Same product whether you say ALFRED or the full name. Use
              whichever one gets you to open the app.
            </p>
            <p className="text-ap-mid font-medium mb-8">
              Not ready yet? Start free with{" "}
              <Link href="/work-with-me/freedom-builders" className="text-gradient-accent font-semibold hover:underline">
                Freedom Builders and the Aligned Freedom Course
              </Link>
              , join a{" "}
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
