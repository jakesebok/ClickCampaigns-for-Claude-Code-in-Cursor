/**
 * Single Vercel Serverless entry (Hobby plan: max 12 functions).
 * All /api/* traffic is rewritten here with ?r=<original-path-after-api/>.
 * Dynamic imports keep cold starts smaller than loading every handler at once.
 */

/** Maps `r` query value (path after /api/) to handler module loader */
const ROUTE_LOADERS = {
  config: () => import("../lib/portal-server/handlers/config.js"),
  "save-vapi-results": () => import("../lib/portal-server/handlers/save-vapi-results.js"),
  "sprint-upsert-from-assessment": () => import("../lib/portal-server/handlers/sprint-upsert-from-assessment.js"),
  "sprint-get-me": () => import("../lib/portal-server/handlers/sprint-get-me.js"),
  "sprint-patch-me": () => import("../lib/portal-server/handlers/sprint-patch-me.js"),
  "coach-sprints": () => import("../lib/portal-server/handlers/coach-sprints.js"),
  "coach-sprint-save": () => import("../lib/portal-server/handlers/coach-sprint-save.js"),
  "coach-sprint-regenerate": () => import("../lib/portal-server/handlers/coach-sprint-regenerate.js"),
  "coach-clients": () => import("../lib/portal-server/handlers/coach-clients.js"),
  "coach-notes": () => import("../lib/portal-server/handlers/coach-notes.js"),
  "admin-results": () => import("../lib/portal-server/handlers/admin-results.js"),
  "admin-active-clients": () => import("../lib/portal-server/handlers/admin-active-clients.js"),
  "admin-set-active-client": () => import("../lib/portal-server/handlers/admin-set-active-client.js"),
  "admin-six-c-submissions": () => import("../lib/portal-server/handlers/admin-six-c-submissions.js"),
  "update-vapi-importance": () => import("../lib/portal-server/handlers/update-vapi-importance.js"),
  "count-vapi-results": () => import("../lib/portal-server/handlers/count-vapi-results.js"),
  "vapi-assessment-complete": () => import("../lib/portal-server/handlers/vapi-assessment-complete.js"),
  "cron/6c-reminders": () => import("../lib/portal-server/handlers/cron-6c-reminders.js"),
};

/**
 * Vercel Node functions must use the Web Standard `default.fetch` export for Request/Response.
 * A plain `export default async function (request)` is treated as a legacy handler and crashes
 * when you return `new Response(...)`.
 * @see https://vercel.com/docs/functions/functions-api-reference#fetch-web-standard
 */
async function gatewayFetch(request) {
  const url = new URL(
    request.url,
    typeof request.url === "string" && request.url.startsWith("http") ? undefined : "https://internal.local"
  );
  let route = (url.searchParams.get("r") || "").replace(/^\/+/, "").replace(/\/+$/, "");

  if (!route || route === "gw") {
    return new Response(JSON.stringify({ error: "not_found", message: "Missing or invalid route" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const loader = ROUTE_LOADERS[route];
  if (!loader) {
    return new Response(JSON.stringify({ error: "not_found", message: "Unknown API route: " + route }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let mod;
  try {
    mod = await loader();
  } catch (e) {
    console.error("[api/gw] load failed", route, e);
    return new Response(JSON.stringify({ error: "handler_load_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;
  const fn = mod[method] || mod.default?.[method];
  if (typeof fn !== "function") {
    return new Response(JSON.stringify({ error: "method_not_allowed", route, method }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: allowedMethods(mod) },
    });
  }

  try {
    return await fn(request);
  } catch (e) {
    console.error("[api/gw] handler error", route, method, e);
    return new Response(JSON.stringify({ error: "handler_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default {
  fetch: gatewayFetch,
};

function allowedMethods(mod) {
  return ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    .filter((m) => typeof mod[m] === "function")
    .join(", ");
}
