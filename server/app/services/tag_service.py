from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.tag import Tag
from app.models.ticket import ticket_tags
from app.schemas.tag import TagCreate, TagUpdate, TagWithCount
from typing import List


def get_tags_with_counts(db: Session) -> List[TagWithCount]:
    """Get all tags with ticket counts"""
    tags_with_counts = db.query(
        Tag,
        func.count(ticket_tags.c.ticket_id).label('ticket_count')
    ).outerjoin(
        ticket_tags, Tag.id == ticket_tags.c.tag_id
    ).group_by(Tag.id).order_by(Tag.name).all()

    return [
        TagWithCount(
            id=tag.id,
            name=tag.name,
            color=tag.color,
            ticket_count=count
        )
        for tag, count in tags_with_counts
    ]


def get_tag_by_id(db: Session, tag_id: int) -> Tag:
    """Get a single tag by ID"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag


def create_tag(db: Session, tag: TagCreate) -> Tag:
    """Create a new tag"""
    # Check for duplicate name (case-insensitive)
    existing = db.query(Tag).filter(
        func.lower(Tag.name) == tag.name.lower()
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Tag '{tag.name}' already exists"
        )

    db_tag = Tag(name=tag.name, color=tag.color)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag


def update_tag(db: Session, tag_id: int, tag: TagUpdate) -> Tag:
    """Update a tag"""
    db_tag = get_tag_by_id(db, tag_id)

    # Check for duplicate name if name is being updated
    if tag.name is not None:
        existing = db.query(Tag).filter(
            func.lower(Tag.name) == tag.name.lower(),
            Tag.id != tag_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Tag '{tag.name}' already exists"
            )

        db_tag.name = tag.name

    if tag.color is not None:
        db_tag.color = tag.color

    db.commit()
    db.refresh(db_tag)
    return db_tag


def delete_tag(db: Session, tag_id: int) -> None:
    """Delete a tag"""
    db_tag = get_tag_by_id(db, tag_id)

    db.delete(db_tag)
    db.commit()
