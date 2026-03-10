import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Freedom Builders Community — Jake Sebok",
  description:
    "Community with the Aligned Freedom Course. Learn at your own pace and connect with like-minded founders.",
};

export default function FreedomBuildersPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Freedom Builders Community
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Build the foundation for aligned growth
        </h1>
        <div className="relative aspect-video rounded-[20px] overflow-hidden mb-10">
          <Image
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Community and collaboration"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        <p className="text-lg text-ap-mid leading-relaxed mb-10">
          The Aligned Freedom Course gives you the framework. The community gives
          you the support. Learn at your own pace, connect with like-minded
          founders, and build something worth waking up for.
        </p>
        <Link
          href="/contact"
          className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
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
