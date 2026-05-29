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
 */
export function Footer() {
  return (
    <footer className="bg-ap-primary text-white border-t-2 border-ap-accent">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-8">
        {/* Certifications row — trust weight at the top edge */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 mb-10 sm:mb-12 pb-8 border-b border-white/10">
          <Image
            src="/images/certifications/icf.png"
            alt="International Coaching Federation"
            width={120}
            height={48}
            className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/images/certifications/cplc.png"
            alt="Certified Professional Life Coach"
            width={80}
            height={80}
            className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/images/certifications/mcpc.png"
            alt="Master Certified Professional Coach"
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
                alt="Jake Sebok"
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
