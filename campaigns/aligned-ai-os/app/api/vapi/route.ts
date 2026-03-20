import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import { calculateScores, getArchetype } from "@/lib/vapi/scoring";
import { buildPortalResultsFormat } from "@/lib/vapi/portal-format";
import {
  determineDriver,
  flattenGroupedAnswersToScoredResponses,
  normalizeResponsesFromStoredMap,
} from "@/lib/vapi/drivers";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fetchPortalVapiByEmail(email: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const emailNorm = String(email).trim().toLowerCase();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vapi_results?email=ilike.${encodeURIComponent(emailNorm)}&select=id,email,first_name,last_name,results,created_at,source&order=created_at.desc`,
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

/** Normalize arena keys from portal (Personal/Relationships/Business) to app (personal/relationships/business) */
function normalizeArenaScores(raw: Record<string, number> | null | undefined): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const map: Record<string, string> = { Personal: "personal", Relationships: "relationships", Business: "business" };
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = map[k] ?? k.toLowerCase();
    out[key] = typeof v === "number" ? v : 0;
  }
  return out;
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

function getDriverEvaluationFromStoredResults(results: Record<string, unknown>) {
  if (
    typeof results.topDriverScore === "number" &&
    typeof results.secondDriverScore === "number" &&
    typeof results.primaryToSecondaryMargin === "number" &&
    results.driverScores &&
    typeof results.driverScores === "object" &&
    results.driverGates &&
    typeof results.driverGates === "object" &&
    "assignedDriver" in results &&
    "secondaryDriver" in results &&
    "secondaryDriverScore" in results
  ) {
    return {
      assignedDriver:
        typeof results.assignedDriver === "string"
          ? (results.assignedDriver as string)
          : null,
      secondaryDriver:
        typeof results.secondaryDriver === "string"
          ? (results.secondaryDriver as string)
          : null,
      driverScores: results.driverScores as Record<string, number>,
      driverGates: results.driverGates as Record<string, boolean>,
      topDriverScore: results.topDriverScore as number,
      secondDriverScore: results.secondDriverScore as number,
      secondaryDriverScore:
        typeof results.secondaryDriverScore === "number"
          ? (results.secondaryDriverScore as number)
          : null,
      primaryToSecondaryMargin: results.primaryToSecondaryMargin as number,
    };
  }

  const hasResponses =
    results.allResponses &&
    typeof results.allResponses === "object" &&
    Object.keys(results.allResponses as Record<string, unknown>).length > 0;

  if (!hasResponses) {
    return {
      assignedDriver: null,
      driverScores: {
        "The Achiever's Trap": 0,
        "The Escape Artist": 0,
        "The Pleaser's Bind": 0,
        "The Imposter Loop": 0,
        "The Perfectionist's Prison": 0,
        "The Protector": 0,
        "The Martyr Complex": 0,
        "The Fog": 0,
      },
      driverGates: {
        "The Achiever's Trap": false,
        "The Escape Artist": false,
        "The Pleaser's Bind": false,
        "The Imposter Loop": false,
        "The Perfectionist's Prison": false,
        "The Protector": false,
        "The Martyr Complex": false,
        "The Fog": false,
      },
      topDriverScore: 0,
      secondDriverScore: 0,
      secondaryDriver: null,
      secondaryDriverScore: null,
      primaryToSecondaryMargin: 0,
    };
  }

  const scoredResponses = normalizeResponsesFromStoredMap(
    (results.allResponses as Record<string, number> | undefined) || {},
    typeof results.responseCodingVersion === "string"
      ? (results.responseCodingVersion as string)
      : null
  );

  return determineDriver({
    domainScores: (results.domainScores as Record<string, number>) || {},
    importanceRatings:
      (results.importanceRatings as Record<string, number>) || {},
    scoredResponses,
    arenaScores: (results.arenaScores as Record<string, number>) || {},
    compositeScore:
      typeof results.overall === "number" ? (results.overall as number) : null,
  });
}

export async function GET(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  const rows = await fetchPortalVapiByEmail(user.email);
  if (!rows || rows.length === 0) {
    return NextResponse.json({ results: [] });
  }

  if (id) {
    const row = rows.find((r: { id: string }) => r.id === id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = row.results as Record<string, unknown>;
    const driverEvaluation = getDriverEvaluationFromStoredResults(r);
    return NextResponse.json({
      result: {
        id: row.id,
        domainScores: (r.domainScores as Record<string, number>) || {},
        arenaScores: normalizeArenaScores(r.arenaScores as Record<string, number>),
        overallScore: Math.round(((r.overall as number) || 0) * 10),
        archetype: (r.archetype as string) || null,
        importance: (r.importanceRatings as Record<string, number>) || {},
        assignedDriver: driverEvaluation.assignedDriver,
        secondaryDriver: driverEvaluation.secondaryDriver,
        driverScores: driverEvaluation.driverScores,
        topDriverScore: driverEvaluation.topDriverScore,
        secondaryDriverScore: driverEvaluation.secondaryDriverScore,
        primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
        createdAt: row.created_at,
      },
    });
  }

  const results = rows.map((row: { id: string; results: Record<string, unknown>; created_at: string }) => {
    const r = row.results;
    const driverEvaluation = getDriverEvaluationFromStoredResults(r);
    return {
      id: row.id,
      domainScores: (r.domainScores as Record<string, number>) || {},
      arenaScores: normalizeArenaScores(r.arenaScores as Record<string, number>),
      overallScore: Math.round(((r.overall as number) || 0) * 10),
      archetype: (r.archetype as string) || null,
      importance: (r.importanceRatings as Record<string, number>) || {},
      assignedDriver: driverEvaluation.assignedDriver,
      secondaryDriver: driverEvaluation.secondaryDriver,
      driverScores: driverEvaluation.driverScores,
      topDriverScore: driverEvaluation.topDriverScore,
      secondaryDriverScore: driverEvaluation.secondaryDriverScore,
      primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
      createdAt: row.created_at,
    };
  });

  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { answers, importance } = await req.json();

  if (!answers || typeof answers !== "object")
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });

  const scores = calculateScores(answers);
  const archetype = getArchetype(scores.arenas, scores.domains);
  const scoredResponses = flattenGroupedAnswersToScoredResponses(answers);
  const driverEvaluation = determineDriver({
    domainScores: scores.domains,
    importanceRatings: importance || {},
    scoredResponses,
    arenaScores: scores.arenas,
    compositeScore: scores.overall,
  });

  const portalResults = buildPortalResultsFormat({
    domainScores: scores.domains,
    arenaScores: scores.arenas,
    overall: scores.overall,
    archetype,
    importance: importance || {},
    assignedDriver: driverEvaluation.assignedDriver,
    secondaryDriver: driverEvaluation.secondaryDriver,
    driverScores: driverEvaluation.driverScores,
    driverGates: driverEvaluation.driverGates,
    topDriverScore: driverEvaluation.topDriverScore,
    secondDriverScore: driverEvaluation.secondDriverScore,
    secondaryDriverScore: driverEvaluation.secondaryDriverScore,
    primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
    allResponses: scoredResponses,
    responseCodingVersion: "scored_v1",
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
    assignedDriver: driverEvaluation.assignedDriver,
    secondaryDriver: driverEvaluation.secondaryDriver,
    driverScores: driverEvaluation.driverScores,
    topDriverScore: driverEvaluation.topDriverScore,
    secondaryDriverScore: driverEvaluation.secondaryDriverScore,
    primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
  });
}
