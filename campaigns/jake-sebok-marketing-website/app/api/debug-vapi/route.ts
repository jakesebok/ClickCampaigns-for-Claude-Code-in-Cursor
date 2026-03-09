/**
 * GET /api/debug-vapi
 * Returns which VAPI-related env vars are present (not their values).
 * Use this to verify Vercel env vars are correctly named and available.
 * Remove or restrict this route in production once debugging is done.
 */
export async function GET() {
  const env = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
  };
  const allRequired =
    env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    env.RESEND_API_KEY;
  return Response.json({
    env,
    vapiReady: allRequired,
    note: "save-vapi-results needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. vapi-assessment-complete needs RESEND_API_KEY + SUPABASE_* for lookup.",
  });
}
