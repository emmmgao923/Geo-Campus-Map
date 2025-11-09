from pymongo import MongoClient
import json, os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URL"))
db = client["geo-campus-db"]
events = db["events"]

# 这里粘贴你生成的 event 列表
data = [
  # {
  #   "_id": "1005",
  #   "building_id": "bldg_005",
  #   "type": "activity",
  #   "title": "Outdoor Movie Night",
  #   "content": "Bring a blanket and enjoy a free outdoor movie screening with friends.",
  #   "is_resolved": False,
  #   "likes_count": 7,
  #   "timestamp": "2025-11-08T18:00:00Z"
  # },
  # {
  #   "_id": "1006",
  #   "building_id": "bldg_006",
  #   "type": "study",
  #   "title": "Group Study Session",
  #   "content": "Students are forming a small study group for upcoming exams. Everyone is welcome.",
  #   "is_resolved": False,
  #   "likes_count": 4,
  #   "timestamp": "2025-11-09T10:30:00Z"
  # },
  # {
  #   "_id": "1007",
  #   "building_id": "bldg_007",
  #   "type": "notice",
  #   "title": "Maintenance Work Scheduled",
  #   "content": "Routine maintenance will take place this weekend. Please plan accordingly.",
  #   "is_resolved": False,
  #   "likes_count": 2,
  #   "timestamp": "2025-11-09T07:00:00Z"
  # },
  # {
  #   "_id": "1008",
  #   "building_id": "bldg_008",
  #   "type": "emergency",
  #   "title": "Smoke Detector Alert",
  #   "content": "A smoke detector was triggered briefly. The situation is under control.",
  #   "is_resolved": False,
  #   "likes_count": 3,
  #   "timestamp": "2025-11-08T16:40:00Z"
  # },
  # {
  #   "_id": "1009",
  #   "building_id": "bldg_009",
  #   "type": "activity",
  #   "title": "Art Workshop",
  #   "content": "A creative art session will be hosted this Friday. Materials are provided.",
  #   "is_resolved": False,
  #   "likes_count": 8,
  #   "timestamp": "2025-11-10T15:00:00Z"
  # },
  # {
  #   "_id": "1010",
  #   "building_id": "bldg_010",
  #   "type": "study",
  #   "title": "Exam Review Session",
  #   "content": "A review session will cover key topics for next week's assessment.",
  #   "is_resolved": False,
  #   "likes_count": 6,
  #   "timestamp": "2025-11-09T12:30:00Z"
  # },
  # {
  #   "_id": "1011",
  #   "building_id": "bldg_011",
  #   "type": "notice",
  #   "title": "Network Downtime Notice",
  #   "content": "Internet access will be unavailable for scheduled updates on Monday morning.",
  #   "is_resolved": False,
  #   "likes_count": 1,
  #   "timestamp": "2025-11-10T04:00:00Z"
  # },
  # {
  #   "_id": "1012",
  #   "building_id": "bldg_012",
  #   "type": "activity",
  #   "title": "Board Game Night",
  #   "content": "Enjoy a fun evening of board games and snacks. Open to everyone.",
  #   "is_resolved": False,
  #   "likes_count": 10,
  #   "timestamp": "2025-11-08T20:00:00Z"
  # },
  # {
  #   "_id": "1013",
  #   "building_id": "bldg_013",
  #   "type": "emergency",
  #   "title": "Minor Water Leak",
  #   "content": "A small leak was detected and is being fixed. No immediate danger.",
  #   "is_resolved": False,
  #   "likes_count": 2,
  #   "timestamp": "2025-11-09T08:15:00Z"
  # },
  # {
  #   "_id": "1014",
  #   "building_id": "bldg_014",
  #   "type": "study",
  #   "title": "Peer Tutoring Program",
  #   "content": "Sign up for peer tutoring sessions available this week. Tutors for multiple subjects.",
  #   "is_resolved": False,
  #   "likes_count": 9,
  #   "timestamp": "2025-11-09T11:00:00Z"
  # },
  # {
  #   "_id": "1015",
  #   "building_id": "bldg_015",
  #   "type": "notice",
  #   "title": "Air Conditioning Repair",
  #   "content": "Air conditioning will be temporarily turned off during repairs tomorrow.",
  #   "is_resolved": False,
  #   "likes_count": 0,
  #   "timestamp": "2025-11-09T09:00:00Z"
  # },
  # {
  #   "_id": "1016",
  #   "building_id": "bldg_016",
  #   "type": "activity",
  #   "title": "Career Workshop",
  #   "content": "Join a hands-on session to improve your resume and interview skills.",
  #   "is_resolved": False,
  #   "likes_count": 7,
  #   "timestamp": "2025-11-10T17:00:00Z"
  # },
  # {
  #   "_id": "1017",
  #   "building_id": "bldg_017",
  #   "type": "emergency",
  #   "title": "Power Fluctuation Reported",
  #   "content": "Temporary power instability observed. Technicians are inspecting the issue.",
  #   "is_resolved": False,
  #   "likes_count": 3,
  #   "timestamp": "2025-11-08T13:30:00Z"
  # },
  # {
  #   "_id": "1018",
  #   "building_id": "bldg_018",
  #   "type": "study",
  #   "title": "Late-Night Study Hours",
  #   "content": "Extended quiet hours for students preparing for finals.",
  #   "is_resolved": False,
  #   "likes_count": 5,
  #   "timestamp": "2025-11-10T22:00:00Z"
  # },
  # {
  #   "_id": "1019",
  #   "building_id": "bldg_019",
  #   "type": "notice",
  #   "title": "System Maintenance Notice",
  #   "content": "Certain internal systems may be unavailable during scheduled maintenance.",
  #   "is_resolved": False,
  #   "likes_count": 1,
  #   "timestamp": "2025-11-09T06:00:00Z"
  # },
  # {
  #   "_id": "1020",
  #   "building_id": "bldg_020",
  #   "type": "activity",
  #   "title": "Volunteer Meeting",
  #   "content": "An orientation for new volunteers will take place this weekend.",
  #   "is_resolved": False,
  #   "likes_count": 6,
  #   "timestamp": "2025-11-09T16:00:00Z"
  # },
  # {
  #   "_id": "1021",
  #   "building_id": "bldg_021",
  #   "type": "notice",
  #   "title": "Policy Update Reminder",
  #   "content": "Please review the updated community policy effective from next week.",
  #   "is_resolved": False,
  #   "likes_count": 0,
  #   "timestamp": "2025-11-08T10:00:00Z"
  # },
  # {
  #   "_id": "1022",
  #   "building_id": "bldg_022",
  #   "type": "emergency",
  #   "title": "Unexpected Power Cut",
  #   "content": "A temporary outage occurred earlier today. Services have been restored.",
  #   "is_resolved": False,
  #   "likes_count": 4,
  #   "timestamp": "2025-11-09T03:20:00Z"
  # },
  # {
  #   "_id": "1023",
  #   "building_id": "bldg_023",
  #   "type": "study",
  #   "title": "Workshop on Time Management",
  #   "content": "Improve study efficiency with strategies shared by senior students.",
  #   "is_resolved": False,
  #   "likes_count": 8,
  #   "timestamp": "2025-11-09T14:30:00Z"
  # },
  # {
  #   "_id": "1024",
  #   "building_id": "bldg_024",
  #   "type": "activity",
  #   "title": "Cooking Class",
  #   "content": "Learn quick and easy recipes perfect for busy students.",
  #   "is_resolved": False,
  #   "likes_count": 11,
  #   "timestamp": "2025-11-10T19:00:00Z"
  # },
#   { "_id": "1100", "building_id": "bldg_012", "type": "help", "title": "Lost my water bottle", "content": "Dropped a blue Hydro Flask near the library entrance. Please DM if found.", "is_resolved": False, "likes_count": 4, "timestamp": "2025-11-08T10:15:00Z" },
#   { "_id": "1101", "building_id": "bldg_007", "type": "notice", "title": "Library closed for maintenance", "content": "Library closes at 6 PM today for scheduled maintenance.", "is_resolved": True, "likes_count": 10, "timestamp": "2025-11-07T16:00:00Z" },
#   { "_id": "1102", "building_id": "bldg_021", "type": "study", "title": "STAT310 study group", "content": "Forming a study group for STAT310 midterm. Room 204 at 8:30 PM.", "is_resolved": False, "likes_count": 12, "timestamp": "2025-11-08T20:30:00Z" },
#   { "_id": "1103", "building_id": "bldg_005", "type": "activity", "title": "Outdoor Movie Night", "content": "Bring a blanket and enjoy a free outdoor movie screening with friends.", "is_resolved": False, "likes_count": 7, "timestamp": "2025-11-08T18:00:00Z" },
#   { "_id": "1104", "building_id": "bldg_034", "type": "food", "title": "Free donuts at Campus Center", "content": "Stop by the Campus Center lobby at 10 AM for free coffee and donuts!", "is_resolved": True, "likes_count": 19, "timestamp": "2025-11-09T15:00:00Z" },
#   { "_id": "1105", "building_id": "bldg_019", "type": "emergency", "title": "Fire drill notification", "content": "Fire drill tomorrow at 9 AM. Please evacuate calmly when the alarm sounds.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-06T14:00:00Z" },
#   { "_id": "1106", "building_id": "bldg_008", "type": "help", "title": "Need a calculus tutor", "content": "Looking for help with derivatives before Tuesday’s quiz.", "is_resolved": False, "likes_count": 3, "timestamp": "2025-11-09T12:45:00Z" },
#   { "_id": "1107", "building_id": "bldg_002", "type": "study", "title": "CS230 coding session", "content": "Project 3 group session at 7 PM in the lounge.", "is_resolved": True, "likes_count": 8, "timestamp": "2025-11-08T19:00:00Z" },
#   { "_id": "1108", "building_id": "bldg_016", "type": "activity", "title": "Art club painting workshop", "content": "Free painting session. Materials provided.", "is_resolved": False, "likes_count": 11, "timestamp": "2025-11-05T17:30:00Z" },
#   { "_id": "1109", "building_id": "bldg_011", "type": "notice", "title": "Wi-Fi outage update", "content": "IT reports Wi-Fi issues in dorms. Expected fix by 5 PM.", "is_resolved": False, "likes_count": 5, "timestamp": "2025-11-09T09:00:00Z" },

#   { "_id": "1110", "building_id": "bldg_029", "type": "food", "title": "Free pizza at game night", "content": "Rec center game night — pizza and drinks provided!", "is_resolved": False, "likes_count": 23, "timestamp": "2025-11-08T21:00:00Z" },
#   { "_id": "1111", "building_id": "bldg_033", "type": "other", "title": "Looking for gym partner", "content": "Anyone up for 7 AM workouts at the gym?", "is_resolved": False, "likes_count": 6, "timestamp": "2025-11-06T13:30:00Z" },
#   { "_id": "1112", "building_id": "bldg_025", "type": "emergency", "title": "Temporary power outage", "content": "Power outage in Building 25. Await updates.", "is_resolved": True, "likes_count": 1, "timestamp": "2025-11-08T06:00:00Z" },
#   { "_id": "1113", "building_id": "bldg_009", "type": "study", "title": "ECON homework help", "content": "Going through problem set 5 together.", "is_resolved": False, "likes_count": 9, "timestamp": "2025-11-09T20:15:00Z" },
#   { "_id": "1114", "building_id": "bldg_017", "type": "activity", "title": "Chess club meetup", "content": "Weekly chess session in the lounge. All levels welcome.", "is_resolved": True, "likes_count": 13, "timestamp": "2025-11-08T16:00:00Z" },
#   { "_id": "1115", "building_id": "bldg_023", "type": "help", "title": "Lost student ID", "content": "Lost UMass ID near the dining hall. Please reach out.", "is_resolved": False, "likes_count": 2, "timestamp": "2025-11-09T08:00:00Z" },
#   { "_id": "1116", "building_id": "bldg_030", "type": "notice", "title": "Elevator inspection", "content": "Maintenance from 2–4 PM. Use stairs during this time.", "is_resolved": True, "likes_count": 4, "timestamp": "2025-11-07T10:00:00Z" },
#   { "_id": "1117", "building_id": "bldg_001", "type": "food", "title": "Bake sale fundraiser", "content": "Support our club with homemade cookies and brownies!", "is_resolved": False, "likes_count": 16, "timestamp": "2025-11-09T14:30:00Z" },
#   { "_id": "1118", "building_id": "bldg_022", "type": "study", "title": "CS240 review session", "content": "Reviewing key algorithms and data structures.", "is_resolved": False, "likes_count": 14, "timestamp": "2025-11-08T22:00:00Z" },
#   { "_id": "1119", "building_id": "bldg_027", "type": "other", "title": "Umbrella exchange box", "content": "Take one, leave one near the main entrance.", "is_resolved": True, "likes_count": 3, "timestamp": "2025-11-06T11:30:00Z" },

#   { "_id": "1120", "building_id": "bldg_040", "type": "notice", "title": "HVAC tune-up complete", "content": "Heating restored across floors 3–6.", "is_resolved": True, "likes_count": 5, "timestamp": "2025-11-05T15:20:00Z" },
#   { "_id": "1121", "building_id": "bldg_004", "type": "help", "title": "Found AirPods case", "content": "White case found by vending machines. Describe to claim.", "is_resolved": False, "likes_count": 7, "timestamp": "2025-11-09T11:05:00Z" },
#   { "_id": "1122", "building_id": "bldg_014", "type": "study", "title": "Linear Algebra office hours", "content": "Peer help in study room B, 6–8 PM.", "is_resolved": False, "likes_count": 6, "timestamp": "2025-11-07T23:00:00Z" },
#   { "_id": "1123", "building_id": "bldg_006", "type": "activity", "title": "Board games night", "content": "Catan, Ticket to Ride, and more. Bring friends!", "is_resolved": False, "likes_count": 15, "timestamp": "2025-11-08T01:30:00Z" },
#   { "_id": "1124", "building_id": "bldg_013", "type": "food", "title": "Soup pop-up", "content": "Warm soup stand outside at noon. First come first served.", "is_resolved": True, "likes_count": 9, "timestamp": "2025-11-09T17:45:00Z" },
#   { "_id": "1125", "building_id": "bldg_031", "type": "emergency", "title": "Water leak reported", "content": "Facilities en route. Avoid corridor C.", "is_resolved": True, "likes_count": 1, "timestamp": "2025-11-09T03:50:00Z" },
#   { "_id": "1126", "building_id": "bldg_020", "type": "other", "title": "Camera club call for submissions", "content": "Submit fall campus photos by Friday.", "is_resolved": False, "likes_count": 8, "timestamp": "2025-11-07T18:10:00Z" },
#   { "_id": "1127", "building_id": "bldg_018", "type": "study", "title": "Discrete Math proofs circle", "content": "Informal proofs jam, room 310.", "is_resolved": False, "likes_count": 5, "timestamp": "2025-11-06T20:40:00Z" },
#   { "_id": "1128", "building_id": "bldg_010", "type": "help", "title": "Borrow a charger?", "content": "Need USB-C charger for one hour near café.", "is_resolved": True, "likes_count": 12, "timestamp": "2025-11-09T10:20:00Z" },
#   { "_id": "1129", "building_id": "bldg_032", "type": "notice", "title": "Quiet hours reminder", "content": "Quiet hours start 11 PM. Please be considerate.", "is_resolved": False, "likes_count": 4, "timestamp": "2025-11-05T02:10:00Z" },

#   { "_id": "1130", "building_id": "bldg_003", "type": "activity", "title": "Morning yoga on the quad", "content": "Free beginner session. Mats available.", "is_resolved": False, "likes_count": 18, "timestamp": "2025-11-09T12:00:00Z" },
#   { "_id": "1131", "building_id": "bldg_015", "type": "food", "title": "Late-night noodles", "content": "Pop-up stand 10 PM outside north gate.", "is_resolved": False, "likes_count": 21, "timestamp": "2025-11-08T02:15:00Z" },
#   { "_id": "1132", "building_id": "bldg_036", "type": "emergency", "title": "First aid training sign-up", "content": "Limited slots. Session next Wednesday.", "is_resolved": True, "likes_count": 3, "timestamp": "2025-11-07T09:45:00Z" },
#   { "_id": "1133", "building_id": "bldg_026", "type": "study", "title": "Python interview prep", "content": "Mock questions and whiteboard practice.", "is_resolved": False, "likes_count": 17, "timestamp": "2025-11-08T23:20:00Z" },
#   { "_id": "1134", "building_id": "bldg_028", "type": "help", "title": "Anyone seen a black scarf?", "content": "Lost near the south entrance bench.", "is_resolved": False, "likes_count": 2, "timestamp": "2025-11-06T07:30:00Z" },
#   { "_id": "1135", "building_id": "bldg_024", "type": "notice", "title": "Parcel room hours extended", "content": "Now open until 8 PM this week.", "is_resolved": True, "likes_count": 6, "timestamp": "2025-11-05T19:10:00Z" },
#   { "_id": "1136", "building_id": "bldg_039", "type": "activity", "title": "Improv comedy night", "content": "Open mic at the café stage.", "is_resolved": False, "likes_count": 13, "timestamp": "2025-11-09T01:05:00Z" },
#   { "_id": "1137", "building_id": "bldg_008", "type": "food", "title": "Cider & donuts social", "content": "Courtyard at 4 PM. While supplies last.", "is_resolved": True, "likes_count": 14, "timestamp": "2025-11-09T21:10:00Z" },
#   { "_id": "1138", "building_id": "bldg_005", "type": "other", "title": "Lost & found shelf update", "content": "Items will be donated after Friday.", "is_resolved": False, "likes_count": 5, "timestamp": "2025-11-07T12:25:00Z" },
#   { "_id": "1139", "building_id": "bldg_037", "type": "study", "title": "Data structures TA review", "content": "Stacks/queues/trees rundown, room 120.", "is_resolved": False, "likes_count": 20, "timestamp": "2025-11-08T18:40:00Z" },

#   { "_id": "1140", "building_id": "bldg_002", "type": "emergency", "title": "Safety escort info", "content": "Call campus safety for late-night escort.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-05T22:55:00Z" },
#   { "_id": "1141", "building_id": "bldg_018", "type": "notice", "title": "Printer paper restocked", "content": "All printers have fresh paper/toner.", "is_resolved": True, "likes_count": 3, "timestamp": "2025-11-06T09:05:00Z" },
#   { "_id": "1142", "building_id": "bldg_033", "type": "help", "title": "Need spare lab goggles", "content": "Forgot mine for CHEM lab at 3 PM.", "is_resolved": False, "likes_count": 4, "timestamp": "2025-11-09T13:25:00Z" },
#   { "_id": "1143", "building_id": "bldg_011", "type": "study", "title": "Quiet reading circle", "content": "Bring a book; silent reading for 1 hour.", "is_resolved": False, "likes_count": 7, "timestamp": "2025-11-06T16:35:00Z" },
#   { "_id": "1144", "building_id": "bldg_035", "type": "activity", "title": "Photography walk", "content": "Golden-hour campus walk, meet at west gate.", "is_resolved": False, "likes_count": 22, "timestamp": "2025-11-09T20:00:00Z" },
#   { "_id": "1145", "building_id": "bldg_030", "type": "food", "title": "Veggie wrap promo", "content": "Café special: buy one get one half off.", "is_resolved": True, "likes_count": 9, "timestamp": "2025-11-07T13:15:00Z" },
#   { "_id": "1146", "building_id": "bldg_022", "type": "other", "title": "Sustainability committee Q&A", "content": "Open meeting Thursday 5 PM.", "is_resolved": False, "likes_count": 6, "timestamp": "2025-11-05T21:40:00Z" },
#   { "_id": "1147", "building_id": "bldg_004", "type": "study", "title": "Late-night study hall", "content": "Rooms 101–103 open until 2 AM.", "is_resolved": True, "likes_count": 18, "timestamp": "2025-11-08T03:30:00Z" },
#   { "_id": "1148", "building_id": "bldg_027", "type": "help", "title": "Bike lock jammed", "content": "Anyone with lube/WD-40 near bike racks?", "is_resolved": False, "likes_count": 5, "timestamp": "2025-11-06T18:05:00Z" },
#   { "_id": "1149", "building_id": "bldg_001", "type": "emergency", "title": "AED location reminder", "content": "AEDs on floors 1 and 3 near elevators.", "is_resolved": True, "likes_count": 4, "timestamp": "2025-11-05T08:20:00Z" },
#     { "_id": "1151", "building_id": "bldg_028", "type": "notice", "title": "Water supply interruption", "content": "Water will be temporarily unavailable between 2–4 PM for maintenance.", "is_resolved": True, "likes_count": 3, "timestamp": "2025-11-09T08:40:00Z" },
#   { "_id": "1152", "building_id": "bldg_019", "type": "study", "title": "STAT525 homework discussion", "content": "Let’s go through HW8 together in the study lounge at 6 PM.", "is_resolved": False, "likes_count": 12, "timestamp": "2025-11-08T23:10:00Z" },
#   { "_id": "1153", "building_id": "bldg_031", "type": "activity", "title": "Campus trivia night", "content": "Compete in trivia for prizes! Hosted at the student center.", "is_resolved": False, "likes_count": 19, "timestamp": "2025-11-09T18:20:00Z" },
#   { "_id": "1154", "building_id": "bldg_014", "type": "food", "title": "Coffee & bagels morning", "content": "Free breakfast event 8–10 AM in the lounge.", "is_resolved": True, "likes_count": 20, "timestamp": "2025-11-08T13:00:00Z" },
#   { "_id": "1155", "building_id": "bldg_036", "type": "emergency", "title": "Smoke alarm test", "content": "Testing alarms at 10 AM tomorrow. No need to evacuate.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-09T01:00:00Z" },
#   { "_id": "1156", "building_id": "bldg_002", "type": "other", "title": "Seeking roommate", "content": "Looking for a quiet roommate for spring semester.", "is_resolved": False, "likes_count": 11, "timestamp": "2025-11-09T15:25:00Z" },
#   { "_id": "1157", "building_id": "bldg_012", "type": "study", "title": "CS345 review meetup", "content": "We’re reviewing SQL queries for the quiz at 7 PM.", "is_resolved": False, "likes_count": 10, "timestamp": "2025-11-09T19:30:00Z" },
#   { "_id": "1158", "building_id": "bldg_005", "type": "help", "title": "Lost my notebook", "content": "Red spiral notebook left in classroom 203.", "is_resolved": False, "likes_count": 3, "timestamp": "2025-11-08T20:10:00Z" },
#   { "_id": "1159", "building_id": "bldg_040", "type": "activity", "title": "Sustainability fair", "content": "Learn about campus green initiatives and free giveaways!", "is_resolved": False, "likes_count": 16, "timestamp": "2025-11-09T17:15:00Z" },

#   { "_id": "1160", "building_id": "bldg_011", "type": "food", "title": "Hot chocolate stand", "content": "Come warm up with free hot cocoa in the courtyard.", "is_resolved": True, "likes_count": 14, "timestamp": "2025-11-08T18:30:00Z" },
#   { "_id": "1161", "building_id": "bldg_023", "type": "notice", "title": "Study lounge repainting", "content": "The study lounge will be closed this Friday for repainting.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-07T09:50:00Z" },
#   { "_id": "1162", "building_id": "bldg_018", "type": "study", "title": "MATH233 review circle", "content": "Going over integration techniques before the exam.", "is_resolved": False, "likes_count": 6, "timestamp": "2025-11-08T16:05:00Z" },
#   { "_id": "1163", "building_id": "bldg_017", "type": "other", "title": "Book exchange shelf", "content": "Bring a book, take a book! Shelf on 2nd floor lounge.", "is_resolved": False, "likes_count": 5, "timestamp": "2025-11-06T13:40:00Z" },
#   { "_id": "1164", "building_id": "bldg_008", "type": "help", "title": "Lost earbuds", "content": "Left AirPods in study room B. Please DM if found.", "is_resolved": False, "likes_count": 7, "timestamp": "2025-11-09T14:30:00Z" },
#   { "_id": "1165", "building_id": "bldg_034", "type": "activity", "title": "Poetry open mic", "content": "Share your poetry or just come to listen! 6:30 PM.", "is_resolved": False, "likes_count": 18, "timestamp": "2025-11-08T22:40:00Z" },
#   { "_id": "1166", "building_id": "bldg_001", "type": "food", "title": "Café happy hour", "content": "Half-price drinks from 2–4 PM today.", "is_resolved": True, "likes_count": 22, "timestamp": "2025-11-09T13:00:00Z" },
#   { "_id": "1167", "building_id": "bldg_039", "type": "emergency", "title": "Storm alert", "content": "Thunderstorms expected at 8 PM. Stay indoors.", "is_resolved": True, "likes_count": 3, "timestamp": "2025-11-09T00:45:00Z" },
#   { "_id": "1168", "building_id": "bldg_021", "type": "study", "title": "Coding interview prep", "content": "Mock interview practice in lab 102.", "is_resolved": False, "likes_count": 8, "timestamp": "2025-11-08T21:25:00Z" },
#   { "_id": "1169", "building_id": "bldg_010", "type": "notice", "title": "Printing outage", "content": "Printers offline for maintenance until 5 PM.", "is_resolved": True, "likes_count": 1, "timestamp": "2025-11-07T12:10:00Z" },

#   { "_id": "1170", "building_id": "bldg_006", "type": "activity", "title": "Board game marathon", "content": "24-hour gaming challenge! Snacks provided.", "is_resolved": False, "likes_count": 24, "timestamp": "2025-11-09T09:20:00Z" },
#   { "_id": "1171", "building_id": "bldg_022", "type": "food", "title": "Thanksgiving potluck", "content": "Bring your favorite dish to share.", "is_resolved": False, "likes_count": 27, "timestamp": "2025-11-08T19:40:00Z" },
#   { "_id": "1172", "building_id": "bldg_029", "type": "help", "title": "Lost wallet", "content": "Black leather wallet lost near rec center.", "is_resolved": False, "likes_count": 4, "timestamp": "2025-11-08T20:55:00Z" },
#   { "_id": "1173", "building_id": "bldg_035", "type": "study", "title": "Group project meetup", "content": "Team 3 meeting tonight at 9 PM.", "is_resolved": False, "likes_count": 5, "timestamp": "2025-11-09T01:25:00Z" },
#   { "_id": "1174", "building_id": "bldg_003", "type": "notice", "title": "Elevator temporarily closed", "content": "Elevator under inspection until further notice.", "is_resolved": True, "likes_count": 3, "timestamp": "2025-11-07T07:50:00Z" },
#   { "_id": "1175", "building_id": "bldg_038", "type": "other", "title": "Volunteers needed", "content": "Looking for helpers for community event this weekend.", "is_resolved": False, "likes_count": 6, "timestamp": "2025-11-09T16:50:00Z" },
#   { "_id": "1176", "building_id": "bldg_016", "type": "activity", "title": "Movie marathon", "content": "Join us for a Marvel night in the common room!", "is_resolved": False, "likes_count": 21, "timestamp": "2025-11-08T18:55:00Z" },
#   { "_id": "1177", "building_id": "bldg_015", "type": "food", "title": "Popcorn giveaway", "content": "Free popcorn at the quad from 3–5 PM.", "is_resolved": True, "likes_count": 11, "timestamp": "2025-11-09T14:35:00Z" },
#   { "_id": "1178", "building_id": "bldg_030", "type": "emergency", "title": "Minor water leak", "content": "Facilities notified. Avoid corridor B.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-09T02:45:00Z" },
#   { "_id": "1179", "building_id": "bldg_027", "type": "study", "title": "Statistics tutoring session", "content": "Free drop-in tutoring 4–6 PM.", "is_resolved": False, "likes_count": 14, "timestamp": "2025-11-08T22:50:00Z" },

#   { "_id": "1180", "building_id": "bldg_020", "type": "help", "title": "Phone charger request", "content": "Anyone have a USB-C charger near lounge 205?", "is_resolved": False, "likes_count": 3, "timestamp": "2025-11-09T13:05:00Z" },
#   { "_id": "1181", "building_id": "bldg_025", "type": "notice", "title": "Fire safety training", "content": "Mandatory session tomorrow at 9 AM.", "is_resolved": True, "likes_count": 5, "timestamp": "2025-11-07T15:30:00Z" },
#   { "_id": "1182", "building_id": "bldg_024", "type": "activity", "title": "Dance workshop", "content": "Beginners welcome! Starts at 6 PM.", "is_resolved": False, "likes_count": 13, "timestamp": "2025-11-09T17:45:00Z" },
#   { "_id": "1183", "building_id": "bldg_032", "type": "food", "title": "Campus farmers market", "content": "Fresh produce at great prices!", "is_resolved": False, "likes_count": 25, "timestamp": "2025-11-09T11:55:00Z" },
#   { "_id": "1184", "building_id": "bldg_026", "type": "emergency", "title": "Power restoration complete", "content": "Electricity restored to all floors.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-09T05:15:00Z" },
#   { "_id": "1185", "building_id": "bldg_004", "type": "study", "title": "Exam stress relief", "content": "Join mindfulness session before finals week.", "is_resolved": False, "likes_count": 10, "timestamp": "2025-11-09T20:30:00Z" },
#   { "_id": "1186", "building_id": "bldg_033", "type": "help", "title": "Need moving boxes", "content": "Anyone has spare cardboard boxes?", "is_resolved": False, "likes_count": 4, "timestamp": "2025-11-08T18:00:00Z" },
#   { "_id": "1187", "building_id": "bldg_013", "type": "other", "title": "Photography contest", "content": "Submit your campus shots by Nov 15.", "is_resolved": False, "likes_count": 17, "timestamp": "2025-11-08T21:10:00Z" },
#   { "_id": "1188", "building_id": "bldg_037", "type": "activity", "title": "Karaoke night", "content": "Sing your favorite songs! Starts 8 PM.", "is_resolved": False, "likes_count": 29, "timestamp": "2025-11-09T19:55:00Z" },
#   { "_id": "1189", "building_id": "bldg_007", "type": "notice", "title": "Laundry machine fixed", "content": "Washing machines are back online.", "is_resolved": True, "likes_count": 6, "timestamp": "2025-11-08T12:35:00Z" },

#   { "_id": "1190", "building_id": "bldg_009", "type": "food", "title": "Midnight snack bar", "content": "Snacks available from 11 PM to 1 AM.", "is_resolved": False, "likes_count": 30, "timestamp": "2025-11-09T23:10:00Z" },
#   { "_id": "1191", "building_id": "bldg_019", "type": "study", "title": "Linear regression workshop", "content": "Hands-on tutorial with R examples.", "is_resolved": False, "likes_count": 19, "timestamp": "2025-11-09T17:20:00Z" },
#   { "_id": "1192", "building_id": "bldg_038", "type": "other", "title": "Community art project", "content": "Help paint the new mural outside.", "is_resolved": False, "likes_count": 9, "timestamp": "2025-11-09T09:50:00Z" },
#   { "_id": "1193", "building_id": "bldg_012", "type": "activity", "title": "Open mic night", "content": "Perform music or comedy! 7–9 PM.", "is_resolved": False, "likes_count": 22, "timestamp": "2025-11-09T18:45:00Z" },
#   { "_id": "1194", "building_id": "bldg_008", "type": "help", "title": "Need printer ink", "content": "Out of ink before deadline, any help?", "is_resolved": False, "likes_count": 3, "timestamp": "2025-11-09T16:35:00Z" },
#   { "_id": "1195", "building_id": "bldg_014", "type": "notice", "title": "Lost & found updated", "content": "Collected items will be donated on Friday.", "is_resolved": True, "likes_count": 4, "timestamp": "2025-11-08T11:05:00Z" },
#   { "_id": "1196", "building_id": "bldg_005", "type": "study", "title": "ML paper reading group", "content": "Discussing transformers and LLMs.", "is_resolved": False, "likes_count": 26, "timestamp": "2025-11-09T15:10:00Z" },
#   { "_id": "1197", "building_id": "bldg_011", "type": "food", "title": "Vegan bake sale", "content": "Cupcakes and cookies! All proceeds to charity.", "is_resolved": True, "likes_count": 16, "timestamp": "2025-11-09T10:25:00Z" },
#   { "_id": "1198", "building_id": "bldg_030", "type": "emergency", "title": "Elevator service restored", "content": "Elevator now fully operational.", "is_resolved": True, "likes_count": 2, "timestamp": "2025-11-09T04:00:00Z"},
#   { "_id": "1199", "building_id": "bldg_016", "type": "other", "title": "Language exchange meetup", "content": "Practice English, Mandarin, or Spanish — open to all!", "is_resolved": False, "likes_count": 15, "timestamp": "2025-11-09T21:50:00Z" },
#   { "_id": "1200", "building_id": "bldg_024", "type": "activity", "title": "Sunset photography walk", "content": "Meet at the west quad at 5 PM, bring your camera!", "is_resolved": False, "likes_count": 18, "timestamp": "2025-11-09T17:55:00Z" }



  # ... 继续粘贴
]

events.insert_many(data)
print(f"Inserted {len(data)} events successfully!")
