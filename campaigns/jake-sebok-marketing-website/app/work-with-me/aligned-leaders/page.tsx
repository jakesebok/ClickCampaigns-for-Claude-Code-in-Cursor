import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Aligned Leaders Community — Jake Sebok",
  description:
    "Ongoing support and accountability. Weekly calls, resources, and a cohort of aligned entrepreneurs.",
};

export default function AlignedLeadersPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Aligned Leaders Community
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Ongoing support. Real accountability.
        </h1>
        <div className="relative aspect-video rounded-[20px] overflow-hidden mb-10">
          <Image
            src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Leadership and team"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-10">
          Weekly calls. Resources. A cohort of entrepreneurs who get it. The
          Aligned Leaders Community is for founders who want ongoing support
          without the full commitment of the Accelerator and who are ready to
          invest in their growth.
        </p>
        <Link
          href="/contact"
          className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
        >
          Learn More
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
