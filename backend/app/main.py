from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import settings
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import RateLimiterMiddleware
from app.api import auth, profile, admin, organizations, teams, subscriptions, files, chat, audit, vuln

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configurations for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Apply protection middlewares
app.add_middleware(LoggingMiddleware)
app.add_middleware(RateLimiterMiddleware, requests_limit=100, window_seconds=60)

# Register Router modules
app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(organizations.router, prefix="/api/v1")
app.include_router(teams.router, prefix="/api/v1")
app.include_router(subscriptions.router, prefix="/api/v1")
app.include_router(files.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(audit.router, prefix="/api/v1")

# Register Intentionally Vulnerable Security Lab Router (isolated and toggle-controlled)
app.include_router(vuln.router, prefix="/api/v1")

@app.get("/api/v1/")
@app.get("/api/v1")
def read_v1_root():
    return {"message": "Welcome to the QA Lab API V1", "vuln_lab_enabled": settings.ENABLE_VULNERABILITY_LAB}

import os
import json

@app.get("/api/v1/announcement")
def get_system_announcement():
    announcement_path = os.path.join(os.path.dirname(__file__), "config", "announcement.json")
    try:
        if os.path.exists(announcement_path):
            with open(announcement_path, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return {"banner_text": "", "banner_type": "info", "is_active": False}

@app.get("/")
def read_root():
    return {"message": "Welcome to the QA Lab API", "vuln_lab_enabled": settings.ENABLE_VULNERABILITY_LAB}


