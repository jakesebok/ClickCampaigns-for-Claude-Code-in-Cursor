/**
 * Unsubscribe link + RFC 8058 List-Unsubscribe headers for jakesebok.com email
 * senders. Opt-outs are handled by the portal's endpoint
 * (https://portal.alignedpower.coach/unsubscribe), which is the single
 * suppression store shared with the 6C reminder cron.
 *
 * For true one-click unsubscribe, set UNSUBSCRIBE_SECRET on BOTH this project
 * and the portal to the same value (the token is HMAC'd with it). If unset here,
 * the link degrades gracefully to a tokenless confirm form on the portal.
 */
import crypto from "node:crypto";

const PORTAL_URL = "https://portal.alignedpower.coach";
const UNSUB_MAILTO = "unsubscribe@alignedpower.coach";

function secret(): string {
  return (process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || "").trim();
}

function normalizeEmail(value: string): string {
  return String(value || "").trim().toLowerCase();
}

function makeToken(email: string): string {
  const key = secret();
  if (!key) return "";
  const e = normalizeEmail(email);
  const sig = crypto.createHmac("sha256", key).update(e).digest("base64url");
  return `${Buffer.from(e).toString("base64url")}.${sig}`;
}

/** Per-recipient unsubscribe URL (signed one-click token when available). */
export function unsubscribeUrl(email: string): string {
  const token = makeToken(email);
  return token
    ? `${PORTAL_URL}/unsubscribe?u=${encodeURIComponent(token)}`
    : `${PORTAL_URL}/unsubscribe?e=${encodeURIComponent(normalizeEmail(email))}`;
}

/** RFC 8058 one-click headers for the Resend `headers` payload field. */
export function unsubscribeHeaders(email: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(email)}>, <mailto:${UNSUB_MAILTO}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
