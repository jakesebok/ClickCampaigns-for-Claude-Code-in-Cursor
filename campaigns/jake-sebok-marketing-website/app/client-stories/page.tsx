import { CaseStudiesContent } from "@/components/CaseStudiesContent";
import { clientStoriesSchemaGraph } from "@/lib/schema";

export const metadata = {
  title: "Client Stories | Jake Sebok Coaching Case Studies",
  description:
    "How Dr. Marshall Gevers and Thaddeus John moved from stuck and scattered to clearer priorities, stronger conviction, and a business that runs better.",
  alternates: { canonical: "/client-stories" },
};

export default function ClientStoriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clientStoriesSchemaGraph()) }}
      />
      <CaseStudiesContent />
    </>
  );
}
