from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import UploadedFileResponse
from app.models.models import UploadedFile, User, Membership
from app.security.dependencies import get_current_user
from uuid import UUID
import os
import shutil
from typing import List, Optional

router = APIRouter(prefix="/files", tags=["File Management"])

# Sandbox local upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "scratch", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Secure constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf", "text/plain", "application/json"]

@router.post("/upload", response_model=UploadedFileResponse)
def upload_file(
    organization_id: Optional[UUID] = None,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate MIME Type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"MIME type {file.content_type} is not allowed")

    # Temp file to verify size
    temp_path = os.path.join(UPLOAD_DIR, f"temp_{current_user.id}_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(temp_path)
        if file_size > MAX_FILE_SIZE:
            os.remove(temp_path)
            raise HTTPException(status_code=400, detail="File exceeds maximum size of 5 MB")
            
        # Secure filename naming convention
        safe_filename = f"{current_user.id}_{int(os.path.getsize(temp_path))}_{file.filename}"
        final_path = os.path.join(UPLOAD_DIR, safe_filename)
        shutil.move(temp_path, final_path)
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"File save error: {str(e)}")

    uploaded_file = UploadedFile(
        user_id=current_user.id,
        organization_id=organization_id,
        filename=file.filename,
        file_size=file_size,
        mime_type=file.content_type,
        storage_path=safe_filename
    )
    db.add(uploaded_file)
    db.commit()
    db.refresh(uploaded_file)
    return uploaded_file

@router.get("/", response_model=List[UploadedFileResponse])
@router.get("", response_model=List[UploadedFileResponse])
def list_files(
    organization_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(UploadedFile)
    if organization_id:
        query = query.filter(UploadedFile.organization_id == organization_id)
        
    if current_user.role and current_user.role.name != "Admin":
        if organization_id:
            membership = db.query(Membership).filter(
                Membership.organization_id == organization_id,
                Membership.user_id == current_user.id
            ).first()
            if not membership:
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            query = query.filter(UploadedFile.user_id == current_user.id)
            
    return query.all()

@router.get("/{file_id}/download")
def download_file(
    file_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_record = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
        
    # Access checks
    if current_user.role and current_user.role.name != "Admin":
        if file_record.user_id != current_user.id:
            # Check org membership if applicable
            if file_record.organization_id:
                membership = db.query(Membership).filter(
                    Membership.organization_id == file_record.organization_id,
                    Membership.user_id == current_user.id
                ).first()
                if not membership:
                    raise HTTPException(status_code=403, detail="Access denied to this organization file")
            else:
                raise HTTPException(status_code=403, detail="Access denied")

    file_path = os.path.join(UPLOAD_DIR, file_record.storage_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Physical file missing from storage sandbox")
        
    return FileResponse(file_path, media_type=file_record.mime_type, filename=file_record.filename)

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_record = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
        
    # Access checks (only owner or Org Manager/Admin can delete)
    if current_user.role and current_user.role.name != "Admin":
        if file_record.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Only the file owner can delete this file")

    file_path = os.path.join(UPLOAD_DIR, file_record.storage_path)
    if os.path.exists(file_path):
        os.remove(file_path)
        
    db.delete(file_record)
    db.commit()
    return None
