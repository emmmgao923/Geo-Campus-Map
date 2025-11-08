from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Enum for building types
class BuildingType(str, Enum):
    STUDY = "study"       # Teaching buildings, labs, lecture halls
    DORM = "dorm"         # Dormitories, student housing
    FOOD = "food"         # Cafeterias, food courts
    ADMIN = "admin"       # Offices, admin buildings
    ACTIVITY = "activity"   # Gyms, clubs, sports centers
    OTHER = "other"         # Everything else

# Building schema for campus map
class Building(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    description: Optional[str] = None
    coordinates: dict  # Example: {"lat": 42.3868, "lng": -72.5281}
    type: BuildingType # Restricted to the Enum values

