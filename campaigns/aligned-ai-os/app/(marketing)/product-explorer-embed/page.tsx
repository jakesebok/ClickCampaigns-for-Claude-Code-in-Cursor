import type { Metadata } from "next";
import Script from "next/script";
import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

export const metadata: Metadata = {
  title: "ALFRED Product Explorer Embed",
  description: "Embed-ready ALFRED product explorer.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductExplorerEmbedPage() {
  return (
    <>
      <Script id="alfred-embed-mode" strategy="beforeInteractive">
        {`document.documentElement.classList.add("alfred-embed-mode");`}
      </Script>
      <style>{`
        .alfred-embed-mode body {
          background: hsl(222 36% 7%) !important;
        }
        .alfred-embed-mode header {
          display: none !important;
        }
        .alfred-embed-mode body > div,
        .alfred-embed-mode body > div > * {
          background: transparent !important;
        }
        /* Remove disclaimer under the phone for embeds. */
        .alfred-embed-mode #product-tour-embed p[class*="hidden lg:block"][class*="text-xs"][class*="text-center"] {
          display: none !important;
        }
        /* Match ALFRED product-tour control button look. */
        .alfred-embed-mode #product-tour-embed [role="group"][aria-label="App tour controls"] button {
          border-color: transparent !important;
          background: rgba(51, 65, 85, 0.62) !important;
          color: rgb(226, 232, 240) !important;
          box-shadow: none !important;
        }
        .alfred-embed-mode #product-tour-embed [role="group"][aria-label="App tour controls"] button:hover {
          background: rgba(71, 85, 105, 0.7) !important;
          color: rgb(251, 146, 60) !important;
        }
      `}</style>

      <section
        id="product-tour-embed"
        className="dark relative min-h-screen overflow-hidden border-y border-accent/25 bg-[hsl(222_36%_7%)] px-4 pb-4 pt-12 text-foreground shadow-[inset_0_1px_0_0_hsl(21_100%_55%/0.12)] sm:px-6 sm:pb-6 sm:pt-16"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-25%,hsl(21_100%_55%/0.14),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1100px]">
          <AlfredFeatureExplorer embed="app-dark" />
        </div>
      </section>
    </>
  );
}
