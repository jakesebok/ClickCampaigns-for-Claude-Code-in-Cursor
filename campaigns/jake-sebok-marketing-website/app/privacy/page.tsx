export const metadata = {
  title: "Privacy Policy — Jake Sebok",
  description: "Privacy policy for jakesebok.com and Jake Sebok coaching services.",
};

export default function PrivacyPage() {
  return (
    <section className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6">
        <h1 className="font-outfit font-bold text-4xl text-ap-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-ap-muted text-sm mb-12">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="prose prose-ap max-w-none space-y-8 text-ap-mid">
          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              We collect information you provide when you contact us, take the
              VAPI™ Assessment, sign up for workshops or communities, or apply for
              coaching programs. This may include:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Name and email address</li>
              <li>Business information (role, revenue range)</li>
              <li>Responses to assessments and application questions</li>
              <li>Any other information you voluntarily submit</li>
            </ul>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              We use your information to deliver services (e.g., assessment
              results, workshop access), respond to inquiries, evaluate
              applications, and improve our offerings. We do not sell your
              personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              3. Data Sharing
            </h2>
            <p className="leading-relaxed">
              We may share data with service providers (e.g., email delivery,
              hosting) who assist in operating our business. These providers are
              bound by confidentiality and use data only for the purposes we
              specify.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              4. Your Rights
            </h2>
            <p className="leading-relaxed">
              Depending on your location, you may have the right to access,
              correct, or delete your personal data. You may also opt out of
              marketing communications. To exercise these rights, contact us at
              the email below.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              5. Cookies and Analytics
            </h2>
            <p className="leading-relaxed">
              We may use cookies and similar technologies for essential
              functionality and to understand how visitors use our site. You can
              adjust your browser settings to limit or block cookies.
            </p>
          </section>

          <section>
            <h2 className="font-outfit font-semibold text-ap-primary text-lg mb-4">
              6. Contact
            </h2>
            <p className="leading-relaxed">
              For questions about this privacy policy or to exercise your
              rights, contact:{" "}
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
