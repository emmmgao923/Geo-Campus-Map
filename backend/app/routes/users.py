# backend/app/routes/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.database import db  # ✅ 复用已有 MongoDB 连接
from app.models.user_model import UserInDB

router = APIRouter(prefix="/api/users", tags=["Users"])



# -------------------- 创建用户 --------------------
@router.post("/", response_model=UserInDB)
async def create_user(user: UserInDB):
    """注册完成后将用户信息存入数据库"""
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = user.dict()
    new_user["created_at"] = datetime.utcnow()

    result = await db["users"].insert_one(new_user)
    new_user["_id"] = str(result.inserted_id)
    return new_user


# -------------------- 获取单个用户 --------------------
@router.get("/{email}", response_model=UserInDB)
async def get_user(email: str):
    """根据 email 获取用户信息"""
    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    return user


# -------------------- 更新用户积分/发帖数 --------------------
@router.patch("/{email}")
async def update_user(email: str, data: dict):
    """更新用户的 credits / post_count / achievements 等字段"""
    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db["users"].update_one({"email": email}, {"$set": data})
    updated = await db["users"].find_one({"email": email})
    updated["_id"] = str(updated["_id"])
    return updated
