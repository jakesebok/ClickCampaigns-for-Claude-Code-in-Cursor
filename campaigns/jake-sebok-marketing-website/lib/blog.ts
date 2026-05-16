/**
 * Blog helpers — read markdown posts at build time from content/blog
 * and parse their YAML frontmatter. The LocalCraft Growth pipeline
 * commits posts here weekly; this file is the bridge between those
 * commits and the rendered /blog routes.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  modified_at: string;
  keywords: string[];
  faq: Array<{ q: string; a: string }>;
  /** Hero image absolute URL — rendered at the top of the post. */
  hero_image_url: string | null;
  /** schema.org BlogPosting JSON-LD object — render verbatim into <head>. */
  schema_article: Record<string, unknown>;
  /** schema.org FAQPage JSON-LD object, or null when no FAQ. */
  schema_faqpage: Record<string, unknown> | null;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function safeJsonParse<T = unknown>(value: unknown): T | null {
  if (value == null) return null;
  if (typeof value === "object") return value as T;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? "Untitled"),
    excerpt: String(data.excerpt ?? ""),
    published_at: String(data.published_at ?? new Date().toISOString()),
    modified_at: String(data.modified_at ?? data.published_at ?? new Date().toISOString()),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    faq: Array.isArray(data.faq)
      ? (data.faq as Array<Record<string, unknown>>)
          .filter((x) => x && x.q && x.a)
          .map((x) => ({ q: String(x.q), a: String(x.a) }))
      : [],
    hero_image_url: typeof data.hero_image_url === "string" && data.hero_image_url.trim() ? data.hero_image_url : null,
    schema_article: (safeJsonParse<Record<string, unknown>>(data.schema_article) ?? {}) as Record<string, unknown>,
    schema_faqpage: safeJsonParse<Record<string, unknown>>(data.schema_faqpage),
    body: content
  };
}

export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map((slug) => getPost(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}
