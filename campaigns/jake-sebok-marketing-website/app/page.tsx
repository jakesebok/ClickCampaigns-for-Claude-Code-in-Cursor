import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { testimonials } from "@/lib/testimonials";

const heroPills = ["Clarity", "Execution", "Freedom", "Values-led growth"];

const hiddenCostItems = [
  {
    title: "The pressure",
    body: "You are carrying too much of the thinking, too much of the fixing, and too much of the emotional load.",
  },
  {
    title: "The split",
    body: "You are at work thinking about home, and at home thinking about work. You are rarely fully anywhere.",
  },
  {
    title: "The stall",
    body: "You know what matters, but execution gets strange. You delay, drift, overcomplicate, or lose the thread.",
  },
];

const pathSteps = [
  {
    number: "1",
    title: "Take the VAPI™",
    body: "72 statements. About 12 minutes. Get a clear read on where you are strong, where you are stretched, and what deserves attention next.",
  },
  {
    number: "2",
    title: "Get your map",
    body: "See your scores, deeper patterns, and 28-day plan. Use the same email as your portal or ALFRED account to keep everything connected.",
  },
  {
    number: "3",
    title: "Choose your next step",
    body: "Workshop, community, intensive, or coaching. Get the level of support that matches the season you are in.",
  },
];

const outcomeItems = [
  "Cleaner decisions when the week gets loud.",
  "More consistent execution on work that actually matters.",
  "A calendar that supports the life you are trying to build.",
  "More energy for the work only you can do.",
];

