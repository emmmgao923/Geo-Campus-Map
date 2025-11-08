# backend/app/routes/authentication.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os, random, smtplib
from email.mime.text import MIMEText

# -------------------- Load environment variables --------------------
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

router = APIRouter()

# -------------------- Email and JWT configuration --------------------
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_SERVER = os.getenv("EMAIL_SERVER")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# -------------------- Password hashing context --------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------- Temporary in-memory storage --------------------
# pending_verifications: stores unverified users' verification codes and expiry times
# users: stores verified users' hashed passwords
pending_verifications = {}
users = {}


# -------------------- Pydantic models --------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class VerifyRequest(BaseModel):
    email: EmailStr
    code: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -------------------- Utility: send verification email --------------------
def send_verification_email(to_email: str, code: str):
    """Send a 6-digit verification code via email"""
    msg = MIMEText(f"Your UMass GeoMap verification code is {code}. It will expire in 5 minutes.")
    msg["Subject"] = "UMass GeoMap Email Verification"
    msg["From"] = EMAIL_SENDER
    msg["To"] = to_email

    try:
        # with smtplib.SMTP_SSL(EMAIL_SERVER, EMAIL_PORT) as smtp:
        #     smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
        #     smtp.send_message(msg)

        # Connect using STARTTLS (port 587)
        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.ehlo("geocampus.umass.edu")
            smtp.starttls()
            smtp.ehlo("geocampus.umass.edu")
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(msg)
            print("✅ Email sent successfully!")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


# -------------------- Route: Register (send verification code) --------------------
@router.post("/register")
def register(data: RegisterRequest):
    """Register a new account and send a verification code"""
    print(f"[DEBUG] Received password length: {len(data.password)}")
    print(f"[DEBUG] Password preview: {data.password[:50]}")


    if not data.email.endswith("@umass.edu"):
        raise HTTPException(status_code=403, detail="Only umass.edu emails are allowed")

    if data.email in users:
        raise HTTPException(status_code=400, detail="User already registered")

    # Generate random 6-digit verification code
    code = str(random.randint(100000, 999999))
    expire_time = datetime.utcnow() + timedelta(minutes=5)

    # Store verification record temporarily
    pending_verifications[data.email] = {
        "code": code,
        "expire_time": expire_time,
        "password": pwd_context.hash(data.password),
    }

    # Send email
    send_verification_email(data.email, code)
    return {"message": f"Verification code sent to {data.email}"}


# -------------------- Route: Verify (confirm code) --------------------
@router.post("/verify")
def verify_code(data: VerifyRequest):
    """Verify the code and activate the account"""
    record = pending_verifications.get(data.email)
    if not record:
        raise HTTPException(status_code=404, detail="No verification pending for this email")

    # Check expiration
    if datetime.utcnow() > record["expire_time"]:
        del pending_verifications[data.email]
        raise HTTPException(status_code=400, detail="Verification code expired")

    # Check correctness
    if record["code"] != data.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    # Verification success, create active user
    users[data.email] = record["password"]
    del pending_verifications[data.email]

    return {"message": "Email verified successfully, account activated"}


# -------------------- Route: Login (generate JWT) --------------------
@router.post("/login")
def login(data: LoginRequest):
    """Authenticate user and issue JWT token"""
    if data.email not in users:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(data.password, users[data.email]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode({"sub": data.email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


# -------------------- Route: Get current user info --------------------
@router.get("/me")
def get_current_user(token: str):
    """Decode and verify JWT token, return user email"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email not in users:
            raise HTTPException(status_code=401, detail="User not found")
        return {"email": email}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
