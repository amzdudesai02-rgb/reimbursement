import os
import smtplib
from email.message import EmailMessage
from typing import Optional

import httpx

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USERNAME or "no-reply@amzdudes.io")
SMTP_TLS = os.getenv("SMTP_TLS", "true").lower() not in {"0", "false", "no"}

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM = os.getenv("RESEND_FROM", SMTP_FROM)

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")


def _send_via_resend(
    to_email: str,
    subject: str,
    html_body: str,
    text_body: Optional[str],
) -> bool:
    """Send email via Resend HTTP API. Returns True if successful."""
    if not RESEND_API_KEY:
        return False

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": RESEND_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html_body,
        "text": text_body or html_body,
    }
    try:
        response = httpx.post("https://api.resend.com/emails", headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        return True
    except httpx.HTTPError as exc:
        print(f"[RESEND ERROR] Failed to send email: {exc}")
        return False


def _send_via_smtp(to_email: str, subject: str, html_body: str, text_body: Optional[str]):
    if not SMTP_HOST:
        raise RuntimeError("SMTP_HOST not configured")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message.set_content(text_body or html_body)
    message.add_alternative(html_body, subtype="html")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        if SMTP_TLS:
            server.starttls()
        if SMTP_USERNAME and SMTP_PASSWORD:
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(message)


def _send_email(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None):
    if _send_via_resend(to_email, subject, html_body, text_body):
        return

    if SMTP_HOST:
        _send_via_smtp(to_email, subject, html_body, text_body)
        return

    print(f"[DEV EMAIL] → {to_email}\nSubject: {subject}\n{html_body}")


def send_verification_email(name: str, email: str, token: str):
    link = f"{FRONTEND_BASE_URL.rstrip('/')}/verify?token={token}"
    subject = "Verify your amzDUDES account"
    friendly_name = name or "there"
    html = f"""
    <p>Hi {friendly_name},</p>
    <p>Thanks for signing up for the amzDUDES Reimbursement Tool.</p>
    <p>Please verify your email address by clicking the button below:</p>
    <p><a href="{link}" style="background:#FF7A18;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify Email</a></p>
    <p>Or copy/paste this link into your browser:<br>{link}</p>
    <p>If you didn’t request this, you can safely ignore it.</p>
    <p>– The amzDUDES Team</p>
    """
    text = (
        f"Hi {friendly_name},\n\n"
        "Thanks for signing up for the amzDUDES Reimbursement Tool.\n"
        f"Verify your email by visiting: {link}\n\n"
        "If you didn’t request this, you can ignore it.\n"
        "– The amzDUDES Team"
    )
    _send_email(email, subject, html, text)


