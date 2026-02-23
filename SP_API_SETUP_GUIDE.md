# Amazon SP-API Setup Guide

## Step-by-Step Instructions After Creating Seller Central Account

---

## **STEP 1: Register as an SP-API Developer**

### 1.1 Access Developer Central
1. Log into your **Seller Central account**: https://sellercentral.amazon.com
2. Navigate to **Apps & Services** → **Develop Apps**
   - This is the correct path for SP-API Developer Central
   - ⚠️ **Note**: Do NOT use `developer.amazon.com` - that's for Alexa/Appstore apps, not SP-API
3. Click **"Proceed to Developer Profile"** or **"Register as a Developer"** (if you haven't already)

### 1.2 Complete Developer Profile
Fill out the required information:
- **Company Information**:
  - Company name
  - Business address
  - Tax ID / EIN
  - Business type (LLC, Corporation, etc.)
- **Contact Information**:
  - Primary contact name
  - Email address
  - Phone number
- **Security Questionnaire**:
  - How you store customer data
  - Encryption methods used
  - Access control policies
  - Data retention policies
- **Privacy Policy URL**: 
  - Must be publicly accessible
  - Must describe how you handle seller data
- **Terms of Service URL** (optional but recommended)

### 1.3 Submit and Wait for Approval
- Review all information carefully
- Submit the application
- **Wait time**: Usually 1-3 business days
- You'll receive an email when approved

---

## **STEP 2: Create Your SP-API Application**

### 2.1 Create New Application
1. In **Seller Central** → **Apps & Services** → **Develop Apps**, click **"Add new app client"**
2. Select **SP-API** as the API type
3. Fill in the application details:

**Application Information:**
- **Application Name**: e.g., "Amazon Reimbursement Tool"
- **Application Description**: Brief description of your app's purpose
- **Privacy Policy URL**: Same URL from Step 1.2
- **Terms of Use URL**: (if you have one)

**OAuth Configuration:**
- **OAuth Login URI**: 
  ```
  https://yourdomain.com/auth/amazon/login
  ```
  (This is where users will see your app's login page)

- **OAuth Redirect URI**: 
  ```
  https://yourdomain.com/api/auth/amazon/callback
  ```
  (This is your backend endpoint that receives the authorization code)

**Important Notes:**
- Use HTTPS URLs (required for production)
- For local development, you can use `http://localhost:8000/api/auth/amazon/callback`
- You can add multiple redirect URIs later

### 2.2 Save and Get Credentials
After saving, Amazon will provide:

1. **LWA (Login with Amazon) Credentials**:
   - **Client ID**: `amzn1.application-oa2-client.xxxxxxxxxxxxx`
   - **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **SAVE THESE SECURELY** - You'll need them for OAuth flow

2. **AWS IAM Role ARN**:
   - Format: `arn:aws:iam::123456789012:role/YourRoleName`
   - This is used to sign SP-API requests
   - ⚠️ **SAVE THIS** - Required for API authentication

---

## **STEP 3: Request Required API Roles/Permissions**

### 3.1 Navigate to Roles & Permissions
1. In your application settings (after creating the app), you'll see **"Roles"** or **"Permissions"** section
2. Click **"Request roles"** or **"Add roles"** to request the required API access

### 3.2 Request Each Required Role

For a reimbursement tool, you'll need:

#### **A. Finances API**
- **Purpose**: Access reimbursement data, transactions, financial events
- **What to request**:
  - `finances:read` - Read financial events
- **Justification**: "We need to read reimbursement transactions to track and report on seller reimbursements."

#### **B. Reports API**
- **Purpose**: Get inventory adjustments, shipment details, fee previews
- **What to request**:
  - `reports:read` - Read reports
  - `reports:write` - Create reports (if submitting cases)
- **Justification**: "We need to access inventory adjustment reports, shipment detail reports, and fee preview reports to identify lost/damaged items and calculate reimbursements."

#### **C. Feeds API** (Optional - if submitting cases programmatically)
- **Purpose**: Submit case documents, create cases
- **What to request**:
  - `feeds:write` - Submit feeds
- **Justification**: "We need to submit case documents and create reimbursement cases on behalf of sellers."

#### **D. Notifications API** (Optional - for real-time updates)
- **Purpose**: Receive push notifications for new reimbursements
- **What to request**:
  - `notifications:read` - Read notifications
- **Justification**: "We need real-time notifications when new reimbursements are issued to provide immediate updates to sellers."

### 3.3 Complete Security Review Forms
For each role request, Amazon may ask:

1. **Data Usage Description**:
   - How will you use this data?
   - What processing will you perform?
   - Example: "We will read financial events to identify reimbursements, match them with inventory adjustments, and display them in a dashboard for sellers to track their recovery."

2. **Data Storage**:
   - Where is data stored? (AWS, Azure, GCP, etc.)
   - Encryption at rest? (Yes, AES-256)
   - Encryption in transit? (Yes, TLS 1.2+)

3. **Access Controls**:
   - Who can access the data? (Only authenticated sellers who own the data)
   - How is access controlled? (JWT tokens, role-based access control)

4. **Data Retention**:
   - How long do you keep data? (e.g., "As long as the seller's account is active, or 7 years for compliance")
   - How is data deleted? (Automated deletion after retention period)

5. **Security Diagrams** (may be required):
   - Network architecture diagram
   - Data flow diagram
   - Authentication flow diagram

### 3.4 Submit and Wait
- Submit all role requests
- **Wait time**: 1-7 business days (can be longer for first-time apps)
- Amazon will email you with approval or questions
- Some roles may require additional security review

---

## **STEP 4: Set Up AWS IAM Role (If Not Done Automatically)**

### 4.1 Check IAM Role in AWS Console
1. Log into **AWS Console**: https://console.aws.amazon.com
2. Navigate to **IAM** → **Roles**
3. Find the role created by Amazon (or create one if needed)

### 4.2 Configure Trust Relationship
The role should trust Amazon's SP-API service:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sellingpartnerapi.amazon.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "YOUR_EXTERNAL_ID"
        }
      }
    }
  ]
}
```

### 4.3 Attach Policies (if needed)
- Usually Amazon handles this automatically
- If you need additional AWS permissions, attach policies here

---

## **STEP 5: Prepare Your Environment Variables**

Create a `.env` file in your backend directory with:

```env
# Amazon SP-API Credentials
# App ID for consent URL (Seller Central) – use App ID, NOT LWA Client ID. Get from Solution Provider Portal.
AMAZON_APP_ID=amzn1.sp.solution.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.xxxxxxxxxxxxx
AMAZON_LWA_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::123456789012:role/YourRoleName
AMAZON_AWS_ACCESS_KEY_ID=your-aws-access-key
AMAZON_AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AMAZON_AWS_REGION=us-east-1