const featuredTestimonial = testimonials[1];
const supportingTestimonials = [testimonials[0], testimonials[2], testimonials[3]];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ap-bg">
        <div className="absolute inset-0 bg-ap-bg" />
        <div
          className="pointer-events-none absolute -right-[18%] top-0 h-full w-[min(58vw,780px)] opacity-[0.95]"
          style={{
            background:
              "linear-gradient(162deg, rgba(255,107,26,0.96) 0%, rgba(255,123,46,0.94) 22%, rgba(255,159,107,0.82) 58%, rgba(255,159,107,0.24) 100%)",
            clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[6%] top-[14%] hidden h-[62%] w-[min(25vw,360px)] opacity-[0.18] lg:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 100%)",
            clipPath: "polygon(28% 0%, 100% 8%, 72% 100%, 0% 88%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-4rem] left-[-8%] h-36 w-[min(58vw,720px)] bg-white"
          style={{ clipPath: "polygon(0% 38%, 100% 0%, 88% 100%, 0% 100%)" }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[1160px] px-5 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,420px)] lg:gap-16">
            <div className="max-w-2xl">
              <p className="mb-4 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                Values-Aligned Growth and Performance
              </p>
              <h1 className="mb-6 font-outfit text-5xl font-extrabold leading-[0.92] tracking-tight text-ap-primary sm:text-6xl">
                Build a business that scales your income, your impact, and your life.
              </h1>
              <p className="max-w-2xl text-xl font-semibold leading-relaxed text-ap-mid sm:text-[1.45rem]">
                You want clearer decisions, stronger execution, more energy, and a business that supports the life it
                was meant to fund.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ap-muted sm:text-lg">
                For founders who want more growth without shrinking the rest of life to make it happen.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {heroPills.map((pill) => (
                  <li
                    key={pill}
                    className="rounded-full border border-ap-border bg-white/86 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ap-muted shadow-[0_16px_38px_-32px_rgba(14,22,36,0.25)]"
                  >
                    {pill}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-stretch gap-3">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex min-w-[220px] items-center justify-center gap-2 rounded-pill bg-ap-accent px-8 py-4 text-base font-semibold tracking-wider text-white transition-all"
                >
                  Take the VAPI™
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex min-w-[220px] items-center justify-center rounded-pill border-[1.5px] border-ap-border px-8 py-4 text-base font-semibold tracking-wider text-ap-primary transition-all hover:border-ap-accent hover:text-ap-accent"
                >
                  See Your Next Step
                </Link>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.94)_0%,rgba(250,251,252,0.92)_48%,rgba(243,246,249,0.88)_100%)] p-7 shadow-[0_38px_90px_-48px_rgba(14,22,36,0.34)] sm:p-8">
                <div
                  className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full blur-3xl opacity-55"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,159,107,0.34) 0%, rgba(255,159,107,0.12) 44%, transparent 74%)",
                  }}
                  aria-hidden
                />
                <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                  Jake Sebok
                </p>
                <p className="font-cormorant text-3xl font-bold leading-[1.02] text-ap-primary sm:text-[2.5rem]">
                  End the war between your business and your life.
                </p>
                <p className="mt-5 text-base leading-relaxed text-ap-mid">
                  You do not need less ambition. You need growth that feels clean to your values, your body, and the
                  life you are actually trying to live.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-ap-border">
                    <Image
                      src="/images/jake/MMC Profile.jpeg"
                      alt="Jake Sebok"
                      fill
                      className="object-cover"
                      sizes="64px"
                      priority
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-ap-primary">Jake Sebok, MCPC</p>
                    <p className="text-sm text-ap-muted">Founder coach for impact-driven operators.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div
          className="pointer-events-none absolute -left-[12%] top-0 h-[220px] w-[min(42vw,420px)] opacity-[0.16]"
          style={{
            background: "linear-gradient(160deg, rgba(255,107,26,0.9) 0%, rgba(255,159,107,0.25) 100%)",
            clipPath: "polygon(0% 0%, 100% 0%, 58% 100%, 0% 78%)",
          }}
          aria-hidden
        />
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
            <div>
              <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                The Hidden Cost
              </p>
              <h2 className="max-w-3xl font-outfit text-3xl font-bold text-ap-primary sm:text-4xl">
                Growth gets harder when success starts costing too much.
              </h2>
              <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-ap-mid">
                You can have momentum and still feel the drag. Decision fatigue. Inconsistent execution. Work bleeding
                into the rest of life. A business that is technically working, but taking more out of you than it
                should.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {hiddenCostItems.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-ap-border bg-ap-bg/84 p-6 shadow-[0_18px_42px_-34px_rgba(14,22,36,0.18)]"
                  >
                    <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-accent">
                      {item.title}
                    </p>
                    <p className="text-base font-medium leading-relaxed text-ap-mid">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] bg-ap-primary p-8 text-white shadow-[0_40px_90px_-48px_rgba(14,22,36,0.55)] sm:p-10">
              <div
                className="pointer-events-none absolute right-0 top-0 h-full w-[44%] opacity-[0.32]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,107,26,0.78) 0%, rgba(255,159,107,0.38) 44%, rgba(255,159,107,0.08) 100%)",
                  clipPath: "polygon(34% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
                aria-hidden
              />
              <div className="relative z-10">
                <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                  The Reframe
                </p>
                <h3 className="font-outfit text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Stop building someone else&apos;s success.
                </h3>
                <p className="mt-5 text-lg font-semibold leading-relaxed text-white/82">
                  If discipline were the answer, you would already be there. The real issue is not that you need to
                  want it more. It is that some part of you no longer trusts the way you are trying to grow.
                </p>
                <div className="mt-8 rounded-[24px] border border-white/12 bg-white/6 p-6">
                  <p className="font-cormorant text-3xl font-bold leading-tight text-white sm:text-[2.6rem]">
                    The business should not feel like a beautiful prison.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-white/72">
                    When success conflicts with what matters most, execution stops being clean. And when growth fits
                    who you really are, performance gets stronger because you are no longer building against yourself.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ap-bg py-20 sm:py-28">
        <div
          className="pointer-events-none absolute right-[-8%] top-16 hidden h-[260px] w-[min(30vw,360px)] opacity-[0.18] lg:block"
          style={{
            background: "linear-gradient(160deg, rgba(255,107,26,0.8) 0%, rgba(255,159,107,0.12) 100%)",
            clipPath: "polygon(18% 0%, 100% 0%, 76% 100%, 0% 82%)",
          }}
          aria-hidden
        />
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
              Proof
            </p>
            <h2 className="font-outfit text-3xl font-bold text-ap-primary sm:text-4xl">
              What happens when alignment replaces the grind.
            </h2>
            <p className="mt-5 text-xl font-semibold leading-relaxed text-ap-mid">
              People do not just get more productive. They get clearer, calmer, and more effective in the parts of
              life and business that actually matter.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
            <article className="overflow-hidden rounded-[32px] border border-ap-border bg-white shadow-[0_34px_90px_-56px_rgba(14,22,36,0.28)]">
              <div className="grid gap-0 md:grid-cols-[minmax(0,0.92fr)_minmax(220px,280px)]">
                <div className="p-8 sm:p-10">
                  <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                    Featured Story
                  </p>
                  <h3 className="font-outfit text-3xl font-bold text-ap-primary">
                    {featuredTestimonial.headline}
                  </h3>
                  <p className="mt-6 font-cormorant text-[2rem] font-bold leading-[1.08] text-ap-primary sm:text-[2.35rem]">
                    &ldquo;{featuredTestimonial.quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-ap-border">
                      <Image
                        src={featuredTestimonial.image}
                        alt={featuredTestimonial.author}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-ap-primary">{featuredTestimonial.author}</p>
                      <p className="text-sm text-ap-muted">Client story</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link
                      href="/client-stories"
                      className="inline-flex items-center gap-2 rounded-pill border-[1.5px] border-ap-accent/40 px-6 py-3 text-sm font-semibold text-ap-primary transition-all hover:border-ap-accent hover:text-ap-accent"
                    >
                      Read Marshall&apos;s story
                      <svg className="h-4 w-4 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="relative min-h-[280px] md:min-h-full">
                  <Image
                    src={featuredTestimonial.image}
                    alt={featuredTestimonial.author}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ap-primary/28 via-transparent to-transparent" />
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              {supportingTestimonials.map((testimonial) => (
                <article
                  key={testimonial.author}
                  className="rounded-[24px] border border-ap-border bg-white p-6 shadow-[0_20px_50px_-40px_rgba(14,22,36,0.2)]"
                >
                  <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-ap-accent">
                    {testimonial.headline}
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-relaxed text-ap-primary">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-medium text-ap-muted">{testimonial.author}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ap-primary py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-ap-primary via-ap-primary-2 to-ap-primary" aria-hidden />
        <div
          className="pointer-events-none absolute -left-[10%] top-0 h-[220px] w-[min(48vw,560px)] opacity-[0.34]"
          style={{
            background: "linear-gradient(160deg, rgba(255,107,26,0.78) 0%, rgba(255,159,107,0.12) 100%)",
            clipPath: "polygon(0% 0%, 100% 0%, 68% 100%, 0% 84%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
              The Path
            </p>
            <h2 className="font-outfit text-3xl font-bold text-white sm:text-4xl">
              See what&apos;s actually off. Then optimize from there.
            </h2>
            <p className="mt-5 text-xl font-semibold leading-relaxed text-white/76">
              The first move is not more effort. It is seeing the real bottleneck clearly.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pathSteps.map((step) => (
              <article
                key={step.number}
                className="group rounded-[24px] border border-white/12 bg-white/6 p-7 transition-all hover:border-ap-accent/40 hover:bg-white/[0.08]"
              >
                <div className="mb-5 flex items-end gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ap-accent text-xl font-bold text-white shadow-[0_16px_42px_-18px_rgba(255,107,26,0.65)]">
                    {step.number}
                  </div>
                  <h3 className="pb-0.5 font-outfit text-lg font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-base font-medium leading-relaxed text-white/74">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/assessment"
              className="cta-pill inline-flex items-center gap-2 rounded-pill bg-ap-accent px-8 py-4 text-base font-semibold tracking-wider text-white transition-all"
            >
              Take the VAPI™
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div
          className="pointer-events-none absolute right-[-6%] top-[10%] hidden h-[70%] w-[min(28vw,360px)] opacity-[0.14] lg:block"
          style={{
            background: "linear-gradient(180deg, rgba(255,107,26,0.8) 0%, rgba(255,159,107,0.12) 100%)",
            clipPath: "polygon(28% 0%, 100% 0%, 76% 100%, 0% 88%)",
          }}
          aria-hidden
        />
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(300px,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
            <div className="relative overflow-hidden rounded-[30px] shadow-[0_36px_90px_-56px_rgba(14,22,36,0.3)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/jake/jake-and-son.png"
                  alt="Jake Sebok with his son"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ap-primary/74 via-ap-primary/22 to-transparent p-6">
                <p className="max-w-sm font-cormorant text-3xl font-bold leading-tight text-white sm:text-[2.45rem]">
                  End the war between your business and your life.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                The Goal
              </p>
              <h2 className="font-outfit text-3xl font-bold text-ap-primary sm:text-4xl">
                The business is supposed to support your life.
              </h2>
              <p className="mt-5 text-xl font-semibold leading-relaxed text-ap-mid">
                You should not have to trade your peace, your relationships, or your body to build something
                meaningful.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-ap-mid">
                The work here is not about shrinking your ambition. It is about building a way of growing that your
                values, your energy, and the people you love can actually live with.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-ap-mid">
                When growth fits who you really are, the drag starts to lift. Decisions get cleaner. Execution gets more
                consistent. Success stops feeling like something you have to recover from.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {outcomeItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[20px] border border-ap-border bg-ap-bg/82 p-5"
                  >
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ap-accent/14">
                      <svg className="h-4 w-4 text-ap-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-base font-medium leading-relaxed text-ap-mid">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 sm:pb-28">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-ap-primary px-8 py-12 text-center shadow-[0_38px_90px_-56px_rgba(14,22,36,0.55)] sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/18 to-transparent" aria-hidden />
            <div
              className="pointer-events-none absolute right-0 top-0 h-full w-[36%] opacity-[0.26]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,107,26,0.74) 0%, rgba(255,159,107,0.32) 48%, rgba(255,159,107,0.06) 100%)",
                clipPath: "polygon(36% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
              aria-hidden
            />

            <div className="relative z-10">
              <div className="mb-8 flex flex-wrap items-center justify-center gap-6 opacity-90">
                <Image
                  src="/images/certifications/icf.png"
                  alt="International Coaching Federation"
                  width={100}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/images/certifications/cplc.png"
                  alt="Certified Professional Life Coach"
                  width={56}
                  height={56}
                  className="h-10 w-auto object-contain"
                />
                <Image
                  src="/images/certifications/mcpc.png"
                  alt="Master Certified Professional Coach"
                  width={56}
                  height={56}
                  className="h-10 w-auto object-contain"
                />
              </div>

              <p className="mb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent">
                Start Here
              </p>
              <h2 className="font-outfit text-3xl font-bold text-white sm:text-4xl">
                Ready to see what&apos;s actually off?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-white/80">
                Start with the free VAPI™. In about 12 minutes, you will see what is strong, what is stretched, and
                what to fix next.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/66">
                Free. No payment required. Use the same email as your portal or ALFRED account to unlock your 28-day
                plan.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link
                  href="/assessment"
                  className="cta-pill inline-flex items-center gap-2 rounded-pill bg-ap-accent px-8 py-4 text-base font-semibold tracking-wider text-white transition-all"
                >
                  Take the VAPI™
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/work-with-me"
                  className="inline-flex items-center rounded-pill border-[1.5px] border-white/60 px-8 py-4 text-base font-semibold tracking-wider text-white transition-all hover:bg-white/10"
                >
                  See Your Next Step
                </Link>
              </div>

              <div className="mt-8 border-t border-white/14 pt-8 text-center">
                <p className="mb-3 text-sm font-semibold text-white/80">Follow along</p>
                <SocialLinks variant="footer" className="justify-center [&_a]:text-white/70 [&_a:hover]:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
