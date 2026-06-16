/**
 * Single source of truth for the digital business card at /card.
 * The page (app/card/page.tsx) and the vCard route (app/card/vcard/route.ts)
 * both read from here, so the QR, the page, and the saved contact never drift.
 *
 * To add social links: drop entries into `socials` (label + url) and they
 * render as rows on the card AND get written into the saved vCard.
 */
export interface CardSocial {
  label: string;
  url: string;
}

export const CARD = {
  firstName: "Jake",
  lastName: "Sebok",
  fullName: "Jake Sebok",
  title: "Founder & Performance Coach",
  org: "Aligned Power",
  tagline: "Build a business that's an extension of who you are.",
  phone: "+12175219778",
  phoneDisplay: "(217) 521-9778",
  email: "jake@alignedpower.coach",
  website: "https://jakesebok.com",
  websiteDisplay: "jakesebok.com",
  photo: "/images/card/jake-avatar.jpg",
  logo: "/images/logo-jake-sebok-horizontal.png",
  cardUrl: "https://jakesebok.com/card",
  workUrl: "/work-with-me",
  workLabel: "Work with me",
  workSub: "Coaching, workshops & ALFRED",
  // Add when you want them on the card + vCard, e.g.
  // { label: "LinkedIn", url: "https://www.linkedin.com/in/jakesebok" },
  socials: [] as CardSocial[],
};
