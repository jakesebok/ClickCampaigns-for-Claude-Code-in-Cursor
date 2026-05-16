import type { MetadataRoute } from "next";

/**
 * AI crawlers we explicitly opt in to. Mirrors the LocalCraft
 * BUILD-STANDARDS allowlist so AI answer engines (Google AI Overviews,
 * ChatGPT, Perplexity, Google AI Mode, Apple Intelligence, Copilot)
 * can index every post on the site.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "CCBot",
  "Applebot-Extended",
  "BingPreview",
];

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [{ userAgent: "*", allow: "/" }];
  for (const agent of AI_CRAWLERS) {
    (rules as any[]).push({ userAgent: agent, allow: "/" });
  }
  return {
    rules,
    sitemap: "https://jakesebok.com/sitemap.xml",
  };
}
