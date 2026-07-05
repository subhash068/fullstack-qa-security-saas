from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import SubscriptionResponse, PaymentResponse, InvoiceResponse
from app.models.models import Subscription, Payment, Invoice, Membership, User
from app.security.dependencies import get_current_user
from uuid import UUID
from datetime import datetime, timedelta
from typing import List, Optional

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])

@router.get("/", response_model=List[SubscriptionResponse])
@router.get("", response_model=List[SubscriptionResponse])
def get_subscriptions(
    organization_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Subscription)
    if organization_id:
        query = query.filter(Subscription.organization_id == organization_id)
        
    # Check access for non-admins
    if current_user.role and current_user.role.name != "Admin":
        if organization_id:
            membership = db.query(Membership).filter(
                Membership.organization_id == organization_id,
                Membership.user_id == current_user.id
            ).first()
            if not membership:
                raise HTTPException(status_code=403, detail="Access denied to this organization's subscription")
        else:
            query = query.join(Membership, Membership.organization_id == Subscription.organization_id)\
                         .filter(Membership.user_id == current_user.id)
                         
    return query.all()

@router.post("/", response_model=SubscriptionResponse)
@router.post("", response_model=SubscriptionResponse)
def create_subscription(
    org_id: UUID,
    plan_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify access
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == org_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership or membership.role_id == 3:
            raise HTTPException(status_code=403, detail="Insufficient organization permissions")

    sub = Subscription(
        organization_id=org_id,
        plan_name=plan_name,
        status="trialing",
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=30)
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub

@router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(
    organization_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Invoice)
    if organization_id:
        query = query.filter(Invoice.organization_id == organization_id)
        
    if current_user.role and current_user.role.name != "Admin":
        if organization_id:
            membership = db.query(Membership).filter(
                Membership.organization_id == organization_id,
                Membership.user_id == current_user.id
            ).first()
            if not membership:
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            query = query.join(Membership, Membership.organization_id == Invoice.organization_id)\
                         .filter(Membership.user_id == current_user.id)
                         
    return query.all()

@router.post("/simulate-payment")
def simulate_payment(
    subscription_id: UUID,
    amount: float,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    # Simulate payment
    payment = Payment(
        subscription_id=sub.id,
        amount=amount,
        currency="USD",
        status="succeeded",
        payment_method="credit_card_sandbox",
        transaction_id=f"tx_sim_{datetime.utcnow().timestamp()}"
    )
    db.add(payment)
    db.flush()
    
    invoice = Invoice(
        organization_id=sub.organization_id,
        subscription_id=sub.id,
        payment_id=payment.id,
        invoice_number=f"INV-SIM-{int(datetime.utcnow().timestamp())}",
        amount=amount,
        status="paid",
        due_date=datetime.utcnow() + timedelta(days=30)
    )
    db.add(invoice)
    
    sub.status = "active"
    sub.current_period_start = datetime.utcnow()
    sub.current_period_end = datetime.utcnow() + timedelta(days=30)
    
    db.commit()
    return {"message": "Sandbox payment simulation successful", "status": "active"}

@router.delete("/{sub_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_subscription(
    sub_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    if current_user.role and current_user.role.name != "Admin":
        membership = db.query(Membership).filter(
            Membership.organization_id == sub.organization_id,
            Membership.user_id == current_user.id
        ).first()
        if not membership or membership.role_id == 3:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
            
    sub.status = "canceled"
    db.commit()
    return None
