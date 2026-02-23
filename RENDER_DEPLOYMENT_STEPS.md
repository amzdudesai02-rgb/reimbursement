# Render Backend Deployment - Next Steps

## 🎯 Complete Amazon SP-API Setup Before Deployment

Before deploying to Render, complete these Amazon SP-API steps:

---

## **STEP 1: Request Required API Roles** ⚠️ CRITICAL

Your app is still in "Draft" but you can request roles now:

### 1.1 Navigate to Your App
1. Go to Solution Provider Portal → Your app "ReimbursementDash"
2. Click **"Edit App"** or **"View"**
3. Find the **"Roles"** or **"Permissions"** section

### 1.2 Request These Roles (Minimum Required):

#### **A. Finance and Accounting** (MUST HAVE)
- **Role**: `finances:read`
- **Justification**: 
  ```
  We need to read financial events and reimbursement transactions to track 
  and report on seller reimbursements. We will display this data in a 
  dashboard so sellers can see all their reimbursements in one place.
  ```

#### **B. Inventory and Order Tracking** (MUST HAVE)
- **Roles**: 
  - `reports:read` - Read reports
  - `reports:write` - Create reports (optional but recommended)
- **Justification**: 
  ```
  We need to access inventory adjustment reports, shipment detail reports, 
  and fee preview reports to identify lost/damaged items and calculate 
  reimbursements. We will match this data with financial events to show 
  sellers what they're owed.
  ```

### 1.3 Submit and Wait
- ⏰ **Wait time**: 1-7 business days for approval
- Amazon may email you with questions - respond promptly

---

## **STEP 2: Get AWS IAM Role ARN**

After role approval (or sometimes immediately):

1. In your app settings, look for **"AWS IAM Role ARN"** or **"IAM Role"**
2. Copy the ARN (format: `arn:aws:iam::123456789012:role/YourRoleName`)
3. **Save this** - you'll need it for Render environment variables

**If not visible:**
- Amazon may create this automatically after role approval
- Check AWS Console → IAM → Roles for a role created by Amazon

---

## **STEP 3: Set Environment Variables in Render**

Once you deploy to Render, add these environment variables in **Render Dashboard → Your Service → Environment**:

### **Amazon SP-API Credentials** (You have these now ✅)

```env
# Amazon App ID (for consent URL – required; use App ID, not LWA Client ID)
AMAZON_APP_ID=amzn1.sp.solution.5bbfb7da-4a1f-4ca0-bcf5-7bf10f30ec6d

# Amazon LWA Credentials (from LWA credentials modal – for token exchange)
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8
AMAZON_LWA_CLIENT_SECRET=amzn1.oa2-cs.v1.cd4caffe71f75cd208ca666142e1801af3f53a0b012af8b61527c98d38

# OAuth Redirect URI (PRODUCTION - must match Seller Central)
AMAZON_OAUTH_REDIRECT_URI=https://reimbursement.amzdudes.io/api/auth/amazon/callback

# AWS IAM Role ARN (Get this after role approval - leave empty for now)
AMAZON_AWS_IAM_ROLE_ARN=

# AWS Region (default)
AMAZON_AWS_REGION=us-east-1
```

### **AWS Credentials for STS AssumeRole**

You'll need AWS access keys with permission to assume the IAM role:

```env
# AWS Credentials (for assuming IAM role via STS)
# Create these in AWS Console → IAM → Users → Your User → Security Credentials
AMAZON_AWS_ACCESS_KEY_ID=your-aws-access-key-id
AMAZON_AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

**How to get AWS credentials:**
1. Log into AWS Console: https://console.aws.amazon.com
2. Go to **IAM** → **Users** → Select your user (or create one)
3. Go to **Security credentials** tab
4. Click **"Create access key"**
5. Choose **"Application running outside AWS"**
6. Copy both Access Key ID and Secret Access Key

### **Database Configuration**

```env
# Database URL (from your Neon/PostgreSQL provider)
DATABASE_URL=postgresql+psycopg://user:password@host:port/database?sslmode=require
```

### **JWT & Security**

```env
# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_MINUTES=60
```

### **CORS & Frontend**

```env
# CORS Origins (comma-separated, no spaces)
CORS_ORIGINS=https://reimbursement.amzdudes.io

