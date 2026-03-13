/**
 * Fetches VAPI and 6Cs data from the shared portal Supabase tables.
 * Used by chat, voice session, and dashboard to get user data keyed by email.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type PortalVapiRow = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  results: Record<string, unknown>;
  created_at: string;
  source?: string;
};

export type PortalSixCRow = {
  id: string;
  email: string;
  created_at: string;
  scores: Record<string, number>;
  one_thing_to_improve: string | null;
  weekly_review: Record<string, unknown> | null;
};

export async function fetchPortalVapiByEmail(email: string): Promise<PortalVapiRow[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return [];
  const emailNorm = String(email).trim().toLowerCase();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vapi_results?email=eq.${encodeURIComponent(emailNorm)}&select=id,email,first_name,last_name,results,created_at,source&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPortalSixCByEmail(email: string): Promise<PortalSixCRow[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return [];
  const emailNorm = String(email).trim().toLowerCase();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/six_c_submissions?email=eq.${encodeURIComponent(emailNorm)}&select=id,email,created_at,scores,one_thing_to_improve,weekly_review&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function insertPortalSixC(params: {
  email: string;
  scores: Record<string, number>;
  oneThing?: string;
  weeklyReview?: Record<string, unknown>;
}): Promise<PortalSixCRow | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const emailNorm = String(params.email).trim().toLowerCase();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/six_c_submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      email: emailNorm,
      scores: params.scores,
      one_thing_to_improve: params.oneThing || null,
      weekly_review: params.weeklyReview || null,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}
