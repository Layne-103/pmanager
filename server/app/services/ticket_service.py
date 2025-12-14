from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from fastapi import HTTPException
from app.models.ticket import Ticket
from app.models.tag import Tag
from app.schemas.ticket import TicketCreate, TicketUpdate
from typing import List, Optional


def get_tickets(
    db: Session,
    search: Optional[str] = None,
    tag_ids: Optional[List[int]] = None,
    status: str = "all"
) -> List[Ticket]:
    """Get tickets with filters"""
    query = db.query(Ticket)
    
    # Apply status filter
    if status == "open":
        query = query.filter(Ticket.is_completed == False)
    elif status == "completed":
        query = query.filter(Ticket.is_completed == True)
    
    # Apply search filter
    if search:
        query = query.filter(
            or_(
                Ticket.title.ilike(f"%{search}%"),
                Ticket.description.ilike(f"%{search}%")
            )
        )
    
    # Apply tag filter (OR logic - tickets with any of the specified tags)
    if tag_ids:
        query = query.join(Ticket.tags).filter(Tag.id.in_(tag_ids)).distinct()
    
    # Order by updated_at desc
    return query.order_by(Ticket.updated_at.desc()).all()


def get_ticket_by_id(db: Session, ticket_id: int) -> Ticket:
    """Get a single ticket by ID"""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


def create_ticket(db: Session, ticket: TicketCreate) -> Ticket:
    """Create a new ticket"""
    db_ticket = Ticket(
        title=ticket.title,
        description=ticket.description
    )
    
    # Add tags if provided
    if ticket.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(ticket.tag_ids)).all()
        db_ticket.tags = tags
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def update_ticket(db: Session, ticket_id: int, ticket: TicketUpdate) -> Ticket:
    """Update a ticket"""
    db_ticket = get_ticket_by_id(db, ticket_id)
    
    if ticket.title is not None:
        db_ticket.title = ticket.title
    if ticket.description is not None:
        db_ticket.description = ticket.description
    if ticket.is_completed is not None:
        db_ticket.is_completed = ticket.is_completed
    
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def delete_ticket(db: Session, ticket_id: int) -> None:
    """Delete a ticket"""
    db_ticket = get_ticket_by_id(db, ticket_id)
    
    db.delete(db_ticket)
    db.commit()


def toggle_complete(db: Session, ticket_id: int) -> Ticket:
    """Toggle ticket completion status"""
    db_ticket = get_ticket_by_id(db, ticket_id)
    
    db_ticket.is_completed = not db_ticket.is_completed
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def add_tags(db: Session, ticket_id: int, tag_ids: List[int]) -> Ticket:
    """Add tags to a ticket"""
    db_ticket = get_ticket_by_id(db, ticket_id)
    
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    
    # Add only new tags (avoid duplicates)
    existing_tag_ids = {tag.id for tag in db_ticket.tags}
    for tag in tags:
        if tag.id not in existing_tag_ids:
            db_ticket.tags.append(tag)
    
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def remove_tag(db: Session, ticket_id: int, tag_id: int) -> None:
    """Remove a tag from a ticket"""
    db_ticket = get_ticket_by_id(db, ticket_id)
    
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if tag and tag in db_ticket.tags:
        db_ticket.tags.remove(tag)
        db.commit()
