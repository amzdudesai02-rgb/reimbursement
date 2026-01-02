# SellerInvestigator-Style Dashboard - Complete Guide

## 🎯 What You're Building

A dashboard that helps Amazon sellers:
- **Track lost/damaged inventory**
- **Identify missing reimbursements**
- **File cases automatically**
- **Monitor reimbursement status**
- **Get detailed reports**

---

## 🔄 How the App Works (Complete Flow)

### **Step 1: Seller Connects Their Amazon Account**

```
Seller → Clicks "Connect Amazon Store"
  ↓
Your App → Redirects to Amazon OAuth
  ↓
Seller → Authorizes your app on Amazon
  ↓
Amazon → Returns authorization code
  ↓
Your Backend → Exchanges code for refresh token
  ↓
Your Database → Saves tokens securely
```

**Result**: Seller's Amazon account is connected, you have access tokens.

---

### **Step 2: Automatic Data Collection (Background Jobs)**

Your app runs scheduled jobs (daily/hourly) to:

#### **A. Fetch Financial Events (Finances API)**
```
Every Day:
  ↓
Your Backend → Calls Finances API
  ↓
Amazon → Returns all financial transactions
  ↓
Your Backend → Filters reimbursement transactions
  ↓
Your Database → Saves reimbursements
```

**What you get:**
- All reimbursement transactions
- Amounts, dates, reasons
- Order IDs, SKUs, ASINs

#### **B. Fetch Inventory Reports (Reports API)**
```
Every Day:
  ↓
Your Backend → Requests inventory adjustment report
  ↓
Amazon → Generates report (takes time)
  ↓
Your Backend → Downloads report when ready
  ↓
Your Backend → Parses lost/damaged items
  ↓
Your Database → Saves inventory adjustments
```

**What you get:**
- Lost inventory records
- Damaged inventory records
- Missing shipments
- Inventory adjustments

#### **C. Match & Identify Missing Reimbursements**
```
Your Backend Logic:
  ↓
Compare: Inventory Adjustments vs Financial Events
  ↓
Find: Lost items WITHOUT matching reimbursement
  ↓
Flag: These are missing reimbursements
  ↓
Your Database → Marks as "Missing Reimbursement"
```

**Result**: You identify what Amazon owes the seller but hasn't paid.

---

### **Step 3: Display in Dashboard**

```
Seller → Logs into your dashboard
  ↓
Your Frontend → Shows:
  - Total reimbursements found
  - Missing reimbursements
  - Cases filed
  - Money recovered
  - Detailed reports
```

---

### **Step 4: Automatic Case Filing (Optional)**

```
Your Backend → Identifies missing reimbursement
  ↓
Your Backend → Prepares case document
  ↓
Your Backend → Submits via Feeds API
  ↓
Amazon → Processes case
  ↓
Your Backend → Tracks case status
  ↓
Seller → Sees case filed in dashboard
```

---

## 📊 Dashboard Features (What Sellers See)

### **1. Summary Cards**
- Total Reimbursements Found: $X,XXX
- Missing Reimbursements: $X,XXX
- Cases Filed: XX
- Money Recovered: $X,XXX

### **2. Reimbursements Table**
- Date
- Order ID
- SKU/ASIN
- Reason (Lost, Damaged, etc.)
- Amount
- Status (Paid, Pending, Missing)

### **3. Missing Reimbursements**
- Items that should be reimbursed but aren't
- Option to file case
- Track case status

### **4. Reports**
- Inventory adjustments
- Financial events
- Case history
- Export to CSV/Excel

---

## 🔑 APIs You Need (Complete List)

### **1. Finances API** ⭐⭐⭐ MUST HAVE

**Role**: `finances:read`

**What it does:**
- Fetches all financial transactions
- Includes reimbursement transactions
- Shows amounts, dates, reasons

**Endpoint:**
```
GET /finances/v0/financialEvents
```

**Why you need it:**
- Track all reimbursements Amazon has paid
- Identify what's been reimbursed
- Calculate total money recovered

**Status**: ✅ You've selected this in your app form

---

### **2. Reports API** ⭐⭐⭐ MUST HAVE

**Roles**: 
- `reports:read` - Read reports
- `reports:write` - Create reports

**What it does:**
- Generate inventory adjustment reports
- Get shipment detail reports
- Download fee preview reports

**Endpoints:**
```
POST /reports/2021-06-30/reports (create report)
GET /reports/2021-06-30/reports/{reportId} (get report)
```

**Why you need it:**
- Identify lost/damaged inventory
- Find missing shipments
- Match with financial events to find missing reimbursements

**Status**: ✅ You've selected this in your app form

---

### **3. Feeds API** ⭐⭐ IMPORTANT (For Auto Case Filing)

**Role**: `feeds:write`

**What it does:**
- Submit case documents to Amazon
- File reimbursement cases automatically
- Upload supporting documents

**Endpoint:**
```
POST /feeds/2021-06-30/feeds
```

**Why you need it:**
- Automatically file cases for missing reimbursements
- Submit case documents programmatically
- Track case submission status

**Status**: ❓ Need to check if available in your app form

**Note**: If you can't get Feeds API, sellers can file cases manually, but you can still track reimbursements.

---

### **4. Notifications API** ⭐ RECOMMENDED

**Role**: `notifications:read`

**What it does:**
- Get real-time notifications
- Receive alerts when new reimbursements arrive
- No need to poll APIs constantly

