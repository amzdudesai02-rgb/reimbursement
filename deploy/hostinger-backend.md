### Hostinger Backend Environment Setup

1. **Create `.env` file** inside `/var/www/amzdudes-backend/backend/.env` (or whatever path you deployed to):
   ```
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_xm3MaoUCnYT4@ep-weathered-sound-afsm39mx-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=super-secret-key
   CORS_ORIGINS=["https://reimbursement.amzdudes.io"]
   FRONTEND_BASE_URL=https://reimbursement.amzdudes.io

   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=<SendGrid_API_Key>
   SMTP_FROM=AMZDUDES <support@amzdudes.io>
   SMTP_TLS=true
   ```
   Replace the connection string with Neon’s pooled URL and your own secrets.

2. **Expose env vars to systemd**
   If using the `amzdudes.service` systemd unit, edit `/etc/systemd/system/amzdudes.service`:
   ```
   EnvironmentFile=/var/www/amzdudes-backend/backend/.env
   ```
   Then restart systemd:
   ```
   systemctl daemon-reload
   systemctl restart amzdudes
   ```

3. **NGINX proxy** already points to `127.0.0.1:8000`. TLS is handled via Let’s Encrypt.

With this setup, Hostinger loads the Neon DB URL and other secrets just like Render did. Redeploy/restart and the backend will use the values from `.env`.

