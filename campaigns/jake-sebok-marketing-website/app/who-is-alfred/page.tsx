import Link from "next/link";
import type { Metadata } from "next";
import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";
import { AlfredHeroPhone } from "@/components/alfred-hero-phone";

const ALFRED_APP_URL = "https://alfredai.coach";

const ogDescription =
  "Aligned Freedom Coach (ALFRED): clarity in your pocket when the week gets loud. It keeps what matters, what you promised, and your next best move in front of you when pressure hits.";

export const metadata: Metadata = {
  title: "Aligned Freedom Coach (ALFRED): Clarity In Your Pocket When It Matters | Jake Sebok",
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
    body: "Straight answers when you are stuck, overloaded, or about to say yes to the wrong thing.",
  },
  {
    title: "What matters stays close",
    body: "Your priorities, commitments, and why they matter stay visible, so you do not waste energy finding your footing again.",
  },
  {
    title: "Quick check-ins",
    body: "Short prompts that pull you back to what matters before the week gets away from you.",
  },
];

export default function WhoIsAlfredPage() {
  return (
    <>
      <section className="relative pt-16 sm:pt-24 pb-14 sm:pb-[4.5rem] lg:pb-24 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none absolute -top-[28%] -left-[35%] z-0 h-[135%] w-[min(165vw,1700px)] lg:-top-[18%] lg:-left-[22%] lg:h-[125%] lg:w-[min(140vw,1600px)] blur-[64px] opacity-[0.95]"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 22% 28%, rgba(255,107,26,0.55) 0%, rgba(255,140,66,0.32) 32%, rgba(255,159,107,0.18) 52%, rgba(234,88,12,0.08) 72%, transparent 88%)",
          }}
          aria-hidden
        />
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
        <div
          className="pointer-events-none absolute -left-[18%] top-0 z-0 h-[52%] w-[min(100vw,1100px)] mix-blend-soft-light opacity-[0.55] lg:-left-[8%]"
          style={{
            background: "linear-gradient(118deg, rgba(255,255,255,0.5) 0%, rgba(255,214,188,0.25) 28%, transparent 62%)",
            clipPath: "polygon(0% 0%, 78% 0%, 32% 62%, 0% 22%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-6">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-[minmax(0,1.02fr)_minmax(250px,380px)] md:gap-10 lg:gap-16 xl:gap-20 items-center">
            <div className="max-w-xl md:max-w-none">
              <div className="relative overflow-hidden rounded-[28px] border border-white/75 bg-white/78 px-6 py-7 shadow-[0_34px_90px_-48px_rgba(14,22,36,0.34)] backdrop-blur-md sm:px-8 sm:py-9 lg:px-10 lg:py-10">
                <div
                  className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full blur-3xl opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,159,107,0.32) 0%, rgba(255,159,107,0.12) 40%, transparent 74%)",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full blur-3xl opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(58,74,92,0.16) 0%, rgba(58,74,92,0.08) 40%, transparent 76%)",
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-mid mb-4 text-center md:text-left">
                    Aligned Freedom Coach
                  </p>
                  <h1 className="font-outfit font-bold text-4xl sm:text-[2.65rem] lg:text-[2.8rem] text-ap-primary leading-[1.08] tracking-tight mb-5 sm:mb-6 text-center md:text-left">
                    Clarity in your pocket when it matters.
                  </h1>
                  <p className="text-lg sm:text-xl font-semibold text-ap-mid leading-relaxed mb-6">
                    ALFRED keeps your priorities in front of you when the week gets loud, so you can make clean
                    decisions fast without losing what matters.
                  </p>
                  <ul className="flex flex-wrap gap-2.5 mb-7">
                    <li className="rounded-full border border-ap-border bg-white/85 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ap-mid">
                      Keeps what matters visible
                    </li>
                    <li className="rounded-full border border-ap-border bg-ap-off/90 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ap-mid">
                      Clear decisions under pressure
                    </li>
                    <li className="rounded-full border border-[rgba(255,107,26,0.18)] bg-[rgba(255,247,240,0.94)] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#b6531b]">
                      Built for the messy week
                    </li>
                    <li className="rounded-full border border-ap-border bg-white/85 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ap-mid">
                      Steady, useful guidance
                    </li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <a
                      href={ALFRED_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-pill inline-flex items-center justify-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
                    >
                      Start My 7-Day Trial
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
                    {ALFRED_APP_URL.replace("https://", "")} · 7-day trial for new accounts; extended access for
                    Intensive and Accelerator clients.
                  </p>
                </div>
              </div>

            </div>

            <div className="hidden md:block relative">
              <div
                className="pointer-events-none absolute inset-x-[12%] top-[16%] h-[58%] rounded-full blur-[72px] opacity-[0.9]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,159,107,0.44) 0%, rgba(255,107,26,0.22) 34%, rgba(14,22,36,0.08) 70%, transparent 82%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-[8%] inset-x-[8%] rounded-[36px] border border-white/45 bg-[linear-gradient(155deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08)_34%,rgba(14,22,36,0.08)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                aria-hidden
              />
              <AlfredHeroPhone className="relative z-10 w-full max-w-md mx-auto md:max-w-none md:mx-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate z-10 py-20 sm:py-24 lg:py-28 text-white [overflow-x:clip]">
        <div
          className="absolute inset-0 bg-gradient-to-b from-ap-primary via-ap-primary-2 to-[#2d3d52]"
          aria-hidden
        />
        <div
          className="absolute -top-[24%] -left-[22%] z-0 h-[120%] w-[min(118vw,1320px)] blur-[44px] opacity-[0.68]"
          style={{
            background:
              "radial-gradient(ellipse 76% 62% at 24% 28%, rgba(255,107,26,0.42) 0%, rgba(255,140,66,0.2) 30%, rgba(255,159,107,0.08) 54%, transparent 76%)",
          }}
          aria-hidden
        />
        <div
          className="absolute top-[2%] -left-[10%] z-0 h-[95%] w-[min(122vw,1380px)] opacity-[0.46]"
          style={{
            background:
              "linear-gradient(196deg, rgba(194,65,12,0.32) 0%, rgba(234,88,12,0.28) 30%, rgba(255,107,26,0.12) 58%, rgba(255,159,107,0.04) 100%)",
            clipPath: "polygon(5% 3%, 100% 0%, 84% 60%, 28% 100%, -2% 92%, 2% 42%)",
          }}
          aria-hidden
        />
        <div
          className="absolute -top-[6%] right-[-10%] z-0 hidden h-[112%] w-[min(70vw,980px)] lg:block"
          style={{
            background:
              "linear-gradient(138deg, rgba(255,107,26,0.34) 0%, rgba(255,123,46,0.2) 24%, rgba(255,159,107,0.1) 52%, rgba(255,107,26,0.02) 100%)",
            clipPath: "polygon(24% 0%, 100% 4%, 74% 100%, 0% 96%)",
            filter: "drop-shadow(0 18px 60px rgba(255,107,26,0.24))",
          }}
          aria-hidden
        />
        <div
          className="absolute left-0 top-0 z-0 h-[46%] w-[min(90vw,960px)] mix-blend-soft-light opacity-[0.32]"
          style={{
            background: "linear-gradient(118deg, rgba(255,255,255,0.36) 0%, rgba(255,214,188,0.14) 24%, transparent 62%)",
            clipPath: "polygon(0% 0%, 78% 0%, 30% 62%, 0% 20%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(10,16,27,0.9)_0%,rgba(18,27,44,0.93)_54%,rgba(33,47,67,0.96)_100%)] shadow-[0_42px_120px_-54px_rgba(0,0,0,0.62)]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,159,107,0.8)] to-transparent" aria-hidden />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,159,107,0.5)] to-transparent" aria-hidden />
            <div
              className="pointer-events-none absolute inset-y-0 right-[-10%] z-0 hidden w-[46%] lg:block"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,107,26,0.18) 0%, rgba(255,159,107,0.08) 34%, rgba(255,255,255,0) 82%)",
                clipPath: "polygon(26% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col md:flex-row md:items-stretch md:justify-between gap-10 md:gap-6 lg:gap-10 xl:gap-14 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12">
              <div className="relative z-20 flex min-w-0 w-full flex-col max-w-[720px] max-md:max-w-none md:max-w-[min(30rem,48%)] lg:max-w-[min(36rem,50%)] xl:max-w-[min(40rem,52%)] md:shrink">
                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:px-8 sm:py-8">
                  <div className="flex justify-center md:hidden my-1 mb-6">
                    <div className="relative">
                      <div
                        className="pointer-events-none absolute inset-x-[16%] top-[18%] h-[58%] rounded-full blur-[42px] opacity-[0.72]"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(255,159,107,0.5) 0%, rgba(255,107,26,0.16) 44%, transparent 78%)",
                        }}
                        aria-hidden
                      />
                      <img
                        src="/images/phone_with_natural_shadow.png"
                        alt="ALFRED dashboard on iPhone"
                        className="relative z-10 pointer-events-none h-auto max-h-[min(58vh,440px)] w-full max-w-[min(92vw,360px)] object-contain object-center opacity-100 select-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
                      />
                    </div>
                  </div>
                  <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white mb-4">
                    Generic AI falls apart when pressure hits.
                  </h2>
                  <div className="space-y-5 text-white/80 font-medium leading-relaxed text-lg">
                    <p>
                      Most AI feels smart when nothing is on fire. Then the week gets messy and you are back at square
                      one, trying to explain what matters, what you promised, and what you cannot afford to ignore.
                    </p>
                    <p>
                      ALFRED is built for that moment. He stays close to the real shape of your week, so you can make a
                      clean call and keep moving instead of starting over.
                    </p>
                    <p className="text-gradient-accent font-semibold">
                      When pressure rises, ALFRED brings you back to what matters.
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex relative z-0 min-h-0 min-w-0 flex-1 shrink-0 items-stretch justify-center self-stretch md:min-w-[min(52%,300px)] md:max-w-[min(68%,560px)] lg:min-w-[min(40%,280px)] lg:max-w-none md:px-0 lg:px-2 xl:px-4">
                <div
                  className="pointer-events-none absolute inset-x-[10%] top-[16%] h-[60%] rounded-full blur-[76px] opacity-[0.86]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,159,107,0.46) 0%, rgba(255,107,26,0.24) 34%, rgba(14,22,36,0.08) 72%, transparent 84%)",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-y-[6%] inset-x-[8%] rounded-[34px] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_32%,rgba(14,22,36,0.08)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  aria-hidden
                />
                <div className="relative flex h-full min-h-[280px] w-full max-w-full items-center justify-center md:min-h-[min(52vh,420px)] lg:min-h-full lg:overflow-visible md:py-2 lg:py-0">
                  <img
                    src="/images/phone_with_natural_shadow.png"
                    alt="ALFRED dashboard on iPhone"
                    className="pointer-events-none relative z-10 h-auto max-h-[min(58vh,480px)] w-full max-w-full object-contain object-center opacity-100 select-none backface-hidden md:max-h-[min(78vh,640px)] md:max-w-[min(100%,500px)] md:scale-[1.62] md:origin-center lg:max-h-none lg:max-w-full lg:h-[90%] lg:min-h-[400px] lg:max-h-[min(88vh,960px)] lg:w-auto lg:scale-[1.72] lg:-translate-y-1 xl:-translate-y-2 [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.32))]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="alfred-product-explorer"
        className="relative py-16 sm:py-24 bg-ap-bg border-b border-ap-border overflow-hidden scroll-mt-24"
      >
        <div
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[min(88vw,860px)] -translate-x-1/2 rounded-full blur-[72px] opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(255,159,107,0.42) 0%, rgba(255,107,26,0.12) 42%, transparent 76%)",
          }}
          aria-hidden
        />
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <div className="max-w-[760px] mx-auto mb-10 sm:mb-12 text-center">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
              Who&apos;s in the room with you?
            </h2>
            <p className="text-lg text-ap-mid font-medium leading-relaxed mb-4">
              Serious operators have always had someone in the earpiece: calm, informed, willing to say the truth out
              loud. ALFRED is that kind of steady presence for founders, without the cave and the cape.
            </p>
            <p className="text-lg text-ap-mid font-medium leading-relaxed mb-3">
              The feel matters. You are not meeting a productivity toy here. You are meeting a clear, grounded coach
              who can help you sort signal from noise when the stakes are real. This preview shows how ALFRED sounds in
              action.
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
                card hover jumps to a highlight. Labels and layout mirror the live product, while coach replies use
                illustrative sample situations.
              </p>
            </details>
          </div>
          <AlfredFeatureExplorer hidePreviewDisclaimer />

          <div className="relative mt-14 sm:mt-16 max-w-[880px] mx-auto px-0 sm:px-2" aria-label="Why Jake built ALFRED">
            <blockquote className="rounded-2xl border border-ap-border border-l-4 border-l-ap-accent bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_24px_60px_-28px_rgba(14,22,36,0.18)]">
              <p className="text-lg sm:text-xl font-semibold text-ap-primary leading-relaxed italic text-center sm:text-left mb-4">
                &ldquo;I built ALFRED because I wanted clarity I could actually carry into a hard week. Not another document
                I felt good about for a day, then forgot. What matters, what I decided, and what this season requires
                stay close here, so when pressure hits I can get real guidance without starting from scratch.&rdquo;
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
            Simple surfaces. Clear decisions. Built for people carrying too many moving pieces in their own head.
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
            Why the advice feels different
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-8">
            Most AI tools sound smart until life gets complicated. ALFRED is built for the real version of the
            question: what matters most, what you already promised, and what this decision will actually cost.
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
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Starting point</td>
                  <td className="p-4 sm:p-5">
                    You end up re-explaining the same priorities, promises, and tradeoffs every time the week gets hard.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    It already knows what matters, what you have been working on, and what you said you wanted this
                    season to look like.
                  </td>
                </tr>
                <tr className="border-b border-ap-border">
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Advice quality</td>
                  <td className="p-4 sm:p-5">
                    Generic hustle templates dressed up in your industry’s keywords. No real values filter, no map of
                    what it would cost you to say yes.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Advice is filtered through what matters most, what you can realistically carry, and what this week
                    actually demands.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-ap-primary font-semibold">Operating rhythm</td>
                  <td className="p-4 sm:p-5">
                    No honest weekly structure unless you invent and police it yourself.
                  </td>
                  <td className="p-4 sm:p-5 bg-ap-bg/80">
                    Check-ins, reviews, and prompts pull you back to what matters before the week drifts off course.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ap-muted mt-4 max-w-[720px]">
            If you have already built your <strong className="text-ap-mid">Aligned AIOS</strong> through Strategic
            Clarity, ALFRED can carry that fuller picture too. The simple promise is this: what matters stays close
            when the week gets noisy. It ships after Phase II in the Accelerator or through a{" "}
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
                Simple pricing.
                <span className="block text-gradient-accent-hero [text-shadow:none]">No upsell maze.</span>
              </h2>
              <p className="relative text-[17px] sm:text-lg text-white/82 font-medium leading-relaxed">
                One product. One clear lane. No scavenger hunt for the real value after you sign in.
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
                  Executives and founders who need clear thinking in the middle of a noisy week.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  Operators carrying too much in their own head and too many decisions on their plate.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-accent shrink-0">→</span>
                  People who want a coach in their pocket, not another smart tool they forget to use.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">Who it isn&apos;t for</h2>
              <ul className="space-y-3 text-ap-mid font-medium leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-ap-muted shrink-0">·</span>
                  Anyone looking for entertainment, novelty, or a magic button.
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-muted shrink-0">·</span>
                  Anyone unwilling to reflect, choose, and follow through.
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
              The name also nods to the other Alfred: the steady voice in the earpiece who remembered what mattered when
              the pressure was on.
            </p>
            <p className="text-ap-mid font-medium leading-relaxed mb-8 max-w-[560px] mx-auto">
              If you like word-nerd trivia, the roots point to wise counsel. That&apos;s the point.
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
                Start My 7-Day Trial
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
