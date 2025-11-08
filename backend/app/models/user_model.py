from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Incoming payload for user registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Incoming payload for user login
class UserLogin(BaseModel):
    username_or_email: str
    password: str

# Public-facing user profile (response model)
class UserPublic(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    username: str
    email: EmailStr
    created_at: datetime
    level: int
    credits: int

# Internal model for user document stored in DB
class UserInDB(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    created_at: datetime = datetime.utcnow()
    level: int
    credits: int
