# Amazon Reimbursement ke liye Required APIs (Urdu/English Guide)

## 🎯 Amazon Reimbursement Tool ke liye zaroori APIs

Amazon reimbursement tool banane ke liye aapko **3 main APIs** chahiye:

---

## 1. ✅ Finances API (MOST IMPORTANT)

### Kya karega:
- **Reimbursement transactions** fetch karega
- **Financial events** (paisa aane ka record) dekh sakte hain
- **Lost/Damaged item reimbursements** track kar sakte hain
- **Fee reimbursements** dekh sakte hain

### Request kya karna hai:
- **Role**: `finances:read` (read permission)

### Justification (Amazon ko kya bolna hai):
```
"We need to read financial events and reimbursement transactions 
to track and report on seller reimbursements. We will display 
this data in a dashboard so sellers can see all their 
reimbursements in one place."
```

### API Endpoint:
```
GET /finances/v0/financialEvents
```

---

## 2. ✅ Reports API (VERY IMPORTANT)

### Kya karega:
- **Inventory adjustments** reports fetch karega (lost/damaged items ka record)
- **Shipment details** reports (kya ship hua, kya missing hai)
- **Fee preview** reports (charges ka detail)
- **Reimbursement case** reports

### Request kya karna hai:
- **Roles**: 
  - `reports:read` - Reports padhne ke liye
  - `reports:write` - Reports create karne ke liye (agar cases submit karna ho)

### Justification:
```
"We need to access inventory adjustment reports, shipment detail 
reports, and fee preview reports to identify lost/damaged items 
and calculate reimbursements. We will match this data with 
financial events to show sellers what they're owed."
```

### API Endpoints:
```
POST /reports/2021-06-30/reports (create report)
GET /reports/2021-06-30/reports/{reportId} (get report)
```

---

## 3. ✅ Notifications API (OPTIONAL but Recommended)

### Kya karega:
- **Real-time notifications** milegi jab naya reimbursement aaye
- **Instant updates** sellers ko milenge
- **No need to poll** APIs repeatedly

### Request kya karna hai:
- **Role**: `notifications:read`

### Justification:
```
"We need real-time notifications when new reimbursements are 
issued to provide immediate updates to sellers. This helps 
sellers track their money faster."
```

### API Endpoint:
```
GET /notifications/v1/destinations
POST /notifications/v1/subscriptions
```

---

## 4. ⚠️ Feeds API (OPTIONAL - agar cases submit karna ho)

### Kya karega:
- **Case documents** submit kar sakte hain
- **Reimbursement cases** programmatically create kar sakte hain

### Request kya karna hai:
- **Role**: `feeds:write`

### Justification:
```
"We need to submit case documents and create reimbursement 
cases on behalf of sellers to automate the reimbursement process."
```

---

## 📋 Step-by-Step: Amazon Portal mein API Request kaise karein

### Step 1: App Select karein
1. Solution Provider Portal mein jao
2. Apni app select karein (ReimbursementDashboard ya koi aur)
3. **"Edit App"** button click karein

### Step 2: Roles Section mein jao
1. App settings mein **"Roles"** ya **"Permissions"** section dhoondhein
2. **"Request roles"** ya **"Add roles"** button click karein

### Step 3: Har API ke liye Request submit karein

#### Finances API:
- ✅ `finances:read` select karein
- Justification paste karein (upar diya gaya)
- Submit karein

#### Reports API:
- ✅ `reports:read` select karein
- ✅ `reports:write` select karein (agar cases submit karna ho)
- Justification paste karein
- Submit karein

#### Notifications API:
- ✅ `notifications:read` select karein
- Justification paste karein
- Submit karein

### Step 4: Security Review Questions ke jawab dein

Amazon aapse ye questions puch sakta hai:

**Q1: Data kaise use karengay?**
```
A: We will read financial events to identify reimbursements, 
match them with inventory adjustments, and display them in a 
dashboard for sellers to track their recovery. We will also 
send notifications when new reimbursements are issued.
```

**Q2: Data kahan store hoga?**
```
A: Data will be stored in [AWS/Azure/GCP] database with 
encryption at rest (AES-256) and encryption in transit (TLS 1.2+).
```

**Q3: Data ka access kaun kar sakta hai?**
```
A: Only authenticated sellers who own the data can access it. 
We use JWT tokens and role-based access control to ensure 
data security.
```

**Q4: Data kitne time tak rakhenge?**
```
A: We will keep data as long as the seller's account is active, 
or 7 years for compliance purposes. Data will be automatically 
deleted after the retention period.
```

### Step 5: Wait for Approval
- ⏰ **Wait time**: 1-7 business days
- Amazon email bhejega approval ya questions ke saath
- Kuch roles ke liye additional security review ho sakta hai

---

## 🚨 IMPORTANT: Pehle Business Information Submit karein

**CRITICAL**: Pehle red banner wala **"Submit Business Information"** complete karein, warna API requests approve nahi hongi.

---

## ✅ Minimum Required APIs (Must Have)

Agar aapko jaldi start karna hai, ye 2 APIs minimum chahiye:

1. ✅ **Finances API** (`finances:read`) - Reimbursements dekhne ke liye
2. ✅ **Reports API** (`reports:read`) - Inventory adjustments dekhne ke liye

Baaki APIs baad mein add kar sakte hain.

---

## 📝 Summary (Quick Reference)

| API | Role | Purpose | Priority |
|-----|------|---------|----------|
| **Finances API** | `finances:read` | Reimbursement transactions | ⭐⭐⭐ MUST HAVE |
| **Reports API** | `reports:read`, `reports:write` | Inventory reports, cases | ⭐⭐⭐ MUST HAVE |
| **Notifications API** | `notifications:read` | Real-time updates | ⭐⭐ RECOMMENDED |
| **Feeds API** | `feeds:write` | Submit cases | ⭐ OPTIONAL |

---

## 🔗 Useful Links

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **Finances API Docs**: https://developer-docs.amazon.com/sp-api/docs/finances-api-v0-reference
- **Reports API Docs**: https://developer-docs.amazon.com/sp-api/docs/reports-api-v2021-06-30-reference
- **Solution Provider Portal**: https://sellercentral.amazon.com/apps/develop/home

---

**Last Updated**: [Current Date]
**Status**: Ready for API requests

