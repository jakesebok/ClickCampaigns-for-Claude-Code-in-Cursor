import type { Metadata } from "next";
import Script from "next/script";
import { AlfredFeatureExplorer } from "@/components/alfred-feature-explorer";

export const metadata: Metadata = {
  title: "ALFRED Product Explorer Embed",
  description: "Embed-ready ALFRED product explorer preview.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AlfredProductExplorerEmbedPage() {
  return (
    <>
      <Script id="embed-mode-class" strategy="beforeInteractive">
        {`document.documentElement.classList.add("alfred-embed-mode");`}
      </Script>
      <style>{`
        .alfred-embed-mode,
        .alfred-embed-mode body {
          background: #2d3953 !important;
        }
        .alfred-embed-mode header,
        .alfred-embed-mode footer {
          display: none !important;
        }
        .alfred-embed-mode body > main,
        .alfred-embed-mode body > main > * {
          background: transparent !important;
        }
        .alfred-embed-mode #alfred-product-explorer [class*="max-w-[260px]"] {
          max-width: 255px !important;
        }
      `}</style>
      <section
        id="alfred-product-explorer"
        className="overflow-hidden bg-[#2d3953] px-4 py-3 sm:px-6 sm:py-6"
      >
        <div className="mx-auto max-w-[1100px]">
          <AlfredFeatureExplorer embed="app-dark" />
        </div>
      </section>
    </>
  );
}
