from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import OrganizationCreate, OrganizationResponse
from app.models.models import Organization, Membership, User
from app.security.dependencies import get_current_user
from uuid import UUID
from typing import List

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("/", response_model=List[OrganizationResponse])
@router.get("", response_model=List[OrganizationResponse])
def list_organizations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Admins see all, standard users see organizations they are members of
    if current_user.role and current_user.role.name == "Admin":
        return db.query(Organization).all()
    return db.query(Organization).join(Membership).filter(Membership.user_id == current_user.id).all()

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    org_in: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if slug is unique
    existing = db.query(Organization).filter(Organization.slug == org_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already taken")
    
    org = Organization(name=org_in.name, slug=org_in.slug)
    db.add(org)
    db.flush()
    
    # Creator becomes manager (role_id=2) or admin (1) of the new organization
    membership = Membership(
        organization_id=org.id,
        user_id=current_user.id,
        role_id=current_user.role_id
    )
    db.add(membership)
    db.commit()
    db.refresh(org)
    return org

@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Check membership
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == org_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership:
            raise HTTPException(status_code=403, detail="Not a member of this organization")
            
    return org

@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(
    org_id: UUID,
    org_in: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    # Check permission (must be admin or manager/member of org)
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == org_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership or membership.role_id == 3: # 3 is User, need Admin/Manager
            raise HTTPException(status_code=403, detail="Insufficient organization permissions")

    existing_slug = db.query(Organization).filter(Organization.slug == org_in.slug, Organization.id != org_id).first()
    if existing_slug:
        raise HTTPException(status_code=400, detail="Slug already taken")

    org.name = org_in.name
    org.slug = org_in.slug
    db.commit()
    db.refresh(org)
    return org

@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    # Only Admin can delete organizations globally
    if current_user.role and current_user.role.name != "Admin":
        raise HTTPException(status_code=403, detail="Only global Admins can delete organizations")

    db.delete(org)
    db.commit()
    return None
