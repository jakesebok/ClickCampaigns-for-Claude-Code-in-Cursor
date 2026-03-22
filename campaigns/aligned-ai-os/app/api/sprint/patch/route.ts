import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PATCH(req: NextRequest) {
  if (!SUPABASE_URL || !SRK) {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }
  const user = await getOrCreateUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const email = user.email.trim().toLowerCase();

  let body: { taskUpdates?: Record<string, boolean>; weekReflections?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const taskUpdates = body.taskUpdates && typeof body.taskUpdates === "object" ? body.taskUpdates : null;
  const weekReflections =
    body.weekReflections && typeof body.weekReflections === "object" ? body.weekReflections : null;
  if (!taskUpdates && !weekReflections) {
    return NextResponse.json({ error: "nothing_to_patch" }, { status: 400 });
  }

  const findUrl = `${SUPABASE_URL}/rest/v1/sprints?user_email=eq.${encodeURIComponent(email)}&status=eq.active&select=id,payload&limit=1`;
  const findRes = await fetch(findUrl, {
    headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, Accept: "application/json" },
  });
  if (!findRes.ok) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
  const rows = (await findRes.json()) as { id: string; payload: Record<string, unknown> }[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "no_sprint" }, { status: 404 });
  }

  const payload = { ...(row.payload || {}) } as {
    weeks?: { weekNumber?: number; tasks?: { id?: string; completed?: boolean }[] }[];
    weekReflections?: Record<string, string>;
  };
  if (!payload.weeks || !Array.isArray(payload.weeks)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  if (taskUpdates) {
    for (const w of payload.weeks) {
      if (!w.tasks || !Array.isArray(w.tasks)) continue;
      for (const t of w.tasks) {
        if (t?.id != null && Object.prototype.hasOwnProperty.call(taskUpdates, t.id)) {
          t.completed = !!taskUpdates[t.id];
        }
      }
    }
  }

  if (weekReflections) {
    payload.weekReflections = { ...(payload.weekReflections || {}) };
    for (const [k, v] of Object.entries(weekReflections)) {
      if (typeof v === "string") payload.weekReflections[k] = v;
    }
  }

  const patchUrl = `${SUPABASE_URL}/rest/v1/sprints?id=eq.${encodeURIComponent(row.id)}`;
  const patchRes = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      apikey: SRK,
      Authorization: `Bearer ${SRK}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ payload, updated_at: new Date().toISOString() }),
  });

  if (!patchRes.ok) {
    const t = await patchRes.text();
    return NextResponse.json({ error: "patch_failed", detail: t.slice(0, 200) }, { status: 500 });
  }
  const data = await patchRes.json();
  const out = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ ok: true, sprint: out });
}
