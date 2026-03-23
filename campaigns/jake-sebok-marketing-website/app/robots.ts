import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/who-is-alfred/product-explorer-embed"],
    },
    sitemap: "https://jakesebok.com/sitemap.xml",
  };
}
