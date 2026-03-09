"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ap-bg/95 backdrop-blur-sm border-b border-ap-border">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-jake-sebok-horizontal.png"
            alt="Jake Sebok"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ap-mid hover:text-ap-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://portal.alignedpower.coach/assessment"
            className="cta-pill inline-flex items-center gap-2 bg-ap-accent text-white font-semibold text-sm px-6 py-3 rounded-pill transition-all"
          >
            Take the VAPI™
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ap-mid hover:text-ap-accent font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://portal.alignedpower.coach/assessment"
              className="cta-pill inline-flex justify-center bg-ap-accent text-white font-semibold py-3 rounded-pill"
              onClick={() => setMobileOpen(false)}
            >
              Take the VAPI™
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
