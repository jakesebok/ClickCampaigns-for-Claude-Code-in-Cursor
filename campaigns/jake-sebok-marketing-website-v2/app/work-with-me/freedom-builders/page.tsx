import Link from "next/link";

export const metadata = {
  title: "Freedom Builders Community — Jake Sebok",
  description:
    "Free community and course for founders who know something is off and want a steadier foundation for growth.",
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
          Build the foundation your growth can actually hold
        </h1>
        <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-6">
          This is often the next step after the VAPI™. You know something is off. You can feel the cost of the version
          of success you have been chasing. Freedom Builders gives you a place to slow down, get honest, and start
          rebuilding around what actually fits.
        </p>
        <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-8">
          Inside, the <strong className="text-ap-primary">Aligned Freedom Course</strong> helps you clarify what you
          actually want, spot the patterns and business-model choices draining you, and rebuild around sustainability,
          leverage, and joy. The community gives you people who get it while you do the work.
        </p>
        <p className="text-lg font-semibold text-ap-mid leading-relaxed mb-10">
          Learn at your own pace. Connect with people who get it. Build something worth waking up for.
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
