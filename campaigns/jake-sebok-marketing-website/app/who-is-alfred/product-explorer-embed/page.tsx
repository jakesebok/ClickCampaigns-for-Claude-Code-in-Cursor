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
        /* Remove marketing disclaimer line under the phone for embed use. */
        .alfred-embed-mode #alfred-product-explorer p[class*="hidden lg:block"][class*="text-xs"][class*="text-center"] {
          display: none !important;
        }
        /* Match ALFRED product-tour control button styling (no white outline). */
        .alfred-embed-mode #alfred-product-explorer [role="group"][aria-label="App tour controls"] button {
          border-color: transparent !important;
          background: rgba(51, 65, 85, 0.62) !important;
          color: rgb(226, 232, 240) !important;
          box-shadow: none !important;
        }
        .alfred-embed-mode #alfred-product-explorer [role="group"][aria-label="App tour controls"] button:hover {
          background: rgba(71, 85, 105, 0.7) !important;
          color: rgb(251, 146, 60) !important;
        }
      `}</style>
      <section
        id="alfred-product-explorer"
        className="dark overflow-hidden bg-[#2d3953] px-4 py-3 sm:px-6 sm:py-6"
      >
        <div className="mx-auto max-w-[1100px]">
          <AlfredFeatureExplorer embed="app-dark" />
        </div>
      </section>
    </>
  );
}
