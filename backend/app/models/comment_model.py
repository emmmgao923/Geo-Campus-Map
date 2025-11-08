from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Comment schema for event discussions
class Comment(BaseModel):
    id: Optional[str] = Field(alias="_id")
    event_id: str
    user_id: Optional[str] = None
    content: str
    timestamp: datetime = datetime.utcnow()
