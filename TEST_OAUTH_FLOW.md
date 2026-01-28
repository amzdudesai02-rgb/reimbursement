# How to Test Amazon OAuth Flow

## Complete Testing Guide

---

## **Prerequisites**

Before testing, make sure:
- [ ] Backend is deployed to Render (or running locally)
- [ ] All environment variables are set correctly in Render
- [ ] You have a user account in your system (signup/login works)
- [ ] You're logged into your application with a valid JWT token
- [ ] Amazon app is configured with correct OAuth redirect URI

### **Connect Amazon button (UI flow)**

The in-app **Connect Amazon** button (Manage Stores) sends users to Amazon and back to a **frontend** callback URL. Set:

- **Backend env** `AMAZON_OAUTH_REDIRECT_URI` to the **frontend** URL:
  - Production: `https://reimbursement.amzdudes.io/auth/amazon/callback`
  - Local: `http://localhost:5173/auth/amazon/callback`
- **Amazon Seller Central** → Your app → OAuth configuration: add the **same** URL as the redirect URI.

The frontend page at `/auth/amazon/callback` receives the code and POSTs it to the backend.

---

## **Method 1: Test via API (Using Postman/curl)**

### Step 1: Login to Get JWT Token

First, you need to authenticate and get a JWT token:

```bash
# Login
curl -X POST "https://api.reimbursement.amzdudes.io/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Save the `access_token` for next steps!**

---

### Step 2: Initialize OAuth Flow

Get the authorization URL:

```bash
curl -X GET "https://api.reimbursement.amzdudes.io/api/auth/amazon/init" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response:**
```json
{
  "authorization_url": "https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8&version=beta&return_url=https://reimbursement.amzdudes.io/api/auth/amazon/callback&state=random_state_string",
  "state": "random_state_string"
}
```

**Save both `authorization_url` and `state`!**

---

### Step 3: Authorize on Amazon

1. **Copy the `authorization_url`** from the response
2. **Open it in a browser** (you must be logged into Seller Central)
3. **You'll see Amazon's authorization page** asking you to authorize the app
4. **Click "Authorize"** or "Confirm"

**Important**: You must be logged into Seller Central with a seller account that has access to the marketplace.

---

### Step 4: Handle the Callback

After authorization, Amazon will redirect to your callback URL with query parameters. However, your backend expects a POST request, so you need to handle this.

**What happens:**
- Amazon redirects to: `https://reimbursement.amzdudes.io/api/auth/amazon/callback?spapi_oauth_code=XXX&selling_partner_id=YYY&state=ZZZ`
- Your backend expects: POST with JSON body

**You have two options:**

#### Option A: Create a Frontend Page to Handle Redirect

Create a simple HTML page that:
1. Receives the GET request from Amazon with query params
2. Extracts the parameters
3. POSTs them to your backend
4. Shows success/error message

#### Option B: Manual Test (Extract Code from URL)

After Amazon redirects, the URL will look like:
```
https://reimbursement.amzdudes.io/api/auth/amazon/callback?spapi_oauth_code=AUTHORIZATION_CODE&selling_partner_id=SELLING_PARTNER_ID&state=STATE_VALUE
```

**Extract the values from the URL**, then POST to your backend:

```bash
curl -X POST "https://api.reimbursement.amzdudes.io/api/auth/amazon/callback" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "spapi_oauth_code": "AUTHORIZATION_CODE_FROM_URL",
    "selling_partner_id": "SELLING_PARTNER_ID_FROM_URL",
    "state": "STATE_VALUE_FROM_URL"
  }'
```

**Expected Response (Success):**
```json
{
  "store_id": 1,
  "store_name": "Amazon Store 12345678",
  "message": "Amazon store connected successfully!"
}
```

---

## **Method 2: Test via Frontend (Recommended)**

If you have a frontend, create a "Connect Amazon Store" flow:

### Frontend Flow:

1. **User clicks "Connect Amazon Store" button**
2. **Frontend calls**: `GET /api/auth/amazon/init` (with JWT token)
3. **Frontend receives**: `authorization_url` and `state`
4. **Frontend redirects user to**: `authorization_url`
5. **User authorizes on Amazon**
6. **Amazon redirects back to**: Your callback page (e.g., `/auth/callback?spapi_oauth_code=XXX&selling_partner_id=YYY&state=ZZZ`)
7. **Your callback page**:
   - Extracts `spapi_oauth_code`, `selling_partner_id`, `state` from URL params
   - POSTs to `/api/auth/amazon/callback` with these values
   - Shows success message and redirects to dashboard

