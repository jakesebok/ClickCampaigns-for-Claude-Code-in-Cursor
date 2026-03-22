import Link from "next/link";

export const metadata = {
  title: "Aligned Freedom Workshop — Jake Sebok",
  description:
    "Free 90-minute monthly workshop. Surface what's holding you back and get coached live. Clarity, community, no fluff.",
};

export default function FreedomWorkshopPage() {
  return (
    <>
      {/* Hero — subtle orange geometric */}
      <section className="relative pt-16 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 bg-ap-bg overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
          style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          aria-hidden
        />
        <div className="relative z-10 max-w-[720px] mx-auto px-5 sm:px-6">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
            Aligned Freedom Workshop
          </p>
          <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
            Join the next free workshop
          </h1>
          <p className="text-xl font-semibold text-ap-mid leading-relaxed mb-10">
            90 minutes. No fluff. In this interactive workshop, we get beneath the tactics—the beliefs, habits, and subconscious patterns that keep you spinning. I coach you live in the room so you leave with a real shift, not just another idea to file away. Connect with entrepreneurs who refuse to stay stuck. Clarity. Community.
          </p>
        <div className="bg-ap-off rounded-[20px] border border-ap-border p-8 mb-10">
          <h2 className="font-outfit font-semibold text-ap-primary mb-4">
            Webinar registration coming soon
          </h2>
          <p className="text-ap-mid text-xl font-semibold leading-relaxed mb-4">
            This workshop uses webinar registration to capture signups and send
            reminders. Recommended tools:
          </p>
          <ul className="text-ap-mid text-xl font-semibold space-y-2 list-disc list-inside mb-4">
            <li>
              <strong>Calendly</strong> — Simple scheduling + automated reminders
            </li>
            <li>
              <strong>Zoom Webinars</strong> — Built-in registration, good for
              live events
            </li>
            <li>
              <strong>WebinarJam / EverWebinar</strong> — For evergreen or
              hybrid webinars
            </li>
            <li>
              <strong>ConvertKit / Kajabi</strong> — If you want email + webinar
              in one platform
            </li>
          </ul>
          <p className="text-ap-muted text-xs">
            For now, use the contact form or apply for the Accelerator to get on
            the list for the next workshop.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
          >
            Get Notified
          </Link>
          <Link
            href="/work-with-me"
            className="inline-flex items-center text-gradient-accent font-semibold hover:underline"
          >
            ← Back to offerings
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
