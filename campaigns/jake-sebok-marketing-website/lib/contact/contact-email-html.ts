import {
  EMAIL_COLORS,
  SITE_ORIGIN,
  bodyPara,
  ctaButton,
  emailShell,
  escHtml,
  fieldRow,
  fmt,
  infoCard,
} from "../email/email-shell";

const C = EMAIL_COLORS;

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

function messageCard(s: ContactSubmission): string {
  return infoCard(
    "Your Message",
    fieldRow("Name", fmt(s.name)) +
      fieldRow("Email", fmt(s.email)) +
      fieldRow("Message", fmt(s.message))
  );
}

function submitterBodyText(s: ContactSubmission): string {
  return [
    "YOUR MESSAGE",
    "------------",
    `Name:    ${s.name || "—"}`,
    `Email:   ${s.email || "—"}`,
    "",
    "Message:",
    s.message || "—",
  ].join("\n");
}

export function buildContactSubmitterEmailHtml(s: ContactSubmission): string {
  const greeting = s.name ? `Hi ${escHtml(s.name)},` : "Hi there,";

  const body =
    bodyPara(greeting, { size: "lg" }) +
    bodyPara(
      "Thanks for reaching out. I&rsquo;ve got your note and I&rsquo;ll be in touch soon. If something is time-sensitive, just reply to this email and say so."
    ) +
    bodyPara(
      `Here&rsquo;s a copy of what you sent, for your records.`,
      { size: "sm" }
    ) +
    messageCard(s) +
    `<hr style="border:none;border-top:1px solid ${C.cardBorder};margin:8px 0 28px;">` +
    bodyPara(
      "While you wait — if you haven&rsquo;t already, the <strong>free VAPI&trade; Assessment</strong> is a 12-minute snapshot of where you&rsquo;re strong, stretched, and what to focus on next. A lot of people find it useful as a starting point for a conversation."
    ) +
    `<div style="text-align:center;margin:0 0 8px;">${ctaButton({
      href: `${SITE_ORIGIN}/assessment`,
      label: "Take the Free VAPI™ Assessment",
    })}</div>`;

  return emailShell({
    preheader: "Thanks for your note — I received it.",
    title: "Got your message",
    bodyHtml: body,
    footerNote: `You received this because you submitted the contact form at <a href="${SITE_ORIGIN}" style="color:${C.accent};text-decoration:none;">jakesebok.com</a>. Reply to this email to add anything.`,
  });
}

export function buildContactSubmitterEmailText(s: ContactSubmission): string {
  const name = s.name || "there";
  return [
    `Hi ${name},`,
    "",
    "Thanks for reaching out. I've got your note and I'll be in touch soon. If something is time-sensitive, just reply to this email and say so.",
    "",
    "Here's a copy of what you sent, for your records:",
    "",
    submitterBodyText(s),
    "",
    "—",
    "",
    "While you wait — if you haven't already, the free VAPI™ Assessment is a 12-minute snapshot of where you're strong, stretched, and what to focus on next.",
    `Take it: ${SITE_ORIGIN}/assessment`,
    "",
    "— Jake",
  ].join("\n");
}

export function buildContactAdminEmailHtml(
  s: ContactSubmission,
  recordId: string
): string {
  const header =
    bodyPara(
      `<strong style="color:${C.primary};">From:</strong> ${escHtml(s.name)} &lt;${escHtml(s.email)}&gt;`,
      { size: "md" }
    ) +
    bodyPara(
      `<strong style="color:${C.primary};">Record ID:</strong> <code style="background:${C.infoCardBg};padding:2px 8px;border-radius:6px;font-size:13px;color:${C.primary};">${escHtml(recordId)}</code>`,
      { size: "sm" }
    ) +
    bodyPara(
      "Reply directly to this email to respond &mdash; the reply-to is set to the sender.",
      { size: "sm" }
    );

  const body = header + messageCard(s);

  return emailShell({
    preheader: `New contact message from ${s.name}`,
    title: "New contact message",
    bodyHtml: body,
    footerNote: `jakesebok.com contact form &middot; ${escHtml(recordId)}`,
  });
}

export function buildContactAdminEmailText(
  s: ContactSubmission,
  recordId: string
): string {
  return [
    "New contact message — jakesebok.com",
    "",
    `Record ID: ${recordId}`,
    `From:      ${s.name} <${s.email}>`,
    "",
    submitterBodyText(s),
    "",
    "Reply directly to this email to respond.",
  ].join("\n");
}
