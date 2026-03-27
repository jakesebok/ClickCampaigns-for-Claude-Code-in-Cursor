import Link from "next/link";
import type { Metadata } from "next";
import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";
import { AlfredHeroPhone } from "@/components/alfred-hero-phone";

const ALFRED_APP_URL = "https://alfredai.coach";

const ogDescription =
  "Aligned Freedom Coach (ALFRED): clarity in your pocket when the week gets loud. He keeps your priorities, tradeoffs, and next best move in front of you when pressure hits.";

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

const whatAlfredDoesItems = [
  {
    title: "Stops the drift",
    body: "When the week gets reactive, he pulls you back to the few things that actually matter.",
  },
  {
    title: "Keeps you from chasing the wrong thing",
    body: "He helps you tell whether a new opportunity is real or just shiny object syndrome dressed up as momentum.",
  },
  {
    title: "Protects your real priorities",
    body: "He keeps your real priorities in the room so the urgent does not quietly replace the important.",
  },
  {
    title: "Helps you make cleaner decisions",
    body: "He helps you weigh the upside, the cost, and what your life can actually hold before you say yes.",
  },
];

const proofItems = [
  {
    title: "He knows what matters to you",
    body: "He knows your values, your priorities, and the kind of life you are trying to build.",
  },
  {
    title: "He knows the game you are actually playing",
    body: "He knows your goals, your numbers, and the weekly sales activity required to make them real.",
  },
  {
    title: "He knows what your life can actually hold",
    body: "He knows your limits, your hard boundaries, and what your time, energy, and calendar can realistically carry.",
  },
  {
    title: "He sees where you are slipping",
    body: "Your weekly check-ins help him spot drift early, before a hard week quietly becomes a lost month.",
  },
];

const realWeekItems = [
  {
    title: "A new opportunity shows up at exactly the wrong time.",
    body: "He helps you tell whether it deserves a yes, a later, or a clean no before it steals time from what already matters.",
  },
  {
    title: "Your priorities are disappearing.",
    body: "He helps you reset around what still matters instead of letting urgency write the week for you.",
  },
  {
    title: "You need a hard yes or no.",
    body: "He helps you see the tradeoff clearly: the upside, the cost, and what saying yes will do to your time, focus, and energy.",
  },
  {
    title: "You know you are off, but you cannot tell where.",
    body: "He helps you see where you are breaking down, what needs repair, and what to change next.",
  },
];

const comparisonRows = [
  {
    label: "Starting point",
    generic: "Only knows what you type today.",
    alfred: "He knows what matters, what you are building, and what this season actually requires.",
  },
  {
    label: "Advice quality",
    generic: "Gives plausible answers that sound smart in the moment.",
    alfred: "He filters advice through your priorities, your goals, and your real-life limits.",
  },
  {
    label: "Decision support",
    generic: "Helps you react.",
    alfred: "He helps you decide in a way you can still respect a week later.",
  },
  {
    label: "Weekly rhythm",
    generic: "One-off help.",
    alfred: "He stays with you across the week and helps catch drift before it compounds.",
  },
];

const pressureItems = [
  "Priorities get blurry",
  "Urgency takes over",
  "The exciting thing hijacks the week",
  "Tradeoffs disappear",
];

const whoItsForItems = [
  "Founders and executives carrying too much in their head and too much on their plate.",
  "People with real responsibility, real pressure, and too many competing inputs.",
  "Operators who do not need more information. They need clearer thinking when it counts.",
];

const whoItIsntForItems = [
  "People looking for novelty, entertainment, or a magic button.",
  "People who want advice without reflection, ownership, or follow-through.",
  "People who want to be hyped up instead of called back to what matters.",
];

const heroPills = [
  "Keeps priorities visible",
  "Clear decisions under pressure",
  "Stops reactive detours",
  "Steady guidance in a messy week",
];

