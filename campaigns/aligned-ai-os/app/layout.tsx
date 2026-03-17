import type { Metadata, Viewport } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { HeaderClient } from "@/components/header-client";
import { ThemeScript } from "@/components/theme-script";
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
  title: "Aligned Freedom Coach — ALFRED",
  description:
    "Your AI-powered performance coach. Built on the Strategic Clarity framework by Jake Sebok.",
  manifest: "/manifest.json",
  icons: { icon: "/logo-apos.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ALFRED",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} font-sans antialiased`}
      >
        <ClerkProvider
          afterSignOutUrl="/"
          signUpFallbackRedirectUrl="/onboarding"
          signInForceRedirectUrl="/dashboard"
        >
          <HeaderClient />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
