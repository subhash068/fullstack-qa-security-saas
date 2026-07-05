import random
from sqlalchemy.orm import Session
from app.models.models import User, AuditLog
from app.repository.repository import AuditLogRepository
from typing import List, Dict, Any

class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.audit_repo = AuditLogRepository(db)

    def get_dashboard_stats(self) -> dict:
        total = self.db.query(User).count()
        active = self.db.query(User).filter(User.is_active == True).count()
        locked = self.db.query(User).filter(User.is_active == False).count()
        return {
            "total_users": total,
            "active_users": active,
            "locked_accounts": locked
        }

    def get_audit_logs(self, limit: int = 100) -> List[AuditLog]:
        return self.audit_repo.list_logs(limit)

    def get_system_health(self) -> Dict[str, Any]:
        return {
            "cpu_usage": round(random.uniform(12.5, 28.4), 1),
            "memory_usage": round(random.uniform(42.1, 56.9), 1),
            "db_latency_ms": round(random.uniform(1.5, 8.2), 1),
            "uptime_hours": 184.2
        }

    def simulate_attack_logs(self) -> List[AuditLog]:
        attacks = [
            ("Failed Login Attempt (Brute Force Alert)", "198.51.100.42", "Mozilla/5.0 (Hydra/9.5)"),
            ("SQL Injection Attempt Blocked", "203.0.113.88", "sqlmap/1.8.2#stable"),
            ("Unauthorized API Access Blocked", "198.51.100.15", "curl/8.4.0"),
            ("Cross-Site Scripting (XSS) Filter Triggered", "203.0.113.121", "Mozilla/5.0 (XSShunter/2.0)")
        ]
        created_entries = []
        for action, ip, ua in attacks:
            entry = self.audit_repo.log(
                user_id=None,
                action=action,
                ip=ip,
                ua=ua,
                details={"simulated": True, "threat_level": "High"}
            )
            created_entries.append(entry)
        return created_entries

    def clear_audit_logs(self) -> None:
        self.db.query(AuditLog).delete()
        self.db.commit()

