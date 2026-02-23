# 📋 App Submission Status Guide - "Submitted" Status

**App Name:** ReimbursementDash  
**Current Status:** Submitted  
**Status Meaning:** Your app is under Amazon's review process

---

## ⏰ Typical Review Timeline

**"Submitted" status usually takes:**
- **Minimum:** 1-3 business days
- **Average:** 3-7 business days
- **Maximum:** Up to 14 business days (for complex apps)

**Why it takes time:**
- Amazon reviews your app's purpose and compliance
- Security team checks your Privacy Policy and data handling
- They verify all URLs are accessible
- They review your business information
- They check API role justifications

---

## 🔍 What to Check While Waiting

### 1. **Check Your Email Regularly** ⚠️ CRITICAL

Amazon will email you if they need:
- Additional information
- Clarifications on your app purpose
- Questions about API role justifications
- Business information verification
- Security questions

**Action:** Check your email daily (including spam folder)

---

### 2. **Verify "Edit Pending Review" Section**

You see "Edit pending review" link - this means:
- Amazon has your submission
- You can still edit some fields (but changes may delay approval)

**Click on "Edit pending review" to verify:**

✅ **App Information:**
- App name is correct
- Description is clear
- Privacy Policy URL: `https://reimbursement.amzdudes.io/privacy-policy`
- Security/Terms URL (if applicable)

✅ **OAuth Configuration:**
- OAuth Login URI is set
- OAuth Redirect URI: `https://reimbursement.amzdudes.io/api/auth/amazon/callback`
- Must match exactly (case-sensitive, no trailing slash)

---

### 3. **Check for Red Banners or Warnings**

Look for any red banners in Developer Central that say:
- ❌ "Submit Business Information" (CRITICAL - blocks approval)
- ❌ "Complete Developer Profile"
- ❌ "Verify Email Address"
- ❌ "Missing Required Fields"

**If you see any red banners, fix them immediately!**

---

### 4. **Verify Privacy Policy & Security Pages Are Live**

**Test these URLs in an incognito/private browser window:**

1. **Privacy Policy:**
   ```
   https://reimbursement.amzdudes.io/privacy-policy
   ```
   - ✅ Should load without login
   - ✅ Should show all Amazon-required sections

2. **Security Page:**
   ```
   https://reimbursement.amzdudes.io/security
   ```
   - ✅ Should load without login
   - ✅ Should cover security practices

**If these don't load, Amazon will reject your app!**

---

### 5. **Check API Roles/Permissions Request Status**

After app approval, you'll need to request API roles separately.

**What to check:**
- [ ] Finances API (`finances:read`) - For reimbursement tracking
- [ ] Reports API (`reports:read`, `reports:write`) - For inventory data
- [ ] Feeds API (`feeds:write`) - For auto case filing (if needed)
- [ ] Notifications API (`notifications:read`) - For real-time updates (optional)

**Note:** These are requested AFTER app approval, not during submission.

---

### 6. **Verify Business Information is Complete**

**Go to Developer Central → View Profile → Check:**

✅ Company/Business Name
✅ Business Address
✅ Tax ID / EIN (if applicable)
✅ Business Type
✅ Contact Information
✅ Security Questionnaire completed

**If any section is incomplete, complete it now!**

---

## 🚨 Common Reasons for Delays or Rejection

### 1. **Business Information Not Submitted**
- **Symptom:** Red banner "Submit Business Information"
- **Fix:** Complete all business information sections
- **Impact:** CRITICAL - App won't be approved

### 2. **Privacy Policy Not Accessible**
- **Symptom:** Amazon can't access your Privacy Policy URL
- **Fix:** Test URL in incognito browser, ensure it's publicly accessible
- **Impact:** CRITICAL - App will be rejected

### 3. **OAuth Redirect URI Mismatch**
- **Symptom:** OAuth flow fails during testing
- **Fix:** Verify URI matches exactly between Amazon Portal and your backend
- **Impact:** HIGH - App may be approved but won't work

### 4. **App Description Too Vague**
- **Symptom:** Amazon emails asking for clarification
- **Fix:** Provide clear explanation of app purpose
- **Impact:** MEDIUM - Delays approval

### 5. **Missing Required Fields**
- **Symptom:** "Edit pending review" shows incomplete sections
- **Fix:** Complete all required fields
- **Impact:** HIGH - Blocks approval

---

## ✅ While Waiting: Complete These Tasks

Since you have to wait anyway, use this time to:

### **1. Deploy Backend to Render**
- [ ] Create Render account
- [ ] Deploy backend service
- [ ] Set all environment variables
- [ ] Verify backend is accessible