# Frontend Base URL (for email verification links)
FRONTEND_BASE_URL=https://reimbursement.amzdudes.io
```

### **SMTP/Email Configuration**

```env
# SMTP Settings (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=AMZDUDES <support@amzdudes.io>
SMTP_TLS=true

# OR use Resend (alternative)
# RESEND_API_KEY=re_xxxxxxxxxxxxx
# RESEND_FROM=AMZDUDES <support@amzdudes.io>
```

---

## **STEP 4: Deploy to Render**

### 4.1 Create Render Web Service

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `amzdudes-backend` (or your preference)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (if your backend code is in a `backend/` folder)
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Environment**: `Python 3`

### 4.2 Add Environment Variables

1. In your Render service, go to **"Environment"** tab
2. Add **ALL** the environment variables from Step 3 above
3. Click **"Save Changes"**
4. Render will automatically redeploy

---

## **STEP 5: Verify OAuth Redirect URI Match**

⚠️ **CRITICAL**: The OAuth Redirect URI in Amazon Seller Central **MUST** match exactly what you set in Render:

**In Amazon Seller Central (Solution Provider Portal):**
- OAuth Redirect URI: `https://reimbursement.amzdudes.io/api/auth/amazon/callback`

**In Render Environment Variables:**
- `AMAZON_OAUTH_REDIRECT_URI=https://reimbursement.amzdudes.io/api/auth/amazon/callback`

**Must match exactly** (including `https://`, no trailing slash, case-sensitive)

---

## **STEP 6: Test After Deployment**

Once deployed and roles are approved:

### 6.1 Test OAuth Flow
1. Start your backend (should be running on Render)
2. From your frontend, initiate Amazon OAuth connection
3. User should be redirected to Amazon authorization page
4. After authorization, should redirect back to your callback URL
5. Check logs in Render for any errors

### 6.2 Test API Calls
1. Once a seller connects their Amazon account
2. Try fetching financial events via your API
3. Verify reimbursements are being retrieved correctly

---

## **📋 Checklist Before Going Live**

- [ ] ✅ LWA Client ID and Secret saved (you have these)
- [ ] ⏳ Request API roles (Finance, Reports) - **DO THIS NOW**
- [ ] ⏳ Wait for role approval (1-7 days)
- [ ] ⏳ Get AWS IAM Role ARN (after approval)
- [ ] ⏳ Create AWS Access Keys
- [ ] ⏳ Deploy backend to Render
- [ ] ⏳ Add all environment variables to Render
- [ ] ⏳ Verify OAuth Redirect URI matches exactly
- [ ] ⏳ Test OAuth flow
- [ ] ⏳ Test API integration

---

## **🚨 Important Notes**

1. **AWS IAM Role ARN**: You'll get this after requesting and getting roles approved. You can deploy to Render without it first, but you won't be able to make API calls until you add it.

2. **AWS Access Keys**: You need these to assume the IAM role. The backend uses boto3 STS to assume the role, which requires AWS credentials.

3. **Role Approvals**: Can take 1-7 business days. You can deploy your backend while waiting, but API calls will fail until roles are approved.

4. **OAuth Redirect URI**: Must match exactly between Amazon Seller Central and your environment variable. Test this carefully.

5. **Security**: Never commit secrets to Git. Always use Render's environment variables.

---

## **🆘 Troubleshooting**

### "Invalid redirect URI" error
- Check that `AMAZON_OAUTH_REDIRECT_URI` in Render matches exactly what's in Seller Central
- No trailing slashes, exact case, must be HTTPS in production

### "Role not approved" error
- Check email for Amazon's questions
- Verify you requested the roles in Solution Provider Portal
- Wait for approval (1-7 days)

### "Cannot assume IAM role" error
- Verify `AMAZON_AWS_IAM_ROLE_ARN` is correct
- Verify AWS access keys have permission to assume the role
- Check AWS Console → IAM → Roles → Your Role → Trust relationships

---

**Last Updated**: After receiving LWA credentials
**Next Action**: Request API roles in Solution Provider Portal

