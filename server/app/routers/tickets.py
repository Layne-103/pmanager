from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.ticket import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketsListResponse,
    AddTagsRequest,
    BatchUpdateStatusRequest,
    BatchDeleteRequest,
    BatchOperationResponse
)
from app.services import ticket_service

router = APIRouter()


@router.get("/", response_model=TicketsListResponse)
def get_tickets(
    search: Optional[str] = Query(None, description="Search in title and description"),
    tags: Optional[str] = Query(None, description="Comma-separated tag names or IDs"),
    status: Optional[str] = Query("all", description="Filter by status: all, open, completed"),
    db: Session = Depends(get_db)
):
    """Get all tickets with optional filters

    The 'tags' parameter accepts either:
    - Tag IDs (e.g., '1,2,3')
    - Tag names (e.g., 'bug,feature,ios')
    - Mixed (e.g., '1,bug,ios')
    """
    tag_ids = None
    if tags:
        tag_ids = ticket_service.parse_tag_filter(db, tags)

    tickets = ticket_service.get_tickets(db, search, tag_ids, status)
    return TicketsListResponse(tickets=tickets)


@router.post("/", response_model=TicketResponse, status_code=201)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    """Create a new ticket"""
    return ticket_service.create_ticket(db, ticket)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Get a single ticket by ID"""
    return ticket_service.get_ticket_by_id(db, ticket_id)


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: int, ticket: TicketUpdate, db: Session = Depends(get_db)):
    """Update a ticket"""
    return ticket_service.update_ticket(db, ticket_id, ticket)


@router.delete("/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """Delete a ticket"""
    ticket_service.delete_ticket(db, ticket_id)
    return None


@router.patch("/{ticket_id}/complete", response_model=TicketResponse)
def toggle_complete(ticket_id: int, db: Session = Depends(get_db)):
    """Toggle ticket completion status"""
    return ticket_service.toggle_complete(db, ticket_id)


@router.post("/{ticket_id}/tags", response_model=TicketResponse)
def add_tags_to_ticket(
    ticket_id: int,
    request: AddTagsRequest,
    db: Session = Depends(get_db)
):
    """Add tags to a ticket"""
    return ticket_service.add_tags(db, ticket_id, request.tag_ids)


@router.delete("/{ticket_id}/tags/{tag_id}", response_model=TicketResponse)
def remove_tag_from_ticket(ticket_id: int, tag_id: int, db: Session = Depends(get_db)):
    """Remove a tag from a ticket"""
    return ticket_service.remove_tag(db, ticket_id, tag_id)


@router.post("/batch/status", response_model=BatchOperationResponse)
def batch_update_status(request: BatchUpdateStatusRequest, db: Session = Depends(get_db)):
    """Batch update ticket completion status

    Updates the completion status for multiple tickets at once.

    Example request:
    ```json
    {
        "ticketIds": [1, 2, 3],
        "isCompleted": true
    }
    ```
    """
    affected_count = ticket_service.batch_update_status(
        db,
        request.ticket_ids,
        request.is_completed
    )

    status_text = "completed" if request.is_completed else "open"
    return BatchOperationResponse(
        success=True,
        affected_count=affected_count,
        message=f"Successfully updated {affected_count} ticket(s) to {status_text}"
    )


@router.post("/batch/delete", response_model=BatchOperationResponse)
def batch_delete_tickets(request: BatchDeleteRequest, db: Session = Depends(get_db)):
    """Batch delete tickets

    Deletes multiple tickets at once.

    Example request:
    ```json
    {
        "ticketIds": [1, 2, 3]
    }
    ```
    """
    affected_count = ticket_service.batch_delete(db, request.ticket_ids)

    return BatchOperationResponse(
        success=True,
        affected_count=affected_count,
        message=f"Successfully deleted {affected_count} ticket(s)"
    )
