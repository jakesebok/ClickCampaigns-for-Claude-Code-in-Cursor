import Link from "next/link";
import type { Metadata } from "next";
import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";
import { AlfredHeroPhone } from "@/components/alfred-hero-phone";

const ALFRED_APP_URL = "https://alfredai.coach";

const ogDescription =
  "Aligned Freedom Coach (ALFRED): coaching that keeps your VAPI™ results, Founder Archetype, pattern driver, 28-day My Plan, weekly check-ins, and strategic context in the conversation when real life gets loud.";

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
    title: "Daily Sparks",
    body: "Light coaching prompts when you want to name how you are showing up before your inbox names it for you. Encouraging, on-brand, and never a performance scoreboard.",
  },
];

export default function WhoIsAlfredPage() {
  return (
    <>
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 bg-ap-bg overflow-hidden">
        {/* Soft under-glow for depth */}
        <div
          className="pointer-events-none absolute -top-[12%] -left-[8%] z-0 h-[72%] w-[min(110vw,820px)] sm:h-[64%] sm:w-[min(100vw,880px)] lg:top-0 lg:left-0 lg:h-[115%] lg:w-[min(78vw,960px)] xl:w-[min(72vw,1000px)] rounded-[35%] bg-ap-accent/50 blur-[52px] opacity-[0.85]"
          aria-hidden
        />
        {/* Primary shard — sharp tech slice + intense gradient */}
        <div
          className="pointer-events-none absolute top-0 left-0 z-0 h-[60%] w-[min(92vw,660px)] sm:h-[54%] sm:w-[min(88vw,740px)] lg:h-full lg:w-[min(72vw,900px)] xl:w-[min(66vw,960px)] bg-gradient-to-br from-ap-accent/55 via-ap-accent/48 to-ap-accent-2/38 shadow-[0_0_100px_-8px_rgba(255,107,26,0.55),32px_8px_80px_-20px_rgba(255,107,26,0.42),inset_0_1px_0_rgba(255,255,255,0.22)]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 22%, 58% 100%, 0% 92%)",
            filter: "drop-shadow(0 0 28px rgba(255,107,26,0.35))",
          }}
          aria-hidden
        />
        {/* Specular edge strip */}
        <div
          className="pointer-events-none absolute top-0 left-0 z-0 h-[60%] w-[min(92vw,660px)] sm:h-[54%] sm:w-[min(88vw,740px)] lg:h-full lg:w-[min(72vw,900px)] xl:w-[min(66vw,960px)] bg-gradient-to-b from-white/25 via-transparent to-transparent opacity-70 mix-blend-soft-light"
          style={{ clipPath: "polygon(0% 0%, 72% 0%, 100% 18%, 48% 55%, 0% 35%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(220px,340px)] gap-8 sm:gap-10 lg:gap-14 xl:gap-16 items-center">
            <div className="max-w-xl lg:max-w-none">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
                Aligned Freedom Coach
              </p>
              <h1 className="font-outfit font-bold text-4xl sm:text-[2.65rem] lg:text-[2.75rem] text-ap-primary leading-[1.1] mb-5 sm:mb-6">
                The coach that remembers what matters.
              </h1>

              <AlfredHeroPhone className="lg:hidden mb-8" />

              <p className="text-lg sm:text-xl font-semibold text-ap-mid leading-relaxed mb-8">
                ALFRED keeps your best decisions in the room when your energy is low and the week gets loud.
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
              </div>
              <p className="text-ap-primary text-sm font-semibold mt-4 max-w-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]">
                {ALFRED_APP_URL.replace("https://", "")} · 7-day trial for new accounts; extended access for Intensive
                and Accelerator clients.
              </p>
            </div>

            <AlfredHeroPhone className="hidden lg:block relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0" />
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-24 lg:py-28 text-white overflow-x-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-ap-primary via-ap-primary-2 to-[#2d3d52]"
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-ap-accent z-[1]" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ap-accent z-[1]" aria-hidden />
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="relative isolate flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-10 lg:gap-10 xl:gap-14">
            <div className="relative z-20 max-w-[720px] shrink-0 lg:max-w-[min(100%,36rem)] xl:max-w-[min(100%,40rem)] lg:z-10 lg:py-1 lg:pr-6 max-lg:drop-shadow-[0_2px_24px_rgba(14,22,36,0.65)]">
              <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white mb-4">
                This is not a generic chat coach
              </h2>
              <div className="space-y-5 text-white/80 font-medium leading-relaxed text-lg">
                <p>
                  You already have models that can sound wise for thirty seconds. The crack shows up midweek, when energy
                  dips, boundaries wobble, and the chat you opened has no memory of what you decided mattered last month.
                </p>
                <p>
                  ALFRED is built for the gap between a good insight and actually following through. This is coaching that
                  remembers what you committed to, so you are not re-explaining your life every time you need a steady
                  voice. ALFRED already knows where your relationships are stretched thin, how your archetype tends to
                  over-correct, and the one commitment that protects both your health and your revenue this week.
                </p>
                <p className="text-gradient-accent font-semibold">
                  ALFRED cuts the noise. You execute.
                </p>
              </div>
            </div>
            <div className="relative z-0 flex flex-1 min-w-0 min-h-0 justify-center self-stretch max-lg:absolute max-lg:inset-0 max-lg:pointer-events-none lg:min-w-[min(45%,320px)] lg:justify-center lg:px-2 xl:px-4">
              <div className="flex h-full min-h-[200px] w-full max-w-full items-center justify-center max-lg:py-6 lg:min-h-full lg:justify-center lg:overflow-visible">
                <img
                  src="/images/phone_with_natural_shadow.png"
                  alt="ALFRED dashboard on iPhone"
                  className="pointer-events-none h-auto max-h-[min(52vh,420px)] w-full max-w-[min(92vw,380px)] object-contain object-center max-lg:opacity-[0.3] opacity-100 select-none sm:max-h-[min(58vh,480px)] sm:max-w-[min(92vw,440px)] lg:h-[90%] lg:min-h-[400px] lg:max-h-[min(88vh,960px)] lg:w-auto lg:max-w-full lg:object-center lg:origin-center lg:scale-[1.72] lg:-translate-y-1 xl:-translate-y-2 drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="alfred-product-explorer"
        className="py-14 sm:py-24 bg-ap-bg border-b border-ap-border overflow-hidden scroll-mt-24"
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="max-w-[720px] mx-auto mb-12 text-center">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
              Who&apos;s in the room with you?
            </h2>
            <p className="text-lg text-ap-mid font-medium leading-relaxed mb-3">
              Serious operators have always had someone in the earpiece: calm, informed, willing to say the quiet part out
              loud. ALFRED is that kind of steady presence for founders, without the cave and the cape.
            </p>
            <details className="mx-auto w-fit text-left">
              <summary className="cursor-pointer text-sm text-ap-muted font-semibold hover:text-ap-mid transition-colors">
                Tour notes
              </summary>
              <p className="mt-3 max-w-[720px] text-sm text-ap-muted font-medium leading-relaxed">
                The tour auto-runs through Dashboard, Coach, Voice, Results, Drivers, and More after this section enters
                view. Use nav/menu, pause, arrows, or dots to explore. Hover the phone to freeze auto-advance; desktop
                card hover jumps to a highlight. Labels/layout mirror the live product, while coach replies use
                illustrative sample context.
              </p>
            </details>
          </div>
          <AlfredFeatureExplorer hidePreviewDisclaimer />
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
          <ul className="grid sm:grid-cols-3 gap-6 mb-12">
            {dailyItems.map((item) => (
              <li key={item.title} className="rounded-[16px] bg-ap-off border border-ap-border p-6">
                <h3 className="font-outfit font-bold text-base text-ap-primary mb-2">{item.title}</h3>
                <p className="text-sm text-ap-mid font-medium leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
          <blockquote className="border-l-4 border-ap-accent pl-5 sm:pl-6 max-w-[720px]">
            <p className="text-lg sm:text-xl font-semibold text-ap-primary leading-relaxed italic mb-3">
              &ldquo;I built ALFRED because I wanted something that would challenge me and optimize for what I actually
              want, not whatever looks shiny at 11&nbsp;p.m. The mission, vision, values docs that you throw in a drawer
              and forget about? Here, along with your assessment results, founder archetype, and weekly reflections, they
              stay current and alive in the conversation — in front of you and guiding your decisions when resolve runs
              thin.&rdquo;
            </p>
            <cite className="not-italic text-sm font-semibold text-ap-mid">— Jake Sebok</cite>
          </blockquote>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-ap-bg">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            The usual AI coach vs ALFRED
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-8">
            Most “AI coaches” are a clever model in a blank chat: impressive for a minute, amnesiac by Tuesday. ALFRED
            is built for the stretch between a good answer and a lived week. Your blueprint, assessment, archetype,
            pattern, scorecard, and Vital Action stay in the room so the voice you hear is about you, not a template.
          </p>
          <div className="overflow-x-auto rounded-[20px] border border-ap-border bg-white">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-ap-border bg-ap-off">
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-primary"> </th>
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-primary">Typical AI chat coach</th>
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-accent">ALFRED</th>
                </tr>
              </thead>
              <tbody className="text-ap-mid font-medium">
                <tr className="border-b border-ap-border">
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Memory of you</td>
                  <td className="p-4 sm:p-5">
                    Context lives in whatever you paste today. Threads, tabs, and models forget your last hard decision.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Your Alignment Blueprint, VAPI™ read, archetype, driver pattern, 6Cs, and Vital Action stay loaded, so
                    you are not re-opening your life story every night.
                  </td>
                </tr>
                <tr className="border-b border-ap-border">
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Advice quality</td>
                  <td className="p-4 sm:p-5">
                    Generic hustle templates dressed up in your industry’s keywords. No real values filter, no map of
                    what it would cost you to say yes.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Answers run through your stated values, capacity, and revenue math, with Fire Starters and coaching
                    prompts wired to the same framework Jake uses in the room.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Operating rhythm</td>
                  <td className="p-4 sm:p-5">
                    No honest weekly structure unless you invent and police it yourself.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Built-in cadence: dashboard, coach, voice, results, scorecard, and Daily Sparks so
                    alignment shows up when willpower thins, not only when you remember to open a chat.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ap-muted mt-4 max-w-[720px]">
            Your <strong className="text-ap-mid">Aligned AIOS</strong> master prompt from Strategic Clarity still runs in
            ChatGPT, Claude, or Gemini whenever you want it. ALFRED is for founders who want that same strategic spine
            with persistence, assessment depth, and a product that does not quit when the week gets loud. It ships after
            Phase II in the Accelerator or through a{" "}
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
            <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">
              Why the name &quot;ALFRED&quot;?
            </h2>
            <p className="text-ap-mid font-medium leading-relaxed mb-4 max-w-[560px] mx-auto">
              <strong className="text-ap-primary">ALFRED</strong> is short for{" "}
              <strong className="text-ap-primary">Aligned Freedom Coach</strong>.
            </p>
            <p className="text-ap-mid font-medium leading-relaxed mb-4 max-w-[560px] mx-auto">
              The name also tips its hat to the other famous Alfred: the one in the earpiece who had Bruce&apos;s six,
              remembered what mattered, and never needed the spotlight.
            </p>
            <p className="text-ap-mid font-medium leading-relaxed mb-8 max-w-[560px] mx-auto">
              If you like word-nerd trivia, the Old English roots boil down to counsel, advice, wisdom. Read it as{" "}
              <em>trusted counsel</em>, not a random syllable salad.
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
              when you want the full program.
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
