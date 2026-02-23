# ✅ Amazon SP-API App Approval Checklist

**App Name:** ReimbursementDash  
**App ID:** `amzn1.sp.solution.5bbfb7da-4a1f-4ca0-bcf5-7bf10f30ec6d`  
**Status:** Submitted (Waiting for Review)

---

## 🔍 Pre-Approval Review

### ✅ 1. OAuth Configuration

**Required Settings:**
- [x] OAuth Login URI configured
- [x] OAuth Redirect URI configured
- [ ] **VERIFY**: OAuth Redirect URI matches exactly between Amazon Portal and Render

**Your OAuth Redirect URI should be:**
```
https://reimbursement.amzdudes.io/api/auth/amazon/callback
```

**Check in Amazon Portal:**
1. Go to Solution Provider Portal → ReimbursementDash → Edit App
2. Find "OAuth Redirect URI" field
3. Verify it matches: `https://reimbursement.amzdudes.io/api/auth/amazon/callback`

**Check in Backend Code:**
- ✅ Backend endpoint: `/api/auth/amazon/callback` (matches)
- ✅ Backend init endpoint: `/api/auth/amazon/init` (correct)

**Action Needed:**
- [ ] Verify OAuth Redirect URI in Amazon Portal matches production URL
- [ ] Set `AMAZON_OAUTH_REDIRECT_URI` in Render environment variables

---

### ✅ 2. Privacy Policy & Security Pages

**Privacy Policy:**
- ✅ URL: `https://reimbursement.amzdudes.io/privacy-policy`
- ✅ Page exists and is accessible
- ✅ Contains all required Amazon sections:
  - Data collection details
  - Data usage explanation
  - Storage and encryption practices
  - Retention and deletion policy
  - Contact information

**Security Page:**
- ✅ URL: `https://reimbursement.amzdudes.io/security`
- ✅ Page exists and is accessible
- ✅ Covers security practices

**Action Needed:**
- [ ] Test both URLs are publicly accessible (no login required)
- [ ] Verify URLs are correctly set in Amazon Portal

---

### ✅ 3. API Roles/Permissions

**Required Roles for Reimbursement Tool:**

#### Minimum Required (Must Have):
1. **Finances API** - `finances:read`
   - Purpose: Read reimbursement transactions and financial events
   - Status: ⏳ Check if requested
   
2. **Reports API** - `reports:read` (and optionally `reports:write`)
   - Purpose: Access inventory adjustment reports, shipment details
   - Status: ⏳ Check if requested

#### Recommended:
3. **Notifications API** - `notifications:read`
   - Purpose: Real-time notifications when reimbursements are issued
   - Status: ⏳ Check if requested

4. **Feeds API** - `feeds:write` (optional)
   - Purpose: Submit reimbursement cases programmatically
   - Status: ⏳ Check if requested

**Action Needed:**
- [ ] Verify all required roles are requested in Amazon Portal
- [ ] Check email for any questions from Amazon about role justifications
- [ ] Respond promptly to any Amazon inquiries

---

### ✅ 4. LWA Credentials

**You Have These:**
- ✅ Client ID: `amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8`
- ✅ Client Secret: `amzn1.oa2-cs.v1.cd4caffe71f75cd208ca666142e1801af3f53a0b012af8b61527c98d38`

**Action Needed:**
- [ ] Add to Render environment variables:
  - `AMAZON_APP_ID` (App ID for consent URL, e.g. `amzn1.sp.solution.5bbfb7da-4a1f-4ca0-bcf5-7bf10f30ec6d` – do not use LWA Client ID in consent URL)
  - `AMAZON_LWA_CLIENT_ID`
  - `AMAZON_LWA_CLIENT_SECRET`

---

### ✅ 5. AWS IAM Configuration

**You Have:**
- ✅ IAM Role ARN: `arn:aws:iam::308855860756:role/sp-api-role`
- ✅ IAM User: `spapi-backend-user`
- ⚠️ **Need to verify**: AWS Access Keys

**Action Needed:**
- [ ] Verify AWS Access Keys are created and saved:
  - `AMAZON_AWS_ACCESS_KEY_ID`
  - `AMAZON_AWS_SECRET_ACCESS_KEY`
- [ ] Add to Render environment variables:
  - `AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::308855860756:role/sp-api-role`
  - `AMAZON_AWS_REGION=us-east-1`
  - `AMAZON_AWS_ACCESS_KEY_ID`
  - `AMAZON_AWS_SECRET_ACCESS_KEY`

**Important:** The AWS Access Keys need permission to assume the IAM role via STS.

---

### ✅ 6. Backend Deployment Readiness

**Code Status:**
- ✅ OAuth endpoints implemented (`/api/auth/amazon/init` and `/api/auth/amazon/callback`)
- ✅ SP-API client with token exchange and AWS STS role assumption
- ✅ Database models for stores and Amazon connections
- ✅ User authentication and authorization

