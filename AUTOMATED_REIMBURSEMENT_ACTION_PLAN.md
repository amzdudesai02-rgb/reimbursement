# Automated Reimbursement Tool - Complete Action Plan

## 🎯 Your Tool Capabilities

You've built a tool that:
- ✅ **Automatically files reimbursement cases**
- ✅ **Automatically tracks reimbursements**

## 📋 What You Need to Do Next

---

## **PHASE 1: Complete Amazon SP-API Setup** (Current Priority)

### 1.1 Request Required API Roles ⚠️ CRITICAL

For automatic case filing and reimbursement tracking, you need:

#### **Must Have APIs:**

1. **Finances API** (`finances:read`)
   - **Purpose**: Track reimbursements automatically
   - **What it does**: Fetches all reimbursement transactions
   - **Status**: ✅ You've selected this in the form

2. **Reports API** (`reports:read`, `reports:write`)
   - **Purpose**: Identify lost/damaged items to file cases
   - **What it does**: Gets inventory adjustments, shipment details
   - **Status**: ✅ You've selected this in the form

3. **Feeds API** (`feeds:write`) ⚠️ **REQUIRED FOR AUTO CASE FILING**
   - **Purpose**: Submit case documents automatically
   - **What it does**: Programmatically create reimbursement cases
   - **Status**: ❓ Need to check if you selected this

#### **Recommended APIs:**

4. **Notifications API** (`notifications:read`)
   - **Purpose**: Get real-time updates when new reimbursements arrive
   - **What it does**: No need to poll APIs constantly

### 1.2 Check Your App Form

Go to your app "ReimbursementDash" → Edit App → Check if you selected:
- ✅ Finance and Accounting
- ✅ Inventory and Order Tracking
- ❓ **Feeds API** (if available - needed for auto case filing)

**If Feeds API is not selected:**
- Add it to your app form
- Save the form
- Wait for approval

### 1.3 Wait for Role Approvals

- **Timeline**: 1-7 business days
- **What to do**: Monitor your email for Amazon's questions
- **Respond promptly** to any security review questions

---

## **PHASE 2: Deploy and Configure Backend**

### 2.1 Deploy to Render ✅ (You're doing this)

**Environment Variables to Add:**
```env
# Amazon SP-API (Already have these)
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8
AMAZON_LWA_CLIENT_SECRET=amzn1.oa2-cs.v1.cd4caffe71f75cd208ca666142e1801af3f53a0b012af8b61527c98d38
AMAZON_OAUTH_REDIRECT_URI=https://reimbursement.amzdudes.io/api/auth/amazon/callback

# AWS (Fill in with your actual values)
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/sp-api-role
AMAZON_AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AMAZON_AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AMAZON_AWS_REGION=us-east-1
```

### 2.2 Test OAuth Flow

- Users connect their Amazon stores
- Tokens are saved to database
- See `TEST_OAUTH_FLOW.md` for detailed steps

---

## **PHASE 3: Implement API Integration** (After Roles Approved)

### 3.1 Implement Finances API Integration

**Purpose**: Automatically fetch reimbursements

**Endpoint to implement:**
```python
GET /finances/v0/financialEvents
```

**What to do:**
1. Create scheduled job (daily/hourly)
2. Fetch financial events for each connected store
3. Parse reimbursement transactions
4. Save to `amazon_reimbursements` table
5. Match with inventory adjustments

**Implementation location:**
- Add to `backend/app/sp_api_client.py`
- Create endpoint in `backend/app/main.py`
- Schedule with background worker (Celery or similar)

### 3.2 Implement Reports API Integration

**Purpose**: Identify lost/damaged items to file cases

**Endpoints to implement:**
```python
# Create report
POST /reports/2021-06-30/reports
{
  "reportType": "GET_FBA_INVENTORY_ADJUSTMENTS_DATA",
  "dataStartTime": "2025-01-01T00:00:00Z",
  "dataEndTime": "2025-01-15T00:00:00Z"
}

# Get report
GET /reports/2021-06-30/reports/{reportId}
```

**What to do:**
1. Schedule daily report generation
2. Download inventory adjustment reports
3. Identify lost/damaged items
4. Match with financial events
5. Create cases for missing reimbursements

### 3.3 Implement Feeds API Integration ⚠️ **FOR AUTO CASE FILING**

**Purpose**: Automatically submit reimbursement cases

**Endpoint to implement:**
```python
POST /feeds/2021-06-30/feeds
{
  "feedType": "POST_FBA_INBOUND_CARTON_CONTENTS",
  "marketplaceIds": ["ATVPDKIKX0DER"],
  "inputFeedDocumentId": "document_id"
}
```

**What to do:**
1. Prepare case documents (XML/JSON format)
2. Upload document to S3 (or use SP-API document upload)
3. Submit feed with case details
4. Track feed status
5. Monitor case creation

