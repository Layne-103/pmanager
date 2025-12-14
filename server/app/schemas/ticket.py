from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import List, Optional


class TagBase(BaseModel):
    id: int
    name: str
    color: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class TicketBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None


class TicketCreate(TicketBase):
    tag_ids: Optional[List[int]] = Field(default=[], serialization_alias="tagIds", alias="tagIds")


class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    is_completed: Optional[bool] = Field(None, serialization_alias="isCompleted", alias="isCompleted")


class TicketResponse(TicketBase):
    id: int
    is_completed: bool = Field(..., serialization_alias="isCompleted")
    created_at: datetime = Field(..., serialization_alias="createdAt")
    updated_at: datetime = Field(..., serialization_alias="updatedAt")
    tags: List[TagBase] = []
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True  # Allow both snake_case and camelCase for input
    )


class TicketsListResponse(BaseModel):
    """Wrapper for list of tickets to match API documentation"""
    tickets: List[TicketResponse]


class AddTagsRequest(BaseModel):
    """Request model for adding tags to a ticket"""
    tag_ids: List[int] = Field(..., serialization_alias="tagIds", alias="tagIds")
