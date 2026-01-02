# AWS IAM Role Setup for SP-API

## Using Your Existing "spapiaccess" Role

Yes, you can use your existing `spapiaccess` IAM role! However, you need to configure it properly for SP-API.

---

## **Step 1: Find Your Role ARN**

1. Log into **AWS Console**: https://console.aws.amazon.com
2. Go to **IAM** → **Roles**
3. Find your role: **`spapiaccess`**
4. Click on it to open details
5. Copy the **Role ARN** (looks like: `arn:aws:iam::123456789012:role/spapiaccess`)

**You'll need this ARN for:**
- Adding to Render environment variables as `AMAZON_AWS_IAM_ROLE_ARN`
- Potentially adding to Amazon Seller Central app settings (if required)

---

## **Step 2: Configure Trust Relationship**

⚠️ **IMPORTANT**: Your current trust policy uses `Federated` with `www.amazon.com` and `sts:AssumeRoleWithWebIdentity`, but your backend code uses standard `sts:AssumeRole` with AWS credentials. You need to update the trust policy.

Your role needs to trust the AWS principal that will assume it (your backend application).

### Option A: Trust Your AWS Account/IAM User (Recommended)

Your backend uses `sts:AssumeRole` with AWS credentials (access key/secret), so configure the role to trust those credentials:

1. In AWS Console → **IAM** → **Roles** → **spapiaccess**
2. Click **"Trust relationships"** tab
3. Click **"Edit trust policy"**
4. **Replace your current policy** with this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Note**: The code uses `ExternalId=self.selling_partner_id` when assuming the role, but you don't need to require it in the trust policy. The ExternalId is just passed as a parameter for additional security (optional).

**OR** if you want to trust a specific IAM user (more secure):

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

### Option B: Trust Any Principal in Your Account (Less Secure - Use for Testing)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**To find YOUR_ACCOUNT_ID:**
- Click your username in the top right of AWS Console
- Your 12-digit account ID is shown there

---

## **Step 3: Attach Permissions Policy**

For SP-API, the role doesn't need any specific AWS permissions. The role is just used to get temporary credentials for signing API requests.

However, you can attach a minimal policy:

1. In **IAM** → **Roles** → **spapiaccess** → **"Permissions"** tab
2. You can either:
   - **Remove all policies** (not needed for SP-API signing)
   - **OR** keep it as-is if it has minimal permissions

**Note**: SP-API request signing doesn't require AWS service permissions. The role is just a container for temporary credentials.

---

## **Step 4: Create AWS Access Keys (For Your Backend)**

Your backend needs AWS credentials to assume the role. Create an IAM user or use existing credentials:

### Create IAM User for Backend:

1. Go to **IAM** → **Users** → **"Create user"**
2. Name: `spapi-backend-user` (or any name)
3. **Access type**: Select **"Programmatic access"**
4. Click **"Next"**

### Attach Policy to Allow Role Assumption:

1. Click **"Attach policies directly"**
2. Click **"Create policy"** (opens new tab)
3. Switch to **"JSON"** tab
4. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::YOUR_ACCOUNT_ID:role/spapiaccess"
    }
  ]
}
```

5. Click **"Next"** → Name it: `AssumeSPAPIRolePolicy`
6. Click **"Create policy"**
7. Go back to user creation, refresh, and attach `AssumeSPAPIRolePolicy`
8. Finish creating the user
9. **IMPORTANT**: Copy the **Access Key ID** and **Secret Access Key** (you won't see the secret again!)

### Or Use Existing IAM User:

If you already have an IAM user with appropriate permissions, you can use that.

---

## **Step 5: Add to Render Environment Variables**

Once you have everything, add these to Render:

```env
# AWS IAM Role ARN (your existing role)
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::YOUR_ACCOUNT_ID:role/spapiaccess

# AWS Credentials (to assume the role)
AMAZON_AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AMAZON_AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AMAZON_AWS_REGION=us-east-1
```

**Replace:**
- `YOUR_ACCOUNT_ID` with your 12-digit AWS account ID
- The access keys with the ones you created in Step 4

---

## **Step 6: How It Works**

1. **Your backend** (running on Render) uses `AMAZON_AWS_ACCESS_KEY_ID` and `AMAZON_AWS_SECRET_ACCESS_KEY` to authenticate with AWS
2. **Backend calls STS AssumeRole** to get temporary credentials from the `spapiaccess` role
3. **Temporary credentials** are used to sign SP-API requests (via AWS Signature V4)
4. **SP-API** verifies the signature and processes the request

---

## **Important Notes**

1. **Current Trust Policy Issue**: Your role currently uses `Federated: www.amazon.com` with `sts:AssumeRoleWithWebIdentity`, but your backend code uses `sts:AssumeRole` with AWS credentials. You **must** change the trust policy to allow your AWS account/user to assume the role using standard STS AssumeRole.

2. **ExternalId**: Your code uses `selling_partner_id` as ExternalId when assuming the role (line 111 in `sp_api_client.py`). This is optional - you don't need to require it in the trust policy. It's just passed as an additional parameter for logging/tracking purposes.

3. **Why the change**: The web identity federation approach (`AssumeRoleWithWebIdentity`) is used when authenticating via OIDC tokens from identity providers. Your backend authenticates with AWS using access keys/secret keys, then assumes the role using standard `AssumeRole`, which requires an AWS principal in the trust policy.

2. **Amazon Seller Central**: Some documentation says you need to register the IAM Role ARN in Seller Central, but based on your code, it seems the role ARN is just used by your backend for signing. Check if Seller Central has a field for IAM Role ARN - if it does, add it there too.

3. **Security**: The AWS access keys you create should ONLY have permission to assume the `spapiaccess` role (nothing else). This follows the principle of least privilege.

---

## **Quick Checklist**

- [ ] Found your `spapiaccess` role ARN
- [ ] Updated trust relationship to allow your AWS account/user
- [ ] Created IAM user with `sts:AssumeRole` permission for the role
- [ ] Saved Access Key ID and Secret Access Key securely
- [ ] Added all variables to Render environment
- [ ] Tested role assumption (after deployment)

---

## **Troubleshooting**

### Error: "AccessDenied: User is not authorized to perform: sts:AssumeRole"
- **Solution**: The IAM user doesn't have permission to assume the role. Attach the policy from Step 4.

### Error: "AccessDenied: Not authorized to perform sts:AssumeRole"
- **Solution**: The role's trust policy doesn't allow your IAM user/account. Update the trust relationship.

### Error: "Invalid userid"
- **Solution**: Remove the ExternalId condition from the trust policy, or update it to match your use case.

---

**Last Updated**: Setup guide for using existing spapiaccess role

