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

## 4. Callback URL (popup flow)

The app uses a **popup** for Connect Amazon:

- **Connect Amazon** opens Seller Central in a **new window**.
- User signs in and approves → Amazon redirects the **popup** to the **frontend** callback.
- Callback page POSTs the code to the backend, then **postMessage** to the opener, **closes the popup**, and the dashboard refreshes + runs sync.

Use this **exact** callback URL for the popup flow:

```text
https://reimbursement.amzdudes.io/auth/amazon/callback
```

| Where | What to set |
|-------|-------------|
| **Amazon LWA (Allowed Return URLs)** | `https://reimbursement.amzdudes.io/auth/amazon/callback` |
| **Init `redirect_uri`** | Same (frontend sends it when opening the popup) |

No trailing slash. The backend also supports **GET** `/api/auth/amazon/callback` (same-tab redirect); you can have both URLs allowed if you use that flow too.

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
| `AMAZON_OAUTH_REDIRECT_URI` | `https://reimbursement.amzdudes.io/api/auth/amazon/callback` | Must match redirect URL configured for the **same** app |
| **`AMAZON_APP_ID`** | `amzn1.sp.solution.5bbfb7da-4a1f-4ca0-bcf5-7bf10f30ec6d` | **Required for consent URL.** Use App ID, NOT LWA Client ID. |
| `AMAZON_LWA_CLIENT_ID` | `amzn1.application-oa2-client.xxxx...` | Used only for token exchange (LWA). Not used in consent URL. |
| `AMAZON_LWA_CLIENT_SECRET` | From the **same** app as Client ID | See below |
| `AMAZON_AWS_IAM_ROLE_ARN` | (from SP-API setup) | |
| **`AWS_ACCESS_KEY_ID`** | (IAM user access key) | **Required for sync.** IAM user that can assume the SP-API role above. |
| **`AWS_SECRET_ACCESS_KEY`** | (IAM user secret key) | **Required for sync.** Without these, sync fails with "Unable to locate credentials" and tables stay empty. |
| `JWT_SECRET` | (strong secret) | |
| … | (DB, etc.) | As in your current backend config |

### AWS credentials for sync (Reports + Finances)

Sync uses Amazon SP-API, which requires the backend to **assume an AWS IAM role** via STS. On Render there is no attached IAM role, so you must provide credentials in the environment:

1. In **AWS IAM**, create a user (or use an existing one) and attach a policy that allows `sts:AssumeRole` on your SP-API app’s role (the one in `AMAZON_AWS_IAM_ROLE_ARN`).  
2. Create an **access key** for that user.  
3. In **Render** → your backend service → Environment, set:
   - `AWS_ACCESS_KEY_ID` = the access key ID  
   - `AWS_SECRET_ACCESS_KEY` = the secret access key  

Redeploy after adding them. Without these, Reports and Finances calls fail with "Unable to locate credentials" and reimbursements/shipments stay empty.

### Amazon consent URL vs LWA credentials

Use the **same** app everywhere:

- **Consent URL** uses **`AMAZON_APP_ID`** (e.g. `amzn1.sp.solution.5bbfb7da-4a1f-4ca0-bcf5-7bf10f30ec6d`). Do **not** use LWA Client ID there; Amazon requires the App ID. See [Website Authorization Workflow](https://developer-docs.amazon.com/sp-api/docs/website-authorization-workflow).
- Set `AMAZON_LWA_CLIENT_ID` = that same value, and `AMAZON_LWA_CLIENT_SECRET` = the secret from the **same** app (e.g. Developer Central “LWA credentials” popup for that app).
- **Do not mix** different apps: e.g. if the consent URL uses `...6753...`, do not use `...9d97...` from another Security Profile.
- Ensure the **redirect/return URL** `https://reimbursement.amzdudes.io/api/auth/amazon/callback` is configured for **that same app** (Developer Central or LWA Web Settings).
- If you ever expose the client secret (screenshot, paste): **Rotate secret** in Developer Central, then update `AMAZON_LWA_CLIENT_SECRET` on Render and redeploy.

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
- [ ] Amazon LWA **Allowed Return URLs**: `https://reimbursement.amzdudes.io/auth/amazon/callback` (popup flow; exact, no trailing slash).
- [ ] Render: `FRONTEND_ORIGIN` = `https://reimbursement.amzdudes.io`; `AMAZON_OAUTH_REDIRECT_URI` matches (optional).
- [ ] `return_url` in consent URL is fully encoded (`https%3A%2F%2F...`); the backend does this.
- [ ] Vercel: `VITE_API_BASE` = `/api`.
- [ ] Render: `CORS_ORIGINS` includes `https://reimbursement.amzdudes.io`.

---

## 10. Flow summary (popup)

1. User visits `https://reimbursement.amzdudes.io` (Vercel).
2. **Connect Amazon** → frontend calls `GET /api/auth/amazon/init` with `redirect_uri=.../auth/amazon/callback` → opens consent URL in a **new window** (popup).
3. User signs in and approves in the popup → Amazon redirects the **popup** to  
   `https://reimbursement.amzdudes.io/auth/amazon/callback?code=...&state=...&selling_partner_id=...`
4. Callback page (in popup) POSTs code to `POST /api/auth/amazon/callback`, then **postMessage** to opener, **closes popup**.
5. Manage Stores (opener) receives message, refreshes stores, runs `POST /api/sync` → data appears on dashboard.

All `/api` requests go through Vercel to Render; the browser only talks to `reimbursement.amzdudes.io`.
