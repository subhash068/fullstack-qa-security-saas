from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime, date
from uuid import UUID

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleResponse(RoleBase):
    id: int
    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None

class ProfileResponse(ProfileBase):
    updated_at: datetime
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    first_name: str
    last_name: str
    password: str
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    role_id: Optional[int] = None
    is_active: Optional[bool] = None

class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str

class UserResponse(UserBase):
    id: UUID
    role_id: int
    role: Optional[RoleResponse] = None
    is_active: bool
    is_mfa_enabled: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    name: str
    profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str
    mfa_code: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    mfa_required: Optional[bool] = False

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class AuditLogResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    action: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AdminDashboardStats(BaseModel):
    total_users: int
    active_users: int
    locked_accounts: int

class OrganizationBase(BaseModel):
    name: str
    slug: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationResponse(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TeamBase(BaseModel):
    name: str

class TeamCreate(TeamBase):
    organization_id: UUID

class TeamResponse(TeamBase):
    id: UUID
    organization_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SubscriptionResponse(BaseModel):
    id: UUID
    organization_id: UUID
    plan_name: str
    status: str
    current_period_start: datetime
    current_period_end: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class PaymentResponse(BaseModel):
    id: UUID
    subscription_id: UUID
    amount: float
    currency: str
    status: str
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: UUID
    organization_id: UUID
    invoice_number: str
    amount: float
    status: str
    due_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class UploadedFileResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    filename: str
    file_size: int
    mime_type: str
    storage_path: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: UUID
    sender: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
