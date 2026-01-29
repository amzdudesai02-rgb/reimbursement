# Deploy Frontend on Vercel + Backend on Render

This guide configures your app so the **frontend** runs on Vercel (e.g. `reimbursement.amzdudes.io`) and the **backend** on Render, with API requests proxied through Vercel.

---

## 1. Proxy `/api/*` → Render backend

In your **frontend** repo (Vercel), `vercel.json` is already set up to:

- Rewrite `/api/(.*)` to your Render backend.
- Send all other routes to `/index.html` (SPA).

Your backend is at **`https://api.reimbursement.amzdudes.io`** (Render). The proxy in `frontend/vercel.json` is set to:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.reimbursement.amzdudes.io/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

The backend serves routes under `/api/...`, so the path stays `/api/$1`. If you use a different Render URL, update the `destination` accordingly.

---

## 2. Redeploy Vercel

Push the change to GitHub. Vercel will redeploy. No extra build step needed for the rewrites.

---

## 3. Confirm the proxy

After redeploy, open:

```text
https://reimbursement.amzdudes.io/api/auth/amazon/callback?code=test&state=test
```

You should get a **backend** response (e.g. JSON error about missing/invalid code or auth), **not** the React app or a marketing page. If you see the app instead, the `/api` rewrite is not taking effect (e.g. wrong order or pattern).

---

## 4. Use one callback URL everywhere

Your app uses a **frontend** callback route for OAuth:

- **Amazon redirects the user to:**  
  `https://reimbursement.amzdudes.io/auth/amazon/callback`  
  (no `/api` — this is the React app.)

- The frontend then **POSTs** to  
  `https://reimbursement.amzdudes.io/api/auth/amazon/callback`  
  (proxied to Render).

So the **return_url** you send to Amazon (and store in config) must be the **frontend** callback:

```text
https://reimbursement.amzdudes.io/auth/amazon/callback
```

Use this **exact** URL in:

| Where | What to set |
|-------|-------------|
| **Amazon Developer Central (LWA)** | Redirect / Return URL |
| **Backend env** `AMAZON_OAUTH_REDIRECT_URI` | `https://reimbursement.amzdudes.io/auth/amazon/callback` (optional fallback; frontend sends `redirect_uri` in callback POST) |
| **Consent URL `return_url`** | Same URL, **URL-encoded**: `https%3A%2F%2Freimbursement.amzdudes.io%2Fauth%2Famazon%2Fcallback` |

No trailing slash. The backend already normalizes and uses the `redirect_uri` from the callback payload when present.

---

## 5. Generate the consent URL with encoded `return_url`

When building the Amazon consent URL, the `return_url` parameter must be **URL-encoded**:

- `https://` → `https%3A%2F%2F`
- So  
  `https://reimbursement.amzdudes.io/auth/amazon/callback`  
  becomes  
  `https%3A%2F%2Freimbursement.amzdudes.io%2Fauth%2Famazon%2Fcallback`

Your `sp_api_client.generate_authorization_url` uses `urllib.parse.quote` on the full URL; that produces the correct encoding.

---

## 6. Frontend env (Vercel)

Set in **Vercel** → Project → Settings → Environment Variables:

| Variable | Value | Notes |
|----------|--------|--------|
| `VITE_API_BASE` | `/api` | Use relative URL when frontend is served from the same domain (e.g. `reimbursement.amzdudes.io`). API calls go to `https://reimbursement.amzdudes.io/api/...` and are proxied to Render. |

All API requests (login, sync, callback POST, etc.) will go to `/api/...` and be proxied to Render.

---

## 7. Backend env (Render)

Configure these in **Render** → Your Backend Service → Environment:

| Variable | Example | Notes |
|----------|---------|--------|
| `CORS_ORIGINS` | `["https://reimbursement.amzdudes.io"]` | JSON array; add any other frontend origins you use |
| `AMAZON_OAUTH_REDIRECT_URI` | `https://reimbursement.amzdudes.io/auth/amazon/callback` | Optional; same as above, no trailing slash |
| `AMAZON_LWA_CLIENT_ID` | (from Seller Central) | |
| `AMAZON_LWA_CLIENT_SECRET` | (from Seller Central) | |
| `AMAZON_AWS_IAM_ROLE_ARN` | (from SP-API setup) | |
| `JWT_SECRET` | (strong secret) | |
| … | (DB, etc.) | As in your current backend config |

---

## 8. CORS and Render

If the frontend sometimes calls the Render URL **directly** (e.g. local dev against Render), ensure Render allows that origin:

- `CORS_ORIGINS` must include `https://reimbursement.amzdudes.io` (and `http://localhost:5173` for local dev if you use it).

When using the **Vercel proxy** only (browser → `reimbursement.amzdudes.io/api` → Vercel → Render), the browser talks to your frontend origin only; CORS still applies if you later switch to direct Render calls.

---

## 9. Checklist

- [ ] `vercel.json`: `/api/(.*)` → `https://api.reimbursement.amzdudes.io/api/$1`, then SPA fallback.
- [ ] Redeploy frontend on Vercel.
- [ ] Test: `https://reimbursement.amzdudes.io/api/auth/amazon/callback?code=test&state=test` returns backend JSON.
- [ ] Amazon LWA redirect URL: `https://reimbursement.amzdudes.io/auth/amazon/callback` (exact, no trailing slash).
- [ ] Backend `AMAZON_OAUTH_REDIRECT_URI` matches (optional).
- [ ] `return_url` in consent URL is URL-encoded.
- [ ] Vercel: `VITE_API_BASE` = `/api`.
- [ ] Render: `CORS_ORIGINS` includes `https://reimbursement.amzdudes.io`.

---

## 10. Flow summary

1. User visits `https://reimbursement.amzdudes.io` (Vercel).
2. "Connect Amazon" → frontend calls `GET /api/auth/amazon/init` (proxied to Render) → redirects to Amazon consent.
3. User signs in and approves → Amazon redirects to  
   `https://reimbursement.amzdudes.io/auth/amazon/callback?state=...&selling_partner_id=...&spapi_oauth_code=...`
4. React callback page POSTs to `POST /api/auth/amazon/callback` (proxied to Render) with the code; backend exchanges code and stores tokens.
5. Frontend redirects to `/stores?amazon_connected=1` and runs sync via `POST /api/sync` (proxied to Render).

All `/api` requests go through Vercel to Render; the browser only talks to `reimbursement.amzdudes.io`.
