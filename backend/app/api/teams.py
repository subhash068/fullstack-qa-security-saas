from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import TeamCreate, TeamResponse
from app.models.models import Team, Membership, User
from app.security.dependencies import get_current_user
from uuid import UUID
from typing import List, Optional

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/", response_model=List[TeamResponse])
@router.get("", response_model=List[TeamResponse])
def list_teams(
    organization_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Team)
    if organization_id:
        query = query.filter(Team.organization_id == organization_id)
        
    # Check access for non-admins
    if current_user.role and current_user.role.name != "Admin":
        if organization_id:
            membership = db.query(Membership).filter(
                Membership.organization_id == organization_id,
                Membership.user_id == current_user.id
            ).first()
            if not membership:
                raise HTTPException(status_code=403, detail="Access denied to this organization's teams")
        else:
            # Only list teams from organizations the user is a member of
            query = query.join(Membership, Membership.organization_id == Team.organization_id)\
                         .filter(Membership.user_id == current_user.id)
                         
    return query.all()

@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    team_in: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check membership/management of the org
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == team_in.organization_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership or membership.role_id == 3: # Need manager or admin
            raise HTTPException(status_code=403, detail="Insufficient organization permissions")
            
    team = Team(name=team_in.name, organization_id=team_in.organization_id)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.get("/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == team.organization_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership:
            raise HTTPException(status_code=403, detail="Access denied")
            
    return team

@router.put("/{team_id}", response_model=TeamResponse)
def update_team(
    team_id: UUID,
    name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == team.organization_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership or membership.role_id == 3:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
            
    team.name = name
    db.commit()
    db.refresh(team)
    return team

@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(
    team_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == team.organization_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership or membership.role_id == 3:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
            
    db.delete(team)
    db.commit()
    return None
