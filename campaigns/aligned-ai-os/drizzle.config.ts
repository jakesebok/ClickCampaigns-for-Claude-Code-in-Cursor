import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "drizzle-kit";

// Load .env.local so DATABASE_URL is available when running db:push
config({ path: resolve(process.cwd(), ".env.local") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.includes("your-project")) {
  throw new Error(
    "DATABASE_URL is missing or still has placeholder values. " +
    "Add your Supabase connection string to .env.local. " +
    "Get it from Supabase → Project Settings → Database → Connection string (URI)."
  );
}

// Parse URL into components — avoids "postgres" hostname parsing bugs with some drivers
function parseDbUrl(url: string) {
  try {
    // URL constructor needs a valid protocol; postgresql:// works
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || "5432", 10),
      user: decodeURIComponent(parsed.username || "postgres"),
      password: decodeURIComponent(parsed.password || ""),
      database: (parsed.pathname || "/postgres").slice(1) || "postgres",
    };
  } catch {
    return null;
  }
}

const parsed = parseDbUrl(databaseUrl);
const dbCredentials = parsed
  ? {
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      password: parsed.password,
      database: parsed.database,
    }
  : { url: databaseUrl };

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials,
  // Only manage APOS tables — do NOT touch portal tables (vapi_results, portal_active_clients, six_c_submissions, coach_notes)
  tablesFilter: [
    "users",
    "context_documents",
    "conversations",
    "messages",
    "weekly_one_things",
    "scorecard_entries",
    "onboarding_progress",
  ],
});
