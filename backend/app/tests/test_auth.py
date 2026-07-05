import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.session import get_db
from app.models.models import Role, User
from app.config.config import settings

# Bind engine directly to the postgres connection
engine = create_engine(settings.DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db():
    # In integration tests, we run inside a transaction and roll back at the end
    connection = engine.connect()
    transaction = connection.begin()
    db_session = TestingSessionLocal(bind=connection)
    
    # Check/Ensure base roles exist
    if not db_session.query(Role).filter(Role.name == "Admin").first():
        db_session.add(Role(id=1, name="Admin", description="Admin"))
    if not db_session.query(Role).filter(Role.name == "Manager").first():
        db_session.add(Role(id=2, name="Manager", description="Manager"))
    if not db_session.query(Role).filter(Role.name == "User").first():
        db_session.add(Role(id=3, name="User", description="Standard User"))
    db_session.commit()

    yield db_session

    db_session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="module")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_register_login_flow(client, db):
    # Unique test email to prevent collisions
    test_email = "pytest_user@example.com"
    
    # Clean up user if it already exists from a dirty state
    existing = db.query(User).filter(User.email == test_email).first()
    if existing:
        db.delete(existing)
        db.commit()

    # Register new user
    res = client.post("/api/v1/auth/register", json={
        "first_name": "Pytest",
        "last_name": "User",
        "email": test_email,
        "password": "Password123!",
        "phone": "+15559999"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # Login with user credentials
    res_login = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "Password123!"
    })
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()
