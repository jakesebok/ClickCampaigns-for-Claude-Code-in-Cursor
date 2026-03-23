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
          background: #2d3953 !important;
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
        className="dark min-h-screen overflow-hidden bg-[#2d3953] px-4 py-4 sm:px-6 sm:py-6"
      >
        <div className="mx-auto max-w-[1100px]">
          <AlfredFeatureExplorer embed="app-dark" />
        </div>
      </section>
    </>
  );
}
