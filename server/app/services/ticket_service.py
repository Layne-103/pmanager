from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from fastapi import HTTPException
from app.models.ticket import Ticket
from app.models.tag import Tag
from app.schemas.ticket import TicketCreate, TicketUpdate
from typing import List, Optional


def parse_tag_filter(db: Session, tags_str: str) -> List[int]:
    """Parse tag filter string into list of tag IDs

    Accepts:
    - Tag IDs: "1,2,3"
    - Tag names: "bug,feature,ios"
    - Mixed: "1,bug,ios"

    Returns list of valid tag IDs
    """
    if not tags_str:
        return []

    tag_identifiers = [t.strip() for t in tags_str.split(",") if t.strip()]
    tag_ids = []
    tag_names = []

    # Separate numeric IDs from names
    for identifier in tag_identifiers:
        try:
            # Try to parse as integer
            tag_ids.append(int(identifier))
        except ValueError:
            # It's a name
            tag_names.append(identifier.lower())

    # Look up tag IDs by names (case-insensitive)
    if tag_names:
        # Use lowercase comparison for case-insensitive matching
        from sqlalchemy import func
        tags_by_name = db.query(Tag).filter(
            func.lower(Tag.name).in_(tag_names)
        ).all()
        tag_ids.extend([tag.id for tag in tags_by_name])

    # Remove duplicates and return
    return list(set(tag_ids)) if tag_ids else []


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
    """
    Add tags to a ticket

    Args:
        db: Database session
        ticket_id: ID of the ticket
        tag_ids: List of tag IDs to add

    Returns:
        Updated ticket with tags

    Raises:
        HTTPException: If ticket not found or tag IDs are invalid
    """
    if not tag_ids:
        raise HTTPException(status_code=400, detail="No tag IDs provided")

    db_ticket = get_ticket_by_id(db, ticket_id)

    # Fetch tags from database
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

    # Validate all tag IDs exist
    found_tag_ids = {tag.id for tag in tags}
    invalid_tag_ids = set(tag_ids) - found_tag_ids
    if invalid_tag_ids:
        raise HTTPException(
            status_code=404,
            detail=f"Tags not found: {', '.join(map(str, invalid_tag_ids))}"
        )

    # Add only new tags (avoid duplicates)
    existing_tag_ids = {tag.id for tag in db_ticket.tags}
    new_tags_added = 0
    for tag in tags:
        if tag.id not in existing_tag_ids:
            db_ticket.tags.append(tag)
            new_tags_added += 1

    if new_tags_added == 0:
        # All tags were already on the ticket
        return db_ticket

    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def remove_tag(db: Session, ticket_id: int, tag_id: int) -> Ticket:
    """
    Remove a tag from a ticket

    Args:
        db: Database session
        ticket_id: ID of the ticket
        tag_id: ID of the tag to remove

    Returns:
        Updated ticket without the tag

    Raises:
        HTTPException: If ticket or tag not found
    """
    db_ticket = get_ticket_by_id(db, ticket_id)

    # Check if tag exists
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail=f"Tag {tag_id} not found")

    # Check if tag is associated with ticket
    if tag not in db_ticket.tags:
        raise HTTPException(
            status_code=400,
            detail=f"Tag '{tag.name}' is not associated with this ticket"
        )

    # Remove the tag
    db_ticket.tags.remove(tag)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
