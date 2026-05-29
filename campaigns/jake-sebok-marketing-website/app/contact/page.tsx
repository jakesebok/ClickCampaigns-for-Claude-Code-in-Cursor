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
        className="pointer-events-none hidden lg:block absolute top-0 right-0 lg:h-full lg:w-[38%] bg-ap-accent/10"
        style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div
        className="lg:hidden pointer-events-none absolute top-0 inset-x-0 h-[35%] bg-gradient-to-br from-ap-accent/10 via-ap-accent/3 to-transparent"
        aria-hidden
      />
      <div className="relative z-10 max-w-[640px] mx-auto px-5 sm:px-6 hero-halo">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Get in Touch
        </p>
        <h1 className="font-outfit font-bold text-[2.25rem] sm:text-5xl text-ap-primary leading-tight mb-6 [text-wrap:balance]">
          Let&apos;s{" "}
          <em className="font-cormorant italic font-semibold tracking-tight text-gradient-accent">talk</em>.
        </h1>
        <p className="text-ap-mid text-xl font-semibold mb-10">
          Have a question about the VAPI™ Assessment, ALFRED, workshops, or working together? Send me a note and
          I&apos;ll point you in the right direction.
        </p>

        <div data-reveal>
          <ContactForm />
        </div>

        <div className="mt-10 pt-8 border-t border-ap-border" data-reveal data-reveal-delay="1">
          <p className="text-base font-semibold text-ap-primary mb-3">Connect with me</p>
          <SocialLinks variant="contact" />
        </div>

        <p className="mt-8 text-base text-ap-muted" data-reveal data-reveal-delay="2">
          Prefer to start with the free assessment?{" "}
          <Link
            href="/assessment"
            className="text-gradient-accent font-semibold hover:underline"
          >
            Take the VAPI&trade;
          </Link>{" "}
          and see where you&apos;re strong, stretched, and what needs attention next.
        </p>
      </div>
    </section>
  );
}
