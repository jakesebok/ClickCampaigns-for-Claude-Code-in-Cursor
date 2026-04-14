import type { BuildIntakePayloadV1 } from "@/lib/build-assessment-intake/types";
import {
  buildAdminEmailHtml,
  buildAdminEmailText,
  buildSubmitterEmailHtml,
  buildSubmitterEmailText,
} from "@/lib/build-assessment-intake/intake-email-html";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL =
  process.env.BUILD_INTAKE_ADMIN_EMAIL ||
  process.env.VAPI_ADMIN_EMAIL ||
  "jacob@alignedpower.coach";
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

  const userHtml = buildSubmitterEmailHtml(full, email);
  const userText = buildSubmitterEmailText(full, email);

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
  const adminText = buildAdminEmailText(full, recordId);
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
        text: adminText,
      }),
    });
    if (r.ok) results.adminEmailSent = true;
    else results.errors.push(`admin_email:${await r.text()}`);
  } catch (e) {
    results.errors.push(`admin_email:${String(e)}`);
  }

  return Response.json(results, { status: 200 });
}
