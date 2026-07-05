from sqlalchemy.orm import Session
from app.models.models import User, Role, UserSession, PasswordReset, AuditLog, Profile
from app.schemas.schemas import UserCreate, UserUpdate
from app.security.auth import hash_password
from uuid import UUID
from typing import List, Optional

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).offset(skip).limit(limit).all()

    def create(self, user_in: UserCreate, default_role_id: int = 3) -> User:
        db_user = User(
            email=user_in.email,
            password_hash=hash_password(user_in.password),
            role_id=default_role_id,
            is_active=True
        )
        self.db.add(db_user)
        self.db.flush()

        db_profile = Profile(
            user_id=db_user.id,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone=user_in.phone
        )
        self.db.add(db_profile)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user: User, update_data: UserUpdate) -> User:
        user_fields = ['email', 'role_id', 'is_active']
        profile_fields = ['first_name', 'last_name', 'phone', 'avatar_url', 'bio', 'date_of_birth']

        for field, value in update_data.model_dump(exclude_unset=True).items():
            if field in user_fields:
                setattr(user, field, value)
            elif field in profile_fields:
                if not user.profile:
                    user.profile = Profile(user_id=user.id)
                setattr(user.profile, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()


class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, user_id: UUID, refresh_token_hash: str, ip: str, ua: str, expires_at) -> UserSession:
        session = UserSession(
            user_id=user_id,
            refresh_token_hash=refresh_token_hash,
            ip_address=ip,
            user_agent=ua,
            expires_at=expires_at
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_token_hash(self, token_hash: str) -> Optional[UserSession]:
        return self.db.query(UserSession).filter(UserSession.refresh_token_hash == token_hash).first()

    def revoke_session(self, session: UserSession) -> None:
        session.is_revoked = True
        self.db.commit()


class AuditLogRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(self, user_id: Optional[UUID], action: str, ip: Optional[str], ua: Optional[str], details: Optional[dict] = None) -> AuditLog:
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            ip_address=ip,
            user_agent=ua,
            details=details
        )
        self.db.add(log_entry)
        self.db.commit()
        return log_entry

    def list_logs(self, limit: int = 100) -> List[AuditLog]:
        return self.db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
