import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ap-primary text-white py-16 sm:py-20">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
          <div>
            <p className="font-cormorant font-semibold text-xl mb-4">
              Jake Sebok
            </p>
            <p className="text-ap-muted text-sm leading-relaxed">
              Values-aligned performance coaching for entrepreneurs who refuse
              to build another cage.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-ap-accent mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/work-with-me"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  Work With Me
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-ap-accent mb-4">
              Legal
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-ap-muted hover:text-white text-sm transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-ap-primary-2">
          <p className="text-ap-muted text-xs">
            © {new Date().getFullYear()} Jake Sebok. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