# OAuth Redirect URI (must match what you set in Seller Central)
AMAZON_OAUTH_REDIRECT_URI=http://localhost:8000/api/auth/amazon/callback
# For production: https://yourdomain.com/api/auth/amazon/callback

# Marketplace IDs (for different regions)
AMAZON_MARKETPLACE_US=ATVPDKIKX0DER
AMAZON_MARKETPLACE_CA=A2EUQ1WTGCTBG2
AMAZON_MARKETPLACE_UK=A1F83G8C2ARO7P
# Add more as needed
```

---

## **STEP 6: Test the Setup**

### 6.1 Verify Credentials
- Double-check all credentials are correct
- Ensure redirect URI matches exactly (including http vs https, trailing slashes)

### 6.2 Test OAuth Flow (Manual)
1. Construct the authorization URL:
   ```
   https://sellercentral.amazon.com/apps/authorize/consent?
     application_id=YOUR_CLIENT_ID&
     version=beta&
     return_url=YOUR_REDIRECT_URI&
     state=random_state_string
   ```
2. Open in browser (while logged into Seller Central)
3. Authorize the app
4. You should be redirected to your callback URL with `spapi_oauth_code` and `selling_partner_id`

---

## **NEXT STEPS (After Setup Complete)**

Once you have:
- ✅ Developer account approved
- ✅ Application created
- ✅ Credentials saved
- ✅ Roles requested (and approved)
- ✅ Environment variables configured

You're ready to:
1. **Implement the OAuth flow** in your backend
2. **Store refresh tokens** securely in your database
3. **Build API integration** to fetch reimbursements, reports, etc.
4. **Set up scheduled jobs** to sync data regularly

---

## **Common Issues & Solutions**

### Issue: "Invalid redirect URI"
- **Solution**: Ensure the redirect URI in your code matches EXACTLY what's in Seller Central (case-sensitive, no trailing slashes unless specified)

### Issue: "Role not approved"
- **Solution**: Check email for Amazon's questions, respond promptly, provide detailed security information

### Issue: "Cannot assume IAM role"
- **Solution**: Verify the IAM role ARN is correct, check trust relationship, ensure External ID matches

### Issue: "Access denied" when calling APIs
- **Solution**: Verify the role has the correct permissions, check if the role request was fully approved

---

## **Security Best Practices**

1. **Never commit credentials to Git**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variables in production
   - Consider using AWS Secrets Manager or similar

2. **Encrypt refresh tokens in database**
   - Use AES-256 encryption
   - Store encryption keys separately

3. **Rotate credentials regularly**
   - Change Client Secret every 90 days
   - Rotate AWS access keys

4. **Monitor API usage**
   - Set up CloudWatch alarms
   - Track rate limits
   - Log all API calls

5. **Use HTTPS everywhere**
   - Required for production OAuth redirects
   - Use TLS 1.2+ for all API calls

---

## **Resources**

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **Developer Central**: https://developer.amazon.com/selling-partner/developer-central
- **API Reference**: https://developer-docs.amazon.com/sp-api/docs
- **Support**: https://sellercentral.amazon.com/help/contact-us

---

**Last Updated**: [Current Date]
**Status**: Ready for implementation

