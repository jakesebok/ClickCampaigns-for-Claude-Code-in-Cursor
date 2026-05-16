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

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

function summaryHtml(s: ContactSubmission): string {
  return cardWrap(
    sectionEyebrow("Your message") +
      fieldHtml("Name", fmt(s.name)) +
      fieldHtml("Email", fmt(s.email)) +
      fieldHtml("Message", fmt(s.message))
  );
}

function summaryText(s: ContactSubmission): string {
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
  const intro = `<p style="margin:0 0 12px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${greeting}</p>
<p style="margin:0 0 16px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">Thanks for reaching out. I&rsquo;ve received your note and I&rsquo;ll get back to you soon. If something is time-sensitive, just reply to this email and say so.</p>
<p style="margin:0;font-size:13px;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Here&rsquo;s a copy of what you sent for your records.</p>`;

  return emailShell({
    preheader: "Thanks for your note — I received it.",
    heroTitle: "Got your message",
    heroAccent: "I'll be in touch soon.",
    introHtml: intro,
    bodyHtml: summaryHtml(s),
    footerHtml: `<p style="margin:0;font-size:12px;line-height:1.55;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Reply to this email to add anything I should know. — Jake</p>`,
  });
}

export function buildContactSubmitterEmailText(s: ContactSubmission): string {
  const name = s.name || "there";
  return [
    `Hi ${name},`,
    "",
    "Thanks for reaching out. I've received your note and I'll get back to you soon. If something is time-sensitive, just reply to this email and say so.",
    "",
    "Here's a copy of what you sent for your records:",
    "",
    summaryText(s),
    "",
    "— Jake",
  ].join("\n");
}

export function buildContactAdminEmailHtml(
  s: ContactSubmission,
  recordId: string
): string {
  const intro = `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Record ID:</strong> <code style="background:${C.soft};padding:2px 8px;border-radius:6px;font-size:13px;color:${C.primary};">${escHtml(recordId)}</code></p>
<p style="margin:0 0 6px;font-size:15px;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">From:</strong> ${escHtml(s.name)} &lt;${escHtml(s.email)}&gt;</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Reply directly to this email to respond &mdash; reply-to is set to the sender.</p>`;

  return emailShell({
    preheader: `New contact message from ${s.name}`,
    heroTitle: "New contact message",
    introHtml: intro,
    bodyHtml: summaryHtml(s),
    footerHtml: `<p style="margin:0;font-size:12px;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">jakesebok.com contact form &middot; ${escHtml(recordId)}</p>`,
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
    summaryText(s),
    "",
    "Reply directly to this email to respond.",
  ].join("\n");
}
