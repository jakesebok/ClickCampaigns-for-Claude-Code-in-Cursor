import {
  EMAIL_COLORS,
  cardWrap,
  emailShell,
  escHtml,
  fieldHtml,
  fmt,
  sectionEyebrow,
} from "../email/email-shell";

const C = EMAIL_COLORS;

export interface ApplySubmission {
  name: string;
  email: string;
  business: string;
  revenue: string;
  why: string;
}

const REVENUE_LABEL: Record<string, string> = {
  "under-80k": "Under $80K",
  "80k-150k": "$80K – $150K",
  "150k-300k": "$150K – $300K",
  "300k-750k": "$300K – $750K",
  "750k-1m": "$750K – $1M",
  "over-1m": "Over $1M",
};

function revenueDisplay(v: string) {
  return REVENUE_LABEL[v] || v || "—";
}

function summaryHtml(s: ApplySubmission): string {
  return (
    cardWrap(
      sectionEyebrow("Applicant") +
        fieldHtml("Name", fmt(s.name)) +
        fieldHtml("Email", fmt(s.email))
    ) +
    cardWrap(
      sectionEyebrow("Business") +
        fieldHtml("Business / Role", fmt(s.business)) +
        fieldHtml("Annual Revenue", escHtml(revenueDisplay(s.revenue)))
    ) +
    cardWrap(
      sectionEyebrow("Why now") +
        fieldHtml("What's at stake / what they want", fmt(s.why))
    )
  );
}

function summaryText(s: ApplySubmission): string {
  return [
    "APPLICANT",
    "---------",
    `Name:     ${s.name || "—"}`,
    `Email:    ${s.email || "—"}`,
    "",
    "BUSINESS",
    "--------",
    `Role:     ${s.business || "—"}`,
    `Revenue:  ${revenueDisplay(s.revenue)}`,
    "",
    "WHY NOW",
    "-------",
    s.why || "—",
  ].join("\n");
}

export function buildApplySubmitterEmailHtml(s: ApplySubmission): string {
  const greeting = s.name ? `Hi ${escHtml(s.name)},` : "Hi there,";
  const intro = `<p style="margin:0 0 12px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${greeting}</p>
<p style="margin:0 0 16px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">Thanks for applying to the <strong style="color:${C.primary};">Aligned Power Program</strong>. I read every application personally, and you&rsquo;ll hear back within 5&ndash;7 business days.</p>
<p style="margin:0 0 16px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">What happens next:</p>
<ol style="margin:0 0 20px;padding-left:22px;font-size:16px;line-height:1.7;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">
  <li>I review your application against current openings and fit.</li>
  <li>If it looks like a match, I&rsquo;ll send a calendar link for a kickoff call.</li>
  <li>We decide together whether to move forward. No pressure either way.</li>
</ol>
<p style="margin:0;font-size:13px;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Here&rsquo;s a copy of what you submitted for your records.</p>`;

  return emailShell({
    preheader: "Your application to the Aligned Power Program — received.",
    heroTitle: "Application received",
    heroAccent: "I review every application personally.",
    introHtml: intro,
    bodyHtml: summaryHtml(s),
    footerHtml: `<p style="margin:0;font-size:12px;line-height:1.55;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Questions in the meantime? Reply to this email. &mdash; Jake</p>`,
  });
}

export function buildApplySubmitterEmailText(s: ApplySubmission): string {
  const name = s.name || "there";
  return [
    `Hi ${name},`,
    "",
    "Thanks for applying to the Aligned Power Program. I read every application personally, and you'll hear back within 5–7 business days.",
    "",
    "What happens next:",
    "  1. I review your application against current openings and fit.",
    "  2. If it looks like a match, I'll send a calendar link for a kickoff call.",
    "  3. We decide together whether to move forward. No pressure either way.",
    "",
    "Here's a copy of what you submitted:",
    "",
    summaryText(s),
    "",
    "— Jake",
  ].join("\n");
}

export function buildApplyAdminEmailHtml(
  s: ApplySubmission,
  recordId: string
): string {
  const intro = `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Record ID:</strong> <code style="background:${C.soft};padding:2px 8px;border-radius:6px;font-size:13px;color:${C.primary};">${escHtml(recordId)}</code></p>
<p style="margin:0 0 6px;font-size:15px;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Applicant:</strong> ${escHtml(s.name)} &lt;${escHtml(s.email)}&gt;</p>
<p style="margin:0 0 20px;font-size:15px;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Revenue band:</strong> ${escHtml(revenueDisplay(s.revenue))}</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Full structured submission below. Reply-to is set to the applicant.</p>`;

  return emailShell({
    preheader: `New Aligned Power application from ${s.name}`,
    heroTitle: "New Aligned Power application",
    introHtml: intro,
    bodyHtml: summaryHtml(s),
    footerHtml: `<p style="margin:0;font-size:12px;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">jakesebok.com Work With Me application &middot; ${escHtml(recordId)}</p>`,
  });
}

export function buildApplyAdminEmailText(
  s: ApplySubmission,
  recordId: string
): string {
  return [
    "New Aligned Power Program application — jakesebok.com",
    "",
    `Record ID: ${recordId}`,
    `Applicant: ${s.name} <${s.email}>`,
    "",
    summaryText(s),
    "",
    "Reply directly to this email to respond.",
  ].join("\n");
}
