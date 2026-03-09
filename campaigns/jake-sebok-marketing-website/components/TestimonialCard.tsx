import Image from "next/image";

export interface Testimonial {
  quote: string;
  headline?: string;
  author: string;
  title?: string;
  image: string;
  wide?: boolean;
}

export function TestimonialCard({ quote, headline, author, title, image, wide }: Testimonial) {
  return (
    <div className={`min-h-[200px] bg-white rounded-[20px] border border-ap-border p-8 sm:p-10 hover:border-ap-accent/50 transition-colors flex flex-col ${wide ? "w-[min(600px,90vw)] min-w-[280px] sm:min-w-[380px]" : "w-[min(520px,90vw)] min-w-[280px] sm:min-w-[340px]"}`}>
      {headline && (
        <p className="text-ap-accent font-semibold text-sm uppercase tracking-wider mb-3 flex-shrink-0">
          {headline}
        </p>
      )}
      <blockquote className="font-cormorant font-semibold text-xl sm:text-2xl text-ap-primary leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-ap-off flex-shrink-0">
          <Image
            src={image}
            alt={author}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold text-ap-primary">{author}</p>
          {title && <p className="text-sm text-ap-muted">{title}</p>}
        </div>
      </div>
    </div>
  );
}
