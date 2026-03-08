/**
 * POST /api/vapi-assessment-complete
 * Fires immediately after a user completes the VAPI assessment
 * (72 behavioral questions + 12 importance ratings).
 *
 * Sends two emails via Resend:
 *   1. User notification with scores + portal link
 *   2. Admin notification to jacob@alignedpower.coach
 *
 * Body (JSON):
 *   email           string  — user email (optional for anon)
 *   firstName       string  — user first name
 *   lastName        string  — user last name
 *   overall         number
 *   overallTier     string
 *   arenaScores     { Personal, Relationships, Business }
 *   arenaTiers      { Personal, Relationships, Business }
 *   domains         array of { code, domain, score, tier }
 *   importanceRatings  { PH, IA, ME, AF, RS, FA, CO, WI, VS, EX, OH, EC }
 *   priorityMatrix  { criticalPriority: [...], protectAndSustain: [...], monitor: [...], overInvestment: [...] }
 *   contextualProfile  { revenueStage, teamSize, lifeStage, timeInBusiness, primaryChallenge }  (optional)
 *   assessmentNumber   number  (which assessment for this user)
 *   hasPortalAccount   boolean
 *   reflectionResponse string  (optional)
 */

const ADMIN_EMAIL       = 'jacob@alignedpower.coach';
const PORTAL_URL        = 'https://portal.alignedpower.coach';
const USER_FROM_EMAIL   = process.env.VAPI_USER_FROM_EMAIL   || 'hello@notifications.alignedpower.coach';
const ADMIN_FROM_EMAIL  = process.env.VAPI_ADMIN_FROM_EMAIL  || 'assessments@notifications.alignedpower.coach';

function getTierColor(tier) {
  if (tier === 'Dialed')          return '#22C55E';
  if (tier === 'Functional')      return '#EAB308';
  if (tier === 'Below the Line')  return '#F97316';
  if (tier === 'In the Red')      return '#EF4444';
  return '#334750';
}

