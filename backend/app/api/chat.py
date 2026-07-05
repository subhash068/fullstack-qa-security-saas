from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import ChatSessionResponse, ChatMessageResponse, ChatMessageCreate
from app.models.models import ChatSession, ChatMessage, User
from app.security.dependencies import get_current_user
from uuid import UUID
from typing import List

router = APIRouter(prefix="/chat", tags=["AI Module"])

@router.get("/sessions", response_model=List[ChatSessionResponse])
def get_chat_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc()).all()

@router.post("/sessions", response_model=ChatSessionResponse)
def create_chat_session(title: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = ChatSession(user_id=current_user.id, title=title)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
def get_chat_messages(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
        
    return db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def send_chat_message(
    session_id: UUID,
    message_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
        
    # Save user message
    user_msg = ChatMessage(session_id=session_id, sender="user", content=message_in.content)
    db.add(user_msg)
    db.flush()
    
    # Generate mock AI reply relevant to manual QA and defensive security
    prompt = message_in.content.lower()
    if "sqli" in prompt or "sql injection" in prompt:
        ai_reply_text = (
            "To mitigate SQL Injection, you should never concatenate strings in raw queries. "
            "Instead, use parameterized inputs (prepared statements) or ORM models like SQLAlchemy's query binding: "
            "`db.query(User).filter(User.email == email).first()`. This forces PostgreSQL to parse the query "
            "structure separately from data inputs."
        )
    elif "xss" in prompt or "cross-site scripting" in prompt:
        ai_reply_text = (
            "To prevent XSS (Cross-Site Scripting), you must sanitize inputs and escape characters when rendering "
            "raw text in HTML pages. Implement proper Content Security Policy (CSP) headers, set SameSite flags, and "
            "ensure cookies containing credentials use the HttpOnly and Secure options to prevent token theft."
        )
    elif "idor" in prompt or "access control" in prompt:
        ai_reply_text = (
            "IDOR occurs when access controls are not verified server-side. "
            "Ensure you always validate that the authenticated user owns or is authorized to view the resource "
            "requested in the URL path, regardless of whether a valid UUID is passed."
        )
    else:
        ai_reply_text = (
            f"Thank you for contacting the Security QA Advisor. I received your request: '{message_in.content}'. "
            "How can I assist you with API testing, manual test plans, or defensive coding verification today?"
        )
        
    ai_msg = ChatMessage(session_id=session_id, sender="assistant", content=ai_reply_text)
    db.add(ai_msg)
    
    session.title = message_in.content[:40] + ("..." if len(message_in.content) > 40 else "")
    db.commit()
    db.refresh(ai_msg)
    return ai_msg
