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

You should get a **backend** response: either a **302 redirect** to `/stores?amazon_connected=1` (backend GET callback) or a **JSON error** (e.g. invalid state/code). You must **not** see the React app or a marketing page. If you do, the `/api` rewrite is not taking effect.

---

## 4. Use one callback URL everywhere (backend GET callback)

The app uses a **backend GET** callback for OAuth:

- **Amazon redirects the user to:**  
  `https://reimbursement.amzdudes.io/api/auth/amazon/callback`  
  (proxied to Render).

- The backend **exchanges** the code for tokens, stores them, then **redirects** to  
  `https://reimbursement.amzdudes.io/stores?amazon_connected=1`.

Use this **exact** callback URL everywhere:

```text
https://reimbursement.amzdudes.io/api/auth/amazon/callback
```

| Where | What to set |
|-------|-------------|
| **Amazon Developer Central (LWA)** | Redirect / Return URL |
| **Backend env** `AMAZON_OAUTH_REDIRECT_URI` | `https://reimbursement.amzdudes.io/api/auth/amazon/callback` (optional) |
| **Consent URL `return_url`** | Same URL, **URL-encoded**: `https%3A%2F%2Freimbursement.amzdudes.io%2Fapi%2Fauth%2Famazon%2Fcallback` |

No trailing slash. The frontend sends this as `redirect_uri` when calling `/api/auth/amazon/init`.

---

## 5. Generate the consent URL with encoded `return_url`

When building the Amazon consent URL, the `return_url` parameter must be **URL-encoded** (e.g. `https://` → `https%3A%2F%2F`). Your `sp_api_client.generate_authorization_url` uses `urllib.parse.quote` on the full URL, which produces the correct encoding.

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
| `FRONTEND_ORIGIN` | `https://reimbursement.amzdudes.io` | Used for redirect after GET callback (no trailing slash) |
| `AMAZON_OAUTH_REDIRECT_URI` | `https://reimbursement.amzdudes.io/api/auth/amazon/callback` | Optional; must match LWA redirect URL |
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
- [ ] Amazon LWA redirect URL: `https://reimbursement.amzdudes.io/api/auth/amazon/callback` (exact, no trailing slash).
- [ ] Render: `FRONTEND_ORIGIN` = `https://reimbursement.amzdudes.io`; `AMAZON_OAUTH_REDIRECT_URI` matches (optional).
- [ ] `return_url` in consent URL is URL-encoded.
- [ ] Vercel: `VITE_API_BASE` = `/api`.
- [ ] Render: `CORS_ORIGINS` includes `https://reimbursement.amzdudes.io`.

---

## 10. Flow summary

1. User visits `https://reimbursement.amzdudes.io` (Vercel).
2. "Connect Amazon" → frontend calls `GET /api/auth/amazon/init` (proxied to Render) with `redirect_uri=.../api/auth/amazon/callback` → redirects to Amazon consent.
3. User signs in and approves → Amazon **GET**-redirects to  
   `https://reimbursement.amzdudes.io/api/auth/amazon/callback?code=...&state=...&selling_partner_id=...`
4. Backend **GET** handler exchanges code, stores tokens, then **302-redirects** to  
   `https://reimbursement.amzdudes.io/stores?amazon_connected=1`.
5. Manage Stores sees `amazon_connected=1`, refreshes stores, and runs `POST /api/sync` (proxied to Render).

All `/api` requests go through Vercel to Render; the browser only talks to `reimbursement.amzdudes.io`.