export default function WhoIsAlfredPage() {
  return (
    <div className="[overflow-x:clip]">
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
              <div className="relative overflow-hidden rounded-[28px] border border-white/78 bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(250,251,252,0.9)_46%,rgba(242,245,248,0.88)_100%)] px-6 py-7 shadow-[0_34px_90px_-48px_rgba(14,22,36,0.34)] backdrop-blur-md sm:px-8 sm:py-9 lg:px-10 lg:py-10">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.58]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)",
                  }}
                  aria-hidden
                />
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
                <div
                  className="pointer-events-none absolute -right-[14%] top-[-8%] h-[116%] w-[40%] opacity-[0.24]"
                  style={{
                    background:
                      "linear-gradient(162deg, rgba(36,52,73,0.12) 0%, rgba(73,90,112,0.07) 40%, rgba(73,90,112,0.02) 64%, rgba(255,255,255,0) 100%)",
                    clipPath: "polygon(24% 0%, 100% 8%, 84% 100%, 0% 92%)",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute right-[7%] bottom-[10%] h-34 w-34 rounded-full blur-[54px] opacity-[0.24]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(73,90,112,0.14) 0%, rgba(73,90,112,0.06) 40%, transparent 76%)",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(73,90,112,0.16)] to-transparent"
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-mid mb-4 text-center md:text-left">
                    Aligned Freedom Coach
                  </p>
                  <h1 className="font-outfit font-bold text-[2.65rem] sm:text-[3.1rem] lg:text-[3.3rem] text-ap-primary leading-[1.04] tracking-tight mb-5 sm:mb-6 text-center md:text-left">
                    Clarity in your pocket when it matters.
                  </h1>
                  <p className="max-w-[38rem] text-[1.05rem] sm:text-[1.24rem] font-semibold text-ap-mid leading-relaxed mb-6 text-center md:text-left">
                    ALFRED keeps what matters in front of you when the week gets loud, so you can make clean decisions
                    without losing your priorities, your values, or the life you are trying to build.
                  </p>
                  <ul className="flex flex-wrap gap-2.5 mb-7 max-w-[40rem] justify-center md:justify-start">
                    {heroPills.map((pill, index) => (
                      <li
                        key={pill}
                        className={
                          index === 2
                            ? "rounded-full border border-[rgba(255,107,26,0.18)] bg-[rgba(255,247,240,0.94)] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#b6531b]"
                            : index === 1
                              ? "rounded-full border border-ap-border bg-ap-off/90 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ap-mid"
                              : "rounded-full border border-ap-border bg-white/85 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ap-mid"
                        }
                      >
                        {pill}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-center md:justify-start">
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
                  <p className="text-ap-primary text-sm font-semibold mt-4 max-w-xl text-center md:text-left">
                    {ALFRED_APP_URL.replace("https://", "")} · 7-day trial for new accounts. Intensive and Accelerator
                    clients get extended access.
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

      <section className="relative z-20 py-14 sm:py-20 bg-white border-y border-ap-border overflow-y-visible [overflow-x:clip]">
        <div
          className="pointer-events-none absolute -top-20 left-[-10%] h-[220px] w-[min(44vw,420px)] opacity-[0.42]"
          style={{
            background:
              "linear-gradient(142deg, rgba(255,107,26,0.42) 0%, rgba(255,159,107,0.22) 44%, rgba(255,107,26,0.06) 100%)",
            clipPath: "polygon(0% 10%, 100% 0%, 66% 100%, 0% 82%)",
            filter: "drop-shadow(0 22px 56px rgba(255,107,26,0.22))",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-14%] right-[-8%] h-48 w-[min(36vw,340px)] rounded-full opacity-[0.28] blur-[78px]"
          style={{
            background:
              "radial-gradient(circle, rgba(58,74,92,0.24) 0%, rgba(58,74,92,0.1) 48%, transparent 76%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-16 right-[6%] h-[190px] w-[min(28vw,240px)] opacity-[0.34]"
          style={{
            background:
              "linear-gradient(164deg, rgba(36,52,73,0.24) 0%, rgba(255,159,107,0.12) 46%, rgba(255,255,255,0) 100%)",
            clipPath: "polygon(26% 0%, 100% 8%, 78% 100%, 0% 88%)",
          }}
          aria-hidden
        />
        <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14 items-start">
            <div className="max-w-[760px]">
              <div className="relative overflow-hidden rounded-[24px] border border-ap-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,250,0.92))] px-6 py-6 shadow-[0_22px_52px_-38px_rgba(14,22,36,0.22)] sm:px-7 sm:py-7">
                <div
                  className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,159,107,0.28) 0%, rgba(255,159,107,0.08) 44%, transparent 76%)",
                  }}
                  aria-hidden
                />
                <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-muted mb-4">
                  What He Does
                </p>
                <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-4">
                  When the week gets loud, here&apos;s what ALFRED does.
                </h2>
                <p className="text-xl sm:text-[1.35rem] font-semibold text-ap-primary leading-[1.35] mb-4">
                  Most founders do not need more ideas.
                </p>
                <p className="text-base sm:text-lg text-ap-mid font-medium leading-relaxed">
                  They need help staying loyal to what matters when urgent problems, tempting opportunities, and real
                  life all hit at once. That is what ALFRED is built for.
                </p>
              </div>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2">
              {whatAlfredDoesItems.map((item, index) => (
                <li
                  key={item.title}
                  className={
                    index === 1
                      ? "rounded-[24px] border border-[rgba(255,107,26,0.18)] bg-[linear-gradient(180deg,rgba(255,247,240,0.96),rgba(255,255,255,0.98))] p-6 shadow-[0_22px_52px_-30px_rgba(255,107,26,0.42)]"
                      : "rounded-[24px] border border-ap-border bg-ap-off/70 p-6 shadow-[0_18px_40px_-30px_rgba(14,22,36,0.22)]"
                  }
                >
                  <span className="inline-flex items-center rounded-full border border-ap-border bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-outfit font-bold text-xl text-ap-primary mt-4 mb-3">{item.title}</p>
                  <p className="text-sm sm:text-[15px] text-ap-mid font-medium leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative isolate z-30 py-20 sm:py-24 lg:py-28 overflow-y-visible text-white [overflow-x:clip]">
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
          <div
            className="pointer-events-none absolute -top-16 left-[4%] z-20 h-[220px] w-[min(34vw,360px)] opacity-[0.46]"
            style={{
              background:
                "linear-gradient(144deg, rgba(255,107,26,0.46) 0%, rgba(255,159,107,0.2) 42%, rgba(255,107,26,0.04) 100%)",
              clipPath: "polygon(0% 14%, 100% 0%, 68% 100%, 0% 84%)",
              filter: "drop-shadow(0 20px 54px rgba(255,107,26,0.24))",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 right-[5%] z-20 h-[210px] w-[min(32vw,320px)] opacity-[0.5]"
            style={{
              background:
                "linear-gradient(154deg, rgba(255,107,26,0.56) 0%, rgba(255,159,107,0.26) 42%, rgba(255,107,26,0.04) 100%)",
              clipPath: "polygon(24% 0%, 100% 12%, 76% 100%, 0% 86%)",
              filter: "drop-shadow(0 20px 52px rgba(255,107,26,0.26))",
            }}
            aria-hidden
          />
          <div className="relative z-10 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(10,16,27,0.9)_0%,rgba(18,27,44,0.93)_54%,rgba(33,47,67,0.96)_100%)] shadow-[0_42px_120px_-54px_rgba(0,0,0,0.62)]">
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
                  <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60 mb-4">
                    Where Generic AI Breaks
                  </p>
                  <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white mb-4">
                    Most AI sounds smart until your real week shows up.
                  </h2>
                  <div className="space-y-5 text-white/80 font-medium leading-relaxed text-lg">
                    <p>
                      Blank-slate AI can give you a decent answer in a calm moment. But founders do not live in calm
                      moments. You live where team needs, client fires, family reality, revenue pressure, and new
                      opportunities all collide.
                    </p>
                    <p>
                      ALFRED is built for that moment. He helps you remember what matters, see the tradeoffs clearly,
                      and make the next right move without starting from zero.
                    </p>
                    <p className="text-gradient-accent font-semibold">
                      When pressure rises, ALFRED brings you back to what matters.
                    </p>
                  </div>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {pressureItems.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/88"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
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
        className="relative z-10 py-16 sm:py-24 bg-ap-bg border-b border-ap-border overflow-y-visible [overflow-x:clip] scroll-mt-24"
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
          <div className="max-w-[760px] mx-auto mb-8 sm:mb-10 text-center">
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-muted mb-4">
              A feel-first tour
            </p>
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
              Who&apos;s in the room with you?
            </h2>
            <p className="text-xl sm:text-[1.35rem] text-ap-mid font-semibold leading-relaxed max-w-[730px] mx-auto">
              Serious operators have always had someone in the earpiece: calm, informed, willing to say the truth out
              loud. ALFRED is that kind of steady presence for founders, without the cave and the cape. He feels less
              like a tool and more like the calm operator who knows your world well enough to steady you, challenge
              you, and call you back to what matters.
            </p>
          </div>
          <AlfredFeatureExplorer
            hidePreviewDisclaimer
            phoneFooter={
              <details className="group relative mx-auto flex w-full max-w-[300px] flex-col items-center text-left">
                <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-[rgba(36,52,73,0.14)] bg-white px-4 py-2 text-sm font-semibold text-ap-primary shadow-[0_18px_36px_-28px_rgba(14,22,36,0.32)] transition-colors hover:text-ap-accent [&::-webkit-details-marker]:hidden">
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
                <div className="absolute top-[calc(100%+0.8rem)] left-1/2 z-30 hidden w-[min(88vw,340px)] -translate-x-1/2 rounded-[22px] border border-[rgba(36,52,73,0.14)] bg-[#fbfcfe] px-4 py-4 text-sm font-medium leading-relaxed text-ap-primary shadow-[0_28px_60px_-30px_rgba(14,22,36,0.28)] group-open:block sm:left-auto sm:right-[-1.5rem] sm:translate-x-0 lg:right-[-4.5rem]">
                  <div
                    className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-[rgba(36,52,73,0.14)] bg-[#fbfcfe] sm:left-auto sm:right-[4.25rem] sm:translate-x-0"
                    aria-hidden
                  />
                  The tour auto-runs after this section enters view. Use the nav, pause button, arrows, or dots to
                  look around. Hover the phone to freeze auto-advance.
                </div>
              </details>
            }
          />

          <div className="relative mt-14 sm:mt-16 max-w-[880px] mx-auto px-0 sm:px-2" aria-label="Why Jake built ALFRED">
            <blockquote className="rounded-2xl border border-ap-border border-l-4 border-l-ap-accent bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-[0_24px_60px_-28px_rgba(14,22,36,0.18)]">
              <p className="text-lg sm:text-xl font-semibold text-ap-primary leading-relaxed italic text-center sm:text-left mb-4">
                &ldquo;I built ALFRED because I wanted clarity I could carry into a hard week. Not another document I felt
                good about for a day, then forgot. What matters, what I decided, and what this season requires stay
                close here, so when pressure hits I can get real guidance without starting from scratch.&rdquo;
              </p>
              <cite className="not-italic block text-center sm:text-left text-sm font-semibold text-ap-mid">
                — Jake Sebok
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="relative z-20 py-14 sm:py-20 bg-white border-y border-ap-border overflow-y-visible [overflow-x:clip]">
        <div
          className="pointer-events-none absolute -top-28 right-[-10%] h-[280px] w-[min(42vw,400px)] opacity-[0.5]"
          style={{
            background:
              "linear-gradient(154deg, rgba(255,107,26,0.48) 0%, rgba(255,159,107,0.26) 40%, rgba(255,107,26,0.04) 100%)",
            clipPath: "polygon(28% 0%, 100% 6%, 78% 100%, 0% 82%)",
            filter: "drop-shadow(0 22px 58px rgba(255,107,26,0.24))",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-18%] left-[-6%] h-52 w-[min(34vw,320px)] rounded-full opacity-[0.24] blur-[82px]"
          style={{
            background:
              "radial-gradient(circle, rgba(36,52,73,0.34) 0%, rgba(36,52,73,0.12) 48%, transparent 76%)",
          }}
          aria-hidden
        />
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14 items-start">
            <div className="max-w-[760px]">
              <div className="relative overflow-visible rounded-[24px] border border-[rgba(14,22,36,0.18)] bg-[linear-gradient(160deg,#172334_0%,#213046_52%,#2f4259_100%)] px-6 py-6 shadow-[0_32px_72px_-40px_rgba(14,22,36,0.6)] sm:px-7 sm:py-7">
                <div
                  className="pointer-events-none absolute -right-8 top-0 h-28 w-28 rounded-full blur-3xl opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,159,107,0.42) 0%, rgba(255,159,107,0.16) 44%, transparent 76%)",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -left-[24vw] bottom-[-28px] h-40 w-[min(48vw,460px)] opacity-[0.36]"
                  style={{
                    background:
                      "linear-gradient(128deg, rgba(255,107,26,0.6) 0%, rgba(255,159,107,0.2) 56%, transparent 100%)",
                    clipPath: "polygon(0% 22%, 100% 0%, 54% 100%, 0% 100%)",
                  }}
                  aria-hidden
                />
                <p className="relative font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent-2/90 mb-4">
                  Why It Lands
                </p>
                <h2 className="relative font-outfit font-bold text-2xl sm:text-3xl text-white mb-3">
                  Why his advice feels so specific.
                </h2>
                <p className="relative text-xl sm:text-[1.35rem] font-semibold text-white leading-[1.35] mb-4">
                  He is not guessing from today&apos;s question.
                </p>
                <p className="relative text-base sm:text-lg text-white/80 font-medium leading-relaxed">
                  He coaches from the bigger picture you build with him over time.
                </p>
              </div>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {proofItems.map((item, index) => (
                <li
                  key={item.title}
                  className={
                    index === 1
                      ? "rounded-[24px] border border-[rgba(255,107,26,0.18)] bg-[linear-gradient(180deg,#fff7f0_0%,#ffffff_100%)] p-6 shadow-[0_22px_52px_-34px_rgba(255,107,26,0.4)]"
                      : "rounded-[24px] border border-ap-border bg-[rgba(248,250,252,0.98)] p-6 shadow-[0_18px_42px_-34px_rgba(14,22,36,0.22)]"
                  }
                >
                  <span className="inline-flex items-center rounded-full border border-ap-border bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-outfit font-bold text-xl text-ap-primary mt-4 mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-[15px] text-ap-mid font-medium leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-30 py-14 sm:py-20 bg-ap-bg border-y border-ap-border overflow-y-visible [overflow-x:clip]">
        <div
          className="pointer-events-none absolute -top-36 left-[-12%] h-[310px] w-[min(46vw,430px)] opacity-[0.5]"
          style={{
            background:
              "linear-gradient(142deg, rgba(255,107,26,0.42) 0%, rgba(255,159,107,0.22) 42%, rgba(255,107,26,0.04) 100%)",
            clipPath: "polygon(0% 8%, 100% 0%, 72% 100%, 0% 84%)",
            filter: "drop-shadow(0 20px 52px rgba(255,107,26,0.2))",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-12%] right-[-10%] h-56 w-[min(46vw,420px)] opacity-[0.3]"
          style={{
            background:
              "linear-gradient(218deg, rgba(36,52,73,0.24) 0%, rgba(36,52,73,0.08) 44%, transparent 100%)",
            clipPath: "polygon(24% 0%, 100% 14%, 82% 100%, 0% 82%)",
          }}
          aria-hidden
        />
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14 items-start">
            <div className="max-w-[760px]">
              <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,107,26,0.14)] bg-[linear-gradient(180deg,rgba(255,250,245,0.98),rgba(255,255,255,0.92))] px-6 py-6 shadow-[0_24px_56px_-38px_rgba(14,22,36,0.22)] sm:px-7 sm:py-7">
                <div
                  className="pointer-events-none absolute -right-6 top-0 h-28 w-28 rounded-full blur-3xl opacity-70"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,159,107,0.34) 0%, rgba(255,159,107,0.12) 44%, transparent 76%)",
                  }}
                  aria-hidden
                />
                <p className="relative font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-muted mb-4">
                  Real Week Use Cases
                </p>
                <h2 className="relative font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
                  How ALFRED helps in a real week.
                </h2>
                <p className="relative text-xl sm:text-[1.35rem] font-semibold text-ap-primary leading-[1.35] mb-4">
                  This is where ALFRED earns his place.
                </p>
                <p className="relative text-base sm:text-lg text-ap-mid font-medium leading-relaxed">
                  Not in a calm hypothetical week. In the one you are actually living.
                </p>
              </div>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {realWeekItems.map((item, index) => (
                <li
                  key={item.title}
                  className="rounded-[24px] border border-ap-border bg-white p-6 shadow-[0_18px_44px_-34px_rgba(14,22,36,0.2)]"
                >
                  <span className="inline-flex items-center rounded-full border border-ap-border bg-ap-off/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-outfit font-bold text-xl text-ap-primary mt-4 mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-[15px] text-ap-mid font-medium leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-b border-ap-border">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-muted mb-4">
            The Difference
          </p>
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-3">
            Why ALFRED feels different.
          </h2>
          <p className="text-lg text-ap-mid font-medium max-w-[720px] leading-relaxed mb-8">
            Most AI tools help with a prompt. ALFRED helps with a week, a decision, and the person carrying both.
          </p>
          <div className="space-y-4 md:hidden">
            {comparisonRows.map((row) => (
              <article key={row.label} className="overflow-hidden rounded-[22px] border border-ap-border bg-white shadow-[0_16px_34px_-30px_rgba(14,22,36,0.18)]">
                <div className="border-b border-ap-border bg-ap-off px-5 py-4">
                  <p className="font-outfit font-bold text-ap-primary">{row.label}</p>
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-muted">
                      Typical AI
                    </p>
                    <p className="text-sm text-ap-mid font-medium leading-relaxed">{row.generic}</p>
                  </div>
                  <div className="rounded-2xl border border-ap-border bg-ap-bg/80 p-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-accent">
                      ALFRED
                    </p>
                    <p className="text-sm text-ap-primary font-semibold leading-relaxed">{row.alfred}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto rounded-[20px] border border-ap-border bg-white">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-ap-border bg-ap-off">
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-primary"> </th>
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-primary">Typical AI chat coach</th>
                  <th className="p-4 sm:p-5 font-outfit font-bold text-ap-accent">ALFRED</th>
                </tr>
              </thead>
              <tbody className="text-ap-mid font-medium">
                {comparisonRows.map((row, index) => (
                  <tr key={row.label} className={index < comparisonRows.length - 1 ? "border-b border-ap-border" : ""}>
                    <td className="p-4 sm:p-5 text-ap-primary font-semibold">{row.label}</td>
                    <td className="p-4 sm:p-5">{row.generic}</td>
                    <td className="p-4 sm:p-5 bg-ap-bg/80">{row.alfred}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ap-muted mt-4 max-w-[760px] leading-relaxed">
            If you come through the{" "}
            <Link
              href="/work-with-me/strategic-intensives"
              className="text-gradient-accent font-semibold hover:underline"
            >
              Strategic Alignment Intensive
            </Link>{" "}
            or the Accelerator, ALFRED can coach from an even richer picture of your world. The simple promise stays
            the same: he keeps what matters close when the week gets noisy.
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
                One product. One clear lane. You are not paying to enter a funnel. You are paying for a coach that
                stays close when the week gets hard.
              </p>
            </div>

            <div className="relative px-8 py-10 sm:px-10 sm:py-12 lg:pl-12 lg:pr-11 lg:py-14 bg-gradient-to-br from-white via-white to-ap-bg/70">
              <ul className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                <li className="rounded-2xl border border-ap-border bg-ap-off/90 px-4 py-4 sm:px-5 sm:py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  <p className="font-outfit font-bold text-sm text-ap-primary mb-1.5">Less than a coaching hour</p>
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
                  <p className="font-outfit font-bold text-sm text-gradient-accent mb-1.5">Programs include extended access</p>
                  <p className="text-xs sm:text-[13px] text-ap-mid font-medium leading-relaxed">
                    Intensive and Accelerator clients get longer trial access through program codes, so the app supports
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
            <div className="rounded-[22px] border border-ap-border bg-white p-6 sm:p-7 shadow-[0_18px_38px_-32px_rgba(14,22,36,0.18)]">
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">Who this is for</h2>
              <ul className="space-y-3 text-ap-mid font-medium leading-relaxed">
                {whoItsForItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ap-accent shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[22px] border border-ap-border bg-ap-off/72 p-6 sm:p-7 shadow-[0_18px_38px_-32px_rgba(14,22,36,0.14)]">
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-ap-primary mb-4">Who it isn&apos;t for</h2>
              <ul className="space-y-3 text-ap-mid font-medium leading-relaxed">
                {whoItIsntForItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ap-muted shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-20 sm:pb-28 pt-4 bg-ap-bg">
        <div
          className="pointer-events-none absolute top-4 left-[-10%] h-[190px] w-[min(34vw,300px)] opacity-[0.3]"
          style={{
            background:
              "linear-gradient(138deg, rgba(255,107,26,0.36) 0%, rgba(255,159,107,0.14) 54%, rgba(255,255,255,0) 100%)",
            clipPath: "polygon(0% 12%, 100% 0%, 68% 100%, 0% 84%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-10 right-[-8%] h-[180px] w-[min(30vw,260px)] opacity-[0.26]"
          style={{
            background:
              "linear-gradient(146deg, rgba(36,52,73,0.24) 0%, rgba(73,90,112,0.08) 44%, rgba(255,255,255,0) 100%)",
            clipPath: "polygon(24% 0%, 100% 8%, 76% 100%, 0% 86%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 right-[-12%] h-56 w-[min(42vw,360px)] rounded-full opacity-[0.22] blur-[74px]"
          style={{
            background:
              "radial-gradient(circle, rgba(58,74,92,0.28) 0%, rgba(58,74,92,0.08) 48%, transparent 74%)",
          }}
          aria-hidden
        />
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden bg-ap-off rounded-[20px] border border-ap-border p-8 sm:p-10 text-center">
            <div
              className="pointer-events-none absolute -left-12 top-8 h-28 w-44 opacity-[0.2]"
              style={{
                background:
                  "linear-gradient(132deg, rgba(255,107,26,0.32) 0%, rgba(255,159,107,0.12) 56%, rgba(255,255,255,0) 100%)",
                clipPath: "polygon(0% 18%, 100% 0%, 58% 100%, 0% 88%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full blur-[56px] opacity-[0.28]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,26,0.42) 0%, rgba(255,159,107,0.16) 40%, transparent 74%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-8 left-1/2 h-28 w-[120%] -translate-x-1/2 opacity-[0.16] blur-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(73,90,112,0.18) 0%, rgba(73,90,112,0.04) 54%, rgba(255,255,255,0) 100%)",
              }}
              aria-hidden
            />
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
    </div>
  );
}
