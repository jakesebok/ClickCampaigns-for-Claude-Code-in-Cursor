"use client";

import Link from "next/link";
import Image from "next/image";
import { testimonials } from "@/lib/testimonials";

const moreResultsTestimonials = testimonials.filter(
  (t) => t.author !== "Dr. Marshall Gevers" && t.author !== "Thaddeus John"
);

const marshallData = {
  id: "marshall",
  name: "Dr. Marshall Gevers",
  title: "Chiropractor",
  image: "/images/testimonials/Marshall.png",
  eyebrow: "Featured story",
  headline: "From \"I hate owning a business\" to excited to go to work every day",
  pullQuote:
    "The business now feels more like an extension of me than something I have to go do.",
  setup:
    "Dr. Marshall Gevers is a chiropractor who learned how to treat patients brilliantly but had no training in how to run a business. He was spinning his wheels, paralyzed by options, and his standard answer whenever anyone asked was: I love being a chiropractor. I hate owning a business. He'd been burned before. He was skeptical of coaching. He was running on fumes.",
  transformations: [
    {
      title: "Clients of his dreams",
      before:
        "Marshall took whoever walked in (\"happy to take scraps,\" as he put it).",
      after:
        "He's crystal clear on his ideal client. When he works with them, he gets excited. It gives him energy for the rest of the day instead of draining him. The business restores him instead of depleting him.",
    },
    {
      title: "Excited to go to work",
      before: '"Oh gosh, I gotta go into work again."',
      after:
        '"I\'m excited about coming into work every day." He went from not wanting to continue on the path to being excited for the next five years of business. The shift wasn\'t tactics. It was alignment.',
    },
    {
      title: "Charging more than he thought possible",
      before:
        "He hated feeling like a salesman. He had a hard time asking people for things. He felt like he was bothering them.",
      after:
        "We reframed it: he's not selling; he's helping. He doesn't feel intrusive anymore. He feels like he's doing what he's supposed to do. He's reaching more people, and the revenue followed.",
    },
    {
      title: "Less grinding, more aligning",
      before:
        "A lot of things he dreaded doing, sapping his energy. He didn't want to do them outside of work.",
      after:
        "He does more networking and business development than ever, but it doesn't feel like work. When opportunities pop up outside work hours, he's excited. The business feels like an extension of him, not something he has to go do.",
    },
  ],
  shortQuote:
    "I knew how to treat patients, but starting a business left me stuck and overthinking everything. Jake helped me cut through the noise, define a vision, and take confident action. What used to feel overwhelming now feels intentional, and it's directly translated into real business growth.",
  longQuote: undefined as string | undefined,
};

