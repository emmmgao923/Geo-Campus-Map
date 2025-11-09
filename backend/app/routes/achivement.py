from fastapi import APIRouter, HTTPException
from app.database import db

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])

@router.get("/latest")
async def get_latest_achievement(user_id: str):
    """Return the latest new achievement for a user."""
    record = await db["achievement_temp"].find_one(
        {"user_id": user_id, "notified": False}
    )

    if not record:
        return {"unlocked": False}

    # 标记为已通知
    await db["achievement_temp"].update_one(
        {"_id": record["_id"]},
        {"$set": {"notified": True}}
    )

    return {
        "unlocked": True,
        "data": record["new_achievements"]
    }
