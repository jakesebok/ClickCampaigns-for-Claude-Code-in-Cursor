#!/usr/bin/env node
/**
 * One-time backfill: create/update active sprints from existing vapi_results (latest row per email).
 *
 * Prerequisites:
 *   - Run supabase/sprints.sql on your Supabase project (sprints table exists).
 *   - Service role key (server only; never commit).
 *
 * Usage (from output-assets directory):
 *   export SUPABASE_URL="https://xxxx.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   node scripts/backfill-sprints-from-vapi.js              # live upsert
 *   node scripts/backfill-sprints-from-vapi.js --dry-run    # print plan only
 *   node scripts/backfill-sprints-from-vapi.js --email=a@b.co  # single email
 *
 * @see lib/portal-server/handlers/coach-sprint-regenerate.js (same payload logic)
 */

import { enrichVapiResultsForStorage } from "../lib/portal-server/vapi-enrich-for-storage.js";
import { buildSprintPayload } from "../lib/portal-server/sprint-from-vapi.js";
import { upsertActiveSprint } from "../lib/portal-server/sprint-upsert.js";

const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const emailArg = args.find((a) => a.startsWith("--email="));
const filterEmail = emailArg ? emailArg.split("=")[1]?.trim().toLowerCase() : null;

const PAGE = 500;

async function fetchAllVapiRows() {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Accept: "application/json",
  };
  const all = [];
  let offset = 0;
  for (;;) {
    const url = `${supabaseUrl}/rest/v1/vapi_results?select=id,email,results,source,created_at&order=created_at.desc&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`vapi_results fetch failed ${res.status}: ${(await res.text()).slice(0, 400)}`);
    }
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) break;
    all.push(...rows);
    if (rows.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

/** Latest row per normalized email (input must be sorted created_at desc). */
function latestPerEmail(rows) {
  const seen = new Map();
  for (const row of rows) {
    const email = String(row?.email || "")
      .trim()
      .toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.set(email, row);
  }
  return seen;
}

async function main() {
  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
    process.exit(1);
  }

  console.log(dryRun ? "[dry-run] No writes will be performed." : "Backfill: upserting active sprints…");
  const rows = await fetchAllVapiRows();
  console.log(`Fetched ${rows.length} vapi_results row(s).`);

  const byEmail = latestPerEmail(rows);
  let targets = [...byEmail.entries()];
  if (filterEmail) {
    targets = targets.filter(([e]) => e === filterEmail);
    if (!targets.length) {
      console.error(`No vapi_results found for --email=${filterEmail}`);
      process.exit(1);
    }
  }

  console.log(`Unique emails (latest assessment each): ${targets.length}`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const [email, row] of targets) {
    if (!row?.results || typeof row.results !== "object") {
      console.warn(`Skip ${email}: missing results object`);
      skipped++;
      continue;
    }

    const enriched = enrichVapiResultsForStorage({ ...row.results });
    const assessmentSource = typeof row.source === "string" && row.source.trim() ? row.source.trim() : "marketing";

    let sprintRow;
    try {
      sprintRow = buildSprintPayload(enriched, {
        userEmail: email,
        vapiResultId: row.id || null,
        assessmentSource,
      });
    } catch (e) {
      console.error(`Skip ${email}: buildSprintPayload failed`, e?.message || e);
      failed++;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] ${email} ← vapi_result ${row.id} source=${assessmentSource} weeks=${sprintRow.payload?.weeks?.length ?? 0}`);
      ok++;
      continue;
    }

    try {
      await upsertActiveSprint({ supabaseUrl, serviceKey, row: sprintRow });
      console.log(`OK ${email} (vapi_result ${row.id})`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${email}:`, e?.message || e);
      failed++;
    }
  }

  console.log(`Done. ok=${ok} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
