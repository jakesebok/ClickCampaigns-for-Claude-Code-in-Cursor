"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/client-stories", label: "Client Stories" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-ap-bg/95 backdrop-blur-sm border-b border-ap-border">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 flex items-center justify-between gap-3 h-16 sm:h-20 md:max-lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 min-w-0">
          <Image
            src="/images/logo-jake-sebok-horizontal.png"
            alt="Jake Sebok"
            width={200}
            height={56}
            className="h-14 sm:h-16 md:max-lg:h-[3.25rem] lg:h-16 w-auto max-w-[min(100%,168px)] md:max-lg:max-w-[176px] lg:max-w-none"
          />
        </Link>

        <nav className="hidden md:flex min-w-0 flex-nowrap items-center justify-end gap-8 md:max-lg:gap-6 lg:gap-8 md:max-lg:overflow-x-auto md:max-lg:[scrollbar-width:none] md:max-lg:[&::-webkit-scrollbar]:hidden md:max-lg:pl-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const hideHomeOnTablet = link.href === "/";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap text-sm font-semibold transition-colors ${
                  hideHomeOnTablet ? "md:max-lg:hidden" : ""
                } ${isActive ? "text-gradient-accent" : "text-ap-mid hover:text-gradient-accent"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/who-is-alfred"
            className={`shrink-0 whitespace-nowrap text-sm font-semibold underline underline-offset-[0.35em] decoration-2 transition-colors ${
              pathname === "/who-is-alfred"
                ? "text-gradient-accent decoration-ap-accent"
                : "text-ap-mid decoration-ap-muted hover:text-gradient-accent hover:decoration-ap-accent"
            }`}
          >
            Who is ALFRED?
          </Link>
          <Link
            href="/assessment"
            className="cta-pill inline-flex shrink-0 items-center gap-2 whitespace-nowrap bg-ap-accent text-sm font-semibold px-6 py-3 md:max-lg:px-5 md:max-lg:py-2.5 text-white rounded-pill transition-all"
          >
            Take the VAPI&trade;
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-ap-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ap-border bg-ap-bg px-5 py-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-semibold ${isActive ? "text-gradient-accent" : "text-ap-mid hover:text-gradient-accent"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/who-is-alfred"
              className={`w-fit text-sm font-semibold underline underline-offset-[0.35em] decoration-2 py-1 transition-colors ${
                pathname === "/who-is-alfred"
                  ? "text-gradient-accent decoration-ap-accent"
                  : "text-ap-mid decoration-ap-muted hover:text-gradient-accent hover:decoration-ap-accent"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Who is ALFRED?
            </Link>
            <Link
              href="/assessment"
              className="cta-pill inline-flex justify-center bg-ap-accent text-white font-semibold text-sm py-3 px-6 rounded-pill"
              onClick={() => setMobileOpen(false)}
            >
              Take the VAPI&trade;
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
