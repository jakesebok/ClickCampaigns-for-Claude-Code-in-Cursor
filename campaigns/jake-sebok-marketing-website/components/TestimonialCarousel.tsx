"use client";

import { useState, useRef, useEffect } from "react";
import { TestimonialCard } from "./TestimonialCard";
import type { Testimonial } from "./TestimonialCard";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const MARSHALL_INDEX = 1;

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(MARSHALL_INDEX);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollToMarshall = () => {
      const children = el.children;
      if (children.length <= MARSHALL_INDEX) return;
      let scrollLeft = 0;
      const gap = 24;
      for (let i = 0; i < MARSHALL_INDEX; i++) {
        scrollLeft += (children[i] as HTMLElement).offsetWidth + gap;
      }
      el.scrollLeft = scrollLeft;
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
      const gap = 24;
      for (let i = 0; i < children.length; i++) {
        const cardWidth = (children[i] as HTMLElement).offsetWidth + gap;
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
    const gap = 24;
    for (let i = 0; i < index && i < children.length; i++) {
      scrollLeft += (children[i] as HTMLElement).offsetWidth + gap;
    }
    el.scrollTo({ left: scrollLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-5 px-5 sm:-mx-6 sm:px-6 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="flex-shrink-0 h-[360px] snap-center"
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
