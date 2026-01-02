# How to Request API Roles in Amazon Solution Provider Portal

## Step-by-Step Guide

---

## **Method 1: Through App Registration Form (If Available)**

If you're on the app registration/edit form and see checkboxes for roles:

### Steps:
1. In the **"Roles"** section, you should see checkboxes for different roles
2. Check the boxes for the roles you need:
   - ✅ **Finance and Accounting** (for `finances:read`)
   - ✅ **Inventory and Order Tracking** (for `reports:read` and `reports:write`)
3. Click **"Save and exit"**
4. After saving, Amazon may automatically start the approval process, OR you may need to submit requests separately (see Method 2)

---

## **Method 2: Request Roles After App Creation (Most Common)**

After your app is created/saved, you need to request approval for the roles:

### Step 1: Navigate to Your App
1. Go to **Solution Provider Portal**: https://sellercentral.amazon.com/apps/develop/home
2. Find your app **"ReimbursementDash"**
3. Click **"View"** or **"Edit App"** button

### Step 2: Find Roles/Permissions Section
Look for one of these sections:
- **"Roles"** tab or section
- **"Permissions"** tab or section
- **"API Access"** or **"Request Permissions"** section
- Sometimes it's under **"Settings"** → **"Roles"**

### Step 3: Request Each Role
You'll typically see options like:
- **"Request roles"** button
- **"Add roles"** button
- **"Request permissions"** button
- Or a list of available roles with request buttons

Click on it and you'll see a form or list of roles to request.

### Step 4: Request Required Roles

Request these roles with the justifications below:

#### **1. Finance and Accounting** (`finances:read`)

**Justification to paste:**
```
We need to read financial events and reimbursement transactions to track and report on seller reimbursements. We will display this data in a dashboard so sellers can see all their reimbursements in one place.
```

#### **2. Inventory and Order Tracking** (`reports:read` and `reports:write`)

**Justification to paste:**
```
We need to access inventory adjustment reports, shipment detail reports, and fee preview reports to identify lost/damaged items and calculate reimbursements. We will match this data with financial events to show sellers what they're owed.
```

#### **3. Notifications API** (Optional but Recommended) (`notifications:read`)

**Justification to paste:**
```
We need real-time notifications when new reimbursements are issued to provide immediate updates to sellers. This helps sellers track their money faster.
```

---

## **Method 3: Check App Settings/Details Page**

1. Go to Solution Provider Portal
2. Click on your app **"ReimbursementDash"**
3. Look for tabs at the top or sections like:
   - **"Settings"**
   - **"Permissions"**
   - **"Roles"**
   - **"API Access"**
4. Click on the relevant tab
5. Look for **"Request"** or **"Add"** buttons next to roles

---

## **What Amazon Will Ask**

When you request roles, Amazon may ask you to fill out a form with:

### 1. **Data Usage Description**
```
We will read financial events to identify reimbursements, match them with inventory adjustments, and display them in a dashboard for sellers to track their recovery. We will also send notifications when new reimbursements are issued.
```

### 2. **Data Storage**
- **Where?**: PostgreSQL database hosted on [AWS/Neon/Render/etc.]
- **Encryption at rest?**: Yes, AES-256
- **Encryption in transit?**: Yes, TLS 1.2+

### 3. **Access Controls**
- **Who can access?**: Only authenticated sellers who own the data
- **How?**: JWT tokens and role-based access control (RBAC)
- **Authentication**: Users must log in to our system, and can only access their own data

### 4. **Data Retention**
- **How long?**: As long as the seller's account is active, or 7 years for compliance purposes
- **Deletion**: Data is automatically deleted after the retention period or when the seller deletes their account

---

## **After Submitting Request**

1. **Wait time**: 1-7 business days
2. **Email notifications**: Amazon will email you when:
   - Your request is approved
   - They have questions
   - They need more information
3. **Check status**: You can check the status in the Solution Provider Portal

---

## **Where to Check Status**

1. Go to Solution Provider Portal
2. Your app → **"Roles"** or **"Permissions"** section
3. You'll see the status of each role request:
   - **Pending** - Waiting for review
   - **Approved** - Ready to use
   - **Rejected** - You'll receive feedback
   - **More information needed** - Amazon has questions

---

## **If You Can't Find the Request Button**

### Try These:
1. **Check if roles are already requested**: Look for status indicators (Pending/Approved)
2. **Check Business Information**: Some portals require business information to be submitted first
3. **Contact Support**: If you can't find where to request roles, contact Amazon SP-API support
4. **Check Documentation**: Amazon's interface may have changed - check their latest documentation

---

## **Quick Checklist**

- [ ] Found the Roles/Permissions section in your app
- [ ] Requested **Finance and Accounting** (`finances:read`)
- [ ] Requested **Inventory and Order Tracking** (`reports:read`, `reports:write`)
- [ ] (Optional) Requested **Notifications** (`notifications:read`)
- [ ] Provided justifications for each role
- [ ] Submitted requests
- [ ] Waiting for approval (1-7 days)

---

## **Important Notes**

1. **Business Information**: Make sure you've submitted business information first (if required by your portal)
2. **Justifications**: Be clear and specific about why you need each role
3. **Response Time**: Respond promptly to any questions from Amazon
4. **Can't Use APIs Yet**: You won't be able to make SP-API calls until roles are approved

---

**Last Updated**: Guide for requesting API roles
**Status**: Ready to use

