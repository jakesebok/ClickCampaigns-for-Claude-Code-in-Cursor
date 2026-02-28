// Vercel serverless function: serves Supabase config from environment variables.
// Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Project → Settings → Environment Variables.
// Uses Web Handler (Request/Response) so it works with Vercel's current runtime.

function escapeJs(s) {
  if (s == null) return 'null';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
}

export function GET() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || '';
  const body =
    'window.SUPABASE_URL=' + escapeJs(url) + ';window.SUPABASE_ANON_KEY=' + escapeJs(key) + ';';
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