**Endpoints:**
```
GET /notifications/v1/destinations
POST /notifications/v1/subscriptions
```

**Why you need it:**
- Instant updates when reimbursements arrive
- Better user experience
- Reduce API calls

**Status**: ❓ Optional but recommended

---

## 📋 How to Get APIs Approved

### **Step 1: Check Your App Form**

Go to Solution Provider Portal → Your App "ReimbursementDash" → Edit App

**Check if you see these options:**
- ✅ Finance and Accounting (you have this)
- ✅ Inventory and Order Tracking (you have this)
- ❓ Feeds API or "Submit Cases" option
- ❓ Notifications API option

### **Step 2: Request Missing APIs**

If Feeds API is not in the form, you may need to:

1. **Contact Amazon Support**
   - Go to: https://sellercentral.amazon.com/help/contact-us
   - Select "Selling Partner API (SP-API)"
   - Ask: "How do I request Feeds API access for automatic case filing?"

2. **Check Documentation**
   - Some APIs require special approval
   - Feeds API might need additional justification

3. **Submit Business Information First**
   - Some portals require business info before API requests
   - Look for red banner about "Submit Business Information"

### **Step 3: Provide Justifications**

When requesting APIs, use these justifications:

#### **For Finances API:**
```
We need to read financial events and reimbursement transactions 
to track and report on seller reimbursements. We will display 
this data in a dashboard so sellers can see all their 
reimbursements in one place and identify missing payments.
```

#### **For Reports API:**
```
We need to access inventory adjustment reports, shipment detail 
reports, and fee preview reports to identify lost/damaged items 
and calculate reimbursements. We will match this data with 
financial events to show sellers what they're owed.
```

#### **For Feeds API (if available):**
```
We need to submit case documents and create reimbursement cases 
on behalf of sellers to automate the reimbursement recovery 
process. This helps sellers recover money they're owed without 
manual case filing.
```

#### **For Notifications API:**
```
We need real-time notifications when new reimbursements are 
issued to provide immediate updates to sellers. This helps 
sellers track their money faster and improves user experience.
```

### **Step 4: Wait for Approval**

- **Timeline**: 1-7 business days
- **Monitor email**: Amazon will email you with questions or approval
- **Respond promptly**: Answer any security questions quickly

---

## 🛠️ Implementation Steps

### **Phase 1: Basic Tracking (Minimum Viable Product)**

**What you need:**
- ✅ Finances API (`finances:read`)
- ✅ Reports API (`reports:read`)

**What you can do:**
- Track reimbursements
- Identify missing reimbursements
- Show dashboard to sellers
- **Cannot**: File cases automatically (need Feeds API)

**Timeline**: Can start after these 2 APIs are approved

---

### **Phase 2: Full Automation (Complete Solution)**

**What you need:**
- ✅ Finances API
- ✅ Reports API
- ✅ Feeds API (`feeds:write`) - **CRITICAL**

**What you can do:**
- Everything from Phase 1
- **Plus**: Automatically file cases
- **Plus**: Track case status
- **Plus**: Full automation

**Timeline**: After Feeds API is approved

---

## 🎯 Your Current Status

### ✅ What You Have:
- [x] App created in Solution Provider Portal
- [x] LWA credentials (Client ID, Secret)
- [x] AWS IAM role and access keys
- [x] OAuth flow implemented
- [x] Database models ready
- [x] Finances API selected in form
- [x] Reports API selected in form

### ⏳ What You're Waiting For:
- [ ] API role approvals (1-7 days)
  - [ ] Finances API approval
  - [ ] Reports API approval
  - [ ] Feeds API (if you can request it)

### 📝 What to Do Next:
1. **Deploy to Render** (add all environment variables)
2. **Test OAuth flow** (connect a test Amazon store)
3. **Wait for API approvals** (monitor email)
4. **After approvals**, implement:
   - Finances API integration
   - Reports API integration
   - Feeds API integration (if approved)
   - Dashboard UI updates
   - Background jobs for data sync

---

## 💡 How SellerInvestigator Works (Reference)

SellerInvestigator likely:
1. Connects seller's Amazon account (OAuth)
2. Fetches financial events daily (Finances API)
3. Fetches inventory reports daily (Reports API)
4. Matches data to find missing reimbursements
5. Files cases automatically (Feeds API)
6. Tracks case status
7. Shows everything in a dashboard

**You're building the same thing!**

---

## 🚀 Quick Start Checklist

- [ ] Deploy backend to Render
- [ ] Add all environment variables
- [ ] Test OAuth flow
- [ ] Check if Feeds API is available in app form
- [ ] Request Feeds API if not available
- [ ] Wait for API approvals (1-7 days)
- [ ] Implement Finances API after approval
- [ ] Implement Reports API after approval
- [ ] Implement Feeds API after approval (if available)
- [ ] Build dashboard UI
- [ ] Set up background jobs
- [ ] Test with real Amazon account
- [ ] Launch!

---

## 📚 Resources

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **Finances API**: https://developer-docs.amazon.com/sp-api/docs/finances-api-v0-reference
- **Reports API**: https://developer-docs.amazon.com/sp-api/docs/reports-api-v2021-06-30-reference
- **Feeds API**: https://developer-docs.amazon.com/sp-api/docs/feeds-api-v2021-06-30-reference

---

**Last Updated**: Complete guide for SellerInvestigator-style dashboard
**Status**: Ready to implement

