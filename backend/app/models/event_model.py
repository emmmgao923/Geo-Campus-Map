from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
from app.models.comment_model import Comment

# Enum for event types
class EventType(str, Enum):
    HELP = "help"            # Events asking for help (lost item, request, etc.)
    NOTICE = "notice"        # Announcements or general notices
    STUDY = "study"          # Study-related events (study group, tutoring)
    ACTIVITY = "activity"    # Campus activities (clubs, events, competitions)
    FOOD = "food"            # Food-related posts (cafeteria, snacks)
    EMERGENCY = "emergency"  # Emergency events (safety, health, urgent)
    OTHER = "other"          # Uncategorized events


# Schema for event documents stored in MongoDB
class Event(BaseModel):
    id: Optional[str] = Field(alias="_id")          # MongoDB document ID
    building_id: str                                # Related building ID
    user_id: Optional[str] = None                   # ID of the user who posted
    title: str                                      # Event title
    content: Optional[str] = None                   # Event content/description
    type: EventType                                 # Restricted to Enum values
    # tags: Optional[List[str]] = []                  # Optional keyword tags
    # location_point: Optional[dict] = None           # Coordinates inside the building
    timestamp: datetime = datetime.utcnow()         # Creation time (UTC)
    likes_count: int = 0                            # Number of likes
    # comments: Optional[List[Comment]] = []          # Embedded comments list
