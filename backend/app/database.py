# app/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection URL (from .env)
MONGO_URL = os.getenv("mongodb+srv://ericgao923:<db_password>@geo-map-cluster.hoakftj.mongodb.net/?appName=geo-map-cluster")
DB_NAME = os.getenv("MONGO_DB_NAME", "campus_db")

# Create MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Optional: create indexes for faster queries
async def init_indexes():
    """Initialize common MongoDB indexes for performance."""
    await db["events"].create_index([("building_id", ASCENDING)])
    await db["comments"].create_index([("event_id", ASCENDING)])
