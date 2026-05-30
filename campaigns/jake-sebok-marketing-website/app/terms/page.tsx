import { legalSchemaGraph } from "@/lib/schema";

export const metadata = {
  title: "Terms of Use | Jake Sebok Coaching and VAPI Assessment",
  description:
    "Terms that govern your use of jakesebok.com, the VAPI™ assessment, ALFRED, the Aligned Power Program, and related coaching services from Jake Sebok.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalSchemaGraph("terms")) }}
      />
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[760px] mx-auto px-5 sm:px-6 hero-halo">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-3 eyebrow-chapter">
          <span>Legal · Doc 02 of 02</span>
        </p>
        <h1 className="font-outfit font-bold text-[2.25rem] sm:text-[2.75rem] text-ap-primary mb-2 [text-wrap:balance]">
          <em className="not-italic font-semibold text-gradient-accent">Terms</em>{" "}
          of Use
        </h1>
        <p className="text-ap-muted text-base mb-12">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="prose prose-ap max-w-none space-y-8 text-ap-mid max-w-[70ch]">
          <section data-reveal>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using jakesebok.com and related services, you
              agree to these Terms of Use. If you do not agree, do not use this
              site or our services.
            </p>
          </section>

          <section data-reveal data-reveal-delay="1">
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              2. Services
            </h2>
            <p className="leading-relaxed">
              Jake Sebok provides values-aligned performance coaching, the VAPI™
              Assessment, workshops, communities, and related content. Services
              are provided as described at the time of purchase or enrollment.
              Coaching and consulting are not a substitute for professional
              medical, legal, or financial advice.
            </p>
          </section>

          <section data-reveal data-reveal-delay="2">
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              3. User Obligations
            </h2>
            <p className="leading-relaxed">
              You agree to provide accurate information, use services only for
              lawful purposes, and not share account credentials. You will not
              copy, distribute, or create derivative works from our content
              without permission.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              4. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the fullest extent permitted by law, Jake Sebok and jakesebok.com
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of our services. Our
              total liability shall not exceed the amount you paid for the
              specific service in question.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              5. Changes
            </h2>
            <p className="leading-relaxed">
              We may update these terms from time to time. Continued use of our
              services after changes constitutes acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              6. Contact
            </h2>
            <p className="leading-relaxed">
              For questions about these terms, contact:{" "}
              <a
                href="mailto:jacob@alignedpower.coach"
                className="text-gradient-accent font-semibold hover:underline"
              >
                jacob@alignedpower.coach
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
    </>
  );
}
