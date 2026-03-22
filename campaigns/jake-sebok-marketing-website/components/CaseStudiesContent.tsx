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
          className="group relative text-left rounded-[24px] overflow-hidden border-2 border-ap-border hover:border-ap-accent/60 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-ap-accent/10 focus:outline-none focus:ring-2 focus:ring-ap-accent focus:ring-offset-2"
        >
          <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden">
            <Image
              src={s.image}
              alt={s.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ap-primary/90 via-ap-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-ap-accent mb-1">
                {s.title}
              </p>
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-white mb-2">
                {s.name}
              </h2>
              <p className="text-white/90 text-sm sm:text-base font-medium line-clamp-2">
                {s.headline}
              </p>
              <span className="inline-flex items-center gap-2 mt-3 text-ap-accent font-semibold text-sm group-hover:gap-3 transition-all">
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
    <div className="group rounded-[20px] overflow-hidden border border-ap-border hover:border-ap-accent/40 bg-white transition-colors duration-300">
      <div className="p-6 sm:p-8">
        <h4 className="font-outfit font-semibold text-ap-primary mb-4 text-lg">
          {title}
        </h4>
        {before ? (
          <div className="space-y-4">
            <div>
              <span className="inline-block font-semibold text-ap-muted text-xs uppercase tracking-wider mb-1">
                Before
              </span>
              <p className="text-ap-mid font-medium leading-relaxed">{before}</p>
            </div>
            <div className="w-full h-px bg-ap-border" />
            <div>
              <span className="inline-block font-semibold text-ap-accent text-xs uppercase tracking-wider mb-1">
                After
              </span>
              <p className="text-ap-primary font-semibold leading-relaxed">{after}</p>
            </div>
          </div>
        ) : (
          <p className="text-ap-mid font-medium leading-relaxed">{after}</p>
        )}
      </div>
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
    <section id={data.id} className="scroll-mt-24">
      {/* Cinematic hero */}
      <div className="relative min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ap-primary via-ap-primary/60 to-ap-primary/20"
            aria-hidden
          />
        </div>
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-6 pb-16 sm:pb-24 pt-32">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
            {data.eyebrow}
          </p>
          <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6 max-w-3xl">
            {data.headline}
          </h2>
          <blockquote className="max-w-2xl">
            <p className="font-cormorant italic text-xl sm:text-2xl lg:text-3xl text-white/95 leading-snug">
              &ldquo;{data.pullQuote}&rdquo;
            </p>
            <footer className="mt-4 flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/40 flex-shrink-0">
                <Image src={data.image} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <cite className="font-semibold text-white not-italic">{data.name}</cite>
                <p className="text-white/70 text-sm">{data.title}</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Content */}
      <div className={`py-16 sm:py-24 ${isAlt ? "bg-ap-bg" : "bg-white"}`}>
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className={`lg:col-span-5 ${isAlt ? "lg:order-2" : ""}`}>
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="rounded-[20px] border border-ap-border border-l-4 border-l-ap-accent bg-ap-off p-6 sm:p-8">
                  <p className="font-cormorant italic text-lg text-ap-primary mb-4">
                    &ldquo;{data.shortQuote}&rdquo;
                  </p>
                  <p className="font-semibold text-ap-primary">— {data.name}</p>
                </div>
                {"longQuote" in data && data.longQuote && (
                  <div className="rounded-[20px] bg-ap-primary text-white p-6 sm:p-8 border-t-2 border-ap-accent">
                    <p className="font-cormorant italic text-lg mb-4">
                      &ldquo;{data.longQuote}&rdquo;
                    </p>
                    <p className="text-white/80 text-sm">— {data.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className={`lg:col-span-7 space-y-10 ${isAlt ? "lg:order-1" : ""}`}>
              <p className="text-ap-mid text-xl font-semibold leading-relaxed">
                {data.setup}
              </p>
              <div>
                <h3 className="font-outfit font-bold text-xl text-ap-primary mb-6">
                  The transformation
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {data.transformations.map((t) => (
                    <TransformationCard
                      key={t.title}
                      title={t.title}
                      before={t.before}
                      after={t.after}
                    />
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
      {/* Hero — compact, with story index */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Client Stories
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl lg:text-6xl text-ap-primary leading-tight mb-6">
            Real results. Real transformation.
          </h1>
          <p className="text-xl font-semibold text-ap-mid max-w-2xl leading-relaxed mb-12">
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
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
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
                className="flex-shrink-0 w-[min(400px,85vw)] snap-center rounded-[24px] overflow-hidden border border-ap-border bg-white hover:border-ap-accent/40 transition-colors group"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.author}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="400px"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  {t.headline && (
                    <p className="font-outfit text-gradient-accent font-semibold text-sm uppercase tracking-wider mb-3">
                      {t.headline}
                    </p>
                  )}
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
      <section className="py-16 sm:py-24 bg-ap-bg">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[24px] bg-ap-primary p-12 sm:p-20 text-center border-t-2 border-ap-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-ap-accent/20 to-transparent" />
            <div className="relative">
              <h2 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                Ready for your own story?
              </h2>
              <p className="text-white/80 text-xl font-semibold max-w-2xl mx-auto mb-10">
                Start with the free VAPI™ Assessment. Discover your Founder Archetype and get clarity on where you stand, then let&apos;s build something that feels like an extension of who you are.
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
