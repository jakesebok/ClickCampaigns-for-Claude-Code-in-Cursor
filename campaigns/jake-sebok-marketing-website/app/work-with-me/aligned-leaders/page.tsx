import Link from "next/link";

export const metadata = {
  title: "Aligned Leaders Community · Jake Sebok",
  description:
    "$97/mo or $997/yr: weekly live calls, accountability, resources, and a curated cohort of values-aligned founders. A bridge between the free community and the Aligned Power Accelerator.",
};

const pillars = [
  {
    title: "Curated belonging",
    description:
      "This isn’t a noisy feed or a race to look successful. It’s a container for founders who care about alignment, integrity, and depth, where belonging beats performing.",
  },
  {
    title: "A weekly anchor",
    description:
      "Live calls keep the community real. You get rhythm, not randomness: a predictable place to bring what’s actually happening in your business and life.",
  },
  {
    title: "Accountability that doesn’t shame",
    description:
      "We name commitments, celebrate truth over polish, and use friction as data, not as evidence that you’re broken. Pain is a compass; the room helps you read it.",
  },
  {
    title: "Practical depth",
    description:
      "Resources, prompts, and conversations tie back to the work you’re already doing: VAPI™, values, nervous system, revenue, leadership. So insight turns into movement.",
  },
  {
    title: "Sustainable pace",
    description:
      "Growth that costs you your health or relationships isn’t the win. This is ongoing support for founders building something they can sustain, not another sprint to burnout.",
  },
];

const included = [
  {
    title: "Weekly group calls",
    description:
      "Facilitated time with Jake and the cohort: wins, stuck points, decisions, and the kind of honesty that’s hard to find in public founder spaces.",
  },
  {
    title: "Member resources & replays",
    description:
      "Access to frameworks, prompts, and call recordings so you can integrate the work on your schedule without losing the thread.",
  },
  {
    title: "Peer accountability",
    description:
      "A cohort of like-minded, values-aligned founders who get the tension between ambition and authenticity, and who will call you forward without cold hustle culture.",
  },
  {
    title: "Priority lane in Jake’s ecosystem",
    description:
      "You’re inside the orbit: aligned language, shared context, and a natural bridge if you later want deeper work like the Aligned Power Accelerator.",
  },
];

