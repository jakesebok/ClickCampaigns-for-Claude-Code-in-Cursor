import type { Metadata, Viewport } from "next";
import { Outfit, Cormorant_Garamond, Caveat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteCTAs } from "@/components/SiteCTAs";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

/**
 * LocalCraft tracking pixel for jakesebok.com.
 * Pixel + dashboard live at https://localcraftdigital.com — see
 * dashboard at /dashboard/analytics under jake@alignedpower.coach.
 * Cross-origin POST to /api/track is allowed (CORS: *).
 */
const LC_PIXEL_ID = "081b3396-6b75-400d-a659-94d51c979d90";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "600", "700"],
});

// Caveat — handwritten-script flourish for the founder signature.
// Used 1-2 times site-wide (About page sign-off, apply thank-you sign-off).
// Loaded as a CSS variable so the .signature-script utility in globals.css
// can switch on prefers-reduced-motion + adjust weight at small viewports.
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jakesebok.com"),
  title: "Growth and Performance Coaching for Entrepreneurs | Jake Sebok",
  description:
    "Growth and performance coaching with Jake Sebok. For founders who want clearer decisions, stronger execution, and a business that supports the life it was meant to fund. Start with the free VAPI™ assessment.",
  keywords: [
    "growth and performance coaching",
    "Jake Sebok",
    "values-aligned performance",
    "executive coaching",
    "entrepreneur coaching",
    "founder coaching",
    "VAPI",
    "Aligned Power Program",
  ],
  authors: [{ name: "Jake Sebok" }],
  creator: "Jake Sebok",
  publisher: "Jake Sebok",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Growth and Performance Coaching for Entrepreneurs | Jake Sebok",
    description:
      "Build a business that scales your income, your impact, and your life. Growth and performance coaching with Jake Sebok.",
    url: "https://jakesebok.com",
    siteName: "Jake Sebok",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Growth and Performance Coaching for Entrepreneurs | Jake Sebok",
    description:
      "For founders who want more growth without shrinking the rest of life to make it happen.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body className="min-h-screen antialiased font-cormorant">
        <Header />
        <main>{children}</main>
        <Footer />
        <SiteCTAs />
        <RevealOnScroll />
        <Script
          src="https://localcraftdigital.com/track.js"
          strategy="lazyOnload"
          data-pixel-id={LC_PIXEL_ID}
        />
      </body>
    </html>
  );
}
