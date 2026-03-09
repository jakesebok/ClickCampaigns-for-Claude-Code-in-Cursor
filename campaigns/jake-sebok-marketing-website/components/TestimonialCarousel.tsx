"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TestimonialCard } from "./TestimonialCard";
import type { Testimonial } from "./TestimonialCard";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const MARSHALL_INDEX = 1;
const GAP = 24;

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(MARSHALL_INDEX);
  const [containerHeight, setContainerHeight] = useState(360);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateHeight = useCallback(() => {
    const card = cardRefs.current[activeIndex];
    if (card) {
      const h = card.offsetHeight;
      setContainerHeight(Math.max(h, 200));
    }
  }, [activeIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    const card = cardRefs.current[activeIndex];
    if (card) ro.observe(card);
    return () => ro.disconnect();
  }, [activeIndex, updateHeight, isDesktop]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollToMarshall = () => {
      const children = el.children;
      if (children.length <= MARSHALL_INDEX) return;
      let offsetBeforeMarshall = 0;
      for (let i = 0; i < MARSHALL_INDEX; i++) {
        offsetBeforeMarshall += (children[i] as HTMLElement).offsetWidth + GAP;
      }
      const marshallCardWidth = (children[MARSHALL_INDEX] as HTMLElement).offsetWidth;
      const containerWidth = el.offsetWidth;
      const scrollLeft = offsetBeforeMarshall + marshallCardWidth / 2 - containerWidth / 2;
      el.scrollLeft = Math.max(0, scrollLeft);
    };
    scrollToMarshall();
    const t = setTimeout(scrollToMarshall, 50);
    return () => clearTimeout(t);
  }, [testimonials.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const children = el.children;
      let accumulated = 0;
      for (let i = 0; i < children.length; i++) {
        const cardWidth = (children[i] as HTMLElement).offsetWidth + GAP;
        if (scrollLeft < accumulated + cardWidth / 2) {
          setActiveIndex(i);
          return;
        }
        accumulated += cardWidth;
      }
      setActiveIndex(children.length - 1);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [testimonials.length]);

  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const children = el.children;
    let scrollLeft = 0;
    for (let i = 0; i < index && i < children.length; i++) {
      scrollLeft += (children[i] as HTMLElement).offsetWidth + GAP;
    }
    el.scrollTo({ left: scrollLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory gap-6 pb-4 -mx-5 px-5 sm:-mx-6 sm:px-6 scrollbar-hide transition-[height] duration-300 ease-out"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          height: isDesktop ? 360 : containerHeight,
        }}
      >
        {testimonials.map((t, i) => (
          <div
            key={t.author}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="flex-shrink-0 snap-center lg:h-[360px]"
          >
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === activeIndex ? "bg-ap-accent" : "bg-ap-border hover:bg-ap-muted"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
