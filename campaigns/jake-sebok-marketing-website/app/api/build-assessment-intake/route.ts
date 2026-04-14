import type { BuildIntakePayloadV1 } from "@/lib/build-assessment-intake/types";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL =
  process.env.BUILD_INTAKE_ADMIN_EMAIL ||
  process.env.VAPI_ADMIN_EMAIL ||
  "jacob@alignedpower.coach";
const USER_FROM =
  process.env.VAPI_USER_FROM_EMAIL || "hello@notifications.alignedpower.coach";
const ADMIN_FROM =
  process.env.VAPI_ADMIN_FROM_EMAIL || "assessments@notifications.alignedpower.coach";

function escHtml(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPayloadText(p: BuildIntakePayloadV1): string {
  return JSON.stringify(p, null, 2);
}

function buildUserEmailHtmlFixed(p: BuildIntakePayloadV1, email: string) {
  const name = p.contactName || "";
  const greeting = name ? `Hi ${escHtml(name)},` : "Hi there,";
  const body = escHtml(formatPayloadText(p));
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:Helvetica Neue,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">
  <tr><td style="padding:36px 40px 28px;">
    <p style="margin:0 0 16px;color:#3A4A5C;font-size:16px;line-height:1.6;">${greeting}</p>
    <p style="margin:0 0 16px;color:#3A4A5C;font-size:16px;line-height:1.6;">Thanks for completing the <strong>Build Your Assessment</strong> intake. I received your answers and will review them personally.</p>
    <p style="margin:0 0 16px;color:#3A4A5C;font-size:16px;line-height:1.6;">A copy of your submission is included below for your records. If anything looks off, reply to this email and we will fix it.</p>
    <p style="margin:0;color:#7A8FA8;font-size:13px;">Submitted by: ${escHtml(email)}</p>
  </td></tr>
  <tr><td style="padding:0 40px 36px;">
    <p style="margin:0 0 8px;color:#7A8FA8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Your answers (JSON)</p>
    <pre style="margin:0;padding:16px;background:#F5F7FA;border-radius:8px;border:1px solid #DDE3ED;font-size:11px;line-height:1.5;color:#0E1624;white-space:pre-wrap;word-break:break-word;">${body}</pre>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function buildAdminEmailHtml(p: BuildIntakePayloadV1, recordId: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:Helvetica Neue,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:24px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FFFFFF;border-radius:12px;border:1px solid #DDE3ED;">
  <tr><td style="padding:24px 28px;background:#0E1624;color:#fff;font-size:18px;font-weight:700;">New Build Your Assessment intake</td></tr>
  <tr><td style="padding:20px 28px;color:#3A4A5C;font-size:14px;">
    <p style="margin:0 0 8px;"><strong>Record ID:</strong> ${escHtml(recordId)}</p>
    <p style="margin:0 0 8px;"><strong>Name:</strong> ${escHtml(p.contactName)}</p>
    <p style="margin:0 0 16px;"><strong>Email:</strong> ${escHtml(p.contactEmail)}</p>
    <pre style="margin:0;padding:14px;background:#F5F7FA;border-radius:8px;font-size:11px;line-height:1.45;white-space:pre-wrap;word-break:break-word;">${escHtml(formatPayloadText(p))}</pre>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey) {
    return Response.json(
      { error: "missing_env", message: "RESEND_API_KEY required" },
      { status: 500 }
    );
  }
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      {
        error: "missing_env",
        message: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const payload = body as Partial<BuildIntakePayloadV1>;
  const email = String(payload.contactEmail || "")
    .trim()
    .toLowerCase();
  const name = String(payload.contactName || "").trim();

  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  if (!name || name.length < 2) {
    return Response.json({ error: "invalid_name" }, { status: 400 });
  }

  const full: BuildIntakePayloadV1 = {
    ...(payload as BuildIntakePayloadV1),
    version: 1,
    contactEmail: email,
    contactName: name,
  };

  if (!full.privacyPolicyUrl?.trim() || !full.termsUrl?.trim()) {
    return Response.json(
      { error: "missing_legal_urls", message: "Privacy and terms URLs required" },
      { status: 400 }
    );
  }

  const insertRes = await fetch(
    `${supabaseUrl}/rest/v1/build_assessment_intake_submissions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        email,
        full_name: name,
        payload: full,
      }),
    }
  );

  if (!insertRes.ok) {
    const detail = await insertRes.text();
    return Response.json(
      {
        error: "insert_failed",
        detail: detail.slice(0, 600),
      },
      { status: 500 }
    );
  }

  const inserted = (await insertRes.json()) as Array<{ id: string }>;
  const recordId = inserted[0]?.id || "unknown";

  const results: {
    ok: boolean;
    id: string;
    userEmailSent: boolean;
    adminEmailSent: boolean;
    errors: string[];
  } = { ok: true, id: recordId, userEmailSent: false, adminEmailSent: false, errors: [] };

  const userHtml = buildUserEmailHtmlFixed(full, email);
  const userText = `${name ? `Hi ${name},` : "Hi there,"}\n\nThanks for completing the Build Your Assessment intake.\n\n${formatPayloadText(full)}`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Jake Sebok <${USER_FROM}>`,
        to: [email],
        subject: "We received your Build Your Assessment intake",
        html: userHtml,
        text: userText,
        reply_to: process.env.VAPI_REPLY_TO || process.env.SIX_C_REPLY_TO,
      }),
    });
    if (r.ok) results.userEmailSent = true;
    else results.errors.push(`user_email:${await r.text()}`);
  } catch (e) {
    results.errors.push(`user_email:${String(e)}`);
  }

  const adminHtml = buildAdminEmailHtml(full, recordId);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Build Intake <${ADMIN_FROM}>`,
        to: [ADMIN_EMAIL],
        subject: `Build Your Assessment intake — ${name}`,
        html: adminHtml,
        text: `New intake\nID: ${recordId}\n${formatPayloadText(full)}`,
      }),
    });
    if (r.ok) results.adminEmailSent = true;
    else results.errors.push(`admin_email:${await r.text()}`);
  } catch (e) {
    results.errors.push(`admin_email:${String(e)}`);
  }

  return Response.json(results, { status: 200 });
}
