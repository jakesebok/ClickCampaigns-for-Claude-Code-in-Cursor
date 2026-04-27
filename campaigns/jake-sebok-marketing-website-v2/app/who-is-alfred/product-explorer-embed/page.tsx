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
        .alfred-embed-mode header,
        .alfred-embed-mode footer {
          display: none !important;
        }
        .alfred-embed-mode body > main {
          min-height: 100vh;
        }
      `}</style>
      <section
        id="alfred-product-explorer"
        className="min-h-screen bg-ap-bg overflow-hidden px-4 pt-14 pb-6 sm:px-6 sm:pt-20 sm:pb-10"
      >
        <div className="mx-auto max-w-[1100px]">
          <AlfredFeatureExplorer hidePreviewDisclaimer />
        </div>
      </section>
    </>
  );
}
