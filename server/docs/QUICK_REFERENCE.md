# API Quick Reference

Quick reference for the Ticket Manager API endpoints.

## Base URL

```
http://localhost:8000
```

## Tickets

### List Tickets
```http
GET /api/tickets/
GET /api/tickets/?status=open
GET /api/tickets/?status=completed
GET /api/tickets/?search=bug
GET /api/tickets/?tags=1,2
GET /api/tickets/?status=open&search=bug&tags=1
```

### Get Single Ticket
```http
GET /api/tickets/{id}
```

### Create Ticket
```http
POST /api/tickets/
Content-Type: application/json

{
  "title": "Ticket title (required, max 200 chars)",
  "description": "Description (optional)",
  "tagIds": [1, 2, 3]  // optional
}
```

### Update Ticket
```http
PUT /api/tickets/{id}
Content-Type: application/json

{
  "title": "New title (optional)",
  "description": "New description (optional)",
  "isCompleted": true  // optional
}
```

### Delete Ticket
```http
DELETE /api/tickets/{id}
```

### Toggle Completion
```http
PATCH /api/tickets/{id}/complete
```

### Add Tags to Ticket
```http
POST /api/tickets/{id}/tags
Content-Type: application/json

{
  "tagIds": [1, 2, 3]
}
```

### Remove Tag from Ticket
```http
DELETE /api/tickets/{id}/tags/{tagId}
```

## Tags

### List Tags (with counts)
```http
GET /api/tags/
```

### Get Single Tag
```http
GET /api/tags/{id}
```

### Create Tag
```http
POST /api/tags/
Content-Type: application/json

{
  "name": "Tag name (required, max 50 chars)",
  "color": "#ff0000"  // optional, must be hex format
}
```

### Update Tag
```http
PUT /api/tags/{id}
Content-Type: application/json

{
  "name": "New name (optional)",
  "color": "#00ff00"  // optional
}
```

### Delete Tag
```http
DELETE /api/tags/{id}
```

## Response Formats

### Ticket Response
```json
{
  "id": 1,
  "title": "Ticket title",
  "description": "Description text",
  "isCompleted": false,
  "createdAt": "2025-12-13T23:20:00Z",
  "updatedAt": "2025-12-13T23:20:00Z",
  "tags": [
    {
      "id": 1,
      "name": "Bug",
      "color": "#ef4444"
    }
  ]
}
```

### Tickets List Response
```json
{
  "tickets": [
    { /* ticket object */ }
  ]
}
```

### Tag Response
```json
{
  "id": 1,
  "name": "Bug",
  "color": "#ef4444",
  "createdAt": "2025-12-13T23:19:53Z"
}
```

### Tags List Response (with counts)
```json
{
  "tags": [
    {
      "id": 1,
      "name": "Bug",
      "color": "#ef4444",
      "ticketCount": 5
    }
  ]
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

Or for validation errors:
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "title"],
      "msg": "Field required",
      "input": { /* request body */ }
    }
  ]
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 422 | Unprocessable Entity (validation error) |
| 500 | Internal Server Error |

## Query Parameters

### Tickets List

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by status: `all`, `open`, `completed` | `?status=open` |
| `search` | string | Search in title and description (case-insensitive) | `?search=bug` |
| `tags` | string | Comma-separated tag IDs (OR logic) | `?tags=1,2,3` |

## Field Naming

- **API uses camelCase**: `isCompleted`, `createdAt`, `updatedAt`, `tagIds`
- **Database uses snake_case**: `is_completed`, `created_at`, `updated_at`
- Both formats accepted in requests
- Responses always use camelCase

## Validation Rules

### Tickets
- `title`: Required, max 200 characters
- `description`: Optional, any length
- `tagIds`: Optional array of integers

### Tags
- `name`: Required, max 50 characters, must be unique (case-insensitive)
- `color`: Optional, must match pattern `^#[0-9A-Fa-f]{6}$` (hex color)

## Examples

### Create a bug ticket
```bash
curl -X POST http://localhost:8000/api/tickets/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix login error",
    "description": "Users cannot login with special chars",
    "tagIds": [1]
  }'
```

### Search for open bugs
```bash
curl "http://localhost:8000/api/tickets/?status=open&tags=1&search=login"
```

### Mark ticket as complete
```bash
curl -X PATCH http://localhost:8000/api/tickets/1/complete
```

### Update ticket title
```bash
curl -X PUT http://localhost:8000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Fix critical login error"}'
```

### Get all tags with counts
```bash
curl http://localhost:8000/api/tags/
```

## Testing Tools

1. **Swagger UI**: http://localhost:8000/docs
2. **REST Client**: Open `server/docs/test.rest` in VS Code
3. **curl**: See examples above
4. **OpenAPI Spec**: http://localhost:8000/openapi.json

## Common Workflows

### Create Complete Ticket
1. Create tags → `POST /api/tags/`
2. Create ticket → `POST /api/tickets/` with `tagIds`
3. Update if needed → `PUT /api/tickets/{id}`
4. Complete when done → `PATCH /api/tickets/{id}/complete`

### Filter Tickets
1. By status → `GET /api/tickets/?status=open`
2. By tags → `GET /api/tickets/?tags=1,2`
3. By search → `GET /api/tickets/?search=keyword`
4. Combined → `GET /api/tickets/?status=open&tags=1&search=bug`

### Manage Tags
1. Create → `POST /api/tags/`
2. Add to ticket → `POST /api/tickets/{id}/tags`
3. Remove from ticket → `DELETE /api/tickets/{id}/tags/{tagId}`
4. Delete tag → `DELETE /api/tags/{id}` (removes from all tickets)

---

For detailed testing examples, see `test.rest` file.
