from pymongo import MongoClient
import json, os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URL"))
db = client["geo-campus-db"]
events = db["events"]

# 这里粘贴你生成的 event 列表
data = [
  {
    "_id": "1005",
    "building_id": "bldg_005",
    "type": "activity",
    "title": "Outdoor Movie Night",
    "content": "Bring a blanket and enjoy a free outdoor movie screening with friends.",
    "is_resolved": False,
    "likes_count": 7,
    "timestamp": "2025-11-08T18:00:00Z"
  },
  {
    "_id": "1006",
    "building_id": "bldg_006",
    "type": "study",
    "title": "Group Study Session",
    "content": "Students are forming a small study group for upcoming exams. Everyone is welcome.",
    "is_resolved": False,
    "likes_count": 4,
    "timestamp": "2025-11-09T10:30:00Z"
  },
  {
    "_id": "1007",
    "building_id": "bldg_007",
    "type": "notice",
    "title": "Maintenance Work Scheduled",
    "content": "Routine maintenance will take place this weekend. Please plan accordingly.",
    "is_resolved": False,
    "likes_count": 2,
    "timestamp": "2025-11-09T07:00:00Z"
  },
  {
    "_id": "1008",
    "building_id": "bldg_008",
    "type": "emergency",
    "title": "Smoke Detector Alert",
    "content": "A smoke detector was triggered briefly. The situation is under control.",
    "is_resolved": False,
    "likes_count": 3,
    "timestamp": "2025-11-08T16:40:00Z"
  },
  {
    "_id": "1009",
    "building_id": "bldg_009",
    "type": "activity",
    "title": "Art Workshop",
    "content": "A creative art session will be hosted this Friday. Materials are provided.",
    "is_resolved": False,
    "likes_count": 8,
    "timestamp": "2025-11-10T15:00:00Z"
  },
  {
    "_id": "1010",
    "building_id": "bldg_010",
    "type": "study",
    "title": "Exam Review Session",
    "content": "A review session will cover key topics for next week's assessment.",
    "is_resolved": False,
    "likes_count": 6,
    "timestamp": "2025-11-09T12:30:00Z"
  },
  {
    "_id": "1011",
    "building_id": "bldg_011",
    "type": "notice",
    "title": "Network Downtime Notice",
    "content": "Internet access will be unavailable for scheduled updates on Monday morning.",
    "is_resolved": False,
    "likes_count": 1,
    "timestamp": "2025-11-10T04:00:00Z"
  },
  {
    "_id": "1012",
    "building_id": "bldg_012",
    "type": "activity",
    "title": "Board Game Night",
    "content": "Enjoy a fun evening of board games and snacks. Open to everyone.",
    "is_resolved": False,
    "likes_count": 10,
    "timestamp": "2025-11-08T20:00:00Z"
  },
  {
    "_id": "1013",
    "building_id": "bldg_013",
    "type": "emergency",
    "title": "Minor Water Leak",
    "content": "A small leak was detected and is being fixed. No immediate danger.",
    "is_resolved": False,
    "likes_count": 2,
    "timestamp": "2025-11-09T08:15:00Z"
  },
  {
    "_id": "1014",
    "building_id": "bldg_014",
    "type": "study",
    "title": "Peer Tutoring Program",
    "content": "Sign up for peer tutoring sessions available this week. Tutors for multiple subjects.",
    "is_resolved": False,
    "likes_count": 9,
    "timestamp": "2025-11-09T11:00:00Z"
  },
  {
    "_id": "1015",
    "building_id": "bldg_015",
    "type": "notice",
    "title": "Air Conditioning Repair",
    "content": "Air conditioning will be temporarily turned off during repairs tomorrow.",
    "is_resolved": False,
    "likes_count": 0,
    "timestamp": "2025-11-09T09:00:00Z"
  },
  {
    "_id": "1016",
    "building_id": "bldg_016",
    "type": "activity",
    "title": "Career Workshop",
    "content": "Join a hands-on session to improve your resume and interview skills.",
    "is_resolved": False,
    "likes_count": 7,
    "timestamp": "2025-11-10T17:00:00Z"
  },
  {
    "_id": "1017",
    "building_id": "bldg_017",
    "type": "emergency",
    "title": "Power Fluctuation Reported",
    "content": "Temporary power instability observed. Technicians are inspecting the issue.",
    "is_resolved": False,
    "likes_count": 3,
    "timestamp": "2025-11-08T13:30:00Z"
  },
  {
    "_id": "1018",
    "building_id": "bldg_018",
    "type": "study",
    "title": "Late-Night Study Hours",
    "content": "Extended quiet hours for students preparing for finals.",
    "is_resolved": False,
    "likes_count": 5,
    "timestamp": "2025-11-10T22:00:00Z"
  },
  {
    "_id": "1019",
    "building_id": "bldg_019",
    "type": "notice",
    "title": "System Maintenance Notice",
    "content": "Certain internal systems may be unavailable during scheduled maintenance.",
    "is_resolved": False,
    "likes_count": 1,
    "timestamp": "2025-11-09T06:00:00Z"
  },
  {
    "_id": "1020",
    "building_id": "bldg_020",
    "type": "activity",
    "title": "Volunteer Meeting",
    "content": "An orientation for new volunteers will take place this weekend.",
    "is_resolved": False,
    "likes_count": 6,
    "timestamp": "2025-11-09T16:00:00Z"
  },
  {
    "_id": "1021",
    "building_id": "bldg_021",
    "type": "notice",
    "title": "Policy Update Reminder",
    "content": "Please review the updated community policy effective from next week.",
    "is_resolved": False,
    "likes_count": 0,
    "timestamp": "2025-11-08T10:00:00Z"
  },
  {
    "_id": "1022",
    "building_id": "bldg_022",
    "type": "emergency",
    "title": "Unexpected Power Cut",
    "content": "A temporary outage occurred earlier today. Services have been restored.",
    "is_resolved": False,
    "likes_count": 4,
    "timestamp": "2025-11-09T03:20:00Z"
  },
  {
    "_id": "1023",
    "building_id": "bldg_023",
    "type": "study",
    "title": "Workshop on Time Management",
    "content": "Improve study efficiency with strategies shared by senior students.",
    "is_resolved": False,
    "likes_count": 8,
    "timestamp": "2025-11-09T14:30:00Z"
  },
  {
    "_id": "1024",
    "building_id": "bldg_024",
    "type": "activity",
    "title": "Cooking Class",
    "content": "Learn quick and easy recipes perfect for busy students.",
    "is_resolved": False,
    "likes_count": 11,
    "timestamp": "2025-11-10T19:00:00Z"
  }


  # ... 继续粘贴
]

events.insert_many(data)
print(f"✅ Inserted {len(data)} events successfully!")