**Note**: Feeds API is complex - you may need to:
- Create proper XML/JSON documents
- Follow Amazon's case submission format
- Handle document uploads
- Track feed processing status

---

## **PHASE 4: Build Automation Logic**

### 4.1 Automatic Reimbursement Detection

**Flow:**
```
1. Fetch financial events (Finances API)
   ↓
2. Identify reimbursement transactions
   ↓
3. Match with inventory adjustments (Reports API)
   ↓
4. Store in database
   ↓
5. Display in dashboard
```

### 4.2 Automatic Case Filing

**Flow:**
```
1. Fetch inventory adjustment reports (Reports API)
   ↓
2. Identify lost/damaged items without reimbursement
   ↓
3. Prepare case documents
   ↓
4. Submit via Feeds API
   ↓
5. Track case status
   ↓
6. Monitor for reimbursement
```

### 4.3 Scheduled Jobs

**Set up background workers:**
- **Daily**: Fetch financial events
- **Daily**: Generate and download reports
- **Daily**: Check for new lost/damaged items
- **As needed**: Submit cases via Feeds API
- **Real-time**: Process notifications (if using Notifications API)

---

## **PHASE 5: Testing & Monitoring**

### 5.1 Test Each Component

1. **Test OAuth Flow**
   - Connect Amazon store
   - Verify tokens saved

2. **Test Finances API** (after roles approved)
   - Fetch financial events
   - Verify reimbursements appear

3. **Test Reports API** (after roles approved)
   - Generate report
   - Download and parse

4. **Test Feeds API** (after roles approved)
   - Submit test case
   - Verify case created

### 5.2 Monitor & Log

- Log all API calls
- Track errors and retries
- Monitor rate limits
- Alert on failures

---

## **📊 Current Status Checklist**

### ✅ Completed:
- [x] App created in Solution Provider Portal
- [x] LWA credentials obtained
- [x] AWS IAM role created
- [x] AWS access keys created
- [x] Environment variables ready
- [x] OAuth flow endpoints implemented
- [x] Database models created

### ⏳ In Progress:
- [ ] Deploy to Render
- [ ] Add environment variables to Render
- [ ] Test OAuth flow

### ⏳ Waiting For:
- [ ] API role approvals (1-7 days)
  - [ ] Finances API (`finances:read`)
  - [ ] Reports API (`reports:read`, `reports:write`)
  - [ ] Feeds API (`feeds:write`) - **CRITICAL for auto case filing**
  - [ ] Notifications API (`notifications:read`) - Optional

### 📝 To Implement (After Roles Approved):
- [ ] Finances API integration
- [ ] Reports API integration
- [ ] Feeds API integration (for auto case filing)
- [ ] Scheduled background jobs
- [ ] Case filing automation logic
- [ ] Reimbursement tracking automation
- [ ] Error handling and retries
- [ ] Monitoring and alerts

---

## **🚨 Important Notes**

### For Automatic Case Filing:

1. **Feeds API is Required**: Without `feeds:write` role, you **cannot** automatically file cases. You can only track reimbursements that Amazon already issued.

2. **Case Submission Format**: Amazon has specific requirements for case documents. You'll need to:
   - Format documents correctly (XML/JSON)
   - Include all required fields
   - Follow Amazon's case submission guidelines

3. **Document Upload**: Cases require document uploads. You may need:
   - S3 bucket for document storage
   - Or use SP-API document upload endpoint

4. **Case Tracking**: After submitting, you need to:
   - Track feed processing status
   - Monitor case creation
   - Check case status updates

### For Automatic Reimbursement Tracking:

1. **Finances API**: This is your primary source for reimbursement data
2. **Reports API**: Use this to identify what should be reimbursed
3. **Matching Logic**: Match financial events with inventory adjustments
4. **Notifications**: Use Notifications API to avoid constant polling

---

## **🎯 Immediate Next Steps**

1. **Check if Feeds API is selected** in your app form
   - If not, add it and save
   - This is **critical** for auto case filing

2. **Deploy to Render** with all environment variables

3. **Test OAuth flow** to ensure stores can connect

4. **Wait for role approvals** (1-7 days)
   - Monitor email
   - Respond to questions promptly

5. **After approvals**, implement API integrations:
   - Start with Finances API (easiest)
   - Then Reports API
   - Finally Feeds API (most complex)

---

## **📚 Resources**

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **Finances API**: https://developer-docs.amazon.com/sp-api/docs/finances-api-v0-reference
- **Reports API**: https://developer-docs.amazon.com/sp-api/docs/reports-api-v2021-06-30-reference
- **Feeds API**: https://developer-docs.amazon.com/sp-api/docs/feeds-api-v2021-06-30-reference

---

**Last Updated**: Action plan for automated reimbursement tool
**Status**: Ready to implement after role approvals

