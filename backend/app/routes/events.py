from fastapi import APIRouter, HTTPException
from app.database import db
from app.models.event_model import Event, EventType
from typing import List

router = APIRouter(prefix="/api/events", tags=["Events"])


@router.post("/", response_model=Event)
async def create_event(event: Event):
    """Create a new event under a building."""
    # # Check if building_id is valid (should be an integer)
    # if not isinstance(event.building_id, int):
    #     raise HTTPException(status_code=400, detail="building_id must be an integer")

    # Insert the event into MongoDB
    new_event = event.dict()
    result = await db["events"].insert_one(new_event)
    new_event["_id"] = str(result.inserted_id)
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
