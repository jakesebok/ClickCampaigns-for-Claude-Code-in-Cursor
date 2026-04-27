import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    <html lang="en" className={`${outfit.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased font-cormorant">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
