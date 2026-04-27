/**
 * GET /api/config
 * Returns Supabase config for client-side auth (portal CTA, session check).
 * Used by vapi-results.html for "logged in" vs "create account" state.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_ANON_KEY || "";
  const body =
    "window.SUPABASE_URL=" +
    JSON.stringify(url) +
    ";window.SUPABASE_ANON_KEY=" +
    JSON.stringify(key) +
    ";";
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=300",
    },
  });
}
