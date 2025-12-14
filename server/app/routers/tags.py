from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.tag import (
    TagCreate,
    TagUpdate,
    TagResponse,
    TagWithCount,
    TagsListResponse
)
from app.services import tag_service

router = APIRouter()


@router.get("/", response_model=TagsListResponse)
def get_tags(db: Session = Depends(get_db)):
    """Get all tags with ticket counts"""
    tags = tag_service.get_tags_with_counts(db)
    return TagsListResponse(tags=tags)


@router.post("/", response_model=TagResponse, status_code=201)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    """Create a new tag"""
    return tag_service.create_tag(db, tag)


@router.get("/{tag_id}", response_model=TagResponse)
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    """Get a single tag by ID"""
    return tag_service.get_tag_by_id(db, tag_id)


@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(tag_id: int, tag: TagUpdate, db: Session = Depends(get_db)):
    """Update a tag"""
    return tag_service.update_tag(db, tag_id, tag)


@router.delete("/{tag_id}", status_code=204)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """Delete a tag"""
    tag_service.delete_tag(db, tag_id)
    return None
