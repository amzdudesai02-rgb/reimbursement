# Next Steps: Amazon SP-API Implementation

## ✅ What Has Been Implemented

### 1. Database Models
- **`Store`** model: Represents an Amazon store/seller account linked to a user
- **`AmazonConnection`** model: Stores OAuth tokens (refresh token, access token) and AWS credentials for SP-API access

### 2. API Schemas
- `StoreOut`, `StoreCreate`: For managing stores
- `AmazonConnectionOut`: For viewing connection status
- `AmazonOAuthInitOut`, `AmazonOAuthCallbackIn/Out`: For OAuth flow

### 3. SP-API Client (`backend/app/sp_api_client.py`)
- **`SPAPIClient`** class: Handles authenticated SP-API requests
  - Automatic LWA token refresh
  - AWS STS role assumption for request signing
  - AWS Signature Version 4 signing
  - Support for multiple regions (NA, EU, FE)
- **`exchange_authorization_code()`**: Exchanges Amazon auth code for tokens
- **`generate_authorization_url()`**: Creates the OAuth authorization URL

### 4. OAuth Endpoints (`backend/app/main.py`)
- **`GET /api/auth/amazon/init`**: Start OAuth flow, returns authorization URL
- **`POST /api/auth/amazon/callback`**: Handle callback, exchange code for tokens, create/store connection
- **`GET /api/stores`**: List all stores for current user
- **`GET /api/stores/{store_id}/connection`**: Get connection details for a store

### 5. Dependencies Added
- `boto3`: For AWS STS role assumption
- `cryptography`: For encryption (future use for token storage)
- `requests`: HTTP client (already had httpx, but requests is also useful)

---

## 🔧 What You Need to Do Next

### Step 1: Complete Seller Central Setup
Follow the guide in `SP_API_SETUP_GUIDE.md`:
1. ✅ Register as SP-API Developer (if not done)
2. ✅ Create SP-API Application
3. ✅ Request required API roles (Finances, Reports, etc.)
4. ✅ Wait for Amazon's approval

### Step 2: Configure Environment Variables
Add these to your `.env` file in the `backend/` directory:

```env
# Amazon SP-API Credentials (from Seller Central / Solution Provider Portal)
# App ID for consent URL (use App ID, not LWA Client ID)
AMAZON_APP_ID=amzn1.sp.solution.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AMAZON_LWA_CLIENT_ID=amzn1.application-oa2-client.xxxxxxxxxxxxx
AMAZON_LWA_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AMAZON_AWS_IAM_ROLE_ARN=arn:aws:iam::123456789012:role/YourRoleName

# AWS Credentials (for STS AssumeRole)
AMAZON_AWS_ACCESS_KEY_ID=your-aws-access-key
AMAZON_AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AMAZON_AWS_REGION=us-east-1

# OAuth Redirect URI (must match Seller Central settings)
AMAZON_OAUTH_REDIRECT_URI=http://localhost:8000/api/auth/amazon/callback
# For production: https://yourdomain.com/api/auth/amazon/callback

# Marketplace IDs (optional, defaults provided)
AMAZON_MARKETPLACE_US=ATVPDKIKX0DER
AMAZON_MARKETPLACE_CA=A2EUQ1WTGCTBG2
AMAZON_MARKETPLACE_UK=A1F83G8C2ARO7P
```

### Step 3: Install New Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Run Database Migrations
The new models (`Store`, `AmazonConnection`) will be created automatically when the server starts (via `models.Base.metadata.create_all()`).

If you need to manually create them:
```python
# In Python shell or migration script
from app.database import engine
from app import models
models.Base.metadata.create_all(bind=engine)
```

### Step 5: Test the OAuth Flow

#### 5.1 Start the Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 5.2 Test OAuth Init Endpoint
```bash
# Get authorization URL (requires authentication)
curl -X GET "http://localhost:8000/api/auth/amazon/init" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "authorization_url": "https://sellercentral.amazon.com/apps/authorize/consent?...",
  "state": "random_csrf_token"
}
```

