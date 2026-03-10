export const metadata = {
  title: "Terms of Use — Jake Sebok",
  description: "Terms of use for alignedpower.coach and Jake Sebok coaching services.",
};

export default function TermsPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6">
        <h1 className="font-outfit font-bold text-4xl text-ap-primary mb-2">
          Terms of Use
        </h1>
        <p className="text-ap-muted text-sm mb-12">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="prose prose-ap max-w-none space-y-8 text-ap-mid">
          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using jakesebok.com and related services, you
              agree to these Terms of Use. If you do not agree, do not use this
              site or our services.
            </p>
          </section>

          <section>
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

          <section>
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
                className="text-ap-accent font-semibold hover:underline"
              >
                jacob@alignedpower.coach
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
