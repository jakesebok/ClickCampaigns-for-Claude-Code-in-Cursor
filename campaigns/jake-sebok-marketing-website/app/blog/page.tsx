import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Notes & answers | Jake Sebok",
  description:
    "Field-tested answers to the questions founders search when they're tired of generic coaching advice. Updated weekly.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Notes & answers | Jake Sebok",
    description:
      "Field-tested answers to the questions founders search when they're tired of generic coaching advice.",
    url: "https://jakesebok.com/blog",
    type: "website"
  }
};

/**
 * Blog index. Intentionally NOT linked from the primary nav — these
 * posts are SEO/AEO fishing lines, not customer-facing reading
 * material. The index exists so anyone who lands on it (via search,
 * AI citation, or direct link) sees a coherent collection.
 */
export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="px-6 lg:px-10 py-16 lg:py-24 max-w-[920px] mx-auto">
      <header className="mb-12 hero-halo" data-reveal>
        <p className="text-[12px] uppercase tracking-[0.16em] text-amber-700 font-medium mb-3">
          Notes from Jake
        </p>
        <h1 className="font-cormorant text-[clamp(36px,5vw,56px)] leading-[1.1] tracking-[-0.01em] text-slate-900 [text-wrap:balance]">
          <em className="italic font-semibold text-amber-700">Answers</em>, not advice.
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-slate-700 max-w-[60ch]">
          Field-tested answers to the questions founders actually search when
          they&apos;re tired of generic coaching content. Updated weekly.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-slate-600" data-reveal data-reveal-delay="1">No posts yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-slate-200" data-reveal data-reveal-delay="1">
          {posts.map((p) => (
            <li key={p.slug} className="py-8" data-reveal data-reveal-delay="2">
              <article className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 items-start">
                {p.hero_image_url ? (
                  <Link href={`/blog/${p.slug}`} className="block">
                    <img
                      src={p.hero_image_url}
                      alt=""
                      style={{
                        width: "100%",
                        aspectRatio: "3 / 2",
                        objectFit: "cover",
                        borderRadius: 6,
                        display: "block"
                      }}
                    />
                  </Link>
                ) : <div className="hidden sm:block" />}
                <div>
                  <p className="text-[12.5px] text-slate-500 mb-2">
                    {new Date(p.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <h2 className="font-cormorant text-[clamp(22px,2.6vw,28px)] leading-tight">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="text-slate-900 hover:text-amber-700 transition no-underline"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  {p.excerpt && (
                    <p className="mt-3 text-[15.5px] leading-relaxed text-slate-700 max-w-[68ch]">
                      {p.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${p.slug}`}
                    className="inline-block mt-4 text-[13px] uppercase tracking-[0.08em] text-amber-700 hover:underline"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
