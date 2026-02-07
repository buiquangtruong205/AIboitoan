from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.db.database import db
from app.schemas.user_schema import UserRegister, OTPVerify, UserLogin
from app.core import security
from app.models.user_model import create_user_document
from datetime import timezone, datetime
from app.utils.email import send_otp_email

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    # Kiểm tra xem email đã tồn tại chưa
    existing_user = await db.users.find_one({"email": user.email})
    
    if existing_user:
        # Nếu tài khoản đã active → từ chối
        if existing_user.get("is_active", False):
            raise HTTPException(status_code=400, detail="Email đã được đăng ký. Vui lòng đăng nhập.")
        
        # Nếu chưa active → tạo OTP mới và gửi lại
        otp_code = security.generate_otp()
        otp_expiry = security.get_otp_expiry(5)
        
        await db.users.update_one(
            {"email": user.email},
            {"$set": {"otp": otp_code, "otp_expiry": otp_expiry}}
        )
        
        try:
            send_otp_email(user.email, otp_code)
        except Exception as e:
            print(f"Error sending email: {e}")
        
        # print(f"📩 OTP mới cho {user.email} là: {otp_code}")
        return {"message": "Tài khoản chưa được xác thực. Mã OTP mới đã được gửi đến email của bạn."}

    # Tạo mã OTP ngẫu nhiên (6 chữ số)
    otp_code = security.generate_otp()
    # Hết hạn sau 5 phút
    otp_expiry = security.get_otp_expiry(5)

    # Hash mật khẩu
    hashed_password = security.hash_password(user.password)

    user_data = create_user_document(
        user_name=user.user_name,
        email=user.email,
        hashed_password=hashed_password,
        otp_code=otp_code,
        otp_expiry=otp_expiry,
        is_active=False
    )

    await db.users.insert_one(user_data)
    
    # Gửi Email chứa otp_code cho người dùng
    try:
        send_otp_email(user.email, otp_code)
    except Exception as e:
        print(f"Error sending email: {e}")
    
    # print(f"📩 OTP cho {user.email} là: {otp_code}") 
    
    return {"message": "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP."}

@router.post("/verify-otp")
async def verify_otp(data: OTPVerify):
    user = await db.users.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")

    if user["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác.")

    current_time = datetime.now(timezone.utc)
    
    # Kiểm tra xem user["otp_expiry"] có timezone chưa
    expiry = user["otp_expiry"]
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if current_time > expiry:
        raise HTTPException(status_code=400, detail="Mã OTP đã hết hạn.")

    # Cập nhật trạng thái tài khoản
    await db.users.update_one(
        {"email": data.email},
        {"$set": {"is_active": True, "otp": None}}
    )

    return {"message": "Xác thực tài khoản thành công!"}

@router.post("/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    
    if not user:
        raise HTTPException(status_code=400, detail="Sai email hoặc mật khẩu")

    if not security.verify_password(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Sai email hoặc mật khẩu")

    if not user.get("is_active", False):
         raise HTTPException(status_code=400, detail="Tài khoản chưa được xác thực. Vui lòng kiểm tra email.")

    access_token = security.create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {"name": user["user_name"], "email": user["email"]}
    }