### **2. Prepare Environment Variables**

**Have these ready for Render:**

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

# CORS
CORS_ORIGINS=https://reimbursement.amzdudes.io
FRONTEND_BASE_URL=https://reimbursement.amzdudes.io
```

### **3. Test Privacy Policy & Security Pages**

- [ ] Open Privacy Policy in incognito browser
- [ ] Verify it loads without login
- [ ] Open Security page in incognito browser
- [ ] Verify it loads without login
- [ ] Check all links work

### **4. Prepare API Role Justifications**

**For Finances API:**
```
Purpose: We need to read reimbursement transactions and financial events 
to automatically track and display seller reimbursements in our dashboard.
```

**For Reports API:**
```
Purpose: We need to access inventory adjustment reports and shipment details 
to identify lost/damaged items and calculate expected reimbursements.
```

**For Feeds API (if needed):**
```
Purpose: We need to programmatically submit reimbursement cases on behalf 
of sellers when we identify missing reimbursements.
```

---

## 📧 What to Expect in Email

### **Email Subject Lines to Watch For:**

1. **"Action Required: Additional Information for Your SP-API Application"**
   - Amazon needs clarification
   - **Action:** Respond within 24-48 hours

2. **"Your SP-API Application Has Been Approved"**
   - ✅ App approved!
   - **Next:** Request API roles

3. **"Your SP-API Application Requires Changes"**
   - ❌ App rejected
   - **Action:** Fix issues and resubmit

4. **"Security Review for SP-API Application"**
   - Additional security questions
   - **Action:** Respond with detailed answers

---

## 🎯 Status Progression

Your app will progress through these statuses:

1. **"Draft"** → You're still editing
2. **"Submitted"** ← **YOU ARE HERE**
3. **"Under Review"** → Amazon is actively reviewing
4. **"Approved"** → ✅ Success! You can request API roles
5. **"Production"** → App is live and fully functional

**OR**

4. **"Changes Required"** → ❌ Amazon needs fixes
5. **"Rejected"** → ❌ App rejected (can resubmit)

---

## 🚀 After Approval - Next Steps

Once status changes to "Approved":

1. **Request API Roles:**
   - Go to App → Roles/Permissions
   - Request: Finances API, Reports API, etc.
   - Provide justifications
   - Wait 1-7 days for role approvals

2. **Test OAuth Flow:**
   - Deploy backend
   - Connect a test Amazon store
   - Verify token exchange works

3. **Implement API Integration:**
   - Start with Finances API
   - Then Reports API
   - Finally Feeds API (if needed)

---

## 📞 What to Do If Status Doesn't Change

**After 7 business days with no email or status change:**

1. **Check Email:**
   - Check spam/junk folder
   - Search for emails from "Amazon" or "Seller Central"

2. **Check Developer Central:**
   - Look for any new messages or notifications
   - Check "Edit pending review" for any red flags

3. **Verify All Requirements:**
   - Business information complete?
   - Privacy Policy accessible?
   - OAuth URLs correct?
   - No red banners?

4. **Contact Amazon Support:**
   - Go to Seller Central → Help → Contact Us
   - Select "Selling Partner API" topic
   - Ask about app review status

---

## ✅ Summary: What You Should Do NOW

**Priority 1 (Critical - Do Today):**
- [ ] Verify Privacy Policy URL is publicly accessible
- [ ] Verify Security Page URL is publicly accessible
- [ ] Check for red banners in Developer Central
- [ ] Verify business information is complete
- [ ] Check email (including spam) for Amazon messages

**Priority 2 (This Week):**
- [ ] Deploy backend to Render
- [ ] Set all environment variables in Render
- [ ] Test backend endpoints are accessible
- [ ] Prepare API role justifications

**Priority 3 (While Waiting):**
- [ ] Review SP-API documentation
- [ ] Plan API integration implementation
- [ ] Test frontend with backend endpoints

---

## 📝 Quick Status Check Checklist

Use this checklist daily while waiting:

- [ ] Checked email (including spam)
- [ ] No red banners in Developer Central
- [ ] Privacy Policy loads in incognito browser
- [ ] Security page loads in incognito browser
- [ ] Business information complete
- [ ] OAuth Redirect URI verified
- [ ] No new messages in Developer Central

---

**Remember:** "Submitted" status is normal and means your app is in Amazon's review queue. Be patient, check email regularly, and ensure all requirements are met. Approval typically takes 3-7 business days.

**Last Updated:** Guide for "Submitted" status troubleshooting  
**Expected Timeline:** 1-7 business days for approval


