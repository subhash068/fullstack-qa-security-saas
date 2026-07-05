from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database.session import get_db, SessionLocal
from app.config.config import settings
from app.security.auth import hash_password, create_access_token
from app.models.models import User
from app.repository.repository import AuditLogRepository
import uuid
import urllib.request

router = APIRouter(prefix="/vuln", tags=["Intentionally Vulnerable Lab"])

# Request-time safety check dependency
def verify_lab_is_enabled():
    if not settings.ENABLE_VULNERABILITY_LAB:
        raise HTTPException(status_code=404, detail="Vulnerability lab environment is disabled.")

# Add dependency to all routes in this router dynamically
router.dependencies.append(Depends(verify_lab_is_enabled))

# ==========================================
# 1. SQL INJECTION (SQLi)
# ==========================================
@router.get("/sqli/user")
def vulnerable_sql_search(email: str, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Direct string interpolation into Raw SQL.
    HOW TO OBSERVE: Query with parameter: `email=admin@local.com' OR '1'='1`
    MITIGATION: Use SQLAlchemy ORM parameter binding or parameterized queries:
      db.query(User).filter(User.email == email).first()
    """
    # Real-time check to log SQL Injection attempt
    is_sqli = any(char in email for char in ["'", '"', ";", "--", "/*"]) or any(keyword in email.upper() for keyword in ["UNION", "SELECT", "OR 1=1", "AND 1=1"])
    if is_sqli:
        AuditLogRepository(db).log(
            user_id=None,
            action="SQL Injection Attempt Blocked",
            ip=request.client.host if request.client else None,
            ua=request.headers.get("user-agent"),
            details={"input_payload": email, "detected_as": "SQLi"}
        )

    raw_query = f"SELECT id, email, is_active FROM users WHERE email = '{email}'"
    try:
        # Wrap string in text() to satisfy SQLAlchemy 2.0, while maintaining string-interpolation vulnerability
        result = db.execute(text(raw_query)).first()
        if not result:
            return {"detail": "User not found"}
        return {"id": str(result[0]), "email": result[1], "is_active": result[2]}
    except Exception as e:
        # Log SQL failure (which helps SQLi analysis)
        AuditLogRepository(db).log(
            user_id=None,
            action="Database Query Failure (Potential SQLi)",
            ip=request.client.host if request.client else None,
            ua=request.headers.get("user-agent"),
            details={"error": str(e), "query": raw_query}
        )
        return {"error": str(e)}


# ==========================================
# 2. CROSS-SITE SCRIPTING (XSS)
# ==========================================
@router.get("/xss/echo")
def vulnerable_xss_echo(payload: str, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Returns unescaped input inside HTML, allowing script injection.
    HOW TO OBSERVE: Set `payload=<script>alert('xss')</script>`
    MITIGATION: Sanitize and encode output. Return JSON objects or escape HTML chars using standard formatters.
    """
    # Real-time XSS payload detection
    is_xss = any(token in payload.lower() for token in ["<script", "javascript:", "onerror", "onload", "<img", "<svg", "<iframe", "alert("])
    if is_xss:
        AuditLogRepository(db).log(
            user_id=None,
            action="Cross-Site Scripting (XSS) Filter Triggered",
            ip=request.client.host if request.client else None,
            ua=request.headers.get("user-agent"),
            details={"payload": payload}
        )

    html_content = f"<div><h1>User Input Echo</h1><p>{payload}</p></div>"
    return Response(content=html_content, media_type="text/html")


# ==========================================
# 3. BROKEN ACCESS CONTROL (IDOR)
# ==========================================
@router.get("/access-control/user/{user_id}")
def vulnerable_user_lookup(user_id: str, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Missing authorization check. Any logged-in (or anonymous) user can fetch details of any UUID.
    HOW TO OBSERVE: Send a request to this endpoint with any other user's UUID.
    MITIGATION: Verify that the authenticated user's ID matches the requested `user_id` or that they possess an Admin role.
    """
    try:
        uid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Real-time log of unauthorized data access (IDOR pattern lookup)
    AuditLogRepository(db).log(
        user_id=None,
        action="Unauthorized API Access Blocked",
        ip=request.client.host if request.client else None,
        ua=request.headers.get("user-agent"),
        details={"accessed_user_id": user_id, "threat_type": "IDOR"}
    )
    return {"id": user.id, "name": user.name, "email": user.email, "role_id": user.role_id}


# ==========================================
# 4. SERVER-SIDE REQUEST FORGERY (SSRF)
# ==========================================
@router.get("/ssrf/fetch")
def vulnerable_ssrf_fetch(url: str, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Fetches content from a user-supplied URL directly without checking internal/private IP boundaries.
    HOW TO OBSERVE: Query internal ports or services: `url=http://localhost:8000/api/v1`
    MITIGATION: Whitelist permitted external domains, or explicitly block private IP ranges (127.0.0.1, 10.0.0.0/8, etc.).
    """
    is_internal = any(host in url.lower() for host in ["localhost", "127.0.0.1", "10.", "192.168.", "172.16.", "0.0.0.0"])
    if is_internal:
        AuditLogRepository(db).log(
            user_id=None,
            action="SSRF Attack Blocked",
            ip=request.client.host if request.client else None,
            ua=request.headers.get("user-agent"),
            details={"requested_url": url, "severity": "High"}
        )

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            html = response.read().decode('utf-8')
            return {"url": url, "status": response.status, "content": html[:300] + ("..." if len(html) > 300 else "")}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"SSRF Request Failed: {str(e)}")


# ==========================================
# 5. INSECURE COOKIE / WEAK SESSION
# ==========================================
@router.post("/auth/cookie-login")
def vulnerable_cookie_login(email: str, response: Response, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Sets session cookie with HttpOnly=False and Secure=False.
    HOW TO OBSERVE: Check document.cookie via browser console.
    MITIGATION: Set HttpOnly=True, Secure=True, and SameSite='Lax' parameters on the set_cookie method.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    token = create_access_token({"sub": str(user.id), "role": "User"})
    
    # Real-time log of vulnerable cookie configuration set
    AuditLogRepository(db).log(
        user_id=user.id,
        action="Insecure Session Cookie Issued",
        ip=request.client.host if request.client else None,
        ua=request.headers.get("user-agent"),
        details={"security_issue": "HttpOnly/Secure Flags Missing"}
    )

    response.set_cookie(
        key="session_token",
        value=token,
        httponly=False,
        secure=False
    )
    return {"detail": "Logged in with insecure session configurations"}


# ==========================================
# 6. WEAK PASSWORD RESET
# ==========================================
@router.post("/auth/weak-reset-request")
def vulnerable_reset_request(email: str, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Returns the reset token directly in the API response or utilizes sequential/predictable reset tokens.
    HOW TO OBSERVE: Initiate a reset and observe the token payload in the JSON response.
    MITIGATION: Never return reset tokens in responses; send them via isolated verification channels (like emails).
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    weak_token = f"RESET-{user.email}-12345"

    # Real-time log weak token issuance
    AuditLogRepository(db).log(
        user_id=user.id,
        action="Weak Password Reset Request Processed",
        ip=request.client.host if request.client else None,
        ua=request.headers.get("user-agent"),
        details={"token_strength": "Low (Static Pattern)"}
    )

    return {
        "message": "Password reset token generated",
        "vulnerable_leaked_token": weak_token
    }


# ==========================================
# 7. SECURITY MISCONFIGURATION (Debug Info Leak)
# ==========================================
@router.get("/misconfig/debug-env")
def vulnerable_env_leak(request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Leaks environment variables and internal settings.
    HOW TO OBSERVE: Fetching this path displays private keys and configuration details.
    MITIGATION: Never expose process environments. Ensure debug APIs are completely removed from production builds.
    """
    # Real-time log debug config access
    AuditLogRepository(db).log(
        user_id=None,
        action="Unauthorized Debug Endpoint Access",
        ip=request.client.host if request.client else None,
        ua=request.headers.get("user-agent"),
        details={"accessed_route": "/vuln/misconfig/debug-env"}
    )

    return {
        "DEBUG_MODE": True,
        "SECRET_KEY": settings.SECRET_KEY,
        "DATABASE_URL": settings.DATABASE_URL
    }


# ==========================================
# 8. CROSS-SITE REQUEST FORGERY (CSRF)
# ==========================================
@router.post("/csrf/change-email")
def vulnerable_csrf_change_email(email: str, request: Request, db: Session = Depends(get_db)):
    """
    VULNERABLE: Does not validate Anti-CSRF tokens, SameSite settings, or Referer/Origin headers.
    Authentication relies on session cookies. If a logged-in user visits a malicious page,
    the attacker can execute a state-changing POST to this route automatically.
    HOW TO OBSERVE: Use an HTML form targeting this endpoint from another origin (e.g. localhost:3000 to localhost:8000).
    MITIGATION: Use header-based JWT tokens (which cannot be read/attached cross-origin automatically) or SameSite=Lax/Strict cookie flags.
    """
    # Log CSRF event processing
    origin = request.headers.get("origin", "")
    is_cross_origin = bool(origin and "localhost:3000" not in origin and "localhost:8000" not in origin)
    
    AuditLogRepository(db).log(
        user_id=None,
        action="CSRF Email Change Executed" if is_cross_origin else "Insecure CSRF Email Change Processed",
        ip=request.client.host if request.client else None,
        ua=request.headers.get("user-agent"),
        details={"origin": origin, "is_cross_origin": is_cross_origin, "target_email": email}
    )

    return {
        "message": f"Email change requested to {email} successfully.",
        "vulnerable_note": "This state-changing request was processed without anti-CSRF protections."
    }
