import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  if (!SUPABASE_URL || !SRK) {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }
  const user = await getOrCreateUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const email = user.email.trim().toLowerCase();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/sprints?user_email=eq.${encodeURIComponent(email)}&status=eq.active&select=*&limit=1`,
    {
      headers: { apikey: SRK, Authorization: `Bearer ${SRK}`, Accept: "application/json" },
    }
  );
  if (!res.ok) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
  const rows = (await res.json()) as unknown[];
  const sprint = rows[0] ?? null;
  return NextResponse.json({ sprint });
}
