import {
  EMAIL_COLORS,
  SITE_ORIGIN,
  bodyPara,
  emailShell,
  escHtml,
  fieldRow,
  fmt,
  infoCard,
  sectionHeading,
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

function applicantCard(s: ApplySubmission): string {
  return infoCard(
    "Applicant",
    fieldRow("Name", fmt(s.name)) + fieldRow("Email", fmt(s.email))
  );
}

function businessCard(s: ApplySubmission): string {
  return infoCard(
    "Business",
    fieldRow("Business / Role", fmt(s.business)) +
      fieldRow("Annual Revenue", escHtml(revenueDisplay(s.revenue)))
  );
}

function whyCard(s: ApplySubmission): string {
  return infoCard("Why Now", fieldRow("What's at stake / what you want", fmt(s.why)));
}

function applicationCards(s: ApplySubmission): string {
  return applicantCard(s) + businessCard(s) + whyCard(s);
}

function applicationText(s: ApplySubmission): string {
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

  const body =
    bodyPara(greeting, { size: "lg" }) +
    bodyPara(
      `Thanks for applying to the <strong style="color:${C.primary};">Aligned Power Program</strong>. I read every application personally, and you&rsquo;ll hear back within 5&ndash;7 business days.`
    ) +
    sectionHeading("What happens next") +
    `<ol style="margin:0 0 28px;padding:0 0 0 22px;color:${C.secondary};font-size:16px;line-height:1.8;font-family:Helvetica Neue,Arial,sans-serif;">
<li>I review your application against current openings and fit.</li>
<li>If it looks like a match, I&rsquo;ll send a calendar link for a kickoff call.</li>
<li>We decide together whether to move forward. No pressure either way.</li>
</ol>` +
    bodyPara("Here&rsquo;s a copy of what you submitted, for your records.", {
      size: "sm",
    }) +
    applicationCards(s);

  return emailShell({
    preheader: "Your Aligned Power Program application — received.",
    title: "Application received",
    bodyHtml: body,
    footerNote: `You received this because you applied to the Aligned Power Program at <a href="${SITE_ORIGIN}" style="color:${C.accent};text-decoration:none;">jakesebok.com</a>. Questions in the meantime? Just reply.`,
  });
}

export function buildApplySubmitterEmailText(s: ApplySubmission): string {
  const name = s.name || "there";
  return [
    `Hi ${name},`,
    "",
    "Thanks for applying to the Aligned Power Program. I read every application personally, and you'll hear back within 5–7 business days.",
    "",
    "WHAT HAPPENS NEXT",
    "-----------------",
    "  1. I review your application against current openings and fit.",
    "  2. If it looks like a match, I'll send a calendar link for a kickoff call.",
    "  3. We decide together whether to move forward. No pressure either way.",
    "",
    "Here's a copy of what you submitted:",
    "",
    applicationText(s),
    "",
    "— Jake",
  ].join("\n");
}

export function buildApplyAdminEmailHtml(
  s: ApplySubmission,
  recordId: string
): string {
  const header =
    bodyPara(
      `<strong style="color:${C.primary};">Applicant:</strong> ${escHtml(s.name)} &lt;${escHtml(s.email)}&gt;`,
      { size: "md" }
    ) +
    bodyPara(
      `<strong style="color:${C.primary};">Revenue band:</strong> ${escHtml(revenueDisplay(s.revenue))}`,
      { size: "md" }
    ) +
    bodyPara(
      `<strong style="color:${C.primary};">Record ID:</strong> <code style="background:${C.infoCardBg};padding:2px 8px;border-radius:6px;font-size:13px;color:${C.primary};">${escHtml(recordId)}</code>`,
      { size: "sm" }
    ) +
    bodyPara(
      "Full structured submission below. Reply-to is set to the applicant.",
      { size: "sm" }
    );

  const body = header + applicationCards(s);

  return emailShell({
    preheader: `New Aligned Power application from ${s.name}`,
    title: "New Aligned Power application",
    bodyHtml: body,
    footerNote: `jakesebok.com Work With Me application &middot; ${escHtml(recordId)}`,
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
    `Revenue:   ${revenueDisplay(s.revenue)}`,
    "",
    applicationText(s),
    "",
    "Reply directly to this email to respond.",
  ].join("\n");
}
