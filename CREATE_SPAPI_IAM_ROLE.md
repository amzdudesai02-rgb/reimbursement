# Create New IAM Role for SP-API - Step by Step

## Complete Guide to Create a Properly Configured IAM Role

This guide will help you create a new IAM role from scratch that works perfectly with your SP-API backend.

---

## **Step 1: Delete Old Role (Optional)**

1. Go to **AWS Console**: https://console.aws.amazon.com
2. Navigate to **IAM** → **Roles**
3. Find **`spapiaccess`** role
4. Click on it, then click **"Delete role"**
5. Confirm deletion

---

## **Step 2: Create New IAM Role**

### 2.1 Start Role Creation

1. In **IAM** → **Roles**, click **"Create role"** button
2. You'll see **"Select trusted entity"** page

### 2.2 Select Trusted Entity Type

Select **"AWS account"** (this is what your backend will use)

### 2.3 Configure Trust Relationship

**Option A: Trust Your Entire AWS Account (Simpler, Recommended for Now)**

1. Select **"This account"** radio button
2. Your account ID will be pre-filled
3. **Leave "Require external ID" UNCHECKED** (your code uses it but doesn't require it in the trust policy)
4. **Leave "Require MFA" UNCHECKED**

**Option B: Trust Specific IAM User (More Secure - Use This if You Have a Dedicated IAM User)**

1. Select **"Another AWS account"**
2. Enter your AWS account ID (12 digits)
3. **UNCHECK "Require external ID"**
4. **UNCHECK "Require MFA"**

Then after role creation, edit the trust policy to specify the IAM user (see Step 4 below).

Click **"Next"** to continue.

### 2.4 Add Permissions (Optional - Not Required for SP-API)

**For SP-API, the role doesn't need any AWS service permissions!**

The role is only used to get temporary credentials for signing API requests. SP-API doesn't require AWS service permissions.

1. **Skip adding any policies** (or you can add a blank policy)
2. Just click **"Next"** to continue

**Note**: If you want to be explicit, you can attach a minimal policy later, but it's not needed for SP-API to work.

### 2.5 Name Your Role

1. **Role name**: Enter `sp-api-role` (or any name you prefer)
2. **Description**: 
   ```
   IAM role for SP-API requests. Used by backend to assume role and sign SP-API requests.
   ```
3. Click **"Create role"**

**✅ Role Created!** Save the Role ARN - you'll need it!

---

## **Step 3: Get Your Role ARN**

1. After creation, you'll see the role details
2. Copy the **Role ARN** (looks like: `arn:aws:iam::123456789012:role/sp-api-role`)
3. **Save this ARN** - you'll need it for Render environment variables

---

## **Step 4: Verify/Update Trust Relationship (If Needed)**

If you selected Option B (trust specific IAM user), update the trust policy:

1. Click on your new role → **"Trust relationships"** tab
2. Click **"Edit trust policy"**
3. Replace with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USERNAME"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Replace:
- `YOUR_ACCOUNT_ID` with your 12-digit AWS account ID
- `YOUR_IAM_USERNAME` with the IAM user that will assume this role

If you selected Option A, the trust policy should already be correct.

---

## **Step 5: Create IAM User for Backend (To Assume the Role)**

Your backend needs AWS credentials to assume the role. Create an IAM user:

### 5.1 Create IAM User

1. Go to **IAM** → **Users** → **"Create user"**
2. **User name**: `spapi-backend-user` (or any name)
3. **Access type**: Select **"Programmatic access"** (for API access)
4. Click **"Next: Permissions"**

### 5.2 Attach Policy to Allow Role Assumption

**Option 1: Create Custom Policy (Recommended)**

1. Click **"Create policy"** (opens new tab)
2. Switch to **"JSON"** tab
3. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::YOUR_ACCOUNT_ID:role/sp-api-role"
    }
  ]
}
```

**Replace `YOUR_ACCOUNT_ID` and role name if different!**

4. Click **"Next: Tags"** (optional, skip)
5. Click **"Next: Review"**
6. **Policy name**: `AssumeSPAPIRolePolicy`
7. **Description**: `Allows assuming SP-API IAM role for backend application`
8. Click **"Create policy"**

9. Go back to the user creation tab (refresh the page)
10. Click the refresh icon next to "Create policy"
11. Search for `AssumeSPAPIRolePolicy`
12. Check the box to select it
13. Click **"Next: Tags"** (optional)
14. Click **"Next: Review"**
15. Click **"Create user"**

### 5.3 Save Access Keys ⚠️ CRITICAL

1. You'll see the **Access key ID** and **Secret access key**
2. **IMPORTANT**: Click **"Show"** to reveal the secret access key
3. **Copy both values immediately** - you won't see the secret again!
4. Save them securely (you'll add to Render environment variables)

**Access Key ID**: `AKIAIOSFODNN7EXAMPLE`  
**Secret Access Key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

---

## **Step 6: Add to Render Environment Variables**

Once you have everything, add these to Render Dashboard → Your Service → Environment:

```env
# AWS IAM Role ARN (from Step 3)
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/sp-api-role

# AWS Credentials (from Step 5.3)
AMAZON_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AMAZON_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# AWS Region
AMAZON_AWS_REGION=us-east-1
```

**Replace with your actual values!**

---

## **Step 7: Test the Setup**

After deploying to Render, test if the role assumption works:

1. Check Render logs for any errors
2. Try making an SP-API request
3. If you see "AccessDenied" errors, check:
   - Trust policy allows your account/user
   - IAM user has permission to assume the role
   - Role ARN is correct in environment variables

---

## **Complete Trust Policy Examples**

### For Entire Account (Simplest)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### For Specific IAM User (More Secure)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/spapi-backend-user"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### With External ID Check (Extra Security - Optional)

If you want to require ExternalId (though your code uses it, it's optional):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringLike": {
          "sts:ExternalId": "*"
        }
      }
    }
  ]
}
```

---

## **Best Practices Summary**

✅ **Do:**
- Use a dedicated IAM user for your backend (not your root account)
- Give IAM user only `sts:AssumeRole` permission for this specific role
- Use descriptive names (`sp-api-role`, `spapi-backend-user`)
- Save access keys securely (never commit to Git)
- Use the entire account trust (simpler) or specific user trust (more secure)

❌ **Don't:**
- Don't attach AWS service policies to the role (not needed for SP-API)
- Don't use your root account credentials
- Don't give the IAM user permissions beyond assuming the role
- Don't use web identity federation (your code uses standard AssumeRole)

---

## **Quick Checklist**

- [ ] Deleted old role (if desired)
- [ ] Created new IAM role with correct trust relationship
- [ ] Saved Role ARN
- [ ] Created IAM user for backend
- [ ] Attached policy to allow assuming the role
- [ ] Saved Access Key ID and Secret Access Key
- [ ] Added all variables to Render environment
- [ ] Tested role assumption

---

## **What Your Backend Does**

1. Backend authenticates to AWS using `AMAZON_AWS_ACCESS_KEY_ID` and `AMAZON_AWS_SECRET_ACCESS_KEY`
2. Backend calls `sts:AssumeRole` with the `AMAZON_AWS_IAM_ROLE_ARN`
3. AWS returns temporary credentials (access key, secret, session token)
4. Backend uses these temporary credentials to sign SP-API requests
5. SP-API verifies the signature and processes the request

---

**Last Updated**: Complete guide for creating new SP-API IAM role
**Status**: Ready to use

