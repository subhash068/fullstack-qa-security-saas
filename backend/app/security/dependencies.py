from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.security.auth import decode_token
from app.repository.repository import UserRepository
from app.models.models import User
import uuid

reusable_oauth2 = HTTPBearer()

def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(reusable_oauth2),
    db: Session = Depends(get_db)
) -> User:
    payload = decode_token(token.credentials)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
         raise HTTPException(status_code=401, detail="Invalid token structure")
         
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")
    return user

def check_admin(current_user: User = Depends(get_current_user)):
    role_name = current_user.role.name if current_user.role else "User"
    if role_name != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admin permissions required"
        )
    return current_user
