# Portal API gateway (`api/gw.js`)

Vercel **Hobby** allows **12 Serverless Functions** per deployment. Each file under `api/` used to become its own function, so the portal exceeded the limit.

## How it works

1. **Single entry:** Only **`api/gw.js`** is deployed as a serverless function at `/api/gw`. It must use **`export default { fetch }`** (Web Standard), not `export default async function (req)` returning `Response`, or Vercel can crash with `FUNCTION_INVOCATION_FAILED`.
2. **Rewrite:** `vercel.json` sends every **`/api/*`** request to **`/api/gw?r=$1`**, where `$1` is the path after `/api/` (e.g. `config`, `save-vapi-results`, `cron/6c-reminders`).
3. **Handlers:** Implementation lives in **`lib/portal-server/handlers/`** (not under `api/`), so those files are **not** separate functions. Shared logic is in **`lib/portal-server/`** (sprint, VAPI enrich, driver scoring).
4. **Loading:** `gw.js` uses **dynamic `import()`** per route so cold starts do not load all handlers at once.

## Adding a route

1. Add the handler file under `lib/portal-server/handlers/<name>.js` exporting `GET` / `POST` / `PATCH` as needed.
2. Register it in **`api/gw.js`** → `ROUTE_LOADERS` with the same key the client uses after `/api/` (e.g. `my-endpoint` for `fetch('/api/my-endpoint')`).
3. No change to client URLs: still call **`/api/<route>`**.

## Cron

`vercel.json` crons still call **`/api/cron/6c-reminders`**. The rewrite sets **`r=cron/6c-reminders`**, which maps to **`cron-6c-reminders.js`** handler module under the key **`cron/6c-reminders`**.
