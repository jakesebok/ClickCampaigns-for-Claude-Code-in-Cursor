/**
 * Centralized JSON-LD schema builders for jakesebok.com.
 *
 * Every public page should render at least:
 *   - a primary entity schema (Person, ProfessionalService, WebPage, FAQPage, etc.)
 *   - a BreadcrumbList for AI / Google site-link generation
 *
 * Rendered via <script type="application/ld+json" dangerouslySetInnerHTML> at
 * the top of the page component.
 *
 * Wave 6 (SEO/AEO deep audit) introduced this module. Prior to Wave 6, only
 * the home page carried structured data. After Wave 6, every indexable page
 * carries a primary schema + a breadcrumb trail.
 */

export const SITE = "https://jakesebok.com";

/**
 * Stable Person node for Jake. Referenced by every Service / WebPage / Article
 * schema across the site so AI engines can resolve "Jake Sebok" as a single
 * named entity instead of inferring a new Person per page.
 */
export const jakePerson = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: "Jake Sebok",
  jobTitle: "Growth and Performance Coach",
  description:
    "Master Certified Professional Coach helping impact-driven entrepreneurs build values-aligned businesses that scale income, impact, and life.",
  url: SITE,
  sameAs: [`${SITE}/about`],
  hasCredential: [
    "International Coaching Federation",
    "Certified Professional Life Coach",
    "Master Certified Professional Coach",
  ],
};

/**
 * Stable Organization node. The site is a personal brand, so the Organization
 * is the same legal entity as Jake's coaching practice.
 */
export const jakeOrg = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "Jake Sebok Coaching",
  url: SITE,
  founder: { "@id": `${SITE}/#person` },
  logo: `${SITE}/images/logo-jake-sebok-512.png`,
};

/**
 * Build a BreadcrumbList for any page. Pass the breadcrumb trail as
 * { name, path } pairs starting from Home.
 *
 * Example:
 *   breadcrumbList([
 *     { name: "Home", path: "/" },
 *     { name: "Work With Me", path: "/work-with-me" },
 *     { name: "Apply", path: "/work-with-me/apply" },
 *   ])
 */
export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/**
 * Build a Person + BreadcrumbList graph for the home page.
 */
export function homeSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...jakePerson,
        sameAs: [
          `${SITE}/about`,
          "https://www.linkedin.com/in/jakesebok",
          "https://www.instagram.com/jake.sebok",
        ],
      },
      jakeOrg,
      {
        "@type": "ProfessionalService",
        "@id": `${SITE}/#coaching-service`,
        name: "Aligned Power Program",
        description:
          "1:1 application-based growth and performance coaching for entrepreneurs who want clearer decisions, stronger execution, and a business that supports the life it was meant to fund.",
        provider: { "@id": `${SITE}/#person` },
        serviceType: "Growth and Performance Coaching",
        areaServed: "Worldwide",
        url: `${SITE}/work-with-me`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "Jake Sebok",
        description:
          "Growth and performance coaching for founders who want clearer decisions, stronger execution, and a business that supports the life it was meant to fund.",
        publisher: { "@id": `${SITE}/#org` },
      },
    ],
  };
}

/**
 * AboutPage schema with mainEntity pointing to Jake's Person node. Lets AI
 * engines pull Jake's bio from a single canonical place.
 */
export function aboutSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      jakePerson,
      {
        "@type": "AboutPage",
        "@id": `${SITE}/about#about`,
        url: `${SITE}/about`,
        name: "About Jake Sebok",
        description:
          "The story behind the Aligned Power Program: Master Certified Coach Jake Sebok and the path from beautiful prison to a business that fits a life.",
        mainEntity: { "@id": `${SITE}/#person` },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  };
}

/**
 * Service + BreadcrumbList graph for /work-with-me.
 */
export function workWithMeSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}/work-with-me#aligned-power-program`,
        name: "Aligned Power Program",
        description:
          "Jake Sebok's flagship 12-month, 1:1, high-touch growth and performance coaching experience for entrepreneurs ready to build a business that fits their life and ambition. Application required.",
        provider: { "@id": `${SITE}/#person` },
        serviceType: "Executive coaching",
        areaServed: "Worldwide",
        url: `${SITE}/work-with-me`,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/LimitedAvailability",
          priceSpecification: {
            "@type": "PriceSpecification",
            description:
              "Application-based. Pricing shared with qualified candidates after application review.",
          },
        },
      },
      {
        "@type": "Service",
        "@id": `${SITE}/work-with-me#vapi-assessment`,
        name: "VAPI Assessment",
        alternateName: "Values Alignment Performance Insights",
        description:
          "Free 12-domain self-assessment in about 12 minutes. Generates a personalized 28-day plan based on your scores.",
        provider: { "@id": `${SITE}/#person` },
        serviceType: "Self-assessment",
        areaServed: "Worldwide",
        url: `${SITE}/assessment`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      jakePerson,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Work With Me", path: "/work-with-me" },
      ]),
    ],
  };
}

