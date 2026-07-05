from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import AuditLogResponse
from app.models.models import AuditLog, AuditTrail, User
from app.security.dependencies import get_current_user, check_admin
from uuid import UUID
from typing import List, Any, Optional

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = 100,
    current_user: User = Depends(check_admin),
    db: Session = Depends(get_db)
):
    # Only Admin can view application audit logs
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()

@router.get("/trail")
def get_database_trail(
    limit: int = 100,
    current_user: User = Depends(check_admin),
    db: Session = Depends(get_db)
):
    # Retrieve low-level DML audit changes (replaces trigger audits views)
    result = db.query(AuditTrail).order_by(AuditTrail.changed_at.desc()).limit(limit).all()
    return [{
        "id": r.id,
        "table_name": r.table_name,
        "action": r.action,
        "row_id": r.row_id,
        "old_values": r.old_values,
        "new_values": r.new_values,
        "changed_by": r.changed_by,
        "changed_at": r.changed_at
    } for r in result]

@router.get("/report-export")
def export_audit_reports(
    current_user: User = Depends(check_admin),
    db: Session = Depends(get_db)
):
    # Simulates export of security logs for forensic compliance audits
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).all()
    csv_data = "id,user_id,action,ip_address,user_agent,created_at\n"
    for log in logs:
        csv_data += f"{log.id},{log.user_id},{log.action},{log.ip_address},{log.user_agent},{log.created_at}\n"
    return {"format": "csv", "content": csv_data}
