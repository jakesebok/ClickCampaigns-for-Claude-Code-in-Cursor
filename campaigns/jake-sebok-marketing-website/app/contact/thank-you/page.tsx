import Link from "next/link";

export const metadata = {
  title: "Message Received | Jake Sebok",
  description:
    "Your message to Jake has been received. Jake reads every note personally and gets back when he can.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactThankYouPage() {
  return (
    <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 bg-ap-bg overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 right-0 w-[min(100%,520px)] h-[45%] lg:h-full lg:w-[38%] bg-ap-accent/10"
        style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-[640px] mx-auto px-5 sm:px-6">
        <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-gradient-accent mb-4">
          Message Received
        </p>
        <h1 className="font-outfit font-bold text-4xl sm:text-5xl text-ap-primary leading-tight mb-6">
          Got it. <span className="text-gradient-accent">Thanks for reaching out.</span>
        </h1>
        <p className="text-ap-mid text-xl font-semibold mb-10">
          Your note is in my inbox. I read every one personally and reply when I can. If your question is time-sensitive,
          please mention that in a follow-up.
        </p>

        <div className="bg-white border border-ap-border rounded-2xl p-6 sm:p-8 mb-10">
          <p className="text-sm font-semibold text-ap-mid mb-4 uppercase tracking-wider">In the meantime</p>
          <div className="space-y-4">
            <Link
              href="/assessment"
              className="group block bg-ap-bg/50 border border-ap-border rounded-xl p-5 hover:border-ap-accent transition-colors"
            >
              <p className="font-semibold text-ap-primary mb-1 group-hover:text-gradient-accent transition-colors">
                Take the free VAPI&trade; Assessment
              </p>
              <p className="text-sm text-ap-mid">
                72 statements, about 12 minutes. See where you are strong, stretched, and what deserves attention next.
              </p>
            </Link>
            <Link
              href="/who-is-alfred"
              className="group block bg-ap-bg/50 border border-ap-border rounded-xl p-5 hover:border-ap-accent transition-colors"
            >
              <p className="font-semibold text-ap-primary mb-1 group-hover:text-gradient-accent transition-colors">
                Meet ALFRED
              </p>
              <p className="text-sm text-ap-mid">
                My AI coach. The Aligned Power method, working with you between sessions.
              </p>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ap-mid hover:text-gradient-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
