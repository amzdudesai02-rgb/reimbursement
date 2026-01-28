# Connect Amazon – What Should Happen & Why “Nothing Shows”

## How it’s supposed to work (SP-API OAuth)

Amazon does **not** allow scraping Seller Central or auto-closing their tab. Data and “Connected” status come only through **OAuth + SP-API**.

### Correct flow

1. **User clicks “Connect Amazon”**  
   Your app sends them to the **OAuth consent URL**, e.g.  
   `https://sellercentral.amazon.com/apps/authorize/consent?application_id=YOUR_APP_ID&state=XXX&version=beta&return_url=https://reimbursement.amzdudes.io/auth/amazon/callback`

2. **User sees the consent page**  
   They must see an **“Allow / Authorize this app”** screen, **not** the normal Seller Central dashboard.  
   If they only see the normal Seller Central home/dashboard, they are not in the OAuth flow.

3. **User approves**  
   They click “Confirm” / “Authorize” on that consent page.

4. **Amazon redirects to your app**  
   The browser is sent to your **redirect URL** with `state`, `selling_partner_id`, `spapi_oauth_code` in the query.  
   Example:  
   `https://reimbursement.amzdudes.io/auth/amazon/callback?state=...&selling_partner_id=...&spapi_oauth_code=...`

5. **Your app shows “Amazon Connected”**  
   Your callback page exchanges the code with your backend, then shows “Amazon Connected Successfully” and sends the user to Manage Stores. Data is loaded later via SP-API (Reports, Finances, Inbound), not from the Seller Central UI.

### Why you see “nothing,” blank Seller Central, tab not closing, “not connected”

- **“This screen appears” (blank Seller Central)**  
  The user ends up on the normal Seller Central dashboard instead of your callback URL. So:
  - They never reached the **consent URL** (e.g. they opened Seller Central manually), or
  - They did approve, but Amazon is **not** redirecting to your app (wrong or missing redirect/return URL in app registration).

- **Tab not closing**  
  The tab closes only if:
  - You use a **popup** for the consent URL, and
  - After approval, Amazon sends that **same popup** to your callback URL.  
  If Amazon sends them to Seller Central or another URL, that tab will not be your callback and will not close.  
  Using **same-tab redirect** avoids this: one tab, your app → consent → back to your app.

- **“Amazon not showing as connected”**  
  “Connected” is set only when your **callback** runs and your backend saves the refresh token. If the user never hits your callback URL (see above), the backend never gets the code and never stores the connection.

## What to do next

### 1. Use same-tab redirect (recommended)

Use **one tab** for the whole flow:

- “Connect Amazon” → navigate the **current tab** to the consent URL (no popup).
- User approves → Amazon redirects the **same tab** to `https://reimbursement.amzdudes.io/auth/amazon/callback?...`.
- Your callback page shows “Amazon Connected Successfully” and redirects to Manage Stores.

No popup, no tab to close; easier and more reliable.

### 2. Match redirect/return URL exactly

In **Seller Central / Developer Central** (or Solution Provider Portal), under your app:

- **Redirect URI** (and/or **return_url** if you use it in the consent URL) must be **exactly**:  
  `https://reimbursement.amzdudes.io/auth/amazon/callback`  
  Same scheme, host, path, no trailing slash (unless you use it in code).
- The **redirect_uri** (or **return_url**) you send in the consent URL from your app must be **identical** to this.

If your app is set up for the **Website authorization workflow** (with a **Log-in URI**):

- Amazon sends the user to your **Log-in URI** first (with `amazon_callback_uri`, `amazon_state`, `selling_partner_id`).
- That page must then redirect the user to the **Amazon callback URI** (from `amazon_callback_uri`) with at least:  
  `redirect_uri`, `amazon_state`, `state`.
- Only after that will Amazon send the user to your **Redirect URI** with `spapi_oauth_code`.

So you either:

- Use an app configuration that allows **direct** redirect to your Redirect URI (e.g. via `return_url` on the consent URL), and ensure that URL is registered and used exactly, or  
- Implement the full Website flow with a Log-in URI that does the redirect to `amazon_callback_uri` and then receives the final redirect on your Redirect URI.

### 3. Confirm the consent URL

When the user clicks “Connect Amazon,” the address bar should look like:

`https://sellercentral.amazon.com/apps/authorize/consent?application_id=...&state=...&return_url=...`

and they must see an **“Authorize / Allow this app”** screen. If they see the normal “Manage inventory / Orders” dashboard, they are not in the OAuth consent flow.

### 4. After it works

Once the user is correctly sent to  
`https://reimbursement.amzdudes.io/auth/amazon/callback?state=...&selling_partner_id=...&spapi_oauth_code=...`:

- Your backend exchanges `spapi_oauth_code` for a refresh token and stores it.
- Your app shows “Amazon Connected” and can run **Refresh data / Sync** to pull Reimbursement (Reports + Finances) and Shipping Queue via SP-API.

No data comes from the Seller Central UI; it all comes from SP-API after a successful OAuth callback.
