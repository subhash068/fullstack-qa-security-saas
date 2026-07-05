from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import UserResponse, UserUpdate, UserCreate, AdminDashboardStats, AuditLogResponse
from app.models.models import User, AuditLog
from app.security.dependencies import check_admin
from app.services.user_service import UserService
from app.services.admin_service import AdminService
from app.config.config import settings
from typing import List
import uuid
import os

router = APIRouter(tags=["Admin Management"], dependencies=[Depends(check_admin)])

# ==========================================
# Admin Telemetry & Statistics
# ==========================================

@router.get("/dashboard", response_model=AdminDashboardStats)
@router.get("/admin/dashboard", response_model=AdminDashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    admin_service = AdminService(db)
    return admin_service.get_dashboard_stats()

@router.get("/statistics", response_model=AdminDashboardStats)
@router.get("/admin/statistics", response_model=AdminDashboardStats)
def get_statistics(db: Session = Depends(get_db)):
    admin_service = AdminService(db)
    return admin_service.get_dashboard_stats()

@router.get("/audit-logs", response_model=List[AuditLogResponse])
@router.get("/admin/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(limit: int = 100, db: Session = Depends(get_db)):
    admin_service = AdminService(db)
    return admin_service.get_audit_logs(limit)

@router.get("/system-health")
@router.get("/admin/system-health")
def get_system_health(db: Session = Depends(get_db)):
    admin_service = AdminService(db)
    return admin_service.get_system_health()

@router.post("/simulate-attack")
@router.post("/admin/simulate-attack")
def simulate_attack(db: Session = Depends(get_db)):
    admin_service = AdminService(db)
    admin_service.simulate_attack_logs()
    return {"detail": "Attack logs successfully simulated"}

@router.post("/clear-logs")
@router.post("/admin/clear-logs")
def clear_logs(db: Session = Depends(get_db)):
    admin_service = AdminService(db)
    admin_service.clear_audit_logs()
    return {"detail": "All logs successfully cleared"}


# ==========================================
# Toggle Security Lab Status
# ==========================================

@router.post("/toggle-lab")
@router.post("/admin/toggle-lab")
def toggle_vulnerability_lab(enabled: bool):
    # 1. Update runtime memory config setting
    settings.ENABLE_VULNERABILITY_LAB = enabled
    
    # 2. Persist state change back to the backend/.env file
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r") as f:
                lines = f.readlines()
            
            updated = False
            for idx, line in enumerate(lines):
                if line.startswith("ENABLE_VULNERABILITY_LAB="):
                    lines[idx] = f"ENABLE_VULNERABILITY_LAB={str(enabled).lower()}\n"
                    updated = True
                    break
            
            if not updated:
                lines.append(f"ENABLE_VULNERABILITY_LAB={str(enabled).lower()}\n")
                
            with open(env_path, "w") as f:
                f.writelines(lines)
        except Exception as e:
            # Fallback if filesystem write encounters permission blocks
            print(f"[ERROR] Failed to write to .env: {str(e)}")
            
    return {"detail": "Vulnerability lab status updated successfully", "vuln_lab_enabled": settings.ENABLE_VULNERABILITY_LAB}

# ==========================================
# User Account Management CRUD
# ==========================================

@router.get("/users", response_model=List[UserResponse])
@router.get("/admin/users", response_model=List[UserResponse])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.list_users(skip, limit)

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@router.post("/admin/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_by_admin(user_in: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.create_user_by_admin(user_in)

@router.get("/users/{id}", response_model=UserResponse)
@router.get("/admin/users/{id}", response_model=UserResponse)
def get_user_by_id(id: uuid.UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_user_by_id(id)

@router.put("/users/{id}", response_model=UserResponse)
@router.put("/admin/users/{id}", response_model=UserResponse)
def update_user(id: uuid.UUID, update_in: UserUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.update_user_by_admin(id, update_in)

@router.delete("/users/{id}")
@router.delete("/admin/users/{id}")
def delete_user(id: uuid.UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user_service.delete_user_by_admin(id)
    return {"detail": "User deleted successfully"}

import os
import json

@router.post("/announcement")
@router.post("/admin/announcement")
def update_announcement(data: dict):
    announcement_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config", "announcement.json")
    try:
        with open(announcement_path, "w") as f:
            json.dump({
                "banner_text": data.get("banner_text", ""),
                "banner_type": data.get("banner_type", "info"),
                "is_active": data.get("is_active", True)
            }, f, indent=2)
        return {"detail": "System announcement updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save announcement: {str(e)}")

