/**
 * Shared transactional-email shell for the Jake Sebok marketing site.
 *
 * Visual language mirrors the VAPI Assessment results email
 * (campaigns/aligned-power-vapi/output-assets/lib/portal-server/handlers/vapi-assessment-complete.js):
 *   - Cream header (#FAF9F7) with logo
 *   - White body card on cool gray (#F5F7FA) page background
 *   - Soft gray info cards with uppercase-tracked labels
 *   - Orange (#FF6B1A) primary CTAs, dark (#0E1624) secondary
 *   - Light gray footer
 */

export const EMAIL_COLORS = {
  primary: "#0E1624",
  secondary: "#3A4A5C",
  muted: "#7A8FA8",
  accent: "#FF6B1A",
  pageBg: "#F5F7FA",
  cardBg: "#FFFFFF",
  cardBorder: "#DDE3ED",
  headerBg: "#FAF9F7",
  headerBorder: "#E8E6E3",
  infoCardBg: "#F5F7FA",
} as const;

const C = EMAIL_COLORS;

export const SITE_ORIGIN = "https://jakesebok.com";
export const LOGO_URL = `${SITE_ORIGIN}/images/logo-jake-sebok-horizontal.png`;

export function escHtml(s: string | null | undefined) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function nl2br(s: string | null | undefined) {
  return escHtml(s).replace(/\r\n/g, "\n").split("\n").join("<br/>");
}

export function fmt(s: string | null | undefined, empty = "—") {
  const t = String(s ?? "").trim();
  return t
    ? nl2br(t)
    : `<span style="color:${C.muted};font-style:italic;">${empty}</span>`;
}

/**
 * A soft-gray card with an uppercase-tracked eyebrow label.
 * Use for grouping related fields (e.g. "YOUR MESSAGE", "APPLICANT").
 */
export function infoCard(label: string, bodyHtml: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid ${C.cardBorder};border-radius:8px;background:${C.infoCardBg};">
<tr><td style="padding:20px 24px;">
<p style="margin:0 0 14px;color:${C.muted};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;font-family:Helvetica Neue,Arial,sans-serif;">${escHtml(label)}</p>
${bodyHtml}
</td></tr></table>`;
}

/**
 * A label + value row, intended for use inside an infoCard.
 * Renders as a tiny secondary label above the value.
 */
export function fieldRow(label: string, valueHtml: string): string {
  return `<div style="margin-bottom:14px;">
<p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">${escHtml(label)}</p>
<div style="margin:0;font-size:15px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${valueHtml}</div>
</div>`;
}

/**
 * A button-styled anchor. Primary is orange, secondary is dark.
 * Wrap in <div style="text-align:center"> as needed.
 */
export function ctaButton(opts: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}): string {
  const bg = opts.variant === "secondary" ? C.primary : C.accent;
  return `<a href="${escHtml(opts.href)}" style="display:inline-block;background:${bg};color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;font-family:Helvetica Neue,Arial,sans-serif;">${escHtml(opts.label)} &#8594;</a>`;
}

/**
 * Main email shell. `bodyHtml` should contain everything between the logo
 * header and the footer (greeting, body paragraphs, info cards, optional CTAs).
 */
export function emailShell(opts: {
  preheader: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const pre = escHtml(opts.preheader);
  const footer =
    opts.footerNote ||
    `Sent from <a href="${SITE_ORIGIN}" style="color:${C.accent};text-decoration:none;">jakesebok.com</a>.`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.pageBg};font-family:'Helvetica Neue',Arial,sans-serif;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${C.pageBg};opacity:0;">${pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.pageBg};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.cardBg};border-radius:12px;overflow:hidden;border:1px solid ${C.cardBorder};">

  <tr><td style="background:${C.headerBg};padding:32px 40px;text-align:center;border-bottom:1px solid ${C.headerBorder};">
    <a href="${SITE_ORIGIN}" style="display:inline-block;text-decoration:none;">
      <img src="${LOGO_URL}" alt="Jake Sebok" width="200" height="auto" style="display:block;max-width:200px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;" />
    </a>
  </td></tr>

  <tr><td style="padding:40px 40px 32px;">
${opts.bodyHtml}
  </td></tr>

  <tr><td style="background:${C.pageBg};padding:24px 40px;text-align:center;border-top:1px solid ${C.cardBorder};">
    <p style="margin:0 0 8px;color:${C.muted};font-size:13px;font-weight:600;">Jake Sebok</p>
    <p style="margin:0;color:${C.muted};font-size:12px;line-height:1.6;">${footer}</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * Styled paragraph for use inside emailShell body sections.
 * Default size matches VAPI body text (16px / 1.6 / secondary color).
 */
export function bodyPara(html: string, opts?: { size?: "sm" | "md" | "lg" }): string {
  const size = opts?.size || "md";
  const fontSize = size === "sm" ? "14px" : size === "lg" ? "17px" : "16px";
  return `<p style="margin:0 0 20px;color:${C.secondary};font-size:${fontSize};line-height:1.6;font-family:Helvetica Neue,Arial,sans-serif;">${html}</p>`;
}

/** A section heading inside the body (e.g. "What happens next"). */
export function sectionHeading(text: string): string {
  return `<h2 style="margin:0 0 12px;color:${C.primary};font-size:18px;font-weight:700;font-family:Helvetica Neue,Arial,sans-serif;">${escHtml(text)}</h2>`;
}
