"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adaptive text that shows orange on light background and white on orange background.
 * Uses CSS masks aligned with the hero's orange diagonal shape.
 * The mask matches the orange div: right 42%, clip-path polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)
 * In hero % coords: diagonal from (65.56, 0) to (58, 100)
 */
const MASK_ORANGE_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="black"/><polygon points="65.56,0 100,0 100,100 58,100" fill="white"/></svg>'
)}`;

const MASK_LIGHT_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><polygon points="65.56,0 100,0 100,100 58,100" fill="black"/></svg>'
)}`;

export function HeroAdaptiveText() {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [maskStyle, setMaskStyle] = useState<{
    size: string;
    position: string;
  } | null>(null);

  useEffect(() => {
    const updateMask = () => {
      const hero = document.getElementById("hero");
      const wrapper = wrapperRef.current;
      if (!hero || !wrapper) return;

      const heroRect = hero.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const x = heroRect.left - wrapperRect.left;
      const y = heroRect.top - wrapperRect.top;

      setMaskStyle({
        size: `${heroRect.width}px ${heroRect.height}px`,
        position: `${x}px ${y}px`,
      });
    };

    updateMask();

    const resizeObserver = new ResizeObserver(updateMask);
    const hero = document.getElementById("hero");
    if (hero) resizeObserver.observe(hero);

    window.addEventListener("resize", updateMask);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMask);
    };
  }, []);

  const baseMask = maskStyle
    ? {
        maskRepeat: "no-repeat" as const,
        maskSize: maskStyle.size,
        maskPosition: maskStyle.position,
        WebkitMaskRepeat: "no-repeat" as const,
        WebkitMaskSize: maskStyle.size,
        WebkitMaskPosition: maskStyle.position,
      }
    : {};

  return (
    <span ref={wrapperRef} className="relative inline-block">
      {/* Invisible spacer for layout */}
      <span className="invisible" aria-hidden="true">
        someone else&apos;s
      </span>
      {/* Orange text — visible only over light background */}
      <span
        className="absolute inset-0 text-ap-accent"
        style={{
          ...baseMask,
          maskImage: maskStyle ? `url("${MASK_LIGHT_SVG}")` : undefined,
          WebkitMaskImage: maskStyle ? `url("${MASK_LIGHT_SVG}")` : undefined,
        }}
      >
        someone else&apos;s
      </span>
      {/* White text — visible only over orange background; hidden until mask is ready */}
      <span
        className={`absolute inset-0 text-white transition-opacity duration-150 ${maskStyle ? "opacity-100" : "opacity-0"}`}
        style={{
          ...baseMask,
          maskImage: maskStyle ? `url("${MASK_ORANGE_SVG}")` : undefined,
          WebkitMaskImage: maskStyle ? `url("${MASK_ORANGE_SVG}")` : undefined,
        }}
      >
        someone else&apos;s
      </span>
    </span>
  );
}
