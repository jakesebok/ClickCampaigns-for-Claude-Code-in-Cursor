import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { calculateScores, getArchetype } from "@/lib/vapi/scoring";
import { buildPortalResultsFormat } from "@/lib/vapi/portal-format";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fetchPortalVapiByEmail(email: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const emailNorm = String(email).trim().toLowerCase();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vapi_results?email=eq.${encodeURIComponent(emailNorm)}&select=id,email,first_name,last_name,results,created_at,source&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) return null;
  return res.json();
}

async function insertPortalVapi(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  results: object;
  source: string;
}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase not configured");
  }
  const emailNorm = String(params.email).trim().toLowerCase();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/vapi_results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      email: emailNorm,
      first_name: params.firstName || null,
      last_name: params.lastName || null,
      results: params.results,
      source: params.source,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const id = req.nextUrl.searchParams.get("id");
  const rows = await fetchPortalVapiByEmail(user.email);
  if (!rows || rows.length === 0) {
    return NextResponse.json({ results: [] });
  }

  if (id) {
    const row = rows.find((r: { id: string }) => r.id === id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = row.results as Record<string, unknown>;
    return NextResponse.json({
      result: {
        id: row.id,
        domainScores: (r.domainScores as Record<string, number>) || {},
        arenaScores: (r.arenaScores as Record<string, number>) || {},
        overallScore: Math.round(((r.overall as number) || 0) * 10),
        archetype: (r.archetype as string) || null,
        importance: (r.importanceRatings as Record<string, number>) || {},
        createdAt: row.created_at,
      },
    });
  }

  const results = rows.map((row: { id: string; results: Record<string, unknown>; created_at: string }) => {
    const r = row.results;
    return {
      id: row.id,
      domainScores: (r.domainScores as Record<string, number>) || {},
      arenaScores: (r.arenaScores as Record<string, number>) || {},
      overallScore: Math.round(((r.overall as number) || 0) * 10),
      archetype: (r.archetype as string) || null,
      importance: (r.importanceRatings as Record<string, number>) || {},
      createdAt: row.created_at,
    };
  });

  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { answers, importance } = await req.json();

  if (!answers || typeof answers !== "object")
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });

  const scores = calculateScores(answers);
  const archetype = getArchetype(scores.arenas, scores.domains);

  const portalResults = buildPortalResultsFormat({
    domainScores: scores.domains,
    arenaScores: scores.arenas,
    overall: scores.overall,
    archetype,
    importance: importance || {},
    firstName: user.name?.split(" ")[0],
    lastName: user.name?.split(" ").slice(1).join(" ") || undefined,
  });

  const row = await insertPortalVapi({
    email: user.email,
    firstName: user.name?.split(" ")[0],
    lastName: user.name?.split(" ").slice(1).join(" ") || undefined,
    results: portalResults,
    source: "app",
  });

  return NextResponse.json({
    id: row.id,
    domainScores: scores.domains,
    arenaScores: scores.arenas,
    overallScore: Math.round(scores.overall * 10),
    archetype,
  });
}
