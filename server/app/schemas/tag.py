from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List


class TagBase(BaseModel):
    id: int
    name: str
    color: Optional[str] = None


class TagCreate(BaseModel):
    name: str = Field(..., max_length=50)
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')


class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')


class TagResponse(TagBase):
    created_at: datetime = Field(..., serialization_alias="createdAt")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


class TagWithCount(TagBase):
    ticket_count: int = Field(..., serialization_alias="ticketCount")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


class TagsListResponse(BaseModel):
    """Wrapper for list of tags to match API documentation"""
    tags: List[TagWithCount]
