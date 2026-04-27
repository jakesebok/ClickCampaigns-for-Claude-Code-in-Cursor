import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Assessment | Jake Sebok",
  description:
    "Intake for a custom assessment funnel, portal, and coaching OS in the style of VAPI™.",
  openGraph: {
    title: "Build Your Assessment | Jake Sebok",
    url: "https://jakesebok.com/build-your-assessment",
  },
};

export default function BuildAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
