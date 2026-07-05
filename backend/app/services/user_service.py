from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.schemas.schemas import UserUpdate, ChangePasswordSchema, UserCreate
from app.models.models import User
from app.repository.repository import UserRepository, AuditLogRepository
from app.security.auth import verify_password, hash_password
from uuid import UUID
from typing import List

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.audit_repo = AuditLogRepository(db)

    def get_profile(self, user: User) -> User:
        return user

    def update_profile(self, user: User, update_in: UserUpdate) -> User:
        # Prevent privilege escalation for standard users
        if user.role.name != "Admin":
            update_in.role_id = None
            update_in.is_active = None
            
        updated = self.user_repo.update(user, update_in)
        self.audit_repo.log(user.id, "UPDATE_PROFILE", None, None)
        return updated

    def change_password(self, user: User, pwd_in: ChangePasswordSchema) -> dict:
        if not verify_password(pwd_in.old_password, user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect old password")
            
        user.password_hash = hash_password(pwd_in.new_password)
        self.db.commit()
        self.audit_repo.log(user.id, "CHANGE_PASSWORD", None, None)
        return {"detail": "Password updated successfully"}

    def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.user_repo.list_users(skip, limit)

    def get_user_by_id(self, user_id: UUID) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def create_user_by_admin(self, user_in: UserCreate) -> User:
        if self.user_repo.get_by_email(user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        return self.user_repo.create(user_in)

    def update_user_by_admin(self, user_id: UUID, update_in: UserUpdate) -> User:
        user = self.get_user_by_id(user_id)
        return self.user_repo.update(user, update_in)

    def delete_user_by_admin(self, user_id: UUID) -> None:
        user = self.get_user_by_id(user_id)
        self.user_repo.delete(user)
