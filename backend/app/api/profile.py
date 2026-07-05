from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import UserResponse, UserUpdate, ChangePasswordSchema
from app.models.models import User
from app.security.dependencies import get_current_user
from app.services.user_service import UserService

router = APIRouter(tags=["Profile"])

@router.get("/profile", response_model=UserResponse)
@router.get("/profile/", response_model=UserResponse)
def read_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_profile(current_user)

@router.put("/profile", response_model=UserResponse)
@router.put("/profile/", response_model=UserResponse)
def update_profile(
    update_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_service = UserService(db)
    return user_service.update_profile(current_user, update_in)

@router.put("/change-password")
@router.put("/profile/change-password")
def change_password(
    pwd_in: ChangePasswordSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_service = UserService(db)
    return user_service.change_password(current_user, pwd_in)
