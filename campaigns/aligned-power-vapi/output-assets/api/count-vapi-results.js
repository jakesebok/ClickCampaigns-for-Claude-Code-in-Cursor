/**
 * GET /api/count-vapi-results?email=...
 * Returns the number of existing vapi_results rows for a given email.
 * Used to determine assessment number before a new row is inserted.
 * Uses service role key — server-side only.
 */

export async function GET(request) {
  const supabaseUrl    = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'missing_env' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();

  if (!email) {
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/vapi_results?email=eq.${encodeURIComponent(email)}&select=id`,
    {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'count=exact',
        'Range': '0-0',
      },
    }
  );

  // Supabase returns count in Content-Range header: e.g. "0-0/3"
  const contentRange = res.headers.get('content-range') || '';
  const match = contentRange.match(/\/(\d+)$/);
  const count = match ? parseInt(match[1], 10) : 0;

  return new Response(JSON.stringify({ count }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
}
