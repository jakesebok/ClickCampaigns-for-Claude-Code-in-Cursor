/**
 * Shared transactional-email shell for the Jake Sebok marketing site.
 * Used by contact and apply submission emails. Mirrors the visual treatment
 * of lib/build-assessment-intake/intake-email-html.ts so all Aligned Power
 * transactional mail feels like the same brand.
 */

export const EMAIL_COLORS = {
  primary: "#0E1624",
  secondary: "#3A4A5C",
  muted: "#7A8FA8",
  accent: "#FF6B1A",
  bg: "#F5F7FA",
  card: "#FFFFFF",
  border: "#DDE3ED",
  soft: "#FAFAFB",
  foot: "#EEF1F7",
} as const;

const C = EMAIL_COLORS;

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
  return t ? nl2br(t) : `<span style="color:${C.muted};font-style:italic;">${empty}</span>`;
}

export function sectionEyebrow(title: string) {
  return `<p style="margin:0 0 14px;padding:0 0 10px;border-bottom:1px solid ${C.border};font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:${C.primary};letter-spacing:-0.02em;">${escHtml(title)}</p>`;
}

export function fieldHtml(label: string, valueHtml: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;"><tr><td>
<p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">${escHtml(label)}</p>
<div style="margin:0;font-size:15px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${valueHtml}</div>
</td></tr></table>`;
}

export function cardWrap(inner: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td style="padding:22px 24px;background:${C.soft};border:1px solid ${C.border};border-radius:14px;">${inner}</td></tr></table>`;
}

export function emailShell(opts: {
  preheader: string;
  heroTitle: string;
  heroAccent?: string;
  introHtml: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  const pre = escHtml(opts.preheader);
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escHtml(opts.heroTitle)}</title>
<!--[if mso]><style type="text/css">table {border-collapse:collapse;} td {font-family: Arial, sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${C.bg};opacity:0;">${pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border-radius:16px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 24px 48px -28px rgba(14,22,36,0.12);">
<tr><td style="padding:0;background:linear-gradient(135deg, ${C.primary} 0%, #192236 100%);">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:28px 32px 24px;">
<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.55);font-family:Helvetica Neue,Arial,sans-serif;">Jake Sebok</p>
<h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;line-height:1.2;">${escHtml(opts.heroTitle)}</h1>
${opts.heroAccent ? `<p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:rgba(255,255,255,0.82);font-family:Helvetica Neue,Arial,sans-serif;">${opts.heroAccent}</p>` : ""}
</td></tr></table>
</td></tr>
<tr><td style="padding:28px 28px 8px;">
${opts.introHtml}
</td></tr>
<tr><td style="padding:8px 28px 32px;">
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:20px 28px 28px;background:${C.foot};border-top:1px solid ${C.border};">
${opts.footerHtml || `<p style="margin:0;font-size:12px;line-height:1.5;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Sent from jakesebok.com</p>`}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
