import json
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

# ====== 1️⃣ MongoDB 连接配置 ======
MONGO_URI = "mongodb+srv://ericgao923:gao780923@geo-map-cluster.hoakftj.mongodb.net/?appName=geo-map-cluster"
DB_NAME = "geo-campus-db"  # 改成你的数据库名

# ====== 2️⃣ 主逻辑 ======
async def upload_comments():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    # 读取本地 JSON 文件
    with open("data/comments_500.json", "r", encoding="utf-8") as f:
        comments = json.load(f)

    # 格式校验与处理
    for c in comments:
        # 确保时间为 datetime 类型
        if isinstance(c.get("createdAt"), str):
            c["createdAt"] = datetime.fromisoformat(c["createdAt"])

    # 插入 MongoDB
    result = await db["comments"].insert_many(comments)
    print(f"✅ 插入成功，共 {len(result.inserted_ids)} 条评论")

    client.close()


# ====== 3️⃣ 异步执行入口 ======
if __name__ == "__main__":
    asyncio.run(upload_comments())
