import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Strategic Alignment Intensive — Jake Sebok",
  description:
    "A quarterly half-day workshop for owner-operators who want to connect their daily actions directly to the outcomes that actually matter and leave with a custom AI Operating System master prompt.",
};

export default function StrategicIntensivesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Quarterly Workshop · $497
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Strategic Alignment Intensive
          </h1>
          <div className="relative aspect-video rounded-[20px] overflow-hidden mb-10">
            <Image
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Strategic Alignment Intensive workshop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-6">
            Most goal-setting is backwards. You name the revenue target, you
            reverse-engineer the tactics, and you hustle until the number hits.
            Then you look up and realize the life you built doesn&apos;t match the
            life you actually want.
          </p>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-10">
            The Strategic Alignment Intensive fixes that in a single half-day.
            You&apos;ll connect your daily actions directly to the outcomes that
            actually matter — and walk away with a personalized AI operating
            system master prompt that turns your AI of choice into a coach,
            strategic advisor, and executive assistant that actually knows you.
          </p>
        </div>
      </section>

      {/* What You Build */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-8">
            What you&apos;ll walk away with
          </h2>

          <div className="space-y-4">
            {[
              {
                title: "The Real Reasons (Your Life Lists)",
                description:
                  "The end goals underneath the means goals. What you actually want your life to feel like — not just the revenue target.",
              },
              {
                title: "Your Driving Fire + Cause Worth Playing For",
                description:
                  "A purpose statement that passes the full-body test. Not marketing copy — the real reason you do this work.",
              },
              {
                title: "Your Top 5 Core Values (Operational)",
                description:
                  "Definition + behaviors + boundary for each. Values that make hard decisions easy.",
              },
              {
                title: "The Future You",
                description:
                  "The person you're becoming across self, social, skills, and service. Standards, not wishes.",
              },
              {
                title: "The Revenue Bridge: From Meaning To Math",
                description:
                  "Needs + desires + impact = Required Revenue. Reverse-engineered to weekly qualified conversations.",
              },
              {
                title: "Your Vital Action Plan",
                description:
                  "The single move that makes everything else easier. Installed on your calendar. Protected from sabotage.",
              },
              {
                title: "Your AI Operating System Master Prompt",
                description:
                  "A custom master prompt that turns Claude, ChatGPT, Gemini, or another AI into your personalized coach, strategic advisor, and executive assistant. It knows your values, goals, revenue math, standards, and Vital Action because you built that context in the workshop.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-ap-off rounded-[16px] border border-ap-border p-5"
              >
                <div className="w-1.5 rounded-full bg-ap-accent shrink-0" />
                <div>
                  <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-ap-mid">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-16 sm:pb-20 bg-ap-off border-y border-ap-border">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-8">
            How it works
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Pre-work packet (before the Intensive)
                </h3>
                <p className="text-ap-mid">
                  You&apos;ll receive a short preparation packet to prime your
                  thinking. Takes about 20 minutes. This ensures we hit the ground
                  running on workshop day.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Half-day live workshop (virtual or in-person)
                </h3>
                <p className="text-ap-mid">
                  We work through the full Alignment Arc framework together.
                  Teaching, exercises, worksheets. You build every asset in real
                  time — not a passive lecture.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Turn your workshop outputs into your AI Operating System
                </h3>
                <p className="text-ap-mid">
                  We use what you build in the Intensive to create the master
                  prompt that powers your AI Operating System. That prompt can
                  run inside Claude, ChatGPT, Gemini, or another model and turns
                  it into a system that knows your values, goals, revenue math,
                  strategic priorities, and Vital Action.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                4
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Leave with a system you can use immediately
                </h3>
                <p className="text-ap-mid">
                  You leave with a working master prompt and the strategic
                  context to use it right away. The deliverable is not generic
                  AI advice. It&apos;s a custom operating system built from what we
                  excavate together in the workshop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Who this is for
          </h2>
          <ul className="space-y-3 text-xl font-semibold text-ap-mid">
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Owner-operators who are succeeding but feel misaligned
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Entrepreneurs who set goals but never feel satisfied when they hit
              them
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Founders who want clarity before they build the next thing
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              People who want to go deeper than a workshop but aren&apos;t ready
              for the full Accelerator
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing + CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <div className="bg-ap-off rounded-[20px] border border-ap-border p-8 text-center">
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
              Next Intensive
            </p>
            <h2 className="font-outfit font-bold text-3xl text-ap-primary mb-3">
              $497
            </h2>
            <p className="text-ap-mid text-lg mb-2">
              Half-day live workshop + pre-work packet + all worksheets + your AI Operating System master prompt
            </p>

            <Link
              href="/contact"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all mb-6"
            >
              Reserve Your Seat
            </Link>

            <p className="text-ap-muted text-sm">
              Held quarterly. Limited to 20 participants per session for interactive depth.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Link
              href="/work-with-me"
              className="inline-flex items-center text-gradient-accent font-semibold hover:underline"
            >
              ← Back to offerings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
