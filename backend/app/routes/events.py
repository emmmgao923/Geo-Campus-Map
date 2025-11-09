from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.event_model import Event, EventType
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/events", tags=["Events"])


@router.post("/", response_model=Event)
async def create_event(event: Event):
    """Create a new event under a building."""
    # # Check if building_id is valid (should be an integer)
    # if not isinstance(event.building_id, int):
    #     raise HTTPException(status_code=400, detail="building_id must be an integer")

    # Insert the event into MongoDB
    new_event = event.dict()
    new_event["timestamp"] = datetime.utcnow()
    result = await db["events"].insert_one(new_event)
    new_event["_id"] = str(result.inserted_id)
    
    
    if not event.user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    user = await db["users"].find_one({"_id": event.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Step 3️⃣ 更新发帖数
    post_count = user.get("post_count", 0) + 1
    user["post_count"] = post_count
    
        # Step 4️⃣ 检查成就解锁
    achievements = user.get("achievements", {
        "first_post": False,
        "ten_posts": False,
        "first_like": False
    })

    new_achievements = []
    if post_count == 1 and not achievements["first_post"]:
        achievements["first_post"] = True
        new_achievements.append({
            "code": "first_post",
            "title": "第一次发帖 🎉",
            "description": "你迈出了在校园发声的第一步！",
            "icon": "first_post.png",
            "unlocked_at": datetime.utcnow()
        })
    if post_count == 10 and not achievements["ten_posts"]:
        achievements["ten_posts"] = True
        new_achievements.append({
            "code": "ten_posts",
            "title": "校园话题达人 🏆",
            "description": "累计发帖10次，校园因为你更热闹！",
            "icon": "ten_posts.png",
            "unlocked_at": datetime.utcnow()
        })

    # Step 5️⃣ 写回用户文档
    await db["users"].update_one(
        {"_id": event.user_id},
        {"$set": {
            "post_count": post_count,
            "achievements": achievements
        }}
    )

    # Step 6️⃣ 若有新成就，存入临时表供前端轮询
    if new_achievements:
        await db["achievement_temp"].insert_one({
            "user_id": str(user["_id"]),
            "new_achievements": new_achievements,
            "notified": False
        })

    return new_event


@router.get("/{building_id}", response_model=List[Event])
async def get_events_by_building(building_id: str):
    """Return all events for a specific building by its numeric ID."""
    events = await db["events"].find({"building_id": building_id}).to_list(100)
    if not events:
        return []
    for e in events:
        e["_id"] = str(e["_id"])
    return events


@router.get("/type/{event_type}", response_model=List[Event])
async def get_events_by_type(event_type: EventType):
    """Return all events of a specific type (e.g., help, study, activity)."""
    events = await db["events"].find({"type": event_type.value}).to_list(100)
    for e in events:
        e["_id"] = str(e["_id"])
    return events


@router.get("/detail/{event_id}", response_model=Event)
# async def get_event_detail(event_id: int):
async def get_single_event(event_id: str):
    """Return a single event by event numeric ID."""
    event = await db["events"].find_one({"_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event["_id"] = str(event["_id"])
    return event
