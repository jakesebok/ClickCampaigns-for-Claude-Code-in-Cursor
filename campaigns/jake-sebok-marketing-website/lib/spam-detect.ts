/**
 * Server-side spam detection for form submissions.
 *
 * Layered on top of the BUILD-STANDARDS §9c honeypot. Catches the
 * spam patterns that slip past a naive honeypot — bots that have
 * learned to leave hidden fields empty but still fill the visible
 * ones with random alphanumeric strings.
 *
 * Used by /api/track (form submissions from customer sites) and
 * /api/contact (LocalCraft's own contact form).
 *
 * Design rules:
 *  - False negatives are MUCH better than false positives. A real
 *    customer's submission must NEVER be flagged as spam.
 *  - Return a verdict + the reason, so the caller can log it for
 *    operator review without blocking the response.
 *  - Tunable thresholds — these should be tightened over time as we
 *    observe what real customer submissions actually look like.
 */

/** Honeypot field names we look for. Any non-empty value here = bot. */
const HONEYPOT_FIELDS = [
  "website_url",
  "company_website",
  "website",
  "phone_secondary",
  "phone_2",
  "url",
  "homepage",
  "nickname",
  "address_2"
];

/** Common disposable / spammer-favorite email domains. Conservative list. */
const SUSPECT_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwaway.email",
  "tempmail.com",
  "fakeinbox.com",
  "trashmail.com"
]);

export interface SpamCheckInput {
  /** Full submission body — checked for honeypot fields by name. */
  body?: Record<string, any> | null;
  name?: string | null;
  /** Business name (separate field on the contact form). Bots often
   *  paste promo URLs into a "business" field — worth scanning. */
  business?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  /** Caller can pass any user-agent string for additional context. */
  userAgent?: string | null;
}

/** Promotional / spam-trigger keywords. Tuned conservatively — these
 *  are words that almost never appear in a real "I want a website"
 *  inquiry but show up constantly in SEO / link-building / crypto spam. */
const SPAM_KEYWORDS = [
  "backlinks",
  "back links",
  "seo services",
  "rank #1",
  "rank 1",
  "google ranking",
  "increase traffic",
  "boost traffic",
  "crypto",
  "bitcoin",
  "investment opportunity",
  "loan offer",
  "casino",
  "viagra",
  "click here to",
  "make money online",
  "guest post",
  "guestpost",
  "blog post on your site",
  "link exchange",
  "do follow",
  "dofollow"
];

/** Matches any http(s) URL or bare-domain mention. */
const URL_PATTERN = /https?:\/\/|www\.|\.(com|net|org|io|biz|info|ru|cn|xyz|top|click|live)\b/i;

export interface SpamCheckResult {
  is_spam: boolean;
  /** Human-readable reason. Empty when not spam. */
  reason: string;
  /** Score 0-100 (higher = more spammy). Useful for telemetry. */
  score: number;
}

/**
 * Classify a form submission as spam or legitimate.
 *
 * Returns the verdict; the caller decides what to do with it (most
 * common: log the event but skip the leads/CRM promotion and don't
 * send notifications). Returning is_spam = true should NEVER raise
 * an error to the client — return 200 OK silently per §9c.
 */
