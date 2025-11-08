from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import events

app = FastAPI(title="GeoChat API", version="1.0")

# Allow frontend calls (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register only the events router
app.include_router(events.router)

@app.get("/")
def root():
    return {"message": "Welcome to GeoChat API (no auth yet)"}
