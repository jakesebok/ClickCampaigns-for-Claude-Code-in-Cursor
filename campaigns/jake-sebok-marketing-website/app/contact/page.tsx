import Link from "next/link";

export const metadata = {
  title: "Contact — Jake Sebok",
  description:
    "Get in touch with Jake Sebok. Questions about the VAPI Assessment, workshops, or coaching? Send a message.",
};

export default function ContactPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[640px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Get in Touch
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Let&apos;s talk.
        </h1>
        <p className="text-ap-mid text-xl font-semibold mb-10">
          Have a question about the VAPI™ Assessment, the Aligned Freedom
          Workshop, or coaching? Send me a message and I&apos;ll get back to
          you.
        </p>

        <form
          action="https://formspree.io/f/mnjgjbjo"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="_subject" value="Contact from jakesebok.com" />
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-ap-primary mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ap-primary mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-ap-primary mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-ap-border focus:border-ap-accent focus:ring-2 focus:ring-ap-accent/20 outline-none transition resize-none"
            />
          </div>
          <button
            type="submit"
            className="cta-pill inline-flex items-center justify-center bg-ap-accent text-white font-semibold text-base px-8 py-4 rounded-pill transition-all"
          >
            Send Message
          </button>
        </form>

        <p className="mt-8 text-sm text-ap-muted">
          Prefer to start with the free assessment?{" "}
          <Link
            href="/assessment"
            className="text-gradient-accent font-semibold hover:underline"
          >
            Take the VAPI™
          </Link>
        </p>
      </div>
    </section>
  );
}
