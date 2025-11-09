from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict
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
    level: int = 1
    credits: int = 0
    post_count: int = 0
    like_received: int = 0
    achievements: Dict[str, bool] = {
        "first_post": False,
        "ten_posts": False,
        "first_like": False,
        "hundred_like": False
    }

# Internal model for user document stored in DB
class UserInDB(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    created_at: datetime = datetime.utcnow()
    level: int = 1
    credits: int = 0
    post_count: int = 0                # 用户累计发帖数
    like_received: int = 0             # 用户累计获赞数
    achievements: Dict[str, bool] = {  # 各项成就解锁状态
        "first_post": False,           # 第一次发帖
        "ten_posts": False,            # 累计发10次帖
        "first_like": False,            # 第一次获赞
        "hundred_like": False
    }