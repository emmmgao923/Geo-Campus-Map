from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.events import router as event_router
from app.routes.authentication import router as auth_router
from app.routes.comments import router as comment_router
from app.routes.achivement import router as achivement_router


app = FastAPI(title="Geo Campus API", version="1.0")

# Allow frontend calls (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(event_router)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(comment_router)
app.include_router(achivement_router)


@app.get("/")
def root():
    return {"message": "Welcome to GeoChat API (no auth yet)"}
