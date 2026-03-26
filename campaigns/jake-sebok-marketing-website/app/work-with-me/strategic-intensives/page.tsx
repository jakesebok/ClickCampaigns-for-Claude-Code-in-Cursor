import Link from "next/link";

export const metadata = {
  title: "Strategic Alignment Intensive — Jake Sebok",
  description:
    "A quarterly half-day workshop for owner-operators who need clearer priorities, cleaner decisions, and an Aligned AIOS prompt that actually knows their context.",
};

export default function StrategicIntensivesPage() {
  return (
    <>
      {/* Hero — subtle orange geometric */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Quarterly Workshop · $497
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Strategic Alignment Intensive
          </h1>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-6">
            Most goal-setting is backwards. You name the revenue target, you
            reverse-engineer the tactics, and you hustle until the number hits.
            Then you look up and realize the life you built doesn&apos;t match the
            life you actually want.
          </p>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-10">
            The Strategic Alignment Intensive fixes that in a single half-day. You&apos;ll get clear on what matters,
            what this season actually requires, and what deserves your focus next. You also leave with a personalized{" "}
            <strong className="text-ap-primary">Aligned AIOS</strong> prompt, an AI coach and strategist built from
            your real priorities, boundaries, and goals.
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
                title: "What you actually want",
                description:
                  "The end goals underneath the means goals. What you want life and work to feel like, not just the number on the whiteboard.",
              },
              {
                title: "The reason this work matters",
                description:
                  "A purpose statement you can actually feel. Not branding language. The honest reason you do this work.",
              },
              {
                title: "Operating values",
                description:
                  "Five values with definitions, behaviors, and boundaries, so hard decisions get cleaner.",
              },
              {
                title: "The future you are building toward",
                description:
                  "The standards for who you are becoming across work, self, relationships, and service.",
              },
              {
                title: "Revenue math that matches reality",
                description:
                  "Translate meaning into numbers, then into weekly conversations and practical targets.",
              },
              {
                title: "The one move that matters most",
                description:
                  "A protected action plan for the move that makes everything else easier or unnecessary.",
              },
              {
                title: "Your Aligned AIOS prompt",
                description:
                  "A personalized AI coach and strategist built from your actual priorities, goals, boundaries, and revenue math.",
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
                  We work through the full clarity process together. Teaching, exercises, and working sessions. You
                  build every asset in real time, not from the back row of a lecture.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Turn the work into a coach that remembers your context
                </h3>
                <p className="text-ap-mid">
                  We use what you build in the Intensive to create the prompt behind your Aligned AIOS. It can run
                  inside Claude, ChatGPT, Gemini, or another model and give you advice based on your real priorities,
                  goals, boundaries, and numbers.
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
                  You leave with a working system you can use immediately. Not generic AI prompts. A private coach and
                  strategist built from the decisions you made in the workshop.
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
              Half-day live workshop + pre-work packet + all worksheets + your Aligned AIOS prompt
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