export default function AlignedLeadersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Aligned Leaders Community · $97/mo or $997/yr
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Your people. Your compass. Ongoing support.
          </h1>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-6">
            You can be good at business and still feel alone in the parts that
            matter: values, identity, the mask you wear to keep everything
            together. What if you didn&apos;t have to white-knuckle that anymore?
          </p>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-10">
            The{" "}
            <strong className="text-ap-primary">Aligned Leaders Community</strong>{" "}
            is for founders who want{" "}
            <strong className="text-ap-primary">belonging</strong>, not{" "}
            <strong className="text-ap-primary">fitting in</strong>, alongside
            peers who are building with integrity. Weekly calls, real
            accountability, and resources that help you steer by alignment, not
            just adrenaline.
          </p>
        </div>
      </section>

      {/* Framework */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-4">
            The framework: five pillars
          </h2>
          <p className="text-ap-mid text-lg mb-8">
            Paid communities fail when they&apos;re only content or only chat.
            This one is built around five pillars so the price tag reflects real
            structure, not vibes.
          </p>

          <div className="space-y-4">
            {pillars.map((item) => (
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

      {/* Value props (explicit) */}
      <section className="pb-16 sm:pb-20 bg-ap-off border-y border-ap-border">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-4">
            Why $97 a month
          </h2>
          <p className="text-ap-mid text-lg mb-8">
            The fee does three jobs: it keeps the room serious, it funds the
            container (calls, curation, resources), and it makes your commitment
            visible to you. You&apos;re not buying access to a secret
            tactic. You&apos;re buying consistency, proximity, and a standard.
          </p>
          <ul className="space-y-3 text-lg font-semibold text-ap-mid">
            <li className="flex gap-3">
              <span className="text-ap-accent shrink-0">→</span>
              <span>
                <strong className="text-ap-primary">Skin in the game</strong>{" "}
                without the full commitment of the Accelerator, with enough friction
                to filter curiosity from readiness.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent shrink-0">→</span>
              <span>
                <strong className="text-ap-primary">Leadership loneliness</strong>{" "}
                gets cheaper when you&apos;re not the only one naming the truth
                beneath the KPIs.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent shrink-0">→</span>
              <span>
                <strong className="text-ap-primary">Integration over intensity</strong>
                . A weekly rhythm beats another course you never finish.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent shrink-0">→</span>
              <span>
                <strong className="text-ap-primary">Values-first peers</strong>{" "}
                who won&apos;t treat your inner work like a side hobby, or your
                ambition like something to apologize for.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* What you get */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-8">
            What membership includes
          </h2>

          <div className="space-y-4">
            {included.map((item) => (
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

      {/* How it works */}
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
                  Apply or reach out
                </h3>
                <p className="text-ap-mid">
                  We keep the cohort values-aligned. Start with a short
                  conversation or message so we both know it&apos;s a fit. That
                  protects the room for everyone.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Onboard & orient
                </h3>
                <p className="text-ap-mid">
                  You&apos;ll get the rhythm of calls, how to bring real
                  questions, and where resources live, so you&apos;re not
                  guessing how to participate.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Show up weekly
                </h3>
                <p className="text-ap-mid">
                  The heartbeat is the live call: truth, accountability, and
                  coaching energy in a room that wants your actual life to work, not
                  just your LinkedIn.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ap-accent text-white font-outfit font-bold text-sm shrink-0">
                4
              </div>
              <div>
                <h3 className="font-outfit font-semibold text-ap-primary mb-1">
                  Integrate between calls
                </h3>
                <p className="text-ap-mid">
                  Replays, prompts, and peer connection keep the thread alive.
                  Small moves compound when the container is steady.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where it sits in the ecosystem */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 pt-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Where this sits in the ecosystem
          </h2>
          <p className="text-ap-mid text-lg mb-8">
            Same mission. Different depth and commitment. You don&apos;t have to
            guess which door is yours.
          </p>

          <div className="space-y-4">
            <div className="rounded-[16px] border border-ap-border bg-white p-5">
              <h3 className="font-outfit font-semibold text-ap-primary mb-2">
                Freedom Builders (free)
              </h3>
              <p className="text-ap-mid">
                Foundational community plus the Aligned Freedom Course. Learn and
                connect at your own pace.
              </p>
            </div>
            <div className="rounded-[16px] border-2 border-ap-accent/40 bg-ap-accent/5 p-5">
              <h3 className="font-outfit font-semibold text-ap-primary mb-2">
                Aligned Leaders ($97/mo or $997/yr)
              </h3>
              <p className="text-ap-mid">
                Ongoing live support, accountability, and a curated cohort when
                you&apos;re ready to pay for consistency and proximity.
              </p>
            </div>
            <div className="rounded-[16px] border border-ap-border bg-white p-5">
              <h3 className="font-outfit font-semibold text-ap-primary mb-2">
                Aligned Power Accelerator (application)
              </h3>
              <p className="text-ap-mid">
                The 12-month flagship for entrepreneurs who want the deepest
                container and transformation, by application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for / not for */}
      <section className="pb-16 sm:pb-20 bg-ap-off border-y border-ap-border">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Who this is for
          </h2>
          <ul className="space-y-3 text-xl font-semibold text-ap-mid mb-10">
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Founders who want ongoing support without the Accelerator commitment
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              Leaders who value integrity, nervous system capacity, and honest peer
              relationships, not just growth hacks
            </li>
            <li className="flex gap-3">
              <span className="text-ap-accent">→</span>
              People who will show up, tell the truth, and let the room help them
              steer
            </li>
          </ul>

          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary mb-6">
            Who this isn&apos;t for
          </h2>
          <ul className="space-y-3 text-lg font-semibold text-ap-mid">
            <li className="flex gap-3">
              <span className="text-ap-muted" aria-hidden>
                ×
              </span>
              Anyone looking for a passive content library with no real participation
            </li>
            <li className="flex gap-3">
              <span className="text-ap-muted" aria-hidden>
                ×
              </span>
              Founders who want hype, hustle-at-all-costs, or a place to perform
            </li>
            <li className="flex gap-3">
              <span className="text-ap-muted" aria-hidden>
                ×
              </span>
              People unwilling to respect confidentiality and the safety of the room
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing + CTA */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-[720px] mx-auto px-5 sm:px-6">
          <div className="bg-ap-off rounded-[20px] border border-ap-border p-8 text-center">
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
              Membership
            </p>
            <h2 className="font-outfit font-bold text-3xl text-ap-primary mb-2">
              $97<span className="text-xl font-semibold text-ap-mid">/month</span>
            </h2>
            <p className="text-ap-mid text-base mb-1">
              or{" "}
              <strong className="text-ap-primary">$997/year</strong> when you
              commit annually
            </p>
            <p className="text-ap-mid text-lg mb-6">
              Weekly calls, cohort accountability, resources & replays, and a
              values-aligned room.
            </p>

            <Link
              href="/contact"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all mb-4"
            >
              Request access
            </Link>

            <p className="text-ap-muted text-sm max-w-md mx-auto">
              Tell me you&apos;re interested in the Aligned Leaders Community and
              we&apos;ll sort fit, timing, and next steps. You&apos;re not broken.
              Let&apos;s get after it, together.
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
