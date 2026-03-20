import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import {
  determineDriver,
  normalizeResponsesFromStoredMap,
} from "@/lib/vapi/drivers";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PAGE_SIZE = 500;
const SAMPLE_LIMIT = 25;

type VapiResultsRow = {
  id: string;
  email: string | null;
  source?: string | null;
  results: Record<string, unknown>;
};

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function requireAdminUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (!user) {
    return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  }

  const adminEmails = getAdminEmails();
  const isAdmin =
    adminEmails.length > 0 &&
    adminEmails.includes((user.email || "").trim().toLowerCase());

  if (!isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

async function fetchVapiResultsPage(offset: number) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role credentials are missing");
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/vapi_results?select=id,email,source,results&order=created_at.asc&limit=${PAGE_SIZE}&offset=${offset}`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to fetch vapi_results: ${response.status} ${detail.slice(0, 200)}`);
  }

  return (await response.json()) as VapiResultsRow[];
}

async function updateVapiResultsRow(id: string, results: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role credentials are missing");
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/vapi_results?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ results }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to update row ${id}: ${response.status} ${detail.slice(0, 200)}`);
  }
}

function hasDriverFields(results: Record<string, unknown>) {
  return (
    typeof results.topDriverScore === "number" &&
    typeof results.secondDriverScore === "number" &&
    typeof results.primaryToSecondaryMargin === "number" &&
    typeof results.driverFallbackType === "string" &&
    results.driverScores &&
    typeof results.driverScores === "object" &&
    results.driverGates &&
    typeof results.driverGates === "object" &&
    "assignedDriver" in results &&
    "secondaryDriver" in results &&
    "secondaryDriverScore" in results
  );
}

function canBackfillFromStoredResults(results: Record<string, unknown>) {
  const allResponses = results.allResponses as Record<string, number> | undefined;
  return (
    allResponses &&
    Object.keys(allResponses).length > 0 &&
    results.domainScores &&
    typeof results.domainScores === "object" &&
    results.importanceRatings &&
    typeof results.importanceRatings === "object"
  );
}

function buildBackfilledResults(results: Record<string, unknown>) {
  const scoredResponses = normalizeResponsesFromStoredMap(
    (results.allResponses as Record<string, number> | undefined) || {},
    typeof results.responseCodingVersion === "string"
      ? (results.responseCodingVersion as string)
      : null
  );

  const driverEvaluation = determineDriver({
    domainScores: (results.domainScores as Record<string, number>) || {},
    importanceRatings:
      (results.importanceRatings as Record<string, number>) || {},
    scoredResponses,
    arenaScores: (results.arenaScores as Record<string, number>) || {},
    compositeScore:
      typeof results.overall === "number" ? (results.overall as number) : null,
  });

  return {
    ...results,
    assignedDriver: driverEvaluation.assignedDriver,
    secondaryDriver: driverEvaluation.secondaryDriver,
    driverScores: driverEvaluation.driverScores,
    driverGates: driverEvaluation.driverGates,
    topDriverScore: driverEvaluation.topDriverScore,
    secondDriverScore: driverEvaluation.secondDriverScore,
    secondaryDriverScore: driverEvaluation.secondaryDriverScore,
    primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin,
    driverFallbackType: driverEvaluation.driverFallbackType,
    allResponses: scoredResponses,
    responseCodingVersion: "scored_v1",
  };
}

function sampleRow(row: VapiResultsRow) {
  return {
    id: row.id,
    email: row.email,
    source: row.source || null,
  };
}

export async function GET(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error: "missing_env",
        message:
          "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the Alfred Vercel project.",
      },
      { status: 500 }
    );
  }

  const adminCheck = await requireAdminUser();
  if (adminCheck.error) return adminCheck.error;

  const execute = req.nextUrl.searchParams.get("execute") === "1";
  let offset = 0;
  let hasMore = true;

  const summary = {
    mode: execute ? "execute" : "dry-run",
    scanned: 0,
    alreadyBackfilled: 0,
    eligible: 0,
    updated: 0,
    skippedMissingResponses: 0,
    failed: 0,
    samples: {
      updated: [] as Array<ReturnType<typeof sampleRow>>,
      skippedMissingResponses: [] as Array<ReturnType<typeof sampleRow>>,
      failed: [] as Array<{ id: string; email: string | null; error: string }>,
    },
  };

  while (hasMore) {
    const rows = await fetchVapiResultsPage(offset);
    hasMore = rows.length === PAGE_SIZE;
    offset += rows.length;

    for (const row of rows) {
      summary.scanned += 1;
      const results =
        row.results && typeof row.results === "object" ? row.results : {};

      if (hasDriverFields(results)) {
        summary.alreadyBackfilled += 1;
        continue;
      }

      if (!canBackfillFromStoredResults(results)) {
        summary.skippedMissingResponses += 1;
        if (
          summary.samples.skippedMissingResponses.length < SAMPLE_LIMIT
        ) {
          summary.samples.skippedMissingResponses.push(sampleRow(row));
        }
        continue;
      }

      summary.eligible += 1;

      try {
        const updatedResults = buildBackfilledResults(results);
        if (execute) {
          await updateVapiResultsRow(row.id, updatedResults);
          summary.updated += 1;
          if (summary.samples.updated.length < SAMPLE_LIMIT) {
            summary.samples.updated.push(sampleRow(row));
          }
        }
      } catch (error) {
        summary.failed += 1;
        if (summary.samples.failed.length < SAMPLE_LIMIT) {
          summary.samples.failed.push({
            id: row.id,
            email: row.email,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    ...summary,
    nextStep: execute
      ? "Backfill complete. Any skipped rows were missing historical item-level responses and cannot be reconstructed exactly."
      : "Dry run only. Add ?execute=1 to this URL when you are ready to write driver fields back to the shared vapi_results rows.",
  });
}
