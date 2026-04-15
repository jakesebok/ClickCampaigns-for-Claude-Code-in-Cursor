import type { BuildIntakePayloadV1 } from "./types";
import {
  GOAL_LABEL,
  MODULE_LABEL,
  RESULT_LABEL,
  WHO_AUTHORS_LABEL,
} from "./email-labels";

const C = {
  primary: "#0E1624",
  secondary: "#3A4A5C",
  muted: "#7A8FA8",
  accent: "#FF6B1A",
  bg: "#F5F7FA",
  card: "#FFFFFF",
  border: "#DDE3ED",
  soft: "#FAFAFB",
  foot: "#EEF1F7",
} as const;

export function escHtml(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(s: string) {
  return escHtml(s).replace(/\r\n/g, "\n").split("\n").join("<br/>");
}

function fmt(s: string | undefined | null, empty = "—") {
  const t = String(s || "").trim();
  return t ? nl2br(t) : `<span style="color:${C.muted};font-style:italic;">${empty}</span>`;
}

function yesNo(v: boolean | null | undefined, empty = "—") {
  if (v === null || v === undefined) return `<span style="color:${C.muted};">${empty}</span>`;
  return v ? "Yes" : "No";
}

function joinLabels(ids: string[], map: Record<string, string>) {
  if (!ids?.length)
    return `<span style="color:${C.muted};font-style:italic;">—</span>`;
  return escHtml(ids.map((id) => map[id] || id.replace(/_/g, " ")).join(", "));
}

function sectionEyebrow(title: string) {
  return `<p style="margin:0 0 14px;padding:0 0 10px;border-bottom:1px solid ${C.border};font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:${C.primary};letter-spacing:-0.02em;">${escHtml(title)}</p>`;
}

function fieldHtml(label: string, valueHtml: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;"><tr><td>
<p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">${escHtml(label)}</p>
<div style="margin:0;font-size:15px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${valueHtml}</div>
</td></tr></table>`;
}

function cardWrap(inner: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td style="padding:22px 24px;background:${C.soft};border:1px solid ${C.border};border-radius:14px;">${inner}</td></tr></table>`;
}

function constructsList(p: BuildIntakePayloadV1): string {
  const flat = p.constructTree?.structure === "flat";
  if (flat) {
    const sd = p.constructTree?.standaloneDomains || [];
    if (!sd.length)
      return `<span style="color:${C.muted};font-style:italic;">—</span>`;
    const lines = sd.map((d) => escHtml(d.name || "Construct"));
    return `<ul style="margin:8px 0 0;padding-left:20px;color:${C.secondary};font-size:15px;line-height:1.6;font-family:Helvetica Neue,Arial,sans-serif;">${lines.map((l) => `<li style="margin-bottom:6px;">${l}</li>`).join("")}</ul>`;
  }
  const lines: string[] = [];
  for (const a of p.constructTree?.arenas || []) {
    const an = a.name || "Arena";
    if (!a.domains?.length) {
      lines.push(`${escHtml(an)} (no domains yet)`);
    } else {
      for (const d of a.domains) {
        lines.push(`${escHtml(an)} → ${escHtml(d.name || "Domain")}`);
      }
    }
  }
  if (!lines.length)
    return `<span style="color:${C.muted};font-style:italic;">—</span>`;
  return `<ul style="margin:8px 0 0;padding-left:20px;color:${C.secondary};font-size:15px;line-height:1.6;font-family:Helvetica Neue,Arial,sans-serif;">${lines.map((l) => `<li style="margin-bottom:6px;">${l}</li>`).join("")}</ul>`;
}

export function buildIntakeSummaryHtml(p: BuildIntakePayloadV1): string {
  const parts: string[] = [];

  parts.push(
    cardWrap(
      sectionEyebrow("Contact") +
        fieldHtml("Name", fmt(p.contactName)) +
        fieldHtml("Email", fmt(p.contactEmail))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Business goals & audience") +
        fieldHtml("Goals", joinLabels(p.businessGoals || [], GOAL_LABEL)) +
        fieldHtml("Audience & context", fmt(p.audienceAndContext)) +
        fieldHtml("Job to be done / outcomes", fmt(p.jobToBeDoneNotes))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Proprietary system") +
        fieldHtml(
          "Has proprietary system?",
          p.hasProprietarySystem === null
            ? "—"
            : p.hasProprietarySystem
              ? "Yes"
              : "No"
        ) +
        fieldHtml("Description", fmt(p.proprietarySystemDescription)) +
        fieldHtml("Gaps / notes", fmt(p.proprietaryGapNotes))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Constructs") +
        fieldHtml(
          "Organization",
          p.constructTree?.structure === "flat"
            ? "Flat (constructs only, no parent arenas)"
            : "Grouped (arenas contain domains)"
        ) +
        `<div style="font-size:15px;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${constructsList(p)}</div>`
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Length & scale") +
        fieldHtml("Length preference", fmt(p.lengthPreference)) +
        fieldHtml("Scale type", fmt(p.scalePreference))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Modules beyond core") +
        fieldHtml(
          "Selected",
          joinLabels(p.optionalSections || [], MODULE_LABEL)
        )
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Scoring & patterns") +
        fieldHtml("Scoring pipeline notes", fmt(p.scoringPipelineNotes)) +
        fieldHtml(
          "Bands / tiers on kickoff call",
          yesNo(p.bandsTiersDiscussKickoff)
        ) +
        fieldHtml("Priority matrix", yesNo(p.wantsPriorityMatrix)) +
        fieldHtml("Pattern / driver layer", yesNo(p.wantsPatternLayer)) +
        fieldHtml("Pattern notes", fmt(p.patternLayerNotes))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Results page must include") +
        fieldHtml("Outputs", joinLabels(p.resultsOutputs || [], RESULT_LABEL))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Voice & libraries") +
        fieldHtml("Reading level (index)", escHtml(String(p.readingLevelIndex ?? "—"))) +
        fieldHtml("Interpretation depth", fmt(p.contentDepth)) +
        fieldHtml(
          "Who authors copy",
          p.whoAuthors
            ? escHtml(WHO_AUTHORS_LABEL[p.whoAuthors] || p.whoAuthors)
            : "—"
        ) +
        fieldHtml("Libraries & help content", fmt(p.librariesNotes))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Generated plans") +
        fieldHtml("Wants generated plans", yesNo(p.wantsGeneratedPlans)) +
        fieldHtml("Cadence & shape", fmt(p.planCadenceNotes)) +
        fieldHtml("Plan update rules", fmt(p.planUpdateNotes))
    )
  );

  const authBlock =
    p.hasAuthProvider === "yes"
      ? fieldHtml("Existing auth provider?", "Yes") +
        fieldHtml("Provider name", fmt(p.authProviderName))
      : p.hasAuthProvider === "no"
        ? fieldHtml(
            "Existing auth provider?",
            `No <span style="color:${C.muted};font-size:14px;">(recommend at kickoff)</span>`
          )
        : fieldHtml("Existing auth provider?", "—");
  parts.push(cardWrap(sectionEyebrow("Sign-in & accounts") + authBlock));

  parts.push(
    cardWrap(
      sectionEyebrow("Coaching OS & longitudinal") +
        fieldHtml("Coach / admin extras", fmt(p.coachDashboardExtras)) +
        fieldHtml(
          "Interested in longitudinal scorecards",
          yesNo(p.interestedInLongitudinal)
        ) +
        fieldHtml("Longitudinal notes", fmt(p.longitudinalNotes))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Brand") +
        fieldHtml("Website URL", fmt(p.brandWebsiteUrl)) +
        fieldHtml("Logo URL", fmt(p.brandLogoUrl)) +
        fieldHtml("Logo / assets (Drive)", fmt(p.brandLogoDriveUrl)) +
        fieldHtml("Primary hex", fmt(p.brandColorPrimaryHex)) +
        fieldHtml("Secondary hex", fmt(p.brandColorSecondaryHex)) +
        fieldHtml("Accent hex", fmt(p.brandColorAccentHex)) +
        fieldHtml("Color notes", fmt(p.brandColorsNotes)) +
        fieldHtml("Headline font", fmt(p.brandHeadlineFont)) +
        fieldHtml("Body font", fmt(p.brandBodyFont)) +
        fieldHtml("Accent font", fmt(p.brandAccentFont)) +
        fieldHtml("Typography notes", fmt(p.brandTypographyNotes)) +
        fieldHtml("Theme", fmt(p.brandTheme))
    )
  );

  parts.push(
    cardWrap(
      sectionEyebrow("Integrations & timeline") +
        fieldHtml("CRM", fmt(p.crm)) +
        fieldHtml("Analytics", fmt(p.analytics)) +
        fieldHtml("LMS", fmt(p.lms)) +
        fieldHtml("Other integrations", fmt(p.otherIntegrations)) +
        fieldHtml("Rush (sooner than 30 days)", yesNo(p.rushSoonerThan30Days)) +
        fieldHtml("Rush context", fmt(p.rushContextNotes))
    )
  );

  const legal =
    (p.privacyPolicyUrl?.trim() || "") + (p.termsUrl?.trim() || "");
  if (legal) {
    parts.push(
      cardWrap(
        sectionEyebrow("Legal (optional)") +
          fieldHtml("Privacy policy URL", fmt(p.privacyPolicyUrl)) +
          fieldHtml("Terms URL", fmt(p.termsUrl))
      )
    );
  }

  return parts.join("");
}

function emailShell(opts: {
  preheader: string;
  heroTitle: string;
  heroAccent?: string;
  introHtml: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  const pre = escHtml(opts.preheader);
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escHtml(opts.heroTitle)}</title>
<!--[if mso]><style type="text/css">table {border-collapse:collapse;} td {font-family: Arial, sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${C.bg};opacity:0;">${pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border-radius:16px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 24px 48px -28px rgba(14,22,36,0.12);">
<tr><td style="padding:0;background:linear-gradient(135deg, ${C.primary} 0%, #192236 100%);">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:28px 32px 24px;">
<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.55);font-family:Helvetica Neue,Arial,sans-serif;">Aligned Power</p>
<h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;line-height:1.2;">${escHtml(opts.heroTitle)}</h1>
${opts.heroAccent ? `<p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:rgba(255,255,255,0.82);font-family:Helvetica Neue,Arial,sans-serif;">${opts.heroAccent}</p>` : ""}
</td></tr></table>
</td></tr>
<tr><td style="padding:28px 28px 8px;">
${opts.introHtml}
</td></tr>
<tr><td style="padding:8px 28px 32px;">
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:20px 28px 28px;background:${C.foot};border-top:1px solid ${C.border};">
${opts.footerHtml || `<p style="margin:0;font-size:12px;line-height:1.5;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">This message was sent because you submitted the Build Your Assessment intake on jakesebok.com.</p>`}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function T(s: string | undefined | null) {
  const x = String(s ?? "").trim();
  return x || "—";
}

function constructsPlain(p: BuildIntakePayloadV1): string {
  if (p.constructTree?.structure === "flat") {
    const sd = p.constructTree?.standaloneDomains || [];
    return sd.length
      ? sd.map((d) => d.name || "—").join("\n")
      : "—";
  }
  const lines: string[] = [];
  for (const a of p.constructTree?.arenas || []) {
    const an = a.name || "Arena";
    if (!a.domains?.length) lines.push(`${an} (no domains yet)`);
    else {
      for (const d of a.domains) lines.push(`${an} → ${d.name || "Domain"}`);
    }
  }
  return lines.length ? lines.join("\n") : "—";
}

/** Full plain-text mirror of the HTML summary (for multipart/alternative clients). */
export function buildIntakeSummaryPlainText(p: BuildIntakePayloadV1): string {
  const o: string[] = [];
  const sec = (title: string) => {
    o.push("");
    o.push(title);
    o.push("-".repeat(Math.min(title.length, 44)));
  };
  const f = (label: string, val: string) => o.push(`${label}: ${val}`);

  sec("CONTACT");
  f("Name", T(p.contactName));
  f("Email", T(p.contactEmail));

  sec("BUSINESS GOALS & AUDIENCE");
  f(
    "Goals",
    (p.businessGoals || []).length
      ? (p.businessGoals || []).map((id) => GOAL_LABEL[id] || id).join(", ")
      : "—"
  );
  f("Audience & context", T(p.audienceAndContext));
  f("Job to be done / outcomes", T(p.jobToBeDoneNotes));

  sec("PROPRIETARY SYSTEM");
  f(
    "Has proprietary system?",
    p.hasProprietarySystem === null ? "—" : p.hasProprietarySystem ? "Yes" : "No"
  );
  f("Description", T(p.proprietarySystemDescription));
  f("Gaps / notes", T(p.proprietaryGapNotes));

  sec("CONSTRUCTS");
  f(
    "Organization",
    p.constructTree?.structure === "flat"
      ? "Flat (constructs only)"
      : "Grouped (arenas + domains)"
  );
  o.push(constructsPlain(p));

  sec("LENGTH & SCALE");
  f("Length preference", T(p.lengthPreference));
  f("Scale type", T(p.scalePreference));

  sec("MODULES BEYOND CORE");
  f(
    "Selected",
    (p.optionalSections || []).length
      ? (p.optionalSections || []).map((id) => MODULE_LABEL[id] || id).join(", ")
      : "—"
  );

  sec("SCORING & PATTERNS");
  f("Scoring pipeline notes", T(p.scoringPipelineNotes));
  f("Bands / tiers on kickoff call", p.bandsTiersDiscussKickoff ? "Yes" : "No");
  f("Priority matrix", p.wantsPriorityMatrix ? "Yes" : "No");
  f("Pattern / driver layer", p.wantsPatternLayer ? "Yes" : "No");
  f("Pattern notes", T(p.patternLayerNotes));

  sec("RESULTS PAGE MUST INCLUDE");
  f(
    "Outputs",
    (p.resultsOutputs || []).length
      ? (p.resultsOutputs || []).map((id) => RESULT_LABEL[id] || id).join(", ")
      : "—"
  );

  sec("VOICE & LIBRARIES");
  f("Reading level index", String(p.readingLevelIndex ?? "—"));
  f("Interpretation depth", T(p.contentDepth));
  f(
    "Who authors copy",
    p.whoAuthors ? WHO_AUTHORS_LABEL[p.whoAuthors] || p.whoAuthors : "—"
  );
  f("Libraries & help content", T(p.librariesNotes));

  sec("GENERATED PLANS");
  f("Wants generated plans", p.wantsGeneratedPlans ? "Yes" : "No");
  f("Cadence & shape", T(p.planCadenceNotes));
  f("Plan update rules", T(p.planUpdateNotes));

  sec("SIGN-IN & ACCOUNTS");
  if (p.hasAuthProvider === "yes") {
    f("Existing auth provider?", "Yes");
    f("Provider name", T(p.authProviderName));
  } else if (p.hasAuthProvider === "no") {
    f("Existing auth provider?", "No (recommend at kickoff)");
  } else {
    f("Existing auth provider?", "—");
  }

  sec("COACHING OS & LONGITUDINAL");
  f("Coach / admin extras", T(p.coachDashboardExtras));
  f("Interested in longitudinal scorecards", p.interestedInLongitudinal ? "Yes" : "No");
  f("Longitudinal notes", T(p.longitudinalNotes));

  sec("BRAND");
  f("Website URL", T(p.brandWebsiteUrl));
  f("Logo URL", T(p.brandLogoUrl));
  f("Logo / assets (Drive)", T(p.brandLogoDriveUrl));
  f("Primary hex", T(p.brandColorPrimaryHex));
  f("Secondary hex", T(p.brandColorSecondaryHex));
  f("Accent hex", T(p.brandColorAccentHex));
  f("Color notes", T(p.brandColorsNotes));
  f("Headline font", T(p.brandHeadlineFont));
  f("Body font", T(p.brandBodyFont));
  f("Accent font", T(p.brandAccentFont));
  f("Typography notes", T(p.brandTypographyNotes));
  f("Theme", T(p.brandTheme));

  sec("INTEGRATIONS & TIMELINE");
  f("CRM", T(p.crm));
  f("Analytics", T(p.analytics));
  f("LMS", T(p.lms));
  f("Other integrations", T(p.otherIntegrations));
  f("Rush (sooner than 30 days)", p.rushSoonerThan30Days ? "Yes" : "No");
  f("Rush context", T(p.rushContextNotes));

  if (p.privacyPolicyUrl?.trim() || p.termsUrl?.trim()) {
    sec("LEGAL (OPTIONAL)");
    f("Privacy policy URL", T(p.privacyPolicyUrl));
    f("Terms URL", T(p.termsUrl));
  }

  return o.join("\n");
}

export function buildSubmitterEmailHtml(
  p: BuildIntakePayloadV1,
  email: string
) {
  const name = p.contactName || "";
  const greeting = name ? `Hi ${escHtml(name)},` : "Hi there,";
  const summary = buildIntakeSummaryHtml(p);

  const intro = `<p style="margin:0 0 12px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">${greeting}</p>
<p style="margin:0 0 16px;font-size:17px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;">Thanks for completing the <strong style="color:${C.primary};">Build Your Assessment</strong> intake. Here is a clean copy of everything you submitted. If anything looks off, just reply to this email.</p>
<p style="margin:0;font-size:13px;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Submitted from: <strong style="color:${C.secondary};">${escHtml(email)}</strong></p>`;

  return emailShell({
    preheader: "Your Build Your Assessment intake — full summary inside.",
    heroTitle: "We received your intake",
    heroAccent: "Your answers are below, section by section.",
    introHtml: intro,
    bodyHtml: summary,
    footerHtml: `<p style="margin:0;font-size:12px;line-height:1.55;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Questions? Reply to this email. Reference: your name and the email address above.</p>`,
  });
}

export function buildAdminEmailHtml(p: BuildIntakePayloadV1, recordId: string) {
  const summary = buildIntakeSummaryHtml(p);
  const intro = `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Record ID:</strong> <code style="background:${C.soft};padding:2px 8px;border-radius:6px;font-size:13px;color:${C.primary};">${escHtml(recordId)}</code></p>
<p style="margin:0 0 6px;font-size:15px;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Name:</strong> ${escHtml(p.contactName)}</p>
<p style="margin:0 0 20px;font-size:15px;color:${C.secondary};font-family:Helvetica Neue,Arial,sans-serif;"><strong style="color:${C.primary};">Email:</strong> ${escHtml(p.contactEmail)}</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Structured submission (same fields as in Supabase):</p>`;

  return emailShell({
    preheader: `New intake from ${p.contactName} — ID ${recordId}`,
    heroTitle: "New Build Your Assessment intake",
    introHtml: intro,
    bodyHtml: summary,
    footerHtml: `<p style="margin:0;font-size:12px;color:${C.muted};font-family:Helvetica Neue,Arial,sans-serif;">Build Intake notification · ${escHtml(recordId)}</p>`,
  });
}

export function buildSubmitterEmailText(p: BuildIntakePayloadV1, email: string) {
  const name = p.contactName || "there";
  return [
    `Hi ${name},`,
    "",
    "Thanks for completing the Build Your Assessment intake. Below is a plain-text copy of everything you submitted.",
    "",
    `Submitted from: ${email}`,
    buildIntakeSummaryPlainText(p),
    "",
    "Reply to this email if anything needs a correction.",
  ].join("\n");
}

export function buildAdminEmailText(p: BuildIntakePayloadV1, recordId: string) {
  return [
    "New Build Your Assessment intake",
    "",
    `Record ID: ${recordId}`,
    `Name: ${p.contactName}`,
    `Email: ${p.contactEmail}`,
    "",
    buildIntakeSummaryPlainText(p),
    "",
    `Supabase stores the full record (including JSON) under ID ${recordId}.`,
  ].join("\n");
}
