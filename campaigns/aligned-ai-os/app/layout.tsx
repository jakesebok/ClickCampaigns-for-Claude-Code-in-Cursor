import type { Metadata, Viewport } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
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
        <ClerkProvider afterSignOutUrl="/">
          <header className="flex items-center justify-end gap-3 px-6 py-4 border-b border-border">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:bg-accent/90 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
