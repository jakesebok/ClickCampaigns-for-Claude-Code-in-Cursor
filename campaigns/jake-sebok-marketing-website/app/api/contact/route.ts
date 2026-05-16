import {
  buildContactAdminEmailHtml,
  buildContactAdminEmailText,
  buildContactSubmitterEmailHtml,
  buildContactSubmitterEmailText,
  type ContactSubmission,
} from "@/lib/contact/contact-email-html";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL =
  process.env.CONTACT_ADMIN_EMAIL ||
  process.env.VAPI_ADMIN_EMAIL ||
  "jake@alignedpower.coach";
const USER_FROM =
  process.env.VAPI_USER_FROM_EMAIL || "hello@notifications.alignedpower.coach";
const ADMIN_FROM =
  process.env.VAPI_ADMIN_FROM_EMAIL || "assessments@notifications.alignedpower.coach";

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

  const raw = body as Partial<ContactSubmission>;
  const name = String(raw.name || "").trim();
  const email = String(raw.email || "").trim().toLowerCase();
  const message = String(raw.message || "").trim();

  if (!name || name.length < 2) {
    return Response.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!message || message.length < 2) {
    return Response.json({ error: "invalid_message" }, { status: 400 });
  }

  const submission: ContactSubmission = { name, email, message };

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ name, email, message }),
  });

  if (!insertRes.ok) {
    const detail = await insertRes.text();
    return Response.json(
      { error: "insert_failed", detail: detail.slice(0, 600) },
      { status: 500 }
    );
  }

  const inserted = (await insertRes.json()) as Array<{ id: string }>;
  const recordId = inserted[0]?.id || "unknown";

  const results = {
    ok: true,
    id: recordId,
    userEmailSent: false,
    adminEmailSent: false,
    errors: [] as string[],
  };

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
        subject: "I got your message",
        html: buildContactSubmitterEmailHtml(submission),
        text: buildContactSubmitterEmailText(submission),
        reply_to: process.env.CONTACT_REPLY_TO || ADMIN_EMAIL,
      }),
    });
    if (r.ok) results.userEmailSent = true;
    else results.errors.push(`user_email:${(await r.text()).slice(0, 300)}`);
  } catch (e) {
    results.errors.push(`user_email:${String(e)}`);
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: `Jake Sebok Contact <${ADMIN_FROM}>`,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `Contact: ${name}`,
        html: buildContactAdminEmailHtml(submission, recordId),
        text: buildContactAdminEmailText(submission, recordId),
      }),
    });
    if (r.ok) results.adminEmailSent = true;
    else results.errors.push(`admin_email:${(await r.text()).slice(0, 300)}`);
  } catch (e) {
    results.errors.push(`admin_email:${String(e)}`);
  }

  return Response.json(results, { status: 200 });
}
