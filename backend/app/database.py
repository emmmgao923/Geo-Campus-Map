from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
# DB_NAME = os.getenv("MONGO_DB_NAME", "geo-campus-db")


if not MONGO_URL:
    raise RuntimeError("❌ Missing MONGO_URL environment variable!")

# ✅ 使用 ServerApi('1') 版本（官方推荐）
client = AsyncIOMotorClient(MONGO_URL, server_api=ServerApi('1'))
# client = MongoClient(MONGO_URL, server_api=ServerApi('1'))

# ✅ 选择数据库
db = client["geo-campus-db"]
