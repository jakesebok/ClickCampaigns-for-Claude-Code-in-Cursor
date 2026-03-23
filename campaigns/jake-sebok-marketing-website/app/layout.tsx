import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { headers } from "next/headers";
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
  title: "Jake Sebok — Values-Aligned Performance Coaching for Entrepreneurs",
  description:
    "Help entrepreneurs who feel trapped by their businesses rediscover their vision and build something sustainable, values-driven, and fully alive.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Jake Sebok — Values-Aligned Performance Coaching",
    description:
      "Build a business that's an extension of who you are, not a cage you built around yourself.",
    url: "https://jakesebok.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const chromelessEmbed =
    pathname === "/who-is-alfred/product-explorer-embed" ||
    pathname.startsWith("/who-is-alfred/product-explorer-embed/");

  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased font-cormorant">
        {chromelessEmbed ? (
          children
        ) : (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