const thaddeusData = {
  id: "thaddeus",
  name: "Thaddeus John",
  title: "Attention Coach",
  image: "/images/testimonials/Thaddeus.jpeg",
  eyebrow: "Client story",
  headline:
    "From stuck and scattered to clarity, conviction, and a calendar full of clients",
  pullQuote:
    "Jake doesn't tell me what to do. He calls forth what was already there.",
  setup:
    "Thaddeus is an attention coach who helps entrepreneurs with addiction, time management, and ADHD recapture their focus and energy for business progress. And yet he was stuck. He'd felt confused about his purpose, wondering whether what he was doing was actually meaningful. Distraction had become his escape. He was avoiding the very thing he was meant for. He chose Jake because Jake had done the deep work himself, and that depth let him hold a curious, non-judgmental space where Thaddeus could explore the deep matters of his purpose and spirit. He finally felt safe enough to be fully seen.",
  transformations: [
    {
      title: "More clients in weeks than in six months",
      before: null as string | null,
      after:
        'The internal shifts showed up fast. "I\'ve gotten more clients booked on my calendar in the past few weeks than I had in the previous six months before working with Jake." Clarity on what he\'s building and why turned into real momentum. The calendar filled. The business moved.',
    },
    {
      title: "Unshakeable belief in his potential",
      before: null as string | null,
      after:
        "He's fully committed to building the life he wants, and he shows up for himself, consistently. The doubt that used to hold him back is giving way to conviction. He knows he can do it. He's empowered to create the life of his dreams.",
    },
    {
      title: "A vision that made everything click",
      before: null as string | null,
      after:
        "Walking through a day in the life of his ideal future was a turning point. Setting that direction and connecting to the feeling of that future made the path obvious. He stopped guessing. He started building.",
    },
    {
      title: "Leaning into the discomfort of growth",
      before: null as string | null,
      after:
        "His breakthrough: the fear of being an outsider, of being judged. It's not a sign to retreat. It's part of the growing process. That reframe changed everything. He stopped resisting the shift. He embraced it.",
    },
    {
      title: "Simple shifts that compound",
      before: null as string | null,
      after:
        "It doesn't always have to be a mind-blowing realization. Sometimes the biggest breakthroughs come from simple perspective changes and habit tweaks. Jake is good at pointing out the obvious and helping Thaddeus feel confident to experiment with different strategies until he finds what works. No overwhelm. Just clarity and action.",
    },
  ],
  shortQuote:
    "Jake called me forth to step into my power and become the man I always knew I could be.",
  longQuote:
    "I feel like Jake understands me at a deep level. I have a clear understanding of what I'm building and why it matters, and it's rare to find someone who holds that kind of space. Jake doesn't tell me what to do. He calls forth what was already there.",
};

