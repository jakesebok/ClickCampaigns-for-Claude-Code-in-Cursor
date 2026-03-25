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
        {/* Massive ambient field — multi-stop oranges, no hard edges */}
        <div
          className="pointer-events-none absolute -top-[28%] -left-[35%] z-0 h-[135%] w-[min(165vw,1700px)] lg:-top-[18%] lg:-left-[22%] lg:h-[125%] lg:w-[min(140vw,1600px)] blur-[64px] opacity-[0.95]"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 22% 28%, rgba(255,107,26,0.55) 0%, rgba(255,140,66,0.32) 32%, rgba(255,159,107,0.18) 52%, rgba(234,88,12,0.08) 72%, transparent 88%)",
          }}
          aria-hidden
        />
        {/* Deep burnt-orange under-plane — angles DOWN (vs primary wedge) so the pair does not read as dual “uphill” behind the phone */}
        <div
          className="pointer-events-none absolute top-[4%] -left-[12%] z-0 h-[92%] w-[min(130vw,1420px)] lg:top-0 lg:-left-[6%] lg:h-full lg:w-[min(118vw,1500px)] opacity-[0.92]"
          style={{
            background:
              "linear-gradient(198deg, rgba(194,65,12,0.42) 0%, rgba(234,88,12,0.38) 32%, rgba(255,107,26,0.22) 62%, rgba(255,159,107,0.08) 100%)",
            clipPath: "polygon(6% 2%, 100% 0%, 86% 58%, 32% 100%, -3% 92%, 3% 44%)",
            filter: "drop-shadow(0 28px 90px rgba(234,88,12,0.35))",
          }}
          aria-hidden
        />
        {/* Primary blade — bright accent → peach, single diagonal sweep */}
        <div
          className="pointer-events-none absolute -top-[8%] -left-[20%] z-0 h-[105%] w-[min(135vw,1480px)] lg:-top-[4%] lg:-left-[10%] lg:h-[118%] lg:w-[min(122vw,1550px)]"
          style={{
            background:
              "linear-gradient(138deg, #ff6b1a 0%, #ff7b2e 18%, #ff8f4a 36%, #ff9f6b 55%, rgba(255,159,107,0.35) 78%, rgba(255,107,26,0.06) 100%)",
            clipPath: "polygon(0% 0%, 100% 4%, 52% 100%, -4% 96%)",
            filter: "drop-shadow(0 20px 70px rgba(255,107,26,0.5))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
          aria-hidden
        />
        {/* Clean foil highlight — diagonal light only */}
        <div
          className="pointer-events-none absolute -left-[18%] top-0 z-0 h-[52%] w-[min(100vw,1100px)] mix-blend-soft-light opacity-[0.55] lg:-left-[8%]"
          style={{
            background: "linear-gradient(118deg, rgba(255,255,255,0.5) 0%, rgba(255,214,188,0.25) 28%, transparent 62%)",
            clipPath: "polygon(0% 0%, 78% 0%, 32% 62%, 0% 22%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,340px)] md:gap-10 lg:gap-14 xl:gap-16 items-center">
            <div className="max-w-xl md:max-w-none">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-mid mb-4 text-center md:text-left">
                Aligned Freedom Coach
              </p>
              <h1 className="font-outfit font-bold text-4xl sm:text-[2.65rem] lg:text-[2.75rem] text-ap-primary leading-[1.1] mb-5 sm:mb-6 text-center md:text-left">
                The coach that remembers what matters.
              </h1>

              <AlfredHeroPhone className="md:hidden mb-8" />

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
              <p className="text-ap-primary text-sm font-semibold mt-4 max-w-xl">
                {ALFRED_APP_URL.replace("https://", "")} · 7-day trial for new accounts; extended access for Intensive
                and Accelerator clients.
              </p>
            </div>

            <AlfredHeroPhone className="hidden md:block relative w-full max-w-md mx-auto md:max-w-none md:mx-0" />
          </div>
        </div>
      </section>

      <section className="relative isolate z-10 py-20 sm:py-24 lg:py-28 text-white overflow-x-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-ap-primary via-ap-primary-2 to-[#2d3d52]"
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-ap-accent z-[1]" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ap-accent z-[1]" aria-hidden />
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="relative flex flex-col md:flex-row md:items-stretch md:justify-between gap-10 md:gap-6 lg:gap-10 xl:gap-14">
            <div className="relative z-20 flex min-w-0 w-full flex-col max-w-[720px] max-md:max-w-none md:max-w-[min(28rem,48%)] lg:max-w-[min(34rem,50%)] xl:max-w-[min(40rem,52%)] md:shrink md:z-10 lg:py-1 md:pr-3 lg:pr-6 max-md:drop-shadow-none md:drop-shadow-[0_2px_24px_rgba(14,22,36,0.65)]">
              <div className="order-1 flex justify-center md:hidden my-2 mb-6">
                <img
                  src="/images/phone_with_natural_shadow.png"
                  alt="ALFRED dashboard on iPhone"
                  className="pointer-events-none h-auto max-h-[min(58vh,440px)] w-full max-w-[min(92vw,380px)] object-contain object-center opacity-100 select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
                />
              </div>
              <h2 className="order-2 md:order-1 font-outfit font-bold text-2xl sm:text-3xl text-white mb-4 max-md:mt-0">
                This is not a generic chat coach
              </h2>
              <div className="order-3 md:order-2 space-y-5 text-white/80 font-medium leading-relaxed text-lg">
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
            <div className="hidden md:flex relative z-0 min-h-0 min-w-0 flex-1 shrink-0 items-stretch justify-center self-stretch md:min-w-[min(52%,300px)] md:max-w-[min(68%,560px)] lg:min-w-[min(40%,280px)] lg:max-w-none md:px-0 lg:px-2 xl:px-4">
              <div className="flex h-full min-h-[280px] w-full max-w-full items-center justify-center md:min-h-[min(52vh,420px)] lg:min-h-full lg:overflow-visible md:py-2 lg:py-0">
                <img
                  src="/images/phone_with_natural_shadow.png"
                  alt="ALFRED dashboard on iPhone"
                  className="pointer-events-none h-auto max-h-[min(58vh,480px)] w-full max-w-full object-contain object-center opacity-100 select-none backface-hidden md:max-h-[min(78vh,640px)] md:max-w-[min(100%,500px)] md:scale-[1.62] md:origin-center lg:max-h-none lg:max-w-full lg:h-[90%] lg:min-h-[400px] lg:max-h-[min(88vh,960px)] lg:w-auto lg:scale-[1.72] lg:-translate-y-1 xl:-translate-y-2 [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.32))]"
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
            <details className="group mx-auto w-full max-w-[720px] text-left">
              <summary className="cursor-pointer list-none flex items-center justify-center gap-2 text-sm text-ap-muted font-semibold hover:text-ap-mid transition-colors [&::-webkit-details-marker]:hidden">
                <span>Tour notes</span>
                <svg
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-ap-muted font-medium leading-relaxed">
                The tour auto-runs through Dashboard, Coach, Voice, Results, Drivers, and More after this section enters
                view. Use nav/menu, pause, arrows, or dots to explore. Hover the phone to freeze auto-advance; desktop
                card hover jumps to a highlight. Labels/layout mirror the live product, while coach replies use
                illustrative sample context.
              </p>
            </details>
          </div>
          <AlfredFeatureExplorer hidePreviewDisclaimer />

          <div className="relative mt-14 sm:mt-16 max-w-[880px] mx-auto px-0 sm:px-2" aria-label="Why Jake built ALFRED">
            <blockquote className="rounded-2xl border border-ap-border border-l-4 border-l-ap-accent bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_24px_60px_-28px_rgba(14,22,36,0.18)]">
              <p className="text-lg sm:text-xl font-semibold text-ap-primary leading-relaxed italic text-center sm:text-left mb-4">
                &ldquo;I built ALFRED because I wanted something that would challenge me and optimize for what I actually
                want, not whatever looks shiny at 11&nbsp;p.m. The mission, vision, values docs that you throw in a drawer
                and forget about? Here, along with your assessment results, founder archetype, and weekly reflections, they
                stay current and alive in the conversation — in front of you and guiding your decisions when resolve runs
                thin.&rdquo;
              </p>
              <cite className="not-italic block text-center sm:text-left text-sm font-semibold text-ap-mid">
                — Jake Sebok
              </cite>
            </blockquote>
          </div>
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

      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-ap-bg border-y border-ap-border">
        <div
          className="pointer-events-none absolute -top-28 right-[-18%] h-[min(72vw,560px)] w-[min(72vw,560px)] rounded-full opacity-[0.38] blur-[88px]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,107,26,0.5) 0%, rgba(255,159,107,0.18) 48%, transparent 72%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-[12%] h-56 w-[min(95vw,720px)] rounded-full opacity-30 blur-[72px] bg-gradient-to-tr from-ap-accent/35 via-ap-accent-2/15 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="rounded-[22px] sm:rounded-[28px] border border-ap-border bg-white shadow-[0_36px_110px_-42px_rgba(14,22,36,0.22)] overflow-hidden grid lg:grid-cols-[minmax(260px,360px)_1fr]">
            <div className="relative bg-ap-primary px-8 py-10 sm:px-10 sm:py-12 lg:px-11 lg:py-14 text-white overflow-hidden">
              <div
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-[0.35] blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(255,107,26,0.75) 0%, transparent 68%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-8 left-1/2 h-40 w-[140%] -translate-x-1/2 opacity-20 blur-2xl bg-gradient-to-t from-ap-accent/50 to-transparent"
                aria-hidden
              />
              <p className="relative font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent-2/95 mb-4">
                Straightforward access
              </p>
              <h2 className="relative font-outfit font-bold text-[1.65rem] sm:text-3xl leading-[1.12] mb-5">
                Simple pricing.{" "}
                <span className="text-gradient-accent-hero [text-shadow:none]">No upsell maze</span>
              </h2>
              <p className="relative text-[17px] sm:text-lg text-white/82 font-medium leading-relaxed">
                One product. One lane. No scavenger hunt for the real features after you sign in.
              </p>
            </div>

            <div className="relative px-8 py-10 sm:px-10 sm:py-12 lg:pl-12 lg:pr-11 lg:py-14 bg-gradient-to-br from-white via-white to-ap-bg/70">
              <ul className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                <li className="rounded-2xl border border-ap-border bg-ap-off/90 px-4 py-4 sm:px-5 sm:py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  <p className="font-outfit font-bold text-sm text-ap-primary mb-1.5">Session-priced</p>
                  <p className="text-xs sm:text-[13px] text-ap-mid font-medium leading-relaxed">
                    Monthly cost sits under what many founders pay for a single coaching hour.
                  </p>
                </li>
                <li className="rounded-2xl border border-ap-border bg-ap-off/90 px-4 py-4 sm:px-5 sm:py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  <p className="font-outfit font-bold text-sm text-ap-primary mb-1.5">All-in</p>
                  <p className="text-xs sm:text-[13px] text-ap-mid font-medium leading-relaxed">
                    Full experience inside ALFRED. No upsell maze between you and the work.
                  </p>
                </li>
                <li className="rounded-2xl border border-ap-border bg-white px-4 py-4 sm:px-5 sm:py-5 shadow-[0_0_0_1px_rgba(255,107,26,0.12),0_18px_40px_-28px_rgba(255,107,26,0.35)] sm:col-span-1">
                  <p className="font-outfit font-bold text-sm text-gradient-accent mb-1.5">Programs extend the room</p>
                  <p className="text-xs sm:text-[13px] text-ap-mid font-medium leading-relaxed">
                    Intensive and Accelerator clients get extended trial access through program codes, so the app backs
                    what you build live.
                  </p>
                </li>
              </ul>

              <div className="space-y-5 text-ap-mid font-medium leading-relaxed text-base sm:text-lg">
                <p>
                  Current price and plan details live on the{" "}
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
                <a
                  href={`${ALFRED_APP_URL}/pricing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-base px-7 py-3.5 rounded-pill transition-all w-full sm:w-auto"
                >
                  View live pricing
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
