import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.database.session import SessionLocal
from app.models.models import User
from app.schemas.schemas import UserResponse

db = SessionLocal()
try:
    print("Testing connection and query...")
    user = db.query(User).filter(User.email == "admin@local.com").first()
    if not user:
        print("User not found!")
    else:
        print(f"User found: {user.email}, Role ID: {user.role_id}")
        print("Validating Pydantic response schema mapping...")
        resp = UserResponse.model_validate(user)
        print("Success! Schema mapping is valid.")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
