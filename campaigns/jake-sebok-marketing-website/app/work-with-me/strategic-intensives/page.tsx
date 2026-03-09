import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Strategic Alignment Intensives — Jake Sebok",
  description:
    "Quarterly deep-dive for owner-operators. Get strategic clarity and a clear path forward.",
};

export default function StrategicIntensivesPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-4">
          Strategic Alignment Intensives
        </p>
        <h1 className="font-cormorant font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Quarterly deep-dive for owner-operators
        </h1>
        <div className="relative aspect-video rounded-[20px] overflow-hidden mb-10">
          <Image
            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Strategic planning session"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        <p className="text-lg text-ap-mid leading-relaxed mb-10">
          A focused day (or half-day) to cut through the noise, get strategic
          clarity, and leave with a clear path forward. For entrepreneurs who
          are ready to go deeper than a workshop—but not yet ready for the
          full Accelerator.
        </p>
        <div className="bg-ap-off rounded-[20px] border border-ap-border p-8 mb-10">
          <h2 className="font-semibold text-ap-primary mb-4">
            Webinar / event registration
          </h2>
          <p className="text-ap-mid text-sm leading-relaxed mb-4">
            For intensives, you&apos;ll want a way to collect registrations and
            send reminders. Recommended tools:
          </p>
          <ul className="text-ap-mid text-sm space-y-2 list-disc list-inside mb-4">
            <li>
              <strong>Calendly</strong> — One-on-one or group event scheduling
            </li>
            <li>
              <strong>Acuity / HoneyBook</strong> — Scheduling + payments +
              contracts
            </li>
            <li>
              <strong>Eventbrite</strong> — Good for paid workshops and
              intensives
            </li>
            <li>
              <strong>Zoom + Calendly</strong> — Free option: Calendly for
              signup, Zoom for the event
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold px-8 py-4 rounded-pill transition-all"
          >
            Express Interest
          </Link>
          <Link
            href="/work-with-me"
            className="inline-flex items-center text-ap-accent font-semibold hover:underline"
          >
            ← Back to offerings
          </Link>
        </div>
      </div>
    </section>
  );
}
