from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Association table for many-to-many relationship
ticket_tags = Table(
    'ticket_tags',
    Base.metadata,
    Column('ticket_id', Integer, ForeignKey('tickets.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now())
)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    tags = relationship("Tag", secondary=ticket_tags, back_populates="tickets")
