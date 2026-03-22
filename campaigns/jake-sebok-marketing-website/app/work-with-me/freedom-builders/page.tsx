import Link from "next/link";

export const metadata = {
  title: "Freedom Builders Community — Jake Sebok",
    description:
    "The next step after the VAPI™. Free community plus the Aligned Freedom Course—framework and peers to build the foundation for aligned growth.",
};

export default function FreedomBuildersPage() {
  return (
    <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 bg-ap-bg overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
        style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Freedom Builders Community
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Build the foundation for aligned growth
        </h1>
        <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-6">
          This is often the next step founders take after the VAPI™—you&apos;ve seen your Founder Archetype, your scores, and your priorities. Now you need the framework and the people to act on it. The{" "}
          <strong className="text-ap-primary">Aligned Freedom Course</strong> lives inside Freedom Builders, and the community gives you the support to apply it.
        </p>
        <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-8">
          Here&apos;s what the work is built for: going beneath the surface goals to uncover what you actually want. Mapping the hidden cost of the goals you&apos;re chasing—on your health, relationships, and nervous system. Identifying where your business model conflicts with your values and generates the self-sabotage you can&apos;t explain. Dismantling the subconscious patterns that cap your growth and trigger burnout. Rebuilding your business around sustainability, leverage, and joy—so growth no longer requires self-sacrifice. And integrating it all: business, body, relationships, and life pulling in the same direction.
        </p>
        <p className="text-lg font-semibold text-ap-mid leading-relaxed mb-10">
          Learn at your own pace. Connect with founders who get it. Build something worth waking up for.
        </p>
        <Link
          href="/contact"
          className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
        >
          Join the Community
        </Link>
        <p className="mt-6">
          <Link href="/work-with-me" className="text-gradient-accent font-semibold hover:underline">
            ← Back to offerings
          </Link>
        </p>
      </div>
    </section>
  );
}
