import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact — Jake Sebok",
  description:
    "Get in touch with Jake Sebok. Questions about the VAPI™ Assessment, ALFRED, workshops, or coaching? Send a message.",
};

export default function ContactPage() {
  return (
    <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 bg-ap-bg overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
        style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-[640px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Get in Touch
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Let&apos;s talk.
        </h1>
        <p className="text-ap-mid text-xl font-semibold mb-10">
          Have a question about the VAPI™ Assessment, ALFRED, workshops, or working together? Send me a note and
          I&apos;ll point you in the right direction.
        </p>

        <ContactForm />

        <div className="mt-10 pt-8 border-t border-ap-border">
          <p className="text-sm font-semibold text-ap-primary mb-3">Connect with me</p>
          <SocialLinks variant="contact" />
        </div>

        <p className="mt-8 text-sm text-ap-muted">
          Prefer to start with the free assessment?{" "}
          <Link
            href="/assessment"
            className="text-gradient-accent font-semibold hover:underline"
          >
            Take the VAPI™
          </Link>{" "}
          and see where you&apos;re strong, stretched, and what needs attention next.
        </p>
      </div>
    </section>
  );
}
