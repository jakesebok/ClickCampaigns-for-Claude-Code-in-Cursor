"use client";

import { useState, useRef, useEffect } from "react";
import { TestimonialCard } from "./TestimonialCard";
import type { Testimonial } from "./TestimonialCard";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, testimonials.length - 1));
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [testimonials.length]);

  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
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
            className="flex-shrink-0 h-[280px] snap-center"
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
