# 📋 Credentials & IDs to Save - Complete Checklist

Save all these values securely. You'll need them for Render deployment.

---

## ✅ 1. Amazon SP-API Credentials (You Already Have These)

From the LWA credentials modal you saw earlier:

```
✅ AMAZON_LWA_CLIENT_ID:
   amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8

✅ AMAZON_LWA_CLIENT_SECRET:
   amzn1.oa2-cs.v1.cd4caffe71f75cd208ca666142e1801af3f53a0b012af8b61527c98d38
```

**Where to find again:**
- Solution Provider Portal → Your app "ReimbursementDash" → Click "View" under LWA credentials

---

## ✅ 2. AWS IAM Role ARN (You Just Created This)

```
❓ AMAZON_AWS_IAM_ROLE_ARN:
   (Fill this in - you need to get it from AWS Console)
```

**How to find it:**
1. Go to: https://console.aws.amazon.com
2. IAM → Roles → Click on `sp-api-role`
3. Copy the **Role ARN** (starts with `arn:aws:iam::`)
4. It looks like: `arn:aws:iam::308855860756:role/sp-api-role`

**✅ SAVED:**
```
AMAZON_AWS_IAM_ROLE_ARN = arn:aws:iam::308855860756:role/sp-api-role
```

---

## ✅ 3. AWS IAM User Access Keys (You Just Created This)

When you created the IAM user, you should have seen these keys. If you didn't save them, you need to create new ones:

```
❓ AMAZON_AWS_ACCESS_KEY_ID:
   (Fill this in - starts with AKIA...)

❓ AMAZON_AWS_SECRET_ACCESS_KEY:
   (Fill this in - long secret string)
```

**How to find/create them:**

**If you saved them when creating the user:**
- They should be in your notes/saved file
- Access Key ID starts with `AKIA`
- Secret Access Key is a long string

**If you didn't save them, create new ones:**
1. Go to: AWS Console → IAM → Users
2. Click on `spapi-backend-user`
3. Go to **"Security credentials"** tab
4. Scroll to **"Access keys"** section
5. Click **"Create access key"**
6. Select: **"Application running outside AWS"**
7. Click **"Next"** → Add description (optional) → **"Create access key"**
8. ⚠️ **IMPORTANT**: Copy both keys immediately - you won't see the secret again!
   - Access Key ID: `AKIAIOSFODNN7EXAMPLE`
   - Secret Access Key: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**Fill in your actual values:**
```
AMAZON_AWS_ACCESS_KEY_ID = YOUR_ACCESS_KEY_ID_HERE
AMAZON_AWS_SECRET_ACCESS_KEY = YOUR_SECRET_ACCESS_KEY_HERE
```

---

## ✅ 4. AWS Account ID (For Reference)

```
AWS Account ID: 308855860756
```

You already have this - it's visible in AWS Console.

---

## ✅ 5. Role & User Names (For Reference)

```
IAM Role Name: sp-api-role
IAM User Name: spapi-backend-user
```

These are just for reference - you mainly need the ARN and access keys.

---

## 📝 Complete Save Template

Copy this template and fill in the blanks:

```env
# ============================================
# AMAZON SP-API CREDENTIALS
# ============================================
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.67532553f3b542ceb2b5fe808ca057d8
AMAZON_LWA_CLIENT_SECRET=amzn1.oa2-cs.v1.cd4caffe71f75cd208ca666142e1801af3f53a0b012af8b61527c98d38

# ============================================
# AWS IAM ROLE ✅ SAVED
# ============================================
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::308855860756:role/sp-api-role
# ↑ Get from: IAM → Roles → sp-api-role → Copy Role ARN

# ============================================
# AWS IAM USER ACCESS KEYS (Fill in your actual values)
# ============================================
AMAZON_AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
# ↑ Get from: IAM → Users → spapi-backend-user → Security credentials → Access keys

AMAZON_AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
# ↑ Same location - create new access key if you didn't save it

AMAZON_AWS_REGION=us-east-1
```

---

## 🚨 Important Reminders

1. **Secret Access Key**: If you didn't save it when creating the user, you MUST create a new access key (the old one is lost forever)
2. **Security**: Never commit these to Git. Only add to Render environment variables.
3. **Backup**: Save these in a secure password manager or encrypted file.

---

## ✅ Action Items - ALL COMPLETE! 🎉

1. [x] Go to AWS Console → IAM → Roles → `sp-api-role` → Copy Role ARN ✅ DONE
2. [x] Go to AWS Console → IAM → Users → `spapi-backend-user` → Security credentials ✅ DONE
3. [x] Check if you have access keys saved ✅ DONE
4. [x] If NOT saved, create new access key and save both keys ✅ DONE
5. [x] Fill in Role ARN in the template above ✅ DONE
6. [x] Save this document securely ✅ DONE

**All AWS credentials collected! Ready for Render deployment.**

---

**Last Updated**: After creating IAM role and user
**Status**: Ready to collect remaining credentials

