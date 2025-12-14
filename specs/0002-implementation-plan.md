# Implementation Plan: Simple Ticket Management System

**Document Version:** 0002  
**Based on Specification:** 0001-spec.md  
**Date:** December 13, 2025  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#1-overview)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Phase 1: Core Infrastructure](#3-phase-1-core-infrastructure-week-1)
4. [Phase 2: Backend API Implementation](#4-phase-2-backend-api-implementation-week-2)
5. [Phase 3: Frontend Foundation](#5-phase-3-frontend-foundation-week-3)
6. [Phase 4: Ticket Management Features](#6-phase-4-ticket-management-features-week-4)
7. [Phase 5: Tag System Implementation](#7-phase-5-tag-system-implementation-week-5)
8. [Phase 6: Filtering and Search](#8-phase-6-filtering-and-search-week-6)
9. [Phase 7: Polish and Testing](#9-phase-7-polish-and-testing-week-7)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Post-Launch Tasks](#11-post-launch-tasks)

---

## 1. Overview

### 1.1 Project Summary
Build a simple, tag-based ticket management system for personal task tracking using:
- **Backend:** Python + FastAPI + PostgreSQL
- **Frontend:** Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- **Timeline:** 7 weeks (6 weeks development + 1 week polish/testing)

### 1.2 Success Criteria
- [ ] All functional requirements from 0001-spec.md implemented
- [ ] Application loads in < 1 second
- [ ] Search/filter operations respond in < 300ms
- [ ] No critical bugs in core workflows
- [ ] Clean, maintainable codebase with proper typing

### 1.3 Development Approach
- **Methodology:** Agile, feature-driven development
- **Version Control:** Git with feature branches
- **Testing:** Unit tests for backend, integration tests for API
- **Documentation:** Inline code comments + API documentation via FastAPI

---

## 2. Development Environment Setup

### 2.1 Prerequisites

**Required Software:**
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 15+
- Git
- Code editor (VS Code recommended)

**Recommended VS Code Extensions:**
- Python
- Pylance
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostgreSQL

### 2.2 Initial Setup Steps

#### 2.2.1 Repository Initialization
```bash
# Initialize git repository
git init
git branch -M main

# Create .gitignore from spec
# (Use .gitignore from 0001-spec.md section 8.2.3)

# Initial commit
git add .
git commit -m "Initial commit: Project structure and specs"
```

#### 2.2.2 Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with local settings:
# - DATABASE_URL: Local PostgreSQL connection
# - SECRET_KEY: Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
# - ALLOWED_ORIGINS: http://localhost:5173
```

#### 2.2.3 Database Setup
```bash
# Create PostgreSQL database
createdb pmanager

# Verify connection
psql pmanager -c "SELECT version();"
```

---

## 3. Phase 1: Core Infrastructure (Week 1)

**Goal:** Set up project scaffolding, database, and basic API server

### 3.1 Day 1-2: Backend Foundation

#### Task 1.1: Python Environment Setup
```bash
# Create and activate virtual environment
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic pydantic-settings python-dotenv
pip freeze > requirements.txt
```

**Deliverables:**
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] requirements.txt generated

#### Task 1.2: FastAPI Application Setup
**File:** `server/app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Ticket Manager API",
    description="Simple tag-based ticket management system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Ticket Manager API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

**Testing:**
```bash
uvicorn app.main:app --reload --port 8000
# Visit http://localhost:8000/docs to see Swagger UI
```

**Deliverables:**
- [ ] FastAPI app running
- [ ] CORS configured
- [ ] Swagger docs accessible

#### Task 1.3: Database Configuration
**File:** `server/app/database.py`

Implement database connection using SQLAlchemy (refer to spec section 8.5.2)

**File:** `server/app/config.py`

Implement settings using Pydantic Settings (refer to spec section 8.5.8)

**Testing:**
```python
# Test database connection
from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print(result.fetchone())  # Should print (1,)
```

**Deliverables:**
- [ ] Database connection working
- [ ] Configuration loading from .env
- [ ] Connection pooling configured

#### Task 1.4: Alembic Setup
```bash
# Initialize Alembic
alembic init alembic

# Edit alembic.ini to use config from .env
# Edit alembic/env.py to import models
```

**File:** `alembic/env.py`
```python
from app.config import settings
from app.database import Base
from app.models import ticket, tag  # Import all models

target_metadata = Base.metadata
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
```

**Deliverables:**
- [ ] Alembic initialized
- [ ] Configuration linked to app settings

### 3.2 Day 3-4: Database Models and Migrations

#### Task 1.5: Create SQLAlchemy Models

**File:** `server/app/models/ticket.py`

Implement Ticket model (refer to spec section 8.5.3)

**File:** `server/app/models/tag.py`
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    color = Column(String(7), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    tickets = relationship("Ticket", secondary="ticket_tags", back_populates="tags")
```

**Deliverables:**
- [ ] Ticket model created
- [ ] Tag model created
- [ ] Association table defined
- [ ] Relationships configured

#### Task 1.6: Create Initial Migration
```bash
# Generate migration
alembic revision --autogenerate -m "Create initial tables"

# Review migration file in alembic/versions/
# Edit if necessary to match spec SQL (section 4.1)

# Apply migration
alembic upgrade head

# Verify tables created
psql pmanager -c "\dt"
```

**Deliverables:**
- [ ] Migration files created
- [ ] Database schema matches spec
- [ ] Indexes created
- [ ] Triggers implemented

#### Task 1.7: Create Database Triggers
Create migration for the `updated_at` trigger (refer to spec section 4.2)

**Testing:**
```sql
-- Test trigger
INSERT INTO tickets (title) VALUES ('Test ticket');
UPDATE tickets SET title = 'Updated test' WHERE title = 'Test ticket';
SELECT title, created_at, updated_at FROM tickets;
-- updated_at should be newer than created_at
```

**Deliverables:**
- [ ] Trigger function created
- [ ] Trigger applied to tickets table
- [ ] Trigger tested and working

### 3.3 Day 5: Frontend Foundation Setup

#### Task 1.8: Vite + React + TypeScript Setup
```bash
# Create Vite project
cd ..
npm create vite@latest client -- --template react-ts

cd client
npm install

# Install dependencies
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom axios
npm install date-fns  # For date formatting
```

**Deliverables:**
- [ ] Vite project created
- [ ] React + TypeScript configured
- [ ] Dependencies installed

#### Task 1.9: Tailwind CSS Configuration
```bash
# Initialize Tailwind
npx tailwindcss init -p
```

**File:** `client/tailwind.config.js`
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
        },
      },
    },
  },
  plugins: [],
}
```

**File:** `client/src/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

**Deliverables:**
- [ ] Tailwind configured
- [ ] Global styles set up
- [ ] Test page renders with Tailwind classes

#### Task 1.10: shadcn/ui Installation
```bash
# Install shadcn/ui CLI
npx shadcn-ui@latest init

# Install initial components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
```

**Deliverables:**
- [ ] shadcn/ui configured
- [ ] Base components installed
- [ ] components/ui folder created

### 3.4 Week 1 Deliverables Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend dev server running on port 5173
- [ ] Database schema created with all tables
- [ ] CORS working between frontend and backend
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Git repository with initial commits

**Testing Command:**
```bash
# Terminal 1
cd server && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2
cd client && npm run dev
```

---

## 4. Phase 2: Backend API Implementation (Week 2)

**Goal:** Implement all API endpoints with proper validation and error handling

### 4.1 Day 1-2: Pydantic Schemas

#### Task 2.1: Create Ticket Schemas
**File:** `server/app/schemas/ticket.py`

Implement all schemas from spec section 8.5.4:
- `TagBase`
- `TicketBase`
- `TicketCreate`
- `TicketUpdate`
- `TicketResponse`
- `TicketsListResponse`
- `AddTagsRequest`

**Testing:**
```python
# Test serialization
from app.schemas.ticket import TicketResponse
from datetime import datetime

ticket = TicketResponse(
    id=1,
    title="Test",
    description="Test description",
    is_completed=False,
    created_at=datetime.now(),
    updated_at=datetime.now(),
    tags=[]
)
print(ticket.model_dump(by_alias=True))
# Should show camelCase fields
```

**Deliverables:**
- [ ] All ticket schemas created
- [ ] Field aliases configured
- [ ] Validation rules applied

#### Task 2.2: Create Tag Schemas
**File:** `server/app/schemas/tag.py`

Implement all schemas from spec section 8.5.6:
- `TagBase`
- `TagCreate`
- `TagUpdate`
- `TagResponse`
- `TagWithCount`
- `TagsListResponse`

**Deliverables:**
- [ ] All tag schemas created
- [ ] Color validation regex applied
- [ ] Field aliases configured

### 4.2 Day 3-4: Service Layer Implementation

#### Task 2.3: Ticket Service
**File:** `server/app/services/ticket_service.py`

```python
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.ticket import Ticket
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
        query = query.filter(Ticket.title.ilike(f"%{search}%"))
    
    # Apply tag filter (OR logic)
    if tag_ids:
        query = query.join(Ticket.tags).filter(Tag.id.in_(tag_ids)).distinct()
    
    # Order by updated_at desc
    return query.order_by(Ticket.updated_at.desc()).all()

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
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
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
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db.delete(db_ticket)
    db.commit()

def toggle_complete(db: Session, ticket_id: int) -> Ticket:
    """Toggle ticket completion status"""
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db_ticket.is_completed = not db_ticket.is_completed
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def add_tags(db: Session, ticket_id: int, tag_ids: List[int]) -> Ticket:
    """Add tags to a ticket"""
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    # Add only new tags (avoid duplicates)
    for tag in tags:
        if tag not in db_ticket.tags:
            db_ticket.tags.append(tag)
    
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def remove_tag(db: Session, ticket_id: int, tag_id: int) -> None:
    """Remove a tag from a ticket"""
    db_ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if tag and tag in db_ticket.tags:
        db_ticket.tags.remove(tag)
        db.commit()
```

**Deliverables:**
- [ ] All ticket CRUD operations implemented
- [ ] Filter logic working (search + tags + status)
- [ ] Error handling added
- [ ] Tag operations implemented

#### Task 2.4: Tag Service
**File:** `server/app/services/tag_service.py`

```python
from sqlalchemy.orm import Session
from sqlalchemy import func
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
    ).group_by(Tag.id).all()
    
    return [
        TagWithCount(
            id=tag.id,
            name=tag.name,
            color=tag.color,
            ticket_count=count
        )
        for tag, count in tags_with_counts
    ]

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
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    if tag.name is not None:
        db_tag.name = tag.name
    if tag.color is not None:
        db_tag.color = tag.color
    
    db.commit()
    db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: int) -> None:
    """Delete a tag"""
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db.delete(db_tag)
    db.commit()
```

**Deliverables:**
- [ ] All tag CRUD operations implemented
- [ ] Ticket counting query working
- [ ] Duplicate name check (case-insensitive)
- [ ] Error handling added

### 4.3 Day 5: Router Implementation

#### Task 2.5: Ticket Router
**File:** `server/app/routers/tickets.py`

Implement router from spec section 8.5.5

**Testing:**
```bash
# Test with curl
curl -X POST http://localhost:8000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title": "Test ticket", "description": "Test"}'

curl http://localhost:8000/api/tickets
```

**Deliverables:**
- [ ] All ticket endpoints working
- [ ] Request/response validation working
- [ ] Error responses formatted correctly

#### Task 2.6: Tag Router
**File:** `server/app/routers/tags.py`

Implement router from spec section 8.5.7

**Deliverables:**
- [ ] All tag endpoints working
- [ ] Ticket counts included in GET response

#### Task 2.7: Register Routers
**File:** `server/app/main.py`

```python
from app.routers import tickets, tags

app.include_router(tickets.router, prefix="/api/tickets", tags=["tickets"])
app.include_router(tags.router, prefix="/api/tags", tags=["tags"])
```

### 4.4 Week 2 Deliverables Checklist

- [ ] All API endpoints implemented and documented
- [ ] Swagger UI shows all endpoints with examples
- [ ] Field name conversion (snake_case ↔ camelCase) working
- [ ] Error handling returns proper status codes
- [ ] Database operations transactional
- [ ] Manual API testing successful

**Postman Collection:** Create collection for all endpoints

---

## 5. Phase 3: Frontend Foundation (Week 3)

**Goal:** Set up routing, API client, and base layout components

### 5.1 Day 1-2: Project Structure and API Client

#### Task 3.1: Create TypeScript Types
**File:** `client/src/types/ticket.ts`

```typescript
export interface Tag {
  id: number;
  name: string;
  color: string | null;
}

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  tagIds?: number[];
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}
```

**File:** `client/src/types/tag.ts`

```typescript
export interface TagWithCount {
  id: number;
  name: string;
  color: string | null;
  ticketCount: number;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}
```

**Deliverables:**
- [ ] All TypeScript interfaces created
- [ ] Types match API responses exactly

#### Task 3.2: API Client Setup
**File:** `client/src/services/api.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);
```

**File:** `client/src/services/ticketService.ts`

```typescript
import { api } from './api';
import { Ticket, CreateTicketRequest, UpdateTicketRequest } from '../types/ticket';

export const ticketService = {
  async getAll(params?: {
    search?: string;
    tags?: string;
    status?: string;
  }): Promise<Ticket[]> {
    const response = await api.get<{ tickets: Ticket[] }>('/api/tickets', { params });
    return response.data.tickets;
  },

  async create(ticket: CreateTicketRequest): Promise<Ticket> {
    const response = await api.post<Ticket>('/api/tickets', ticket);
    return response.data;
  },

  async update(id: number, ticket: UpdateTicketRequest): Promise<Ticket> {
    const response = await api.put<Ticket>(`/api/tickets/${id}`, ticket);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/tickets/${id}`);
  },

  async toggleComplete(id: number): Promise<Ticket> {
    const response = await api.patch<Ticket>(`/api/tickets/${id}/complete`);
    return response.data;
  },

  async addTags(id: number, tagIds: number[]): Promise<Ticket> {
    const response = await api.post<Ticket>(`/api/tickets/${id}/tags`, { tagIds });
    return response.data;
  },

  async removeTag(ticketId: number, tagId: number): Promise<void> {
    await api.delete(`/api/tickets/${ticketId}/tags/${tagId}`);
  },
};
```

**File:** `client/src/services/tagService.ts`

```typescript
import { api } from './api';
import { TagWithCount, CreateTagRequest } from '../types/tag';

export const tagService = {
  async getAll(): Promise<TagWithCount[]> {
    const response = await api.get<{ tags: TagWithCount[] }>('/api/tags');
    return response.data.tags;
  },

  async create(tag: CreateTagRequest): Promise<TagWithCount> {
    const response = await api.post<TagWithCount>('/api/tags', tag);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/tags/${id}`);
  },
};
```

**Deliverables:**
- [ ] Axios client configured
- [ ] All API methods implemented
- [ ] Error interceptor working
- [ ] Environment variable for API URL

#### Task 3.3: React Query Setup (Optional but Recommended)
```bash
npm install @tanstack/react-query
```

**File:** `client/src/hooks/useTickets.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import { CreateTicketRequest, UpdateTicketRequest } from '../types/ticket';

export function useTickets(filters?: {
  search?: string;
  tags?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.getAll(filters),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticket: CreateTicketRequest) => ticketService.create(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

// Similar hooks for update, delete, toggle, etc.
```

**Deliverables:**
- [ ] React Query configured
- [ ] Custom hooks for data fetching
- [ ] Cache invalidation working

### 5.2 Day 3-4: Layout Components

#### Task 3.4: Main Layout
**File:** `client/src/components/layout/Layout.tsx`

```typescript
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Deliverables:**
- [ ] Layout component created
- [ ] Responsive sidebar
- [ ] Header with title and actions

#### Task 3.5: Header Component
**File:** `client/src/components/layout/Header.tsx`

```typescript
import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onNewTicket?: () => void;
}

export function Header({ onNewTicket }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎫</span>
          <h1 className="text-xl font-semibold text-gray-900">
            Ticket Manager
          </h1>
        </div>
        
        <Button onClick={onNewTicket}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>
    </header>
  );
}
```

**Install icons:**
```bash
npm install lucide-react
```

**Deliverables:**
- [ ] Header component with branding
- [ ] New Ticket button
- [ ] Icons integrated

#### Task 3.6: Sidebar Component
**File:** `client/src/components/layout/Sidebar.tsx`

```typescript
import React from 'react';
import { TagFilter } from '../tag/TagFilter';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Tags</h2>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <TagFilter />
      </div>
    </aside>
  );
}
```

**Deliverables:**
- [ ] Sidebar with tags section
- [ ] Add tag button
- [ ] Proper spacing and styling

### 5.3 Day 5: Utility Components

#### Task 3.7: Install Additional shadcn Components
```bash
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add command
npx shadcn-ui@latest add separator
```

#### Task 3.8: Loading and Empty States
**File:** `client/src/components/common/LoadingSpinner.tsx`

```typescript
import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

**File:** `client/src/components/ticket/EmptyTicketState.tsx`

```typescript
import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface EmptyTicketStateProps {
  onCreateTicket?: () => void;
}

export function EmptyTicketState({ onCreateTicket }: EmptyTicketStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No tickets yet
      </h3>
      <p className="text-gray-500 mb-6">
        Get started by creating your first ticket
      </p>
      <Button onClick={onCreateTicket}>
        <Plus className="mr-2 h-4 w-4" />
        Create Ticket
      </Button>
    </div>
  );
}
```

**Deliverables:**
- [ ] Loading spinner component
- [ ] Empty state component
- [ ] Reusable across app

### 5.4 Week 3 Deliverables Checklist

- [ ] API client working with backend
- [ ] TypeScript types for all data models
- [ ] Layout structure complete
- [ ] Navigation working
- [ ] Basic components installed
- [ ] Application shells out (empty but structured)

---

## 6. Phase 4: Ticket Management Features (Week 4)

**Goal:** Implement complete ticket CRUD functionality with UI

### 6.1 Day 1-2: Ticket Display

#### Task 4.1: Ticket Card Component
**File:** `client/src/components/ticket/TicketCard.tsx`

```typescript
import React from 'react';
import { Ticket } from '../../types/ticket';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
}

export function TicketCard({
  ticket,
  onEdit,
  onDelete,
  onToggleComplete,
}: TicketCardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border p-4 
        hover:shadow-md transition-shadow
        ${ticket.isCompleted ? 'bg-gray-50' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={`
              text-lg font-medium mb-2
              ${ticket.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}
            `}
          >
            {ticket.title}
          </h3>
          
          {ticket.description && (
            <p className="text-sm text-gray-600 mb-3">
              {ticket.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            {ticket.tags.map((tag) => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color || undefined }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          
          <p className="text-xs text-gray-500">
            Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
          </p>
        </div>
        
        <div className="flex gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete?.(ticket.id)}
            title={ticket.isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check className={`h-4 w-4 ${ticket.isCompleted ? 'text-green-600' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(ticket)}
            title="Edit ticket"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(ticket.id)}
            title="Delete ticket"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Install date-fns:**
```bash
npm install date-fns
```

**Deliverables:**
- [ ] Ticket card displays all fields
- [ ] Completed tickets styled differently
- [ ] Tags displayed with colors
- [ ] Action buttons working
- [ ] Hover effects applied

#### Task 4.2: Ticket List Component
**File:** `client/src/components/ticket/TicketList.tsx`

```typescript
import React from 'react';
import { Ticket } from '../../types/ticket';
import { TicketCard } from './TicketCard';
import { EmptyTicketState } from './EmptyTicketState';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TicketListProps {
  tickets: Ticket[];
  loading?: boolean;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
  onCreateTicket?: () => void;
}

export function TicketList({
  tickets,
  loading,
  onEdit,
  onDelete,
  onToggleComplete,
  onCreateTicket,
}: TicketListProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (tickets.length === 0) {
    return <EmptyTicketState onCreateTicket={onCreateTicket} />;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
```

**Deliverables:**
- [ ] List displays all tickets
- [ ] Loading state shown
- [ ] Empty state shown when no tickets
- [ ] Events properly handled

### 6.2 Day 3: Ticket Creation

#### Task 4.3: Ticket Form Component
**File:** `client/src/components/ticket/TicketForm.tsx`

```typescript
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { CreateTicketRequest, UpdateTicketRequest } from '../../types/ticket';

interface TicketFormProps {
  initialValues?: Partial<CreateTicketRequest>;
  onSubmit: (data: CreateTicketRequest | UpdateTicketRequest) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TicketForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: TicketFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter ticket title"
          maxLength={200}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter ticket description (optional)"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!title.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
```

**Deliverables:**
- [ ] Form with validation
- [ ] Character limit enforced
- [ ] Cancel/Submit buttons
- [ ] Disabled state when empty

#### Task 4.4: Ticket Modal Component
**File:** `client/src/components/ticket/TicketModal.tsx`

```typescript
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { TicketForm } from './TicketForm';
import { Ticket } from '../../types/ticket';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
  onSubmit: (data: any) => void;
}

export function TicketModal({
  open,
  onClose,
  ticket,
  onSubmit,
}: TicketModalProps) {
  const isEditing = !!ticket;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? 'Edit Ticket' : 'Create Ticket'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the ticket details below'
              : 'Fill in the details to create a new ticket'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <TicketForm
            initialValues={ticket ? {
              title: ticket.title,
              description: ticket.description || '',
            } : undefined}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitLabel={isEditing ? 'Update' : 'Create'}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

**Deliverables:**
- [ ] Modal opens/closes properly
- [ ] Works for both create and edit
- [ ] Form submits correctly

### 6.3 Day 4: Ticket Deletion

#### Task 4.5: Confirmation Dialog
**File:** `client/src/components/common/ConfirmDialog.tsx`

```typescript
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Install alert-dialog:**
```bash
npx shadcn-ui@latest add alert-dialog
```

**Deliverables:**
- [ ] Confirmation dialog component
- [ ] Reusable for any confirmation
- [ ] Properly styled

### 6.4 Day 5: Integration

#### Task 4.6: Main Page Component
**File:** `client/src/pages/HomePage.tsx`

```typescript
import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { TicketList } from '../components/ticket/TicketList';
import { TicketModal } from '../components/ticket/TicketModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useTickets, useCreateTicket, useUpdateTicket, useDeleteTicket, useToggleComplete } from '../hooks/useTickets';
import { Ticket } from '../types/ticket';
import { toast } from 'sonner';

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<number | null>(null);

  const { data: tickets, isLoading } = useTickets();
  const createMutation = useCreateTicket();
  const updateMutation = useUpdateTicket();
  const deleteMutation = useDeleteTicket();
  const toggleMutation = useToggleComplete();

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Ticket created successfully');
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (!editingTicket) return;
    
    try {
      await updateMutation.mutateAsync({ id: editingTicket.id, data });
      setIsModalOpen(false);
      setEditingTicket(null);
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    if (!deletingTicketId) return;
    
    try {
      await deleteMutation.mutateAsync(deletingTicketId);
      setDeletingTicketId(null);
      toast.success('Ticket deleted successfully');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  return (
    <Layout>
      <TicketList
        tickets={tickets || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeletingTicketId}
        onToggleComplete={handleToggleComplete}
        onCreateTicket={() => setIsModalOpen(true)}
      />

      <TicketModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
        }}
        ticket={editingTicket}
        onSubmit={editingTicket ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={!!deletingTicketId}
        onClose={() => setDeletingTicketId(null)}
        onConfirm={handleDelete}
        title="Delete Ticket"
        description="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmLabel="Delete"
      />
    </Layout>
  );
}
```

**Install toast:**
```bash
npm install sonner
```

**Deliverables:**
- [ ] Main page with all operations working
- [ ] Toast notifications on actions
- [ ] Error handling in place
- [ ] Loading states working

### 6.5 Week 4 Deliverables Checklist

- [ ] Tickets display in list view
- [ ] Create ticket functionality working
- [ ] Edit ticket functionality working
- [ ] Delete ticket with confirmation
- [ ] Toggle complete status
- [ ] All operations update UI immediately
- [ ] Error messages show to user
- [ ] Success messages show to user

---

## 7. Phase 5: Tag System Implementation (Week 5)

**Goal:** Implement tag management and assignment features

### 7.1 Day 1-2: Tag Display and Management

#### Task 5.1: Tag Badge Component
**File:** `client/src/components/tag/TagBadge.tsx`

```typescript
import React from 'react';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { Tag } from '../../types/tag';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  removable?: boolean;
}

export function TagBadge({ tag, onRemove, removable }: TagBadgeProps) {
  return (
    <Badge
      style={{
        backgroundColor: tag.color || '#6b7280',
        color: '#ffffff',
      }}
      className="flex items-center gap-1"
    >
      {tag.name}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
```

**Deliverables:**
- [ ] Tag badge with color
- [ ] Optional remove button
- [ ] Click event handled properly

#### Task 5.2: Tag List Component (Sidebar)
**File:** `client/src/components/tag/TagList.tsx`

```typescript
import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { TagWithCount } from '../../types/tag';

interface TagListProps {
  tags: TagWithCount[];
  selectedTagIds: number[];
  onToggleTag: (tagId: number) => void;
  onDeleteTag?: (tagId: number) => void;
}

export function TagList({
  tags,
  selectedTagIds,
  onToggleTag,
  onDeleteTag,
}: TagListProps) {
  const totalTickets = tags.reduce((sum, tag) => sum + tag.ticketCount, 0);

  return (
    <div className="space-y-2">
      {/* All tickets option */}
      <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
        <Checkbox
          id="all-tickets"
          checked={selectedTagIds.length === 0}
          onCheckedChange={() => onToggleTag(0)}
        />
        <label
          htmlFor="all-tickets"
          className="flex-1 text-sm cursor-pointer"
        >
          All Tickets
        </label>
        <span className="text-xs text-gray-500">
          {totalTickets}
        </span>
      </div>

      {/* Individual tags */}
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 group"
        >
          <Checkbox
            id={`tag-${tag.id}`}
            checked={selectedTagIds.includes(tag.id)}
            onCheckedChange={() => onToggleTag(tag.id)}
          />
          
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: tag.color || '#6b7280' }}
          />
          
          <label
            htmlFor={`tag-${tag.id}`}
            className="flex-1 text-sm cursor-pointer truncate"
          >
            {tag.name}
          </label>
          
          <span className="text-xs text-gray-500">
            {tag.ticketCount}
          </span>
          
          {onDeleteTag && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
              onClick={() => onDeleteTag(tag.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Deliverables:**
- [ ] Tag list with checkboxes
- [ ] Show ticket counts
- [ ] Color indicators
- [ ] Delete button on hover
- [ ] "All tickets" option

#### Task 5.3: Tag Create Dialog
**File:** `client/src/components/tag/TagCreateDialog.tsx`

```typescript
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface TagCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color?: string }) => void;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
];

export function TagCreateDialog({
  open,
  onClose,
  onSubmit,
}: TagCreateDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, color });
    setName('');
    setColor(PRESET_COLORS[0]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription>
            Add a new tag to organize your tickets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tag name"
                maxLength={50}
                required
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={`
                      w-8 h-8 rounded-full
                      ${color === presetColor ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
                    `}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => setColor(presetColor)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Deliverables:**
- [ ] Tag creation dialog
- [ ] Name input with validation
- [ ] Color picker with presets
- [ ] Form submission

### 7.2 Day 3-4: Tag Assignment

#### Task 5.4: Tag Selector Component
**File:** `client/src/components/tag/TagSelector.tsx`

```typescript
import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { TagWithCount } from '../../types/tag';
import { cn } from '../../lib/utils';

interface TagSelectorProps {
  tags: TagWithCount[];
  selectedTagIds: number[];
  onToggleTag: (tagId: number) => void;
}

export function TagSelector({
  tags,
  selectedTagIds,
  onToggleTag,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTagIds.length === 0
            ? 'Select tags...'
            : `${selectedTagIds.length} tag(s) selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                onSelect={() => onToggleTag(tag.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedTagIds.includes(tag.id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: tag.color || '#6b7280' }}
                />
                {tag.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

**Install popover:**
```bash
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add label
```

**Deliverables:**
- [ ] Multi-select tag picker
- [ ] Search functionality
- [ ] Selected tags shown
- [ ] Dropdown closes on selection

#### Task 5.5: Update Ticket Form with Tags
Update `TicketForm.tsx` to include tag selection

**Deliverables:**
- [ ] Tag selector in ticket form
- [ ] Tags submitted with ticket
- [ ] Existing tags shown when editing

### 7.3 Day 5: Integration and Testing

#### Task 5.6: Integrate Tag Features
- Connect tag creation to API
- Connect tag deletion to API
- Connect tag filtering to ticket list
- Add tags to ticket create/edit flow

**Deliverables:**
- [ ] Create tag working
- [ ] Delete tag with confirmation
- [ ] Filter tickets by tags
- [ ] Assign tags to tickets
- [ ] Remove tags from tickets

### 7.4 Week 5 Deliverables Checklist

- [ ] Tags displayed in sidebar with counts
- [ ] Create tags functionality working
- [ ] Delete tags with confirmation
- [ ] Tag filtering updates ticket list
- [ ] Multiple tag selection working (OR logic)
- [ ] Assign tags during ticket creation
- [ ] Edit tags on existing tickets
- [ ] Remove tags from tickets

---

## 8. Phase 6: Filtering and Search (Week 6)

**Goal:** Implement comprehensive filtering and search capabilities

### 8.1 Day 1-2: Search Implementation

#### Task 6.1: Search Bar Component
**File:** `client/src/components/common/SearchBar.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search tickets by title...',
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

**Deliverables:**
- [ ] Search input with icon
- [ ] Debounced search (300ms)
- [ ] Clear button
- [ ] Real-time search working

#### Task 6.2: Debounce Hook
**File:** `client/src/hooks/useDebounce.ts`

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Deliverables:**
- [ ] Debounce hook implemented
- [ ] Prevents excessive API calls
- [ ] Cleanup on unmount

### 8.2 Day 3: Status Filtering

#### Task 6.3: Status Filter Component
**File:** `client/src/components/common/StatusFilter.tsx`

```typescript
import React from 'react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../ui/toggle-group';

interface StatusFilterProps {
  value: 'all' | 'open' | 'completed';
  onChange: (value: 'all' | 'open' | 'completed') => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => val && onChange(val as any)}
      className="justify-start"
    >
      <ToggleGroupItem value="all" aria-label="All tickets">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="open" aria-label="Open tickets">
        Open
      </ToggleGroupItem>
      <ToggleGroupItem value="completed" aria-label="Completed tickets">
        Completed
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

**Install toggle-group:**
```bash
npx shadcn-ui@latest add toggle-group
```

**Deliverables:**
- [ ] Status filter with 3 options
- [ ] Visual indication of selected
- [ ] Changes filter tickets

### 8.3 Day 4: Combined Filtering

#### Task 6.4: Filter State Management
**File:** `client/src/hooks/useFilters.ts`

```typescript
import { useState, useCallback } from 'react';

export interface Filters {
  search: string;
  tagIds: number[];
  status: 'all' | 'open' | 'completed';
}

export function useFilters() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    tagIds: [],
    status: 'all',
  });

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleTag = useCallback((tagId: number) => {
    setFilters((prev) => {
      const tagIds = prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds };
    });
  }, []);

  const setStatus = useCallback((status: 'all' | 'open' | 'completed') => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      tagIds: [],
      status: 'all',
    });
  }, []);

  const hasActiveFilters = filters.search || filters.tagIds.length > 0 || filters.status !== 'all';

  return {
    filters,
    updateSearch,
    toggleTag,
    setStatus,
    clearFilters,
    hasActiveFilters,
  };
}
```

**Deliverables:**
- [ ] Centralized filter state
- [ ] Update functions for each filter
- [ ] Clear filters function
- [ ] Active filters indicator

### 8.4 Day 5: Integration and Polish

#### Task 6.5: Update Main Page with All Filters
Update `HomePage.tsx` to include all filters:
- Search bar in header
- Status filter near top
- Tag filters in sidebar
- Combined filter logic

**File:** `client/src/pages/HomePage.tsx` (Updated)

```typescript
// Add search and filters
const { filters, updateSearch, toggleTag, setStatus, clearFilters, hasActiveFilters } = useFilters();

// Update tickets query to use filters
const { data: tickets, isLoading } = useTickets({
  search: filters.search,
  tags: filters.tagIds.join(','),
  status: filters.status,
});

// Add components to UI
<div className="space-y-4">
  <div className="flex items-center gap-4">
    <SearchBar onSearch={updateSearch} />
    <StatusFilter value={filters.status} onChange={setStatus} />
    {hasActiveFilters && (
      <Button variant="outline" size="sm" onClick={clearFilters}>
        Clear Filters
      </Button>
    )}
  </div>
  
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {filters.search && (
      <span>Searching for "{filters.search}"</span>
    )}
    {filters.tagIds.length > 0 && (
      <span>• {filters.tagIds.length} tag(s) selected</span>
    )}
    {filters.status !== 'all' && (
      <span>• Status: {filters.status}</span>
    )}
  </div>
  
  <TicketList ... />
</div>
```

**Deliverables:**
- [ ] Search bar prominent in UI
- [ ] Status filter easy to access
- [ ] Tag filters in sidebar
- [ ] Active filters displayed
- [ ] Clear filters button
- [ ] All filters work together (AND logic)

### 8.5 Week 6 Deliverables Checklist

- [ ] Search by title working (partial match, case-insensitive)
- [ ] Search debounced to avoid excessive API calls
- [ ] Filter by status (All/Open/Completed)
- [ ] Filter by tags (multiple selection with OR logic)
- [ ] Combine search + tags + status (AND logic between types)
- [ ] Clear all filters button
- [ ] Active filters displayed to user
- [ ] Performance meets spec (<300ms response)

---

## 9. Phase 7: Polish and Testing (Week 7)

**Goal:** Add final polish, handle edge cases, and ensure quality

### 9.1 Day 1-2: Error Handling and Validation

#### Task 7.1: Error Boundary
**File:** `client/src/components/common/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Deliverables:**
- [ ] Error boundary catches React errors
- [ ] User-friendly error message
- [ ] Reload option available

#### Task 7.2: API Error Handling
Enhance error handling in API client:

```typescript
// Update api.ts interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred';
    
    if (error.response) {
      // Server responded with error
      message = error.response.data.detail || error.response.data.message || message;
    } else if (error.request) {
      // No response received
      message = 'Network error. Please check your connection.';
    }
    
    // Show toast notification
    toast.error(message);
    
    return Promise.reject(error);
  }
);
```

**Deliverables:**
- [ ] API errors shown to user
- [ ] Network errors handled gracefully
- [ ] Validation errors displayed clearly

### 9.2 Day 3: Loading States and Animations

#### Task 7.3: Skeleton Loaders
**File:** `client/src/components/common/TicketSkeleton.tsx`

```typescript
import React from 'react';

export function TicketSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}
```

**Deliverables:**
- [ ] Skeleton loaders for tickets
- [ ] Skeleton loaders for tags
- [ ] Smooth loading experience

#### Task 7.4: Transitions and Animations
Add subtle animations using Tailwind:

```css
/* Add to globals.css */
@layer utilities {
  .animate-in {
    animation: fadeIn 0.2s ease-in;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

**Deliverables:**
- [ ] Fade-in animations for new items
- [ ] Smooth transitions on hover
- [ ] Loading spinners for async operations

### 9.3 Day 4: Responsive Design

#### Task 7.5: Mobile Optimization
Update components for mobile:

```typescript
// Update Layout.tsx for mobile menu
<div className="flex flex-col lg:flex-row">
  <Sidebar className="lg:w-64" />
  <main className="flex-1 p-4 lg:p-6">
    {children}
  </main>
</div>
```

**Deliverables:**
- [ ] Responsive breakpoints applied
- [ ] Mobile menu for sidebar
- [ ] Touch-friendly tap targets
- [ ] Proper spacing on small screens

### 9.4 Day 5: Testing and Bug Fixes

#### Task 7.6: Manual Testing Checklist

**Ticket Operations:**
- [ ] Create ticket with title only
- [ ] Create ticket with title + description
- [ ] Create ticket with tags
- [ ] Edit ticket title
- [ ] Edit ticket description
- [ ] Toggle ticket complete/incomplete
- [ ] Delete ticket
- [ ] Delete ticket with confirmation cancel

**Tag Operations:**
- [ ] Create tag with color
- [ ] Create duplicate tag (should fail)
- [ ] Delete tag
- [ ] Delete tag with tickets (shows count)
- [ ] Add tag to ticket
- [ ] Remove tag from ticket

**Filtering:**
- [ ] Search by title (partial match)
- [ ] Search with no results
- [ ] Filter by single tag
- [ ] Filter by multiple tags
- [ ] Filter by status (All/Open/Completed)
- [ ] Combine search + tags + status
- [ ] Clear all filters

**Edge Cases:**
- [ ] Empty ticket list
- [ ] Very long ticket title
- [ ] Very long description
- [ ] Many tags on one ticket
- [ ] No tags in system
- [ ] Slow network (check loading states)
- [ ] Network error (check error handling)

#### Task 7.7: Backend Testing
Create basic pytest tests:

**File:** `server/tests/test_tickets.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_ticket():
    response = client.post(
        "/api/tickets",
        json={"title": "Test Ticket", "description": "Test"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Ticket"
    assert "id" in data

def test_get_tickets():
    response = client.get("/api/tickets")
    assert response.status_code == 200
    data = response.json()
    assert "tickets" in data
    assert isinstance(data["tickets"], list)

def test_create_ticket_without_title():
    response = client.post(
        "/api/tickets",
        json={"description": "No title"}
    )
    assert response.status_code == 422  # Validation error
```

**Run tests:**
```bash
cd server
pytest
```

**Deliverables:**
- [ ] Unit tests for key endpoints
- [ ] Integration tests for workflows
- [ ] All tests passing

### 9.5 Week 7 Deliverables Checklist

- [ ] All edge cases handled
- [ ] Error messages user-friendly
- [ ] Loading states smooth
- [ ] Animations subtle and professional
- [ ] Responsive on mobile/tablet/desktop
- [ ] Manual testing complete
- [ ] Backend tests written and passing
- [ ] No critical bugs remaining

---

## 10. Deployment Strategy

### 10.1 Production Build

#### Task 10.1: Frontend Production Build
```bash
cd client
npm run build

# Test production build locally
npm run preview
```

**Optimization checklist:**
- [ ] Build completes without errors
- [ ] Bundle size reasonable (<500KB gzipped)
- [ ] Source maps generated for debugging
- [ ] Environment variables configured

#### Task 10.2: Backend Production Setup
```bash
cd server

# Install production dependencies
pip install gunicorn

# Update requirements.txt
pip freeze > requirements.txt
```

**File:** `server/Procfile` (for deployment platforms)
```
web: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

**Deliverables:**
- [ ] Production dependencies installed
- [ ] Gunicorn configured
- [ ] WSGI server tested locally

### 10.2 Database Migration for Production

```bash
# Backup database
pg_dump pmanager > backup.sql

# Run migrations on production
alembic upgrade head
```

**Deliverables:**
- [ ] Migration scripts tested
- [ ] Rollback plan documented
- [ ] Database backup created

### 10.3 Deployment Options

#### Option A: Railway / Render
1. Connect GitHub repository
2. Configure build commands:
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install && npm run build`
3. Set environment variables
4. Deploy

#### Option B: Docker Deployment

**File:** `Dockerfile.backend`
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**File:** `Dockerfile.frontend`
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY client/package*.json ./
RUN npm ci

COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

**File:** `docker-compose.yml`
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: pmanager
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/pmanager
    depends_on:
      - db

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy:**
```bash
docker-compose up -d
```

### 10.4 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection string updated
- [ ] CORS origins set to production URL
- [ ] API URL updated in frontend
- [ ] SSL certificate configured
- [ ] Database migrations run
- [ ] Health check endpoints working
- [ ] Error logging configured
- [ ] Performance monitoring setup (optional)

---

## 11. Post-Launch Tasks

### 11.1 Monitoring and Maintenance

**Week 8-9: Monitor and Fix**
- [ ] Monitor error logs daily
- [ ] Track performance metrics
- [ ] Fix any bugs reported
- [ ] Optimize slow queries if needed

### 11.2 Documentation

**Create user documentation:**
- [ ] README with setup instructions
- [ ] API documentation (auto-generated via FastAPI)
- [ ] Deployment guide
- [ ] Development guide for contributors

### 11.3 Future Enhancements

**Priority for v1.1:**
1. Sorting options (by date, title, status)
2. Keyboard shortcuts
3. Ticket templates
4. Export tickets to CSV

**Consider for v2.0:**
1. Priority levels
2. Due dates
3. Attachments
4. Comments on tickets
5. Multi-user support with authentication

---

## Appendix A: Development Commands Quick Reference

### Backend Commands
```bash
# Activate virtual environment
source server/venv/bin/activate  # macOS/Linux
server\venv\Scripts\activate     # Windows

# Run development server
uvicorn app.main:app --reload --port 8000

# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Description"

# Run tests
pytest

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Add shadcn component
npx shadcn-ui@latest add component-name

# Lint and format
npm run lint
npm run format
```

### Database Commands
```bash
# Create database
createdb pmanager

# Drop database
dropdb pmanager

# Connect to database
psql pmanager

# Backup database
pg_dump pmanager > backup.sql

# Restore database
psql pmanager < backup.sql
```

---

## Appendix B: Troubleshooting Guide

### Common Issues

**Issue: CORS errors**
- Check `ALLOWED_ORIGINS` in backend `.env`
- Verify frontend is running on expected port
- Check CORS middleware configuration

**Issue: Database connection failed**
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

**Issue: Module not found**
- Backend: Activate virtual environment
- Frontend: Run `npm install`
- Check import paths

**Issue: Migration conflicts**
- Review migration files
- Rollback if needed: `alembic downgrade -1`
- Delete conflicting migration and regenerate

**Issue: Build errors**
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies installed

---

## Appendix C: Code Quality Checklist

### Backend
- [ ] All functions have type hints
- [ ] Pydantic models for all request/response
- [ ] Proper error handling with HTTP status codes
- [ ] Database queries optimized (use joins, eager loading)
- [ ] No hardcoded values (use config/env vars)
- [ ] Docstrings for public functions
- [ ] Input validation on all endpoints

### Frontend
- [ ] TypeScript strict mode enabled
- [ ] All components properly typed
- [ ] No `any` types (use proper interfaces)
- [ ] Components are small and focused
- [ ] Reusable logic extracted to hooks
- [ ] Proper error boundaries
- [ ] Loading states for async operations
- [ ] Accessibility attributes (aria-labels, etc.)

---

**End of Implementation Plan**

This plan provides a comprehensive roadmap for implementing the Ticket Management System. Follow each phase sequentially, checking off deliverables as you complete them. Adjust timelines as needed based on your development speed and any unforeseen challenges.

Good luck with the implementation! 🚀