/**
 * Apply page graph. Treats the program as the primary entity so AI engines
 * can answer "What does the Aligned Power Program application involve?"
 */
export function applySchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}/work-with-me/apply#program`,
        name: "Aligned Power Program",
        description:
          "12-month, 1:1, high-touch growth and performance coaching with Jake Sebok. Applications are reviewed personally within 5 to 7 business days.",
        provider: { "@id": `${SITE}/#person` },
        url: `${SITE}/work-with-me/apply`,
      },
      jakePerson,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Work With Me", path: "/work-with-me" },
        { name: "Apply", path: "/work-with-me/apply" },
      ]),
    ],
  };
}

/**
 * ALFRED product schema. Treats the AI coach as a SoftwareApplication so AI
 * engines can answer "What is ALFRED?" with the right entity type.
 */
export function alfredSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/who-is-alfred#alfred`,
        name: "ALFRED",
        alternateName: "Aligned Freedom Coach",
        description:
          "Aligned Freedom Coach (ALFRED): clarity in your pocket when the week gets loud. Keeps your priorities, tradeoffs, and next best move in front of you when pressure hits.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://alfredai.coach",
        creator: { "@id": `${SITE}/#person` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      jakePerson,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Who Is ALFRED", path: "/who-is-alfred" },
      ]),
    ],
  };
}

/**
 * Build-Your-Assessment is a productized service for coaches/founders. Treats
 * the bespoke assessment build as a separate Service from the 1:1 coaching.
 */
export function buildYourAssessmentSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}/build-your-assessment#bespoke-assessment`,
        name: "Build Your Own Assessment",
        description:
          "Commission a bespoke assessment system like VAPI™: custom constructs, scoring, results, and an optional client-facing app, scoped to how you actually coach.",
        provider: { "@id": `${SITE}/#person` },
        serviceType: "Productized assessment design",
        areaServed: "Worldwide",
        url: `${SITE}/build-your-assessment`,
      },
      jakePerson,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Build Your Assessment", path: "/build-your-assessment" },
      ]),
    ],
  };
}

/**
 * Client Stories — case studies as a CollectionPage.
 */
export function clientStoriesSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/client-stories#collection`,
        name: "Client Stories",
        description:
          "How Dr. Marshall Gevers and Thaddeus John moved from stuck and scattered to clearer priorities, stronger conviction, and a business that runs better.",
        url: `${SITE}/client-stories`,
        about: { "@id": `${SITE}/#coaching-service` },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Client Stories", path: "/client-stories" },
      ]),
    ],
  };
}

/**
 * Testimonials index. Schema.org Review type would imply individual ratings,
 * but the page is curated quotes — CollectionPage is the right fit.
 */
export function testimonialsSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/testimonials#collection`,
        name: "Coaching Testimonials",
        description:
          "What chiropractors, coaches, healers, and founders say about working with Jake Sebok.",
        url: `${SITE}/testimonials`,
        about: { "@id": `${SITE}/#coaching-service` },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Testimonials", path: "/testimonials" },
      ]),
    ],
  };
}

/**
 * Contact page — ContactPage is a recognized schema.org subtype that AI
 * engines specifically look for when answering "how do I contact X".
 */
export function contactSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${SITE}/contact#contact`,
        name: "Contact Jake Sebok",
        description:
          "Send a message to Jake Sebok. Questions about the free VAPI™ assessment, ALFRED, workshops, or 1:1 coaching get a real reply within a few business days.",
        url: `${SITE}/contact`,
      },
      jakePerson,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  };
}

/**
 * Blog index — CollectionPage with @type Blog included so feed aggregators
 * and AI engines recognize the index as a content stream.
 */
export function blogIndexSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE}/blog#blog`,
        name: "Notes and Answers",
        description:
          "Field-tested answers to the questions founders search when generic coaching advice falls short.",
        url: `${SITE}/blog`,
        author: { "@id": `${SITE}/#person` },
        publisher: { "@id": `${SITE}/#org` },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  };
}

/**
 * Legal pages. Schema.org has WebPage subtypes for these; using AboutPage
 * for privacy/terms documents would mis-categorize them.
 */
export function legalSchemaGraph(kind: "privacy" | "terms") {
  const path = kind === "privacy" ? "/privacy" : "/terms";
  const name = kind === "privacy" ? "Privacy Policy" : "Terms of Use";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}${path}#page`,
        name,
        url: `${SITE}${path}`,
        isPartOf: { "@id": `${SITE}/#website` },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: name, path },
      ]),
    ],
  };
}

/**
 * FAQ schema builder. Pass an array of { question, answer } pairs.
 * Answer strings should be plain text — no HTML.
 */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
