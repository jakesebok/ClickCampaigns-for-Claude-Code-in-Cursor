import Link from "next/link";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/lib/testimonials";

export const metadata = {
  title: "Testimonials — Jake Sebok",
  description:
    "What entrepreneurs say about working with Jake Sebok. Real transformation, real results from chiropractors, coaches, healers, and service professionals.",
};

export default function TestimonialsPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
          What People Say
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Real transformation. Real results.
        </h1>
        <p className="text-lg text-ap-mid max-w-2xl mb-12">
          Entrepreneurs who&apos;ve worked with me share what changed: clarity,
          confidence, and businesses that finally feel like extensions of who
          they are.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.author} {...t} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/work-with-me"
            className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
          >
            Work With Me
          </Link>
        </div>
      </div>
    </section>
  );
}
