from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import UserCreate, LoginRequest, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.register(user_in, request.client.host, request.headers.get("user-agent", ""))

@router.post("/login", response_model=TokenResponse)
def login(login_in: LoginRequest, request: Request, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.login(login_in, request.client.host, request.headers.get("user-agent", ""))

@router.post("/logout")
def logout(refresh_token: str, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    auth_service.logout(refresh_token)
    return {"detail": "Logged out successfully"}

@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_token: str, request: Request, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.refresh_tokens(refresh_token)

@router.post("/forgot-password")
def forgot_password(forgot_in: ForgotPasswordRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.forgot_password(forgot_in)

@router.post("/reset-password")
def reset_password(reset_in: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.reset_password(reset_in)

@router.post("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.verify_email(token)
