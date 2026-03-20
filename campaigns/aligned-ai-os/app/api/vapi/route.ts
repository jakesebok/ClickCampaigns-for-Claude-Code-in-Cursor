import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import { calculateScores, getArchetype } from "@/lib/vapi/scoring";
import { buildPortalResultsFormat } from "@/lib/vapi/portal-format";
import {
  ALIGNED_MOMENTUM_NAME,
  determineDriver,
  flattenGroupedAnswersToScoredResponses,
  getDriverFallbackType,
  getDriverState,
  isDysfunctionDriverName,
  normalizeResponsesFromStoredMap,
  type VapiAssignedDriverName,
  type VapiDriverState,
  type VapiDriverName,
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

function normalizeDysfunctionDriverName(value: unknown): VapiDriverName | null {
  return isDysfunctionDriverName(value) ? value : null;
}

function normalizeAssignedDriverName(value: unknown): VapiAssignedDriverName | null {
  if (value === ALIGNED_MOMENTUM_NAME) return ALIGNED_MOMENTUM_NAME;
  return normalizeDysfunctionDriverName(value);
}

function normalizeDriverState(value: unknown): VapiDriverState | null {
  return value === "dysfunction_driver" ||
    value === "aligned_momentum" ||
    value === "no_driver"
    ? value
    : null;
}

function normalizeStoredDriverFallbackType(value: unknown) {
  if (value === "aligned_momentum" || value === "standard" || value === "none") {
    return value;
  }
  if (value === "high_performer") {
    return "aligned_momentum" as const;
  }
  return null;
}

function deriveArchetypeFromStoredResults(
  results: Record<string, unknown>,
  normalizedArenaScores: Record<string, number>
) {
  const domainScores = (results.domainScores as Record<string, number>) || {};
  const hasArenaScores =
    typeof normalizedArenaScores.personal === "number" &&
    typeof normalizedArenaScores.relationships === "number" &&
    typeof normalizedArenaScores.business === "number";

  if (hasArenaScores && Object.keys(domainScores).length > 0) {
    return getArchetype(
      {
        personal: normalizedArenaScores.personal,
        relationships: normalizedArenaScores.relationships,
        business: normalizedArenaScores.business,
      },
      domainScores
    );
  }

  return (results.archetype as string) || null;
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

function getDriverEvaluationFromStoredResults(
  results: Record<string, unknown>
): ReturnType<typeof determineDriver> {
  const hasResponses = !!(
    results.allResponses &&
    typeof results.allResponses === "object" &&
    Object.keys(results.allResponses as Record<string, unknown>).length > 0
  );

  if (hasResponses) {
    const scoredResponses = normalizeResponsesFromStoredMap(
      (results.allResponses as Record<string, number> | undefined) || {},
      typeof results.responseCodingVersion === "string"
        ? (results.responseCodingVersion as string)
        : null
    );

    return determineDriver({
      domainScores: (results.domainScores as Record<string, number>) || {},
      importanceRatings:
        ((results.importanceRatings as Record<string, number>) ||
          (results.importanceScores as Record<string, number>) ||
          {}),
      scoredResponses,
      arenaScores: (results.arenaScores as Record<string, number>) || {},
      compositeScore:
        typeof results.overall === "number" ? (results.overall as number) : null,
    });
  }

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
    const storedAssignedDriver = normalizeAssignedDriverName(results.assignedDriver);
    const storedDriverState = normalizeDriverState(results.driverState);
    const normalizedStoredFallbackType = normalizeStoredDriverFallbackType(
      results.driverFallbackType
    );
    const secondaryDriver = normalizeDysfunctionDriverName(results.secondaryDriver);
    const driverState =
      storedDriverState ??
      getDriverState({
        assignedDriver: storedAssignedDriver,
        driverFallbackType: normalizedStoredFallbackType,
      });
    const assignedDriver =
      driverState === "aligned_momentum"
        ? ALIGNED_MOMENTUM_NAME
        : storedAssignedDriver;
    return {
      assignedDriver,
      secondaryDriver,
      driverScores: results.driverScores as Record<string, number>,
      driverGates: results.driverGates as Record<string, boolean>,
      topDriverScore: results.topDriverScore as number,
      secondDriverScore: results.secondDriverScore as number,
      secondaryDriverScore:
        typeof results.secondaryDriverScore === "number"
          ? (results.secondaryDriverScore as number)
          : null,
      primaryToSecondaryMargin: results.primaryToSecondaryMargin as number,
      driverState,
      driverFallbackType: getDriverFallbackType({
        domainScores: (results.domainScores as Record<string, number>) || {},
        compositeScore:
          typeof results.overall === "number" ? (results.overall as number) : null,
        assignedDriver,
        driverState,
      }),
    };
  }

  const fallbackType = getDriverFallbackType({
    domainScores: (results.domainScores as Record<string, number>) || {},
    compositeScore:
      typeof results.overall === "number" ? (results.overall as number) : null,
  });

  if (!hasResponses) {
    return {
      assignedDriver:
        fallbackType === "aligned_momentum" ? ALIGNED_MOMENTUM_NAME : null,
      driverScores: {
        "The Achiever's Trap": 0,
        "The Escape Artist": 0,
        "The Pleaser's Bind": 0,
        "The Imposter Loop": 0,
        "The Perfectionist's Prison": 0,
        "The Protector": 0,
        "The Martyr Complex": 0,
        "The Fog": 0,
        "The Scattered Mind": 0,
        "The Builder's Gap": 0,
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
        "The Scattered Mind": false,
        "The Builder's Gap": false,
      },
      topDriverScore: 0,
      secondDriverScore: 0,
      secondaryDriver: null,
      secondaryDriverScore: null,
      primaryToSecondaryMargin: 0,
      driverState:
        fallbackType === "aligned_momentum" ? "aligned_momentum" : "no_driver",
      driverFallbackType: fallbackType,
    };
  }

  return {
    assignedDriver: fallbackType === "aligned_momentum" ? ALIGNED_MOMENTUM_NAME : null,
    driverScores: {
      "The Achiever's Trap": 0,
      "The Escape Artist": 0,
      "The Pleaser's Bind": 0,
      "The Imposter Loop": 0,
      "The Perfectionist's Prison": 0,
      "The Protector": 0,
      "The Martyr Complex": 0,
      "The Fog": 0,
      "The Scattered Mind": 0,
      "The Builder's Gap": 0,
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
      "The Scattered Mind": false,
      "The Builder's Gap": false,
    },
    topDriverScore: 0,
    secondDriverScore: 0,
    secondaryDriver: null,
    secondaryDriverScore: null,
    primaryToSecondaryMargin: 0,
    driverState:
      fallbackType === "aligned_momentum" ? "aligned_momentum" : "no_driver",
    driverFallbackType: fallbackType,
  };
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
    const normalizedArenaScores = normalizeArenaScores(
      r.arenaScores as Record<string, number>
    );
    const archetype = deriveArchetypeFromStoredResults(r, normalizedArenaScores);
    const driverEvaluation = getDriverEvaluationFromStoredResults(r);
    return NextResponse.json({
      result: {
        id: row.id,
        domainScores: (r.domainScores as Record<string, number>) || {},
        arenaScores: normalizedArenaScores,
        overallScore: Math.round(((r.overall as number) || 0) * 10),
        archetype,
        importance:
          ((r.importanceRatings as Record<string, number>) ||
            (r.importanceScores as Record<string, number>) ||
            {}),
        assignedDriver: driverEvaluation.assignedDriver,
        secondaryDriver: driverEvaluation.secondaryDriver,
        driverScores: driverEvaluation.driverScores,
        topDriverScore: driverEvaluation.topDriverScore,
        secondaryDriverScore: driverEvaluation.secondaryDriverScore,
        primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
        driverState: driverEvaluation.driverState,
        driverFallbackType: driverEvaluation.driverFallbackType,
        createdAt: row.created_at,
      },
    });
  }

  const results = rows.map((row: { id: string; results: Record<string, unknown>; created_at: string }) => {
    const r = row.results;
    const normalizedArenaScores = normalizeArenaScores(
      r.arenaScores as Record<string, number>
    );
    const archetype = deriveArchetypeFromStoredResults(r, normalizedArenaScores);
    const driverEvaluation = getDriverEvaluationFromStoredResults(r);
    return {
      id: row.id,
      domainScores: (r.domainScores as Record<string, number>) || {},
      arenaScores: normalizedArenaScores,
      overallScore: Math.round(((r.overall as number) || 0) * 10),
      archetype,
      importance:
        ((r.importanceRatings as Record<string, number>) ||
          (r.importanceScores as Record<string, number>) ||
          {}),
      assignedDriver: driverEvaluation.assignedDriver,
      secondaryDriver: driverEvaluation.secondaryDriver,
      driverScores: driverEvaluation.driverScores,
      topDriverScore: driverEvaluation.topDriverScore,
      secondaryDriverScore: driverEvaluation.secondaryDriverScore,
      primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
      driverState: driverEvaluation.driverState,
      driverFallbackType: driverEvaluation.driverFallbackType,
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
    driverState: driverEvaluation.driverState,
    driverFallbackType: driverEvaluation.driverFallbackType,
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
    driverState: driverEvaluation.driverState,
    driverFallbackType: driverEvaluation.driverFallbackType,
  });
}
