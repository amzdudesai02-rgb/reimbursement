# Amazon Solution Provider Portal - Action Plan

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. Submit Business Information (CRITICAL - Red Banner)
**Status**: ⚠️ **REQUIRED** - This is blocking proper tax calculations

**Steps**:
1. Click the red **"Submit Business Information"** button in the Actions section
2. Fill out all required fields:
   - **Business Name**: Your legal business name
   - **Tax ID / EIN**: Your business tax identification number
   - **Business Address**: Complete business address
   - **Business Type**: LLC, Corporation, Sole Proprietorship, etc.
   - **Contact Information**: Primary contact details
3. Submit the form
4. **Wait for approval**: Usually 1-3 business days

**Why this matters**: Amazon needs this for tax compliance and to process your application properly.

---

## 2. Choose Your Production App

You have **3 apps** listed. You need to decide which one to use for production:

- **Reimbursement Tool** (Draft) - App ID: `amzn1.sp.solution.a409f89e-487d-457d-b2b2-2a533637c377`
- **Reimbursement** (Draft) - App ID: `amzn1.sp.solution.085ea9cf-77d8-4cd7-ae38-529a61307d20`
- **ReimbursementDashboard** (Sandbox) - App ID: `amzn1.sp.solution.d6071428-8215-4f01-a405-d90bc1e466de`

**Recommendation**: Use **"ReimbursementDashboard"** (Sandbox) since it's already in Sandbox status, OR choose one of the Draft apps and move it to Production.

---

## 3. Get Your LWA Credentials

**For Sandbox App (ReimbursementDashboard)**:
1. Click **"View sandbox credentials"** link in the table
2. Copy these values:
   - **Client ID** (LWA Client ID)
   - **Client Secret** (LWA Client Secret)
3. Save them securely - you'll add them to your `.env` file

**For Draft Apps**:
1. Click **"View"** link under LWA credentials
2. Copy the Client ID and Client Secret
3. Note: Draft apps may need to be moved to Sandbox/Production first

---

## 4. Move App to Production (If Using Draft App)

**Steps**:
1. Click **"Edit App"** dropdown button for your chosen app
2. Review and complete all required fields:
   - Application name
   - Description
   - Privacy Policy URL (must be publicly accessible)
   - Terms of Use URL (optional but recommended)
   - OAuth Login URI
   - OAuth Redirect URI
3. Submit for review
4. **Wait for approval**: Can take 1-7 business days

**Important URLs to set**:
- **OAuth Login URI**: `https://yourdomain.com/auth/amazon/login`
- **OAuth Redirect URI**: `https://yourdomain.com/api/auth/amazon/callback`
  - For local testing: `http://localhost:8000/api/auth/amazon/callback`

---

## 5. Request Required API Roles/Permissions

**Steps**:
1. Click **"Edit App"** for your chosen app
2. Navigate to **"Roles"** or **"Permissions"** section
3. Click **"Request roles"** or **"Add roles"**

**Required Roles for Reimbursement Tool**:

#### A. Finances API
- **Role**: `finances:read`
- **Justification**: "We need to read financial events and reimbursement transactions to track and report on seller reimbursements."

#### B. Reports API
- **Roles**: 
  - `reports:read` - Read reports
  - `reports:write` - Create reports (if submitting cases)
- **Justification**: "We need to access inventory adjustment reports, shipment detail reports, and fee preview reports to identify lost/damaged items and calculate reimbursements."

#### C. Notifications API (Optional but Recommended)
- **Role**: `notifications:read`
- **Justification**: "We need real-time notifications when new reimbursements are issued to provide immediate updates to sellers."

**Security Review Questions** (be prepared to answer):
- How will you use this data?
- Where is data stored? (AWS, Azure, GCP)
- Encryption at rest? (Yes, AES-256)
- Encryption in transit? (Yes, TLS 1.2+)
- Who can access the data? (Only authenticated sellers)
- How long do you keep data? (e.g., "As long as seller's account is active")

**Wait time**: 1-7 business days for approval

---

## 6. Get AWS IAM Role ARN

**Steps**:
1. In your app settings, look for **"AWS IAM Role ARN"** or **"IAM Role"**
2. Copy the ARN (format: `arn:aws:iam::123456789012:role/YourRoleName`)
3. Save this - you'll need it for API authentication

**If not visible**:
- Amazon may create this automatically after role approval
- Check your AWS Console → IAM → Roles for a role created by Amazon

---

## 7. Configure Your Backend Environment

Once you have all credentials, update your `backend/.env` file:

```env
# Amazon SP-API Credentials (from Solution Provider Portal)
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.xxxxxxxxxxxxx
AMAZON_LWA_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::123456789012:role/YourRoleName

# AWS Credentials (if you have separate AWS access keys)
AMAZON_AWS_ACCESS_KEY_ID=your-aws-access-key
AMAZON_AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AMAZON_AWS_REGION=us-east-1

# OAuth Redirect URI (must match what you set in Seller Central)
AMAZON_OAUTH_REDIRECT_URI=http://localhost:8000/api/auth/amazon/callback
# For production: https://yourdomain.com/api/auth/amazon/callback

# Marketplace IDs
AMAZON_MARKETPLACE_US=ATVPDKIKX0DER
```

---

## 8. Set Up Notification Preferences (Optional)

**Steps**:
1. Click **"Notification Preferences"** button in Featured Functions section
2. Or click **"Notification preferences"** link above the table
3. Configure which notifications you want to receive:
   - New reimbursement events
   - API usage alerts
   - Security alerts
4. Save preferences

---

## 9. Monitor API Usage

**Steps**:
1. Click **"Manage API Calls"** button in Featured Functions section
2. Review your API usage metrics
3. Set up alerts if needed (to avoid hitting rate limits)

---

## 10. Test Your Integration

Once everything is configured:

1. **Test OAuth Flow**:
   - Start your backend server
   - Navigate to: `GET /api/auth/amazon/init`
   - This will redirect to Amazon's authorization page
   - Authorize your app
   - You should be redirected back with tokens

2. **Verify Connection**:
   - Check `GET /api/stores` endpoint
   - Your store should appear in the list

3. **Test API Calls**:
   - Try fetching financial events
   - Test report generation

---

## 📋 Checklist

- [ ] Submit business information (CRITICAL)
- [ ] Choose which app to use for production
- [ ] Get LWA Client ID and Client Secret
- [ ] Get AWS IAM Role ARN
- [ ] Complete app configuration (OAuth URIs, privacy policy, etc.)
- [ ] Request required API roles (Finances, Reports, Notifications)
- [ ] Wait for role approvals (1-7 days)
- [ ] Add credentials to `backend/.env` file
- [ ] Set up notification preferences
- [ ] Test OAuth flow
- [ ] Test API integration

---

## ⚠️ Important Notes

1. **Business Information**: This is blocking - submit it ASAP
2. **Sandbox vs Production**: 
   - Sandbox apps can be used for testing
   - Production apps require full security review
3. **Privacy Policy**: Must be publicly accessible HTTPS URL
4. **OAuth URIs**: Must match exactly (including http vs https, trailing slashes)
5. **Role Approvals**: Can take time - be patient and respond to Amazon's questions promptly
6. **Security**: Never commit credentials to Git - always use `.env` files

---

## 🆘 Need Help?

- **Amazon Support**: https://sellercentral.amazon.com/help/contact-us
- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **Developer Forums**: https://sellercentral.amazon.com/forums

---

**Last Updated**: [Current Date]
**Status**: Action items for Solution Provider Portal setup

