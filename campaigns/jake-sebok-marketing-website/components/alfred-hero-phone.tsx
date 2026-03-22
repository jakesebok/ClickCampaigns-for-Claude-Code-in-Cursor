import Image from "next/image";
import Link from "next/link";

/**
 * Product hero visual: device frame aligned with the explorer mock, dark shell,
 * orange hairline, ALFRED logo reveal + float + halo (CSS; honors prefers-reduced-motion).
 */
export function AlfredHeroPhone({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px] alfred-hero-float-after">
        <div
          className="relative rounded-[2.5rem] border-2 border-black bg-neutral-950 shadow-[0_28px_70px_-18px_rgba(14,22,36,0.55),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
          style={{ aspectRatio: "9 / 19" }}
        >
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[2rem]">
            <div
              className="h-1 shrink-0 bg-gradient-to-r from-[#ff6b1a] via-[#ff9f6b] to-[#ff6b1a] opacity-95"
              aria-hidden
            />
            <div className="relative flex-1 min-h-0 bg-[#05080e]">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(255,107,26,0.12)_0%,transparent_55%)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[42%] h-[min(55%,220px)] w-[min(90%,240px)] -translate-x-1/2 -translate-y-1/2"
                aria-hidden
              >
                <div className="h-full w-full rounded-full bg-[#ff6b1a] blur-[48px] alfred-hero-halo-pulse opacity-60" />
              </div>

              <div className="relative z-10 flex h-full items-center justify-center px-6 py-8">
                <div className="relative w-[min(78%,200px)] alfred-hero-logo-reveal">
                  <Image
                    src="/images/alfred/logo-alfred.png"
                    alt="ALFRED — Aligned Freedom Coach"
                    width={400}
                    height={160}
                    className="h-auto w-full object-contain drop-shadow-[0_0_28px_rgba(255,107,26,0.35)]"
                    priority
                  />
                </div>
              </div>

              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <Link
          href="#alfred-product-explorer"
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-ap-border bg-white px-4 py-3 shadow-md transition-colors hover:border-ap-accent/60 hover:shadow-lg"
        >
          <span className="min-w-0 text-left">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-ap-accent">
              Interactive demo
            </span>
            <span className="block text-sm font-semibold text-ap-primary leading-snug">
              Explore the real app UI below
            </span>
          </span>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ap-accent/10 text-ap-accent transition-colors hover:bg-ap-accent hover:text-white"
            aria-hidden
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
