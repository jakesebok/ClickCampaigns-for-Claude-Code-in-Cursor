import type { Metadata, Viewport } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { HeaderClient } from "@/components/header-client";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "APOS — Aligned Performance Operating System",
  description:
    "Your AI-powered performance coach. Built on the Strategic Clarity framework by Jake Sebok.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "APOS",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E1624",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased`}
      >
        <ClerkProvider
          afterSignOutUrl="/"
          signUpForceRedirectUrl="/onboarding"
          signInForceRedirectUrl="/dashboard"
        >
          <HeaderClient />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
