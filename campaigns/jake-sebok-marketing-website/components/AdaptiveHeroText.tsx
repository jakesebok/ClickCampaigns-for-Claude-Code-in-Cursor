"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Mask-based adaptive text: orange on light background, white on orange background.
 * Uses two stacked text layers with SVG masks that align to the hero's orange polygon.
 * The orange region: right 42% of hero with diagonal clip-path(18% 0, 100% 0, 100% 100%, 0 100%).
 * In hero percentage coords: (66, 0) to (100, 0) to (100, 100) to (58, 100).
 */
export function AdaptiveHeroText({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [maskStyle, setMaskStyle] = useState<{
    orange: React.CSSProperties;
    white: React.CSSProperties;
  } | null>(null);

  useEffect(() => {
    const updateMask = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const hero = wrapper.closest("section");
      if (!hero) return;

      const heroRect = hero.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      // Mask size = hero dimensions; position so mask (0,0) aligns with hero top-left
      const size = `${heroRect.width}px ${heroRect.height}px`;
      const position = `${heroRect.left - wrapperRect.left}px ${heroRect.top - wrapperRect.top}px`;

      setMaskStyle({
        orange: {
          maskImage: "url(#hero-mask-inverse)",
          maskSize: size,
          maskPosition: position,
          maskRepeat: "no-repeat",
          WebkitMaskImage: "url(#hero-mask-inverse)",
          WebkitMaskSize: size,
          WebkitMaskPosition: position,
          WebkitMaskRepeat: "no-repeat",
        },
        white: {
          maskImage: "url(#hero-mask-orange)",
          maskSize: size,
          maskPosition: position,
          maskRepeat: "no-repeat",
          WebkitMaskImage: "url(#hero-mask-orange)",
          WebkitMaskSize: size,
          WebkitMaskPosition: position,
          WebkitMaskRepeat: "no-repeat",
        },
      });
    };

    updateMask();

    const resizeObserver = new ResizeObserver(updateMask);
    if (wrapperRef.current) {
      const hero = wrapperRef.current.closest("section");
      if (hero) resizeObserver.observe(hero);
    }

    window.addEventListener("scroll", updateMask, { passive: true });
    window.addEventListener("resize", updateMask);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateMask);
      window.removeEventListener("resize", updateMask);
    };
  }, []);

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <svg aria-hidden="true" className="absolute size-0 overflow-hidden" viewBox="0 0 100 100">
        <defs>
          {/* Orange region: show white text here. Coords = hero % (0-100). */}
          <mask id="hero-mask-orange">
            <polygon points="66,0 100,0 100,100 58,100" fill="white" />
          </mask>
          {/* Inverse: show orange text where NOT over orange. */}
          <mask id="hero-mask-inverse">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <polygon points="66,0 100,0 100,100 58,100" fill="black" />
          </mask>
        </defs>
      </svg>
      {/* Orange text: visible only over light background */}
      <span
        className="text-ap-accent"
        style={maskStyle?.orange ?? undefined}
      >
        {children}
      </span>
      {/* White text: visible only over orange background */}
      <span
        className="absolute inset-0 text-white"
        style={{
          ...(maskStyle?.white ?? {}),
          visibility: maskStyle ? "visible" : "hidden",
        }}
      >
        {children}
      </span>
    </span>
  );
}