function ordinal(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildUserEmail({ firstName, overall, overallTier, arenaScores, arenaTiers, topCriticalPriority, hasPortalAccount }) {
  const name = firstName ? `Hi ${escHtml(firstName)},` : 'Hi there,';
  const portalLink = `${PORTAL_URL}/login`;
  const signupLink = `${PORTAL_URL}/signup`;
  const ctaUrl     = hasPortalAccount ? portalLink : signupLink;
  const ctaLabel   = hasPortalAccount ? 'View My Full Results' : 'Create My Free Account';
  const loginCtaLabel = hasPortalAccount ? 'Log Into My Account' : 'Create My Free Account';

  const arenasHtml = ['Personal','Relationships','Business'].map(a => {
    const sc = arenaScores[a] ?? '?';
    const ti = arenaTiers[a]  ?? '';
    const c  = getTierColor(ti);
    return `<tr>
      <td style="padding:6px 12px;font-weight:600;color:#3A4A5C;">${escHtml(a)}</td>
      <td style="padding:6px 12px;font-weight:700;color:${c};">${escHtml(String(sc))} / 10</td>
      <td style="padding:6px 12px;color:${c};font-size:13px;">${escHtml(ti)}</td>
    </tr>`;
  }).join('');

  const overallColor = getTierColor(overallTier);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your VAPI Assessment Results</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">

  <!-- Header -->
  <tr><td style="background:#0E1624;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#FF6B1A;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Jake Sebok</p>
    <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:700;line-height:1.2;">Values-Aligned Performance Indicator&#8482;</h1>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 40px 32px;">
    <p style="margin:0 0 20px;color:#3A4A5C;font-size:16px;line-height:1.6;">${name}</p>
    <p style="margin:0 0 20px;color:#3A4A5C;font-size:16px;line-height:1.6;">Congratulations on completing the VAPI Assessment.</p>
    <p style="margin:0 0 32px;color:#3A4A5C;font-size:16px;line-height:1.6;">Taking an honest look at where you actually stand takes courage. Most people avoid it. You just did it.</p>

    <h2 style="margin:0 0 12px;color:#0E1624;font-size:18px;font-weight:700;">Your snapshot</h2>

    <!-- Overall score -->
    <div style="background:#F5F7FA;border-radius:8px;padding:20px 24px;margin-bottom:20px;border:1px solid #DDE3ED;">
      <p style="margin:0 0 4px;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">VAPI Composite Score</p>
      <p style="margin:0;font-size:36px;font-weight:700;color:${overallColor};">${escHtml(String(overall ?? '?'))} <span style="font-size:20px;font-weight:400;color:#3A4A5C;">/ 10</span> &nbsp;<span style="font-size:18px;">${escHtml(overallTier ?? '')}</span></p>
    </div>

    <!-- Arena scores -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      ${arenasHtml}
    </table>

    ${topCriticalPriority ? `<div style="background:#FFF3EE;border-left:4px solid #F97316;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 4px;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your #1 Critical Priority</p>
      <p style="margin:0;color:#3A4A5C;font-size:16px;font-weight:600;">${escHtml(topCriticalPriority)}</p>
    </div>` : ''}

    <p style="margin:0 0 28px;color:#3A4A5C;font-size:15px;line-height:1.6;">Your full results, including all 12 domain scores, detailed interpretations, and your personalized priority matrix, are waiting for you in the portal.</p>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${ctaUrl}" style="display:inline-block;background:#FF6B1A;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">View My Full Results &#8594;</a>
    </div>

    <hr style="border:none;border-top:1px solid #DDE3ED;margin:0 0 28px;">

    <h2 style="margin:0 0 12px;color:#0E1624;font-size:18px;font-weight:700;">When you create your free portal account, you can:</h2>
    <ul style="margin:0 0 28px;padding:0 0 0 20px;color:#3A4A5C;font-size:15px;line-height:1.8;">
      <li>View your complete results with in-depth interpretations for every domain</li>
      <li>Download and print your results as a PDF</li>
      <li>Track your progress over time by retaking the assessment</li>
      <li>See exactly what changed and what to focus on next</li>
    </ul>

    <p style="margin:0 0 20px;color:#3A4A5C;font-size:15px;line-height:1.6;">This is not a one-time snapshot. The VAPI Assessment is designed to measure your growth. Come back in 30, 60, or 90 days and see how far you have moved.</p>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${ctaUrl}" style="display:inline-block;background:#0E1624;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">${escHtml(loginCtaLabel)} &#8594;</a>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F5F7FA;padding:24px 40px;text-align:center;border-top:1px solid #DDE3ED;">
    <p style="margin:0 0 8px;color:#7A8FA8;font-size:13px;">Jake Sebok</p>
    <p style="margin:0;color:#7A8FA8;font-size:12px;">You received this because you completed the VAPI Assessment. <a href="${PORTAL_URL}" style="color:#FF6B1A;">Unsubscribe</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `${name}

Congratulations on completing the VAPI Assessment.

Your VAPI Composite Score: ${overall ?? '?'} / 10 - ${overallTier ?? ''}

Self: ${arenaScores.Personal ?? '?'} / 10 - ${arenaTiers.Personal ?? ''}
Relationships: ${arenaScores.Relationships ?? '?'} / 10 - ${arenaTiers.Relationships ?? ''}
Business: ${arenaScores.Business ?? '?'} / 10 - ${arenaTiers.Business ?? ''}
${topCriticalPriority ? `\nYour #1 Critical Priority: ${topCriticalPriority}\n` : ''}
View your full results: ${ctaUrl}

-- Jake Sebok`;

  return { html, text };
}

function buildAdminEmail({ email, firstName, lastName, overall, overallTier, arenaScores, arenaTiers, domains, importanceRatings, priorityMatrix, contextualProfile, assessmentNumber, hasPortalAccount, timestamp }) {
  const userName = [firstName, lastName].filter(Boolean).join(' ') || email || 'Anonymous';
  const ordinalNum = ordinal(assessmentNumber || 1);
  const accountStatus = hasPortalAccount ? 'Has portal account' : 'No account yet';

  const sortedDomains = [...(domains || [])].sort((a,b) => a.score - b.score);
  const domainRows = sortedDomains.map(d => {
    const c = getTierColor(d.tier);
    return `<tr>
      <td style="padding:5px 12px;color:#3A4A5C;">${escHtml(d.domain)}</td>
      <td style="padding:5px 12px;font-weight:700;color:${c};">${escHtml(String(d.score))} / 10</td>
      <td style="padding:5px 12px;color:${c};font-size:13px;">${escHtml(d.tier)}</td>
    </tr>`;
  }).join('');

  const criticalList = (priorityMatrix?.criticalPriority || []).map(d => escHtml(d.domain + ' (' + d.score + '/10)')).join(', ') || 'None';

  const cp = contextualProfile || {};
  const profileRows = [
    ['Revenue Stage', cp.revenueStage],
    ['Team Size', cp.teamSize],
    ['Life Stage', cp.lifeStage],
    ['Time in Business', cp.timeInBusiness],
    ['Primary Challenge', cp.primaryChallenge],
  ].map(([label, val]) => `<tr><td style="padding:5px 12px;color:#7A8FA8;font-size:13px;">${escHtml(label)}</td><td style="padding:5px 12px;color:#3A4A5C;font-size:13px;">${escHtml(val || 'Not provided')}</td></tr>`).join('');

  const overallColor = getTierColor(overallTier);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New VAPI Assessment Completed</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">
  <tr><td style="background:#0E1624;padding:24px 32px;">
    <p style="margin:0;color:#FF6B1A;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Jake Sebok Admin</p>
    <h1 style="margin:6px 0 0;color:#FFFFFF;font-size:22px;font-weight:700;">New VAPI Assessment Completed</h1>
  </td></tr>
  <tr><td style="padding:32px 32px 24px;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Assessment Details</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Date:</strong> ${escHtml(timestamp || new Date().toISOString())}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>User:</strong> ${escHtml(userName)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Email:</strong> ${escHtml(email || 'Not provided')}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Account Status:</strong> ${escHtml(accountStatus)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Assessment #:</strong> ${escHtml(ordinalNum)} assessment</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Composite Score</td></tr>
      <tr><td style="padding:10px 12px;font-size:28px;font-weight:700;color:${overallColor};">${escHtml(String(overall ?? '?'))} <span style="font-size:16px;color:#3A4A5C;font-weight:400;">/ 10 &mdash; ${escHtml(overallTier ?? '')}</span></td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Self:</strong> ${escHtml(String(arenaScores?.Personal ?? '?'))} &mdash; ${escHtml(arenaTiers?.Personal ?? '')}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Relationships:</strong> ${escHtml(String(arenaScores?.Relationships ?? '?'))} &mdash; ${escHtml(arenaTiers?.Relationships ?? '')}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Business:</strong> ${escHtml(String(arenaScores?.Business ?? '?'))} &mdash; ${escHtml(arenaTiers?.Business ?? '')}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td colspan="3" style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Domain Scores (Lowest to Highest)</td></tr>
      ${domainRows}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Critical Priorities</td></tr>
      <tr><td style="padding:8px 12px;color:#3A4A5C;">${criticalList}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td colspan="2" style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Contextual Profile</td></tr>
      ${profileRows}
    </table>

  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `New VAPI Assessment Completed

Date: ${timestamp || new Date().toISOString()}
User: ${userName}
Email: ${email || 'Not provided'}
Account Status: ${accountStatus}
Assessment #: ${ordinalNum} assessment

Composite Score: ${overall ?? '?'} / 10 - ${overallTier ?? ''}
Self: ${arenaScores?.Personal ?? '?'} - ${arenaTiers?.Personal ?? ''}
Relationships: ${arenaScores?.Relationships ?? '?'} - ${arenaTiers?.Relationships ?? ''}
Business: ${arenaScores?.Business ?? '?'} - ${arenaTiers?.Business ?? ''}

Domain Scores (Lowest to Highest):
${sortedDomains.map(d => `${d.domain}: ${d.score} / 10 - ${d.tier}`).join('\n')}

Critical Priorities: ${criticalList}

Contextual Profile:
Revenue Stage: ${cp.revenueStage || 'Not provided'}
Team Size: ${cp.teamSize || 'Not provided'}
Life Stage: ${cp.lifeStage || 'Not provided'}
Time in Business: ${cp.timeInBusiness || 'Not provided'}
Primary Challenge: ${cp.primaryChallenge || 'Not provided'}`;

  return { html, text };
}

async function lookupUserByEmail(supabaseUrl, serviceRoleKey, email) {
  // Returns { hasAccount, assessmentNumber, contextualProfile, firstName, lastName }
  const result = { hasAccount: false, assessmentNumber: 1, contextualProfile: null, firstName: null, lastName: null };
  if (!email || !supabaseUrl || !serviceRoleKey) return result;

  const emailNorm = email.trim().toLowerCase();

  // 1. Check auth.users for a portal account and pull user_metadata
  try {
    const usersRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(emailNorm)}`,
      { headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}` } }
    );
    if (usersRes.ok) {
      const usersJson = await usersRes.json();
      const users = usersJson.users || [];
      const match = users.find(u => (u.email || '').toLowerCase() === emailNorm);
      if (match) {
        result.hasAccount = true;
        const meta = match.user_metadata || {};
        result.contextualProfile = meta.contextual_profile || null;
        if (!result.firstName && meta.first_name) result.firstName = meta.first_name;
        if (!result.lastName  && meta.last_name)  result.lastName  = meta.last_name;
      }
    }
  } catch (e) {}

  // 2. Count prior assessments for this email
  try {
    const countRes = await fetch(
      `${supabaseUrl}/rest/v1/vapi_results?email=eq.${encodeURIComponent(emailNorm)}&select=id`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'count=exact',
          'Range': '0-0',
        },
      }
    );
    const contentRange = countRes.headers.get('content-range') || '';
    const match = contentRange.match(/\/(\d+)$/);
    // Count is rows already saved; this call happens after save, so count = this assessment number
    result.assessmentNumber = match ? parseInt(match[1], 10) : 1;
  } catch (e) {}

  return result;
}

export async function POST(request) {
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const {
    email, firstName, lastName, overall, overallTier,
    arenaScores = {}, arenaTiers = {}, domains = [],
    importanceRatings = {}, priorityMatrix = {},
  } = body;

  const timestamp = new Date().toISOString();

  // Server-side lookup: account status, assessment number, contextual profile
  const lookup = await lookupUserByEmail(supabaseUrl, serviceRoleKey, email);
  const hasPortalAccount = lookup.hasAccount;
  const assessmentNumber = lookup.assessmentNumber;
  const contextualProfile = lookup.contextualProfile;
  // Use metadata name if quiz didn't capture one
  const resolvedFirstName = firstName || lookup.firstName;
  const resolvedLastName  = lastName  || lookup.lastName;

  // Determine #1 Critical Priority
  const criticals = priorityMatrix.criticalPriority || [];
  let topCriticalPriority = null;
  if (criticals.length > 0) {
    const sorted = [...criticals].sort((a, b) => (b.importance || 0) - (a.importance || 0));
    topCriticalPriority = sorted[0]?.domain || null;
  } else {
    const sorted = [...domains].sort((a, b) => a.score - b.score);
    topCriticalPriority = sorted[0]?.domain || null;
  }

  const results = { ok: true, userEmailSent: false, adminEmailSent: false, errors: [] };

  // Email 1: User
  if (email) {
    const { html, text } = buildUserEmail({ firstName: resolvedFirstName, overall, overallTier, arenaScores, arenaTiers, topCriticalPriority, hasPortalAccount });
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `Jake Sebok <${USER_FROM_EMAIL}>`,
          to: [email.trim().toLowerCase()],
          subject: 'Your VAPI Assessment Results Are Ready',
          html,
          text,
          reply_to: process.env.VAPI_REPLY_TO || process.env.SIX_C_REPLY_TO || undefined,
        }),
      });
      if (res.ok) {
        results.userEmailSent = true;
      } else {
        const errText = await res.text();
        results.errors.push({ type: 'user_email', status: res.status, detail: errText.slice(0, 400) });
      }
    } catch (err) {
      results.errors.push({ type: 'user_email', message: String(err.message) });
    }
  }

  // Email 2: Admin
  const { html: adminHtml, text: adminText } = buildAdminEmail({
    email, firstName: resolvedFirstName, lastName: resolvedLastName,
    overall, overallTier, arenaScores, arenaTiers, domains,
    importanceRatings, priorityMatrix, contextualProfile,
    assessmentNumber, hasPortalAccount, timestamp,
  });
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `VAPI Assessments <${ADMIN_FROM_EMAIL}>`,
          to: [ADMIN_EMAIL],
          subject: 'New VAPI Assessment Completed',
          html: adminHtml,
          text: adminText,
        }),
    });
    if (res.ok) {
      results.adminEmailSent = true;
    } else {
      const errText = await res.text();
      results.errors.push({ type: 'admin_email', status: res.status, detail: errText.slice(0, 400) });
    }
  } catch (err) {
    results.errors.push({ type: 'admin_email', message: String(err.message) });
  }

  return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
