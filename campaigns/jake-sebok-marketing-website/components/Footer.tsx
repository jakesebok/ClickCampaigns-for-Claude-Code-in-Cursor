import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-ap-primary text-white border-t-2 border-ap-accent py-8">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo-jake-sebok-horizontal.png"
            alt="Jake Sebok"
            width={120}
            height={34}
            className="h-7 w-auto brightness-0 invert opacity-90"
          />
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/" className="text-ap-muted hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-ap-muted hover:text-white transition-colors">
            About
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
        <p className="text-ap-muted text-xs">
          © {new Date().getFullYear()} Jake Sebok
        </p>
      </div>
    </footer>
  );
}