### Example Frontend Callback Handler (React/TypeScript):

```typescript
// In your callback page component
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('spapi_oauth_code');
  const sellingPartnerId = urlParams.get('selling_partner_id');
  const state = urlParams.get('state');
  
  if (code && sellingPartnerId && state) {
    // POST to your backend
    fetch('/api/auth/amazon/callback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        spapi_oauth_code: code,
        selling_partner_id: sellingPartnerId,
        state: state
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Store connected:', data);
      // Redirect to dashboard or show success
    })
    .catch(err => {
      console.error('Error:', err);
      // Show error message
    });
  }
}, []);
```

---

## **Method 3: Test Locally (Development)**

For local testing:

1. **Update environment variable**:
   ```env
   AMAZON_OAUTH_REDIRECT_URI=http://localhost:8000/api/auth/amazon/callback
   ```

2. **Add this redirect URI to Amazon Seller Central**:
   - Go to Solution Provider Portal → Your App → Edit
   - Add: `http://localhost:8000/api/auth/amazon/callback`
   - Save

3. **Run backend locally**:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Follow Method 1 or 2 above**, but use `http://localhost:8000` instead of production URL

---

## **Verification Steps**

After successful OAuth flow:

### 1. Check Database

Verify the store and connection were created:

```bash
# List stores (should show your connected store)
curl -X GET "https://api.reimbursement.amzdudes.io/api/stores" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "store_name": "Amazon Store 12345678",
    "region": "US",
    "marketplace_id": "ATVPDKIKX0DER",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### 2. Check Logs

Check Render logs for any errors:
- Render Dashboard → Your Service → Logs
- Look for successful token exchange messages
- Watch for any error messages

### 3. Test API Calls (After Roles Approved)

Once roles are approved, test fetching data:

```bash
# This will only work after roles are approved
# You'll need to implement an endpoint to fetch financial events
```

---

## **Common Issues & Solutions**

### Issue 1: "Invalid redirect URI"
**Problem**: Redirect URI doesn't match what's in Seller Central  
**Solution**: Ensure `AMAZON_OAUTH_REDIRECT_URI` in Render matches exactly what's in Seller Central (including `https://`, no trailing slash)

### Issue 2: "Invalid authorization code"
**Problem**: Authorization code expired or already used  
**Solution**: Start the OAuth flow again (codes expire quickly)

### Issue 3: "Access Denied" on Authorization Page
**Problem**: Your app doesn't have the required roles approved yet  
**Solution**: This is normal - OAuth will still work, but API calls will fail until roles are approved

### Issue 4: Callback receives GET but backend expects POST
**Problem**: Amazon redirects with GET, but your endpoint expects POST  
**Solution**: Create a frontend callback page that converts GET params to POST request (see Method 2 above)

### Issue 5: "User not authenticated"
**Problem**: JWT token missing or invalid  
**Solution**: Make sure you're logged in and passing the `Authorization: Bearer TOKEN` header

---

## **Expected Flow Diagram**

```
1. User clicks "Connect Amazon Store"
   ↓
2. Frontend → GET /api/auth/amazon/init
   ↓
3. Backend → Returns authorization_url + state
   ↓
4. Frontend → Redirects user to authorization_url
   ↓
5. User authorizes on Amazon Seller Central
   ↓
6. Amazon → Redirects to callback URL with code, selling_partner_id, state
   ↓
7. Frontend callback page → Extracts params from URL
   ↓
8. Frontend → POST /api/auth/amazon/callback with params
   ↓
9. Backend → Exchanges code for refresh_token
   ↓
10. Backend → Saves tokens to database
   ↓
11. Backend → Returns success response
   ↓
12. Frontend → Shows success, redirects to dashboard
```

---

## **Quick Test Checklist**

- [ ] Backend deployed and running
- [ ] Can login and get JWT token
- [ ] Can call `/api/auth/amazon/init` successfully
- [ ] Authorization URL opens Amazon consent page
- [ ] Can authorize on Amazon
- [ ] Amazon redirects back to callback URL
- [ ] Callback endpoint receives and processes the code
- [ ] Store appears in `/api/stores` endpoint
- [ ] No errors in logs

---

**Last Updated**: Complete OAuth testing guide
**Status**: Ready to test

