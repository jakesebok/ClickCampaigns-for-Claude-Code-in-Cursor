import type { MetadataRoute } from "next";

const BASE = "https://jakesebok.com";

/** Public routes (App Router + assessment rewrites to static VAPI). */
const paths: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/work-with-me", changeFrequency: "weekly", priority: 0.95 },
  { path: "/who-is-alfred", changeFrequency: "monthly", priority: 0.9 },
  { path: "/assessment", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.8 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work-with-me/strategic-intensives", changeFrequency: "monthly", priority: 0.85 },
  { path: "/work-with-me/apply", changeFrequency: "monthly", priority: 0.85 },
  { path: "/work-with-me/freedom-workshop", changeFrequency: "monthly", priority: 0.75 },
  { path: "/work-with-me/freedom-builders", changeFrequency: "monthly", priority: 0.75 },
  { path: "/work-with-me/aligned-leaders", changeFrequency: "monthly", priority: 0.75 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