#### 5.3 User Flow
1. User clicks "Connect Amazon Store" button in your frontend
2. Frontend calls `/api/auth/amazon/init` to get authorization URL
3. User is redirected to Amazon's consent screen
4. User authorizes your app
5. Amazon redirects to your callback URL with `spapi_oauth_code` and `selling_partner_id`
6. Frontend calls `/api/auth/amazon/callback` with the code
7. Backend exchanges code for tokens and creates/store connection

---

## 🚧 Next Implementation Steps (Phase 4)

Once OAuth is working, you'll need to implement:

### 1. Frontend OAuth Flow
- Add "Connect Amazon Store" button to "Manage Stores" page
- Handle OAuth redirect and callback
- Display connection status

### 2. Data Sync Jobs
- **Scheduled job** to fetch reimbursements from SP-API
- **Scheduled job** to fetch inventory adjustments
- **Scheduled job** to fetch shipment details
- **Scheduled job** to fetch fee previews

### 3. SP-API Integration Functions
Create functions to call specific SP-API endpoints:
- **Finances API**: `GET /finances/v0/financialEvents`
- **Reports API**: `GET /reports/2021-06-30/reports` (create reports)
- **Reports API**: `GET /reports/2021-06-30/reports/{reportId}` (get report)
- **Feeds API**: `POST /feeds/2021-06-30/feeds` (submit case documents)

### 4. Token Encryption
- Encrypt `lwa_refresh_token` and `aws_secret_access_key` in database
- Use `cryptography` library with a master key from environment

### 5. Error Handling & Retry Logic
- Handle token expiration gracefully
- Implement retry logic for rate-limited requests
- Log API errors for debugging

### 6. Background Workers
- Set up Celery or similar for async jobs
- Queue sync jobs per store
- Handle failures and retries

---

## 📝 Important Notes

### Security
- ⚠️ **Never commit `.env` file to Git** (already in `.gitignore`)
- ⚠️ **Encrypt refresh tokens** before storing in database (currently stored as plaintext - implement encryption)
- ⚠️ **Use HTTPS in production** for OAuth redirect URIs
- ⚠️ **Validate state parameter** in OAuth callback to prevent CSRF attacks

### Rate Limits
- SP-API has rate limits per endpoint
- Implement exponential backoff for retries
- Consider using a queue system for bulk operations

### Token Management
- LWA access tokens expire in 1 hour
- Refresh tokens are long-lived but can be revoked
- AWS STS credentials expire in 1 hour
- Current implementation caches tokens and refreshes automatically

### Testing
- Use Amazon's sandbox environment for testing
- Test with a real seller account (your own test account)
- Monitor API responses for errors

---

## 🔗 Useful Resources

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **OAuth Flow Guide**: https://developer-docs.amazon.com/sp-api/docs/website-authorization-workflow
- **API Reference**: https://developer-docs.amazon.com/sp-api/docs
- **Rate Limits**: https://developer-docs.amazon.com/sp-api/docs/rate-limits

---

## ✅ Checklist

- [ ] Complete Seller Central developer registration
- [ ] Create SP-API application and get credentials
- [ ] Request and get approval for required API roles
- [ ] Add environment variables to `.env`
- [ ] Install new dependencies (`pip install -r requirements.txt`)
- [ ] Test OAuth init endpoint
- [ ] Test OAuth callback endpoint
- [ ] Verify database tables are created (`stores`, `amazon_connections`)
- [ ] Implement frontend OAuth flow
- [ ] Test end-to-end OAuth flow with real Amazon account
- [ ] Implement token encryption
- [ ] Set up data sync jobs
- [ ] Test SP-API calls (fetch reimbursements, etc.)

---

**Status**: Backend OAuth infrastructure is ready. Next step is completing Seller Central setup and testing the OAuth flow.

