"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/work-with-me",
    label: "Work With Me",
    children: [
      { href: "/work-with-me", label: "Overview" },
      { href: "/work-with-me/freedom-workshop", label: "Aligned Freedom Workshop" },
      { href: "/work-with-me/freedom-builders", label: "Freedom Builders Community" },
      { href: "/work-with-me/strategic-intensives", label: "Strategic Alignment Intensives" },
      { href: "/work-with-me/aligned-leaders", label: "Aligned Leaders Community" },
    ],
  },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workWithMeOpen, setWorkWithMeOpen] = useState(false);
  const [mobileWorkWithMeOpen, setMobileWorkWithMeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWorkWithMeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileOpen) setMobileWorkWithMeOpen(false);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-ap-bg/95 backdrop-blur-sm border-b border-ap-border">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-jake-sebok-horizontal.png"
            alt="Jake Sebok"
            width={200}
            height={56}
            className="h-14 sm:h-16 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if ("children" in link && link.children) {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <div key={link.href} ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setWorkWithMeOpen(!workWithMeOpen)}
                    className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                      isActive ? "text-gradient-accent" : "text-ap-mid hover:text-gradient-accent"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${workWithMeOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {workWithMeOpen && (
                    <div className="absolute top-full left-0 mt-1 py-2 w-56 bg-white rounded-lg shadow-lg border border-ap-border z-50">
                      {link.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 text-sm font-medium transition-colors ${
                              childActive ? "text-gradient-accent bg-ap-accent/5" : "text-ap-primary hover:bg-ap-bg hover:text-gradient-accent"
                            }`}
                            onClick={() => setWorkWithMeOpen(false)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? "text-gradient-accent" : "text-ap-mid hover:text-gradient-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/assessment"
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
            {navLinks.map((link) => {
              if ("children" in link && link.children) {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <div key={link.href}>
                    <button
                      type="button"
                      onClick={() => setMobileWorkWithMeOpen(!mobileWorkWithMeOpen)}
                      className={`font-semibold flex items-center justify-between w-full text-left py-1 ${
                        isActive ? "text-gradient-accent" : "text-ap-mid hover:text-gradient-accent"
                      }`}
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform flex-shrink-0 ml-2 ${mobileWorkWithMeOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileWorkWithMeOpen && (
                      <div className="mt-2 pl-4 flex flex-col gap-2 border-l-2 border-ap-border">
                        {link.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`text-sm font-medium py-1 ${childActive ? "text-gradient-accent" : "text-ap-mid hover:text-gradient-accent"}`}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileWorkWithMeOpen(false);
                              }}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
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
              href="/assessment"
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
