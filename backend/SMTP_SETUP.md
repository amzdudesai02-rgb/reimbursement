### SMTP Configuration

To send verification emails, configure a sender mailbox once and place its SMTP
credentials in Render → Environment:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=amzdudes.ai02@gmail.com
SMTP_PASSWORD=Amzdudes@12345   # ideally use an app password
SMTP_FROM=AMZDUDES <amzdudes.ai02@gmail.com>
SMTP_TLS=true
FRONTEND_BASE_URL=https://reimbursement-psi.vercel.app
```

You can replace these values with a dedicated provider (SendGrid, Mailgun, SES,
etc.) at any time. Once saved, redeploy the backend so verification emails are
actually sent to users.

