from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.schemas.schemas import UserCreate, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.repository.repository import UserRepository, SessionRepository, AuditLogRepository
from app.security.auth import verify_password, hash_password, create_access_token, create_refresh_token, decode_token
from app.models.models import PasswordReset, UserSession, EmailVerification
import uuid

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.session_repo = SessionRepository(db)
        self.audit_repo = AuditLogRepository(db)

    def register(self, user_in: UserCreate, ip: str, ua: str) -> dict:
        if self.user_repo.get_by_email(user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user = self.user_repo.create(user_in)
        
        # Create verification token
        verify_token = str(uuid.uuid4())
        verification = EmailVerification(
            user_id=user.id,
            verification_token_hash=hash_password(verify_token),
            expires_at=datetime.utcnow() + timedelta(days=1),
            is_verified=False
        )
        self.db.add(verification)
        self.db.commit()
        
        print(f"[SECURITY LAB INFO] Email verification token for {user.email}: {verify_token}")
        
        access = create_access_token({"sub": str(user.id), "role": "User"})
        refresh = create_refresh_token({"sub": str(user.id)})
        
        self.session_repo.create_session(
            user_id=user.id,
            refresh_token_hash=hash_password(refresh),
            ip=ip,
            ua=ua,
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        
        self.audit_repo.log(user.id, "REGISTER", ip, ua)
        return {"access_token": access, "refresh_token": refresh}

    def login(self, login_in: LoginRequest, ip: str, ua: str) -> dict:
        user = self.user_repo.get_by_email(login_in.email)
        if not user or not verify_password(login_in.password, user.password_hash):
            self.audit_repo.log(None, "FAILED_LOGIN", ip, ua, {"email": login_in.email})
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is disabled")

        # MFA check
        if user.is_mfa_enabled:
            if not login_in.mfa_code:
                return {"access_token": "", "refresh_token": "", "mfa_required": True}
            if login_in.mfa_code != "123456":  # Sandboxed static MFA verification code
                raise HTTPException(status_code=401, detail="Invalid MFA passcode")

        role_name = user.role.name if user.role else "User"
        access = create_access_token({"sub": str(user.id), "role": role_name})
        refresh = create_refresh_token({"sub": str(user.id)})
        
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        self.session_repo.create_session(
            user_id=user.id,
            refresh_token_hash=hash_password(refresh),
            ip=ip,
            ua=ua,
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        
        self.audit_repo.log(user.id, "LOGIN", ip, ua)
        return {"access_token": access, "refresh_token": refresh, "mfa_required": False}

    def logout(self, refresh_token: str) -> None:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token")
        
        user_id = payload.get("sub")
        sessions = self.db.query(UserSession).filter(UserSession.user_id == user_id, UserSession.is_revoked == False).all()
        for session in sessions:
            session.is_revoked = True
        self.db.commit()

    def refresh_tokens(self, refresh_token: str) -> dict:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        user_id = payload.get("sub")
        user = self.user_repo.get_by_id(uuid.UUID(user_id))
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User disabled or not found")
            
        role_name = user.role.name if user.role else "User"
        access = create_access_token({"sub": str(user.id), "role": role_name})
        new_refresh = create_refresh_token({"sub": str(user.id)})
        
        return {"access_token": access, "refresh_token": new_refresh}

    def forgot_password(self, forgot_in: ForgotPasswordRequest) -> dict:
        user = self.user_repo.get_by_email(forgot_in.email)
        if not user:
            return {"detail": "If the email exists, a reset link will be sent shortly."}
            
        token = str(uuid.uuid4())
        hashed_token = hash_password(token)
        
        reset_entry = PasswordReset(
            user_id=user.id,
            reset_token_hash=hashed_token,
            expires_at=datetime.utcnow() + timedelta(hours=1),
            is_used=False
        )
        self.db.add(reset_entry)
        self.db.commit()
        
        print(f"[SECURITY LAB INFO] Password reset token for {user.email}: {token}")
        return {"detail": "If the email exists, a reset link will be sent shortly."}

    def reset_password(self, reset_in: ResetPasswordRequest) -> dict:
        resets = self.db.query(PasswordReset).filter(PasswordReset.is_used == False, PasswordReset.expires_at > datetime.utcnow()).all()
        target_reset = None
        for r in resets:
            if verify_password(reset_in.token, r.reset_token_hash):
                target_reset = r
                break
                
        if not target_reset:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
            
        user = self.user_repo.get_by_id(target_reset.user_id)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
            
        user.password_hash = hash_password(reset_in.new_password)
        target_reset.is_used = True
        self.db.commit()
        return {"detail": "Password has been successfully updated"}

    def verify_email(self, token: str) -> dict:
        verifications = self.db.query(EmailVerification).filter(EmailVerification.is_verified == False).all()
        target_ver = None
        for v in verifications:
            if verify_password(token, v.verification_token_hash):
                target_ver = v
                break
                
        if not target_ver:
             raise HTTPException(status_code=400, detail="Invalid or expired verification token")
             
        target_ver.is_verified = True
        self.db.commit()
        return {"detail": "Email address successfully verified"}