**Deployment Checklist:**
- [ ] Backend deployed to Render
- [ ] All environment variables set in Render
- [ ] Database connection working
- [ ] CORS configured for `https://reimbursement.amzdudes.io`

**Required Environment Variables for Render:**
```env
# Amazon SP-API (App ID for consent URL; LWA for token exchange)
AMAZON_APP_ID=amzn1.sp.solution.5bbfb7da-4a1f-4ca0-bcf5-7bf10f30ec6d
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8
AMAZON_LWA_CLIENT_SECRET=amzn1.oa2-cs.v1.cd4caffe71f75cd208ca666142e1801af3f53a0b012af8b61527c98d38
AMAZON_OAUTH_REDIRECT_URI=https://reimbursement.amzdudes.io/api/auth/amazon/callback

# AWS IAM
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::308855860756:role/sp-api-role
AMAZON_AWS_ACCESS_KEY_ID=<your-access-key>
AMAZON_AWS_SECRET_ACCESS_KEY=<your-secret-key>
AMAZON_AWS_REGION=us-east-1

# Database
DATABASE_URL=<your-neon-postgres-url>

# JWT & Security
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_MINUTES=60

# CORS & Frontend
CORS_ORIGINS=https://reimbursement.amzdudes.io
FRONTEND_BASE_URL=https://reimbursement.amzdudes.io

# Email (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=<your-email>
SMTP_PASSWORD=<your-app-password>
SMTP_FROM=AMZDUDES <support@amzdudes.io>
SMTP_TLS=true
```

---

### ✅ 7. Business Information

**Status:** ⏳ Check if submitted

Amazon requires business information to be submitted before API roles can be approved.

**Action Needed:**
- [ ] Verify business information is submitted in Amazon Portal
- [ ] Check for any red banners or incomplete sections

---

## 🚨 Critical Issues to Fix Before Approval

### Issue 1: OAuth Redirect URI Match
**Priority:** 🔴 CRITICAL

**Problem:** The OAuth Redirect URI in Amazon Portal must match exactly with your Render environment variable.

**Solution:**
1. Verify in Amazon Portal: OAuth Redirect URI = `https://reimbursement.amzdudes.io/api/auth/amazon/callback`
2. Set in Render: `AMAZON_OAUTH_REDIRECT_URI=https://reimbursement.amzdudes.io/api/auth/amazon/callback`
3. Must match exactly (case-sensitive, no trailing slash)

### Issue 2: AWS Access Keys for STS
**Priority:** 🔴 CRITICAL

**Problem:** Your backend needs AWS access keys to assume the IAM role via STS.

**Solution:**
1. Go to AWS Console → IAM → Users → `spapi-backend-user`
2. Security credentials → Create access key
3. Save both keys securely
4. Add to Render environment variables

### Issue 3: API Roles Request Status
**Priority:** 🟡 HIGH

**Problem:** Verify all required API roles are requested.

**Solution:**
1. Check Amazon Portal → ReimbursementDash → Roles/Permissions section
2. Verify these are requested:
   - `finances:read`
   - `reports:read`
   - `reports:write` (optional)
   - `notifications:read` (recommended)
3. Check email for Amazon's questions about role justifications

---

## 📋 Testing Checklist (After Deployment)

Once your app is approved and backend is deployed:

- [ ] Test OAuth flow:
  1. User logs into your app
  2. Clicks "Connect Amazon Account"
  3. Redirected to Amazon authorization page
  4. Grants permissions
  5. Redirected back to your callback URL
  6. Store connection saved successfully

- [ ] Test API calls:
  1. After OAuth connection, try fetching financial events
  2. Verify reimbursements are retrieved
  3. Check for any API errors in logs

- [ ] Verify data security:
  1. Check that tokens are stored securely
  2. Verify refresh token rotation works
  3. Test reconnection if token expires

---

## 📞 Support & Contact

**Amazon SP-API Support:**
- Seller Central: https://sellercentral.amazon.com/apps/develop/home
- SP-API Documentation: https://developer-docs.amazon.com/sp-api/

**Your Contact Info:**
- Support Email: support@amzdudes.io
- Domain: reimbursement.amzdudes.io

---

## ✅ Next Steps (Priority Order)

1. **IMMEDIATE:**
   - [ ] Verify OAuth Redirect URI matches in Amazon Portal and Render
   - [ ] Verify AWS Access Keys are created and saved
   - [ ] Verify API roles are requested in Amazon Portal

2. **BEFORE APPROVAL:**
   - [ ] Ensure Privacy Policy and Security pages are publicly accessible
   - [ ] Verify business information is submitted
   - [ ] Respond to any Amazon questions about role justifications

3. **AFTER APPROVAL:**
   - [ ] Deploy backend to Render (if not already done)
   - [ ] Set all environment variables in Render
   - [ ] Test OAuth flow end-to-end
   - [ ] Test API integration

---

**Last Updated:** After app submission  
**Status:** Waiting for Amazon Review (1-7 business days expected)

