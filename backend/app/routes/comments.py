from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.comment_model import Comment
from typing import List

router = APIRouter(prefix="/api/comments", tags=["Comments"])


@router.post("/", response_model=Comment)
async def create_comment(comment: Comment):
    """Create a new comment for a specific event."""
    if not isinstance(comment.event_id, int):
        raise HTTPException(status_code=400, detail="event_id must be an integer")

    new_comment = comment.dict()
    result = await db["comments"].insert_one(new_comment)
    new_comment["_id"] = result.inserted_id
    return new_comment


@router.get("/{event_id}", response_model=List[Comment])
async def get_comments_by_event(event_id: str):
    """Return all comments under a specific event (by numeric ID)."""
    comments = await db["comments"].find({"event_id": event_id}).to_list(100)
    for c in comments:
        c["_id"] = str(c["_id"])
    return comments
