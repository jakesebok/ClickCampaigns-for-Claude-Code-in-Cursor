import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "@/components/SocialLinks";

export function Footer() {
  return (
    <footer className="bg-ap-primary text-white border-t-2 border-ap-accent py-8">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 mb-8 pb-6 border-b border-white/10">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
        <Link href="/" className="relative flex-shrink-0 overflow-visible">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-28 rounded-full blur-[26px] opacity-[0.30]"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,107,26,0.55) 0%, rgba(255,107,26,0.25) 34%, rgba(255,107,26,0.12) 55%, transparent 72%)",
            }}
          />
          <Image
            src="/images/logo-jake-sebok-horizontal.png"
            alt="Jake Sebok"
            width={120}
            height={34}
            className="relative h-7 w-auto opacity-95 drop-shadow-[0_0_20px_rgba(255,107,26,0.40)]"
          />
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/" className="text-ap-muted hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-ap-muted hover:text-white transition-colors">
              About
            </Link>
            <Link href="/who-is-alfred" className="text-ap-muted hover:text-white transition-colors">
              Who is ALFRED?
            </Link>
            <Link href="/work-with-me" className="text-ap-muted hover:text-white transition-colors">
              Work With Me
            </Link>
            <Link href="/contact" className="text-ap-muted hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-ap-muted hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-ap-muted hover:text-white transition-colors">
              Terms
            </Link>
          </nav>
          <SocialLinks variant="footer" />
        </div>
        <p className="text-ap-muted text-xs">
          © {new Date().getFullYear()} Jake Sebok
        </p>
        </div>
      </div>
    </footer>
  );
}
