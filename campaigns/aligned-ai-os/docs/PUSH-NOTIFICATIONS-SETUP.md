# 6Cs Scorecard Push Notifications — Setup Guide

Push notifications remind app users when their weekly 6Cs scorecard is available (Friday–Sunday 12:05pm Eastern), matching the portal email reminders.

---

## 1. Generate VAPID Keys

VAPID keys authenticate your app with browser push services. Generate a pair:

```bash
npx web-push generate-vapid-keys
```

You'll get output like:

```
Public Key:  BEl62iUYgUivxIkv69yViEuiBIa-Ib27-SVMej4pwk...
Private Key: UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qw...
```

---

## 2. Add Environment Variables

Add to `.env` (and Vercel Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | The **public** key from step 1 |
| `VAPID_PRIVATE_KEY` | The **private** key from step 1 |

**Important:** The public key must be prefixed with `NEXT_PUBLIC_` so the client can use it. The private key must stay server-side only.

---

## 3. Run Database Migration

The `push_subscriptions` table stores user subscriptions. Apply the schema:

```bash
npm run db:push
```

Or, if using migrations:

```bash
npm run db:generate
# Then run your migration command
```

---

## 4. Deploy

1. Push your code to Vercel.
2. Add the env vars in Vercel → Project → Settings → Environment Variables.
3. Redeploy.

---

## 5. Cron Schedule

The cron runs at **17:05 UTC** (12:05pm Eastern) daily. Vercel invokes `/api/cron/6c-reminders` with the `CRON_SECRET` in the `Authorization: Bearer` header.

**Vercel Hobby:** Only one cron job runs per day. The app defines both `morning-prompt` and `6c-reminders`; on Hobby, only one may execute. Upgrade to Vercel Pro for multiple daily crons, or consolidate into a single cron that dispatches by time.

---

## 6. Testing

### Test the cron (no push sent)

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://your-app.vercel.app/api/cron/6c-reminders"
```

You'll get JSON like:

```json
{
  "ok": true,
  "message": "No reminder scheduled (Fri/Sat/Sun 12:05pm Eastern only)",
  "type": null
}
```

When it's Friday/Saturday/Sunday 12:05pm Eastern, you'll see `"type": "available"` (or `"saturday"` / `"one-hour-left"`) and `sent`, `failed`, `total` counts.

### Test push subscription

1. Open the app in a supported browser (Chrome, Edge, Firefox).
2. Go to **Settings**.
3. Enable **6Cs Scorecard Reminders**.
4. Allow notifications when prompted.
5. The toggle should stay on.

### Test push delivery

1. Subscribe (as above).
2. Manually trigger the cron when it's Fri/Sat/Sun 12:05pm Eastern, or temporarily change the cron schedule for testing.
3. You should receive a push notification.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "VAPID keys not configured" | Add both env vars and redeploy. |
| "Notification permission denied" | User must allow in browser. They can re-enable in Settings. |
| "Could not subscribe" | Ensure `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is set. Service worker must be at `/sw.js`. |
| No push received | Check cron ran (Vercel logs). Ensure it's Fri/Sat/Sun 12:05pm Eastern. |
| Service worker not found | Ensure `public/sw.js` exists and is deployed. |

---

## Flow Summary

1. **User enables** in Settings → registers `/sw.js` → requests permission → subscribes → subscription sent to `/api/push/subscribe` → stored in `push_subscriptions`.
2. **Cron runs** at 12:05pm Eastern (Fri/Sat/Sun) → fetches subscribers → (Sat/Sun) filters out users who already submitted → sends push via `web-push`.
3. **User taps notification** → opens `/scorecard`.