function StoryIndex({
  stories,
  onSelect,
}: {
  stories: { id: string; name: string; title: string; image: string; headline: string }[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
      {stories.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          className="group relative text-left rounded-[16px] overflow-hidden border border-ap-border hover:border-ap-accent/60 bg-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ap-accent focus:ring-offset-2"
        >
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={s.image}
              alt={s.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ap-primary/90 via-ap-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-ap-accent mb-0.5">
                {s.title}
              </p>
              <h2 className="font-outfit font-bold text-lg text-white mb-1">
                {s.name}
              </h2>
              <p className="text-white/90 text-sm font-medium line-clamp-2">
                {s.headline}
              </p>
              <span className="inline-flex items-center gap-2 mt-2 text-ap-accent font-semibold text-xs group-hover:gap-3 transition-all">
                Read story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function TransformationCard({
  title,
  before,
  after,
}: {
  title: string;
  before: string | null;
  after: string;
}) {
  return (
    <div className="rounded-[16px] border border-ap-border border-l-4 border-l-ap-accent bg-white p-5 hover:border-ap-accent/40 transition-colors">
      <h4 className="font-outfit font-semibold text-ap-primary mb-3 text-base">
        {title}
      </h4>
      {before ? (
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-ap-muted text-xs uppercase tracking-wider">Before</span>
            <p className="text-ap-mid text-sm font-medium leading-relaxed mt-1">{before}</p>
          </div>
          <div className="h-px bg-ap-border" />
          <div>
            <span className="font-semibold text-ap-accent text-xs uppercase tracking-wider">After</span>
            <p className="text-ap-primary text-sm font-semibold leading-relaxed mt-1">{after}</p>
          </div>
        </div>
      ) : (
        <p className="text-ap-mid text-sm font-medium leading-relaxed">{after}</p>
      )}
    </div>
  );
}

function StorySection({
  data,
  variant,
}: {
  data: typeof marshallData | typeof thaddeusData;
  variant: "default" | "alt";
}) {
  const isAlt = variant === "alt";
  return (
    <section
      id={data.id}
      className={`scroll-mt-24 py-12 sm:py-16 ${isAlt ? "bg-ap-bg" : "bg-white"}`}
    >
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: image + quotes — sticky so you stay connected to the person */}
          <div className={`lg:col-span-5 ${isAlt ? "lg:order-2" : ""}`}>
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-lg">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className={data.id === "marshall" ? "object-cover object-[50%_18%]" : "object-cover"}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="rounded-[16px] border border-ap-border border-l-4 border-l-ap-accent bg-ap-off p-5">
                <p className="font-cormorant italic text-base text-ap-primary leading-snug mb-3">
                  &ldquo;{data.shortQuote}&rdquo;
                </p>
                <p className="font-semibold text-ap-primary text-sm">— {data.name}</p>
              </div>
              {"longQuote" in data && data.longQuote && (
                <div className="rounded-[16px] bg-ap-primary text-white p-5 border-t-2 border-ap-accent">
                  <p className="font-cormorant italic text-sm leading-snug mb-2">
                    &ldquo;{data.longQuote}&rdquo;
                  </p>
                  <p className="text-white/80 text-xs">— {data.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: headline, setup, transformations — balanced column */}
          <div className={`lg:col-span-7 space-y-6 ${isAlt ? "lg:order-1" : ""}`}>
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-1">
              {data.eyebrow}
            </p>
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary leading-tight">
              {data.headline}
            </h2>
            <p className="text-ap-mid font-semibold leading-relaxed">
              {data.setup}
            </p>
            <div>
              <h3 className="font-outfit font-semibold text-ap-primary mb-4 text-lg">
                The transformation
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.transformations.map((t, i) => (
                  <div
                    key={t.title}
                    className={data.transformations.length % 2 === 1 && i === data.transformations.length - 1 ? "sm:col-span-2" : ""}
                  >
                    <TransformationCard
                      title={t.title}
                      before={t.before}
                      after={t.after}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/work-with-me"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
            >
              Start Your Transformation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseStudiesContent() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Hero — story index */}
      <section className="relative pt-16 sm:pt-24 pb-8 sm:pb-12 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Client Stories
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-4">
            Real results. Real transformation.
          </h1>
          <p className="text-lg font-semibold text-ap-mid max-w-2xl leading-relaxed mb-8">
            These are the stories of entrepreneurs who chose alignment over the grind, and what happened when they did.
          </p>

          <StoryIndex
            stories={[
              { ...marshallData, headline: marshallData.headline },
              { ...thaddeusData, headline: thaddeusData.headline },
            ]}
            onSelect={scrollTo}
          />
        </div>
      </section>

      <StorySection data={marshallData} variant="default" />
      <StorySection data={thaddeusData} variant="alt" />

      {/* More Results — horizontal scroll */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6 mb-10">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3">
            More Results
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-ap-primary">
            More entrepreneurs who chose alignment
          </h2>
        </div>
        <div className="w-full">
          <div className="flex overflow-x-auto gap-6 pb-4 px-5 sm:px-6 lg:px-8 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {moreResultsTestimonials.map((t) => (
              <div
                key={t.author}
                className="flex-shrink-0 w-[min(400px,85vw)] snap-center rounded-[24px] border border-ap-border bg-white hover:border-ap-accent/40 transition-colors p-6 sm:p-7"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-ap-off flex-shrink-0">
                    <Image
                      src={t.image}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-outfit font-semibold text-ap-primary">{t.author}</p>
                    {t.headline && (
                      <p className="text-sm text-ap-muted">{t.headline}</p>
                    )}
                  </div>
                </div>
                <div>
                  <blockquote className="font-cormorant italic text-lg text-ap-primary leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="font-semibold text-ap-primary">{t.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-ap-bg">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[20px] bg-ap-primary p-10 sm:p-14 text-center border-t-2 border-ap-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/20 to-transparent" />
            <div className="relative">
              <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                Ready for your own story?
              </h2>
              <p className="text-white/80 text-xl font-semibold max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. Discover your Founder Archetype, pattern driver, and where you stand—with a personalized 28-day My Plan when you use the same email as your portal or ALFRED account—then let&apos;s build something that feels like an extension of who you are.
              </p>
              <Link
                href="/assessment"
                className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
              >
                Take the VAPI™
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
