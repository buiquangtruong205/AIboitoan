import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_otp_email(to_email: str, otp: str):
    """
    Sends an OTP email to the specified recipient.
    """
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print(f"⚠️ SMTP not configured. OTP for {to_email}: {otp}")
        return

    subject = "Divination App - Your OTP Code"
    body = f"""
    <html>
    <body>
        <h2>Verification Code</h2>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="color: #6a1b9a;">{otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
    </body>
    </html>
    """

    message = MIMEMultipart()
    message["From"] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "html"))

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.MAIL_FROM, to_email, message.as_string())
        server.quit()
        print(f"✅ OTP email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
