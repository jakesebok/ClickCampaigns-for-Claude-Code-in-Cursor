import Link from "next/link";
import Image from "next/image";
import { LogoOnDarkGlow } from "@/components/LogoOnDarkGlow";
import { SocialLinks } from "@/components/SocialLinks";

/**
 * Footer — editorial three-column treatment.
 *
 * Wave 2 update: dark ap-primary background (kept), accent-orange small-caps
 * section titles, three columns on tablet+ that collapse to a single column
 * on mobile. Certifications stay top-aligned because they carry the trust
 * weight; brand wordmark stays at the bottom-left with the social row.
 *
 * Wave 7 update: footer is preceded by a standalone VAPI™ band — single
 * dominant ask before the editorial grid (Litvin / Goldsmith pattern).
 * Routes a final-impression conversion path to the free assessment so the
 * site exits to action, not to fine print.
 */
export function Footer() {
  return (
    <footer className="bg-ap-primary text-white border-t-2 border-ap-accent">
      {/* Footer VAPI band — single dominant footer ask. Sits ABOVE the
          certifications row + editorial grid so it reads as the closing
          conversion surface, not as buried-in-the-fine-print. */}
      <aside className="footer-vapi-band" aria-labelledby="footer-vapi-band-title">
        <div className="footer-vapi-band__inner">
          <p className="footer-vapi-band__eyebrow">One last thing</p>
          <h2 id="footer-vapi-band-title" className="footer-vapi-band__title">
            See <em>where you stand</em> in 12 minutes.
          </h2>
          <p className="footer-vapi-band__sub">
            Free. No card. No upsell wall. Take the VAPI&trade; and get your scores across 12 domains, plus a personalized
            28-day plan to act on the result.
          </p>
          <div className="footer-vapi-band__cta">
            <Link
              href="/assessment"
              className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-base tracking-wider px-8 py-4 rounded-pill transition-all"
            >
              Take the VAPI&trade;
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="cta-trust cta-trust--on-dark mt-1">
            <span className="cta-trust__item cta-trust__item--accent text-white">ICF Master Certified Coach</span>
            <span className="cta-trust__dot" aria-hidden />
            <span className="cta-trust__item">12 domains, 72 statements</span>
            <span className="cta-trust__dot" aria-hidden />
            <span className="cta-trust__item">Built on Jake&apos;s methodology</span>
          </div>
        </div>
      </aside>
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-8">
        {/* Certifications row — trust weight at the top edge */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 mb-10 sm:mb-12 pb-8 border-b border-white/10">
          <Image
            src="/images/certifications/icf.png"
            alt="International Coaching Federation member badge"
            width={120}
            height={48}
            className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/images/certifications/cplc.png"
            alt="Certified Professional Life Coach credential badge"
            width={80}
            height={80}
            className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/images/certifications/mcpc.png"
            alt="Master Certified Professional Coach credential badge"
            width={80}
            height={80}
            className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Editorial three-column nav + wordmark */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 mb-10">
          <div>
            <p className="footer-section-title">Explore</p>
            <nav className="flex flex-col gap-3 text-base">
              <Link href="/" className="text-white/85 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-white/85 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/work-with-me" className="text-white/85 hover:text-white transition-colors">
                Work with me
              </Link>
              <Link href="/client-stories" className="text-white/85 hover:text-white transition-colors">
                Client stories
              </Link>
              <Link href="/blog" className="text-white/85 hover:text-white transition-colors">
                Blog
              </Link>
            </nav>
          </div>
          <div>
            <p className="footer-section-title">Products</p>
            <nav className="flex flex-col gap-3 text-base">
              <Link href="/who-is-alfred" className="text-white/85 hover:text-white transition-colors">
                ALFRED app
              </Link>
              <Link href="/assessment" className="text-white/85 hover:text-white transition-colors">
                VAPI&trade; assessment
              </Link>
              <Link
                href="/work-with-me/apply"
                className="text-white/85 hover:text-white transition-colors"
              >
                Apply for the Aligned Power&trade; Program
              </Link>
            </nav>
          </div>
          <div>
            <p className="footer-section-title">Reach out</p>
            <nav className="flex flex-col gap-3 text-base">
              <Link href="/contact" className="text-white/85 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-white/85 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-white/85 hover:text-white transition-colors">
                Terms
              </Link>
            </nav>
            <div className="mt-5">
              <p className="footer-section-title" style={{ marginBottom: "0.625rem" }}>
                Follow along
              </p>
              <SocialLinks variant="footer" />
            </div>
          </div>
        </div>

        {/* Wordmark + copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-white/10">
          <Link href="/" className="relative flex-shrink-0 overflow-visible">
            <LogoOnDarkGlow size="sm">
              <Image
                src="/images/logo-jake-sebok-horizontal.png"
                alt="Jake Sebok wordmark"
                width={120}
                height={34}
                className="logo-on-dark-img h-7 w-auto opacity-100"
              />
            </LogoOnDarkGlow>
          </Link>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-ap-muted text-sm">
            <p>&copy; {new Date().getFullYear()} Jake Sebok</p>
            <span className="hidden sm:inline" aria-hidden>
              &middot;
            </span>
            <p>
              Built by{" "}
              <a
                href="https://localcraftdigital.com"
                target="_blank"
                rel="noopener"
                className="underline hover:text-white transition-colors"
              >
                LocalCraft Digital
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
