from datetime import datetime
from typing import Optional

# Helper to structure user data
def create_user_document(
    user_name: str,
    email: str,
    hashed_password: str,
    otp_code: str,
    otp_expiry: datetime,
    is_active: bool = False
) -> dict:
    return {
        "user_name": user_name,
        "email": email,
        "password": hashed_password,
        "otp": otp_code,
        "otp_expiry": otp_expiry,
        "is_active": is_active,
        "create_at": datetime.utcnow()
    }
