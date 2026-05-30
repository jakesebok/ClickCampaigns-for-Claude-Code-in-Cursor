import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { ContactForm } from "./ContactForm";
import { contactSchemaGraph } from "@/lib/schema";

export const metadata = {
  title: "Contact Jake Sebok | Growth and Performance Coaching",
  description:
    "Send a message to Jake Sebok. Questions about the free VAPI™ assessment, ALFRED, workshops, or 1:1 coaching get a real reply within a few business days.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchemaGraph()) }}
      />
    <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 bg-ap-bg overflow-hidden">
      <div
        className="pointer-events-none hidden lg:block absolute top-0 right-0 lg:h-full lg:w-[38%] bg-ap-accent/10"
        style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div
        className="lg:hidden pointer-events-none absolute top-0 right-0 w-[58%] h-full bg-ap-accent"
        style={{ clipPath: "polygon(72% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-[640px] mx-auto px-5 sm:px-6 hero-halo">
        <span className="hero-balloon-mark" aria-hidden />
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4 eyebrow-chapter">
          <span>Get in Touch</span>
        </p>
        <h1 className="font-outfit font-bold text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] text-ap-primary leading-[0.98] tracking-tight mb-6 [text-wrap:balance]">
          Let&rsquo;s{" "}
          <em className="not-italic text-gradient-accent hand-underline">talk</em>.
        </h1>
        <p className="text-ap-mid text-xl font-semibold mb-10">
          Have a question about the VAPI™ Assessment, ALFRED, workshops, or working together? Send me a note and
          I&apos;ll point you in the right direction.
        </p>

        <div className="form-frame contact-form-frame mt-2" data-reveal data-lc-source="contact_form_frame">
          <div className="expectation-setter">
            <p className="expectation-setter__eyebrow">What happens next</p>
            <p className="expectation-setter__line">
              <span className="expectation-setter__numeral">01</span>
              <span>
                <strong>I read it.</strong> Every message hits my inbox, not a queue.
              </span>
            </p>
            <p className="expectation-setter__line">
              <span className="expectation-setter__numeral">02</span>
              <span>
                <strong>I reply within a few business days.</strong> Usually shorter. Sometimes weekends.
              </span>
            </p>
            <p className="expectation-setter__line">
              <span className="expectation-setter__numeral">03</span>
              <span>
                <strong>You get a real human.</strong> No funnel, no bot, no <em>fake urgency</em>.
              </span>
            </p>
          </div>
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
    </>
  );
}
