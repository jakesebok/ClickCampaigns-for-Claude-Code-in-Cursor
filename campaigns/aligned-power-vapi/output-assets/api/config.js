// Vercel serverless function: serves Supabase config from environment variables.
// Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Project → Settings → Environment Variables.
// Uses CommonJS so it works when there is no package.json in the project.

function escapeJs(s) {
  if (s == null) return 'null';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
}

module.exports = function handler(req, res) {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || '';
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(
    'window.SUPABASE_URL=' + escapeJs(url) + ';window.SUPABASE_ANON_KEY=' + escapeJs(key) + ';'
  );
};