export function classifySubmission(input: SpamCheckInput): SpamCheckResult {
  let score = 0;
  const reasons: string[] = [];

  // 1) Honeypot fields populated — definitive bot signal.
  if (input.body) {
    for (const field of HONEYPOT_FIELDS) {
      const v = input.body[field];
      if (typeof v === "string" && v.trim() !== "") {
        return {
          is_spam: true,
          reason: `honeypot field "${field}" was filled (value: "${v.slice(0, 40)}")`,
          score: 100
        };
      }
    }
  }

  const name = (input.name || "").trim();
  const business = (input.business || "").trim();
  const email = (input.email || "").trim().toLowerCase();
  const message = (input.message || "").trim();

  // 2) Email domain blocklist.
  if (email && email.includes("@")) {
    const domain = email.split("@")[1] || "";
    if (SUSPECT_EMAIL_DOMAINS.has(domain)) {
      score += 80;
      reasons.push(`disposable email domain (${domain})`);
    }
  }

  // 3) Gibberish name detection: long string, no spaces, low vowel ratio.
  if (looksLikeGibberish(name)) {
    score += 45;
    reasons.push(`name looks like random keymash ("${name.slice(0, 30)}")`);
  }

  // 4) Gibberish message detection.
  if (looksLikeGibberish(message)) {
    score += 45;
    reasons.push(`message looks like random keymash ("${message.slice(0, 30)}")`);
  }

  // 5) "Dot-obfuscated Gmail" pattern — Gmail treats dots as no-ops, so
  //    bots use 5+ dots in the local part to generate apparently-unique
  //    addresses from one mailbox. Not definitive on its own (some
  //    legitimate users have `first.middle.last@gmail.com`), but
  //    combined with other signals it's strong.
  if (email.endsWith("@gmail.com")) {
    const local = email.split("@")[0] || "";
    const dotCount = (local.match(/\./g) || []).length;
    if (dotCount >= 4) {
      score += 30;
      reasons.push(`dot-obfuscated gmail (${dotCount} dots in local part)`);
    }
  }

  // 6) URLs in the name, business name, or message body. Real
  //    customers reaching out for the first time almost never paste a
  //    URL — they describe their business, they don't link-drop. Form
  //    spam, by contrast, is overwhelmingly URL-stuffed (backlink
  //    campaigns, crypto pumps, "visit my site" promo).
  if (URL_PATTERN.test(name)) {
    score += 60;
    reasons.push("URL in name field");
  }
  if (URL_PATTERN.test(business)) {
    score += 55;
    reasons.push("URL in business field");
  }
  if (URL_PATTERN.test(message)) {
    score += 50;
    reasons.push("URL in message");
  }

  // 7) Promotional / link-building keyword matches. Conservative list —
  //    only words that simply don't appear in a real "I need a
  //    website" inquiry but appear in every SEO / crypto / backlink
  //    spam blast.
  const haystack = `${name} ${business} ${message}`.toLowerCase();
  const matchedKeywords = SPAM_KEYWORDS.filter(k => haystack.includes(k));
  if (matchedKeywords.length > 0) {
    score += 50 * matchedKeywords.length;
    reasons.push(`spam keywords: ${matchedKeywords.slice(0, 3).join(", ")}`);
  }

  // 8) Time-trap. The client form sets a `form_loaded_at` epoch ms on
  //    mount. Humans take >2 seconds to fill out a contact form;
  //    headless bots submit in milliseconds.
  if (input.body && typeof input.body.form_loaded_at === "string") {
    const loadedAt = parseInt(input.body.form_loaded_at, 10);
    if (!Number.isNaN(loadedAt) && loadedAt > 0) {
      const elapsed = Date.now() - loadedAt;
      if (elapsed >= 0 && elapsed < 2000) {
        score += 70;
        reasons.push(`submitted in ${elapsed}ms (sub-2s)`);
      }
      // Optional: cap very old forms too (>2hr = recycled session,
      // could be a bot replaying a captured form). Soft signal.
      if (elapsed > 2 * 60 * 60 * 1000) {
        score += 20;
        reasons.push(`form age ${Math.round(elapsed / 60000)}min (stale)`);
      }
    }
  }

  // 9) Mismatched signals — name is gibberish but email looks valid;
  //    OR message is gibberish but a phone was provided. Strong combos
  //    push past threshold even when individual signals are weak.
  // (Implicit in the additive score — no extra logic needed.)

  // Final verdict. Threshold tightened from 60 → 50 to catch
  // submissions hitting one strong signal alone.
  const is_spam = score >= 50;
  return {
    is_spam,
    reason: is_spam ? reasons.join(" + ") : "",
    score
  };
}

/**
 * Heuristic for "looks like random keymash" — no spaces, length > 12,
 * mostly consonants OR mostly random alphanumeric without dictionary-
 * like patterns.
 *
 * Tuned to catch the patterns we've seen in real spam (e.g.
 * "PChjBGXesVoJJKUQEsmS", "NUqCDgmSwctzlnVied") while NOT flagging
 * short real names ("Jake", "Mark Eck", "Dr. Williams").
 */
function looksLikeGibberish(s: string): boolean {
  if (!s) return false;
  const trimmed = s.trim();
  if (trimmed.length < 12) return false; // too short to be confident

  // Real names + sentences almost always contain a space.
  if (/\s/.test(trimmed)) return false;

  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 10) return false;

  // Vowel ratio. Real English / Spanish / etc. names + words have
  // 30-45% vowels. Random keymash typically < 25%.
  const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
  const vowelRatio = vowels / letters.length;
  if (vowelRatio < 0.20) return true; // very low vowel ratio = gibberish

  // Mixed-case randomness: a name almost always starts with uppercase
  // and the rest is lowercase. Bots often produce camel-cased random
  // strings (uppercase scattered throughout the lowercase mass).
  const upperCount = (letters.match(/[A-Z]/g) || []).length;
  const ratio = upperCount / letters.length;
  if (ratio > 0.25 && ratio < 0.7) {
    // Many uppercase letters spread through a no-space string =
    // very likely keymash.
    return true;
  }

  return false;
}
