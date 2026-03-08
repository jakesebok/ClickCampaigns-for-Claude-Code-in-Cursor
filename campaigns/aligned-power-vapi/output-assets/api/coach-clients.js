// Vercel serverless: returns unified client list for coach dashboard (coach only).
// Merges vapi_results, six_c_submissions, portal_active_clients.
// Requires SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.PORTAL_ADMIN_EMAIL || 'jacob@alignedpower.coach').trim().toLowerCase();

async function lookupDisplayName(url, serviceKey, email) {
  if (!email || !url || !serviceKey) return null;
  const emailNorm = String(email).trim().toLowerCase();
  try {
    const res = await fetch(
      `${url}/auth/v1/admin/users?filter=${encodeURIComponent(emailNorm)}`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const users = json.users || [];
    const match = users.find((u) => (u.email || '').toLowerCase() === emailNorm);
    if (!match) return null;
    const meta = match.user_metadata || {};
    const first = meta.first_name || meta.firstName || '';
    const last = meta.last_name || meta.lastName || '';
    const name = [first, last].filter(Boolean).join(' ').trim();
    return name || null;
  } catch (e) {
    return null;
  }
}

async function verifyCoach(request) {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : '';
  if (!accessToken || !url || !anonKey) return { ok: false, status: 401 };
  const u = await fetch(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!u.ok) return { ok: false, status: 401 };
  const user = await u.json();
  const email = String(user?.email || '').trim().toLowerCase();
  if (email !== ADMIN_EMAIL) return { ok: false, status: 403 };
  return { ok: true };
}

export async function GET(request) {
  const url = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: 'missing_env' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const auth = await verifyCoach(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.status === 403 ? 'forbidden' : 'unauthorized' }), {
      status: auth.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' };

  try {
    const [vapiRes, sixcRes, activeRes] = await Promise.all([
      fetch(`${url}/rest/v1/vapi_results?select=email,first_name,last_name,created_at&order=created_at.desc&limit=2000`, { headers }),
      fetch(`${url}/rest/v1/six_c_submissions?select=email,created_at&order=created_at.desc&limit=2000`, { headers }),
      fetch(`${url}/rest/v1/portal_active_clients?select=email,active_client`, { headers }),
    ]);

    const vapiRows = vapiRes.ok ? await vapiRes.json() : [];
    const sixcRows = sixcRes.ok ? await sixcRes.json() : [];
    const activeRows = activeRes.ok ? await activeRes.json() : [];

    const activeSet = new Set(activeRows.filter((r) => r.active_client).map((r) => (r.email || '').trim().toLowerCase()));

    const byEmail = {};
    vapiRows.forEach((r) => {
      const k = (r.email || '').trim().toLowerCase();
      if (!k) return;
      if (!byEmail[k]) {
        byEmail[k] = {
          email: r.email,
          name: [r.first_name, r.last_name].filter(Boolean).join(' ') || r.email || '—',
          lastVapiAt: r.created_at,
          lastSixCAt: null,
          assessmentCount: 0,
          sixcCount: 0,
          isActiveClient: activeSet.has(k),
        };
      }
      byEmail[k].assessmentCount++;
      if (!byEmail[k].lastVapiAt || r.created_at > byEmail[k].lastVapiAt) byEmail[k].lastVapiAt = r.created_at;
    });

    const sixcByEmail = {};
    sixcRows.forEach((r) => {
      const k = (r.email || '').trim().toLowerCase();
      if (!k) return;
      sixcByEmail[k] = (sixcByEmail[k] || 0) + 1;
      if (!byEmail[k]) {
        byEmail[k] = {
          email: r.email || k,
          name: k,
          lastVapiAt: null,
          lastSixCAt: r.created_at,
          assessmentCount: 0,
          sixcCount: 0,
          isActiveClient: activeSet.has(k),
        };
      }
      byEmail[k].sixcCount = (byEmail[k].sixcCount || 0) + 1;
      if (!byEmail[k].lastSixCAt || r.created_at > byEmail[k].lastSixCAt) byEmail[k].lastSixCAt = r.created_at;
    });

    activeRows.forEach((r) => {
      const k = (r.email || '').trim().toLowerCase();
      if (!k || byEmail[k]) return;
      byEmail[k] = {
        email: r.email || k,
        name: k,
        lastVapiAt: null,
        lastSixCAt: null,
        assessmentCount: 0,
        sixcCount: 0,
        isActiveClient: !!r.active_client,
      };
    });

    const allClients = Object.values(byEmail).map((c) => {
      const lastActivityAt = [c.lastVapiAt, c.lastSixCAt].filter(Boolean).sort().pop() || null;
      return { ...c, lastActivityAt };
    }).sort((a, b) => {
      const aDate = a.lastActivityAt || '';
      const bDate = b.lastActivityAt || '';
      return bDate.localeCompare(aDate);
    });

    let clients = allClients.filter((c) => c.isActiveClient);

    // Enrich names from auth.users for clients who only have email (no vapi_results name)
    const needsName = clients.filter((c) => {
      const n = (c.name || '').trim();
      const e = (c.email || '').trim().toLowerCase();
      return !n || n === e || n.toLowerCase() === e || n.includes('@');
    });
    if (needsName.length > 0) {
      const enriched = await Promise.all(
        needsName.map(async (c) => {
          const displayName = await lookupDisplayName(url, serviceKey, c.email);
          return { ...c, name: displayName || c.name };
        })
      );
      const byEmailEnriched = new Map(enriched.map((c) => [(c.email || '').trim().toLowerCase(), c]));
      clients = clients.map((c) => {
        const k = (c.email || '').trim().toLowerCase();
        return byEmailEnriched.has(k) ? byEmailEnriched.get(k) : c;
      });
    }

    return new Response(JSON.stringify({ clients }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
