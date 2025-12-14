# Batch Operations for Tickets

## Overview

Batch operations allow you to modify or delete multiple tickets at once, improving efficiency when managing large numbers of tickets.

## Features

- **Batch Status Update**: Change the completion status of multiple tickets simultaneously
- **Batch Delete**: Delete multiple tickets in a single operation

## Backend API

### 1. Batch Update Status

**Endpoint:** `POST /api/tickets/batch/status`

**Description:** Updates the completion status for multiple tickets.

**Request Body:**
```json
{
  "ticketIds": [1, 2, 3, 4],
  "isCompleted": true
}
```

**Response:**
```json
{
  "success": true,
  "affectedCount": 4,
  "message": "Successfully updated 4 ticket(s) to completed"
}
```

**Status Codes:**
- `200 OK` - Batch update successful
- `400 Bad Request` - No ticket IDs provided or invalid request
- `422 Unprocessable Entity` - Invalid request format

**Example Usage:**

```bash
# Mark tickets as completed
curl -X POST http://localhost:8000/api/tickets/batch/status \
  -H "Content-Type: application/json" \
  -d '{"ticketIds": [1, 2, 3], "isCompleted": true}'

# Mark tickets as open
curl -X POST http://localhost:8000/api/tickets/batch/status \
  -H "Content-Type: application/json" \
  -d '{"ticketIds": [1, 2, 3], "isCompleted": false}'
```

### 2. Batch Delete

**Endpoint:** `POST /api/tickets/batch/delete`

**Description:** Deletes multiple tickets at once.

**Request Body:**
```json
{
  "ticketIds": [1, 2, 3, 4]
}
```

**Response:**
```json
{
  "success": true,
  "affectedCount": 4,
  "message": "Successfully deleted 4 ticket(s)"
}
```

**Status Codes:**
- `200 OK` - Batch delete successful
- `400 Bad Request` - No ticket IDs provided or invalid request
- `422 Unprocessable Entity` - Invalid request format

**Example Usage:**

```bash
# Delete multiple tickets
curl -X POST http://localhost:8000/api/tickets/batch/delete \
  -H "Content-Type: application/json" \
  -d '{"ticketIds": [1, 2, 3]}'
```

## Frontend Integration

### TypeScript Types

```typescript
// Request types
export interface BatchUpdateStatusRequest {
  ticketIds: number[];
  isCompleted: boolean;
}

export interface BatchDeleteRequest {
  ticketIds: number[];
}

// Response type
export interface BatchOperationResponse {
  success: boolean;
  affectedCount: number;
  message: string;
}
```

### Service Methods

```typescript
import { ticketService } from './services/ticketService';

// Batch update status
const result = await ticketService.batchUpdateStatus([1, 2, 3], true);
console.log(result.message); // "Successfully updated 3 ticket(s) to completed"

// Batch delete
const result = await ticketService.batchDelete([1, 2, 3]);
console.log(result.message); // "Successfully deleted 3 ticket(s)"
```

### React Component Example

```tsx
import { useState } from 'react';
import { ticketService } from '../services/ticketService';
import { toast } from 'sonner';

function TicketBatchActions() {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBatchComplete = async () => {
    if (selectedTickets.length === 0) {
      toast.error('Please select tickets first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await ticketService.batchUpdateStatus(
        selectedTickets,
        true
      );
      toast.success(result.message);
      setSelectedTickets([]);
      // Refresh ticket list
    } catch (error) {
      toast.error('Failed to update tickets');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedTickets.length === 0) {
      toast.error('Please select tickets first');
      return;
    }

    if (!confirm(`Delete ${selectedTickets.length} ticket(s)?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await ticketService.batchDelete(selectedTickets);
      toast.success(result.message);
      setSelectedTickets([]);
      // Refresh ticket list
    } catch (error) {
      toast.error('Failed to delete tickets');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleBatchComplete}
        disabled={isLoading || selectedTickets.length === 0}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Mark as Complete ({selectedTickets.length})
      </button>
      <button
        onClick={handleBatchDelete}
        disabled={isLoading || selectedTickets.length === 0}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete ({selectedTickets.length})
      </button>
    </div>
  );
}
```

## Behavior Details

### Batch Status Update
- Updates all tickets with the specified IDs to the given completion status
- If some ticket IDs don't exist, they are silently ignored
- Returns the count of actually updated tickets
- Preserves all other ticket properties (title, description, tags, etc.)
- Updates the `updated_at` timestamp automatically

### Batch Delete
- Deletes all tickets with the specified IDs
- If some ticket IDs don't exist, they are silently ignored
- Returns the count of actually deleted tickets
- Cascade deletes all tag associations (via foreign key constraints)
- Cannot be undone - use with caution

### Error Handling

Both operations will return a `400 Bad Request` if:
- The `ticketIds` array is empty
- The request body is malformed

Example error response:
```json
{
  "detail": "No ticket IDs provided"
}
```

## Performance Considerations

- Batch operations use single database queries for efficiency
- Recommended batch size: up to 100 tickets per request
- For larger batches, consider breaking into multiple requests
- Operations are transactional (all or nothing within a batch)

## Use Cases

### Batch Status Update
1. **Project Completion**: Mark all tickets in a sprint/milestone as completed
2. **Reopening**: Reopen multiple tickets that need rework
3. **Bulk Triage**: Quickly process multiple tickets during review
4. **Status Sync**: Update status based on external systems

### Batch Delete
1. **Cleanup**: Remove old or obsolete tickets
2. **Duplicate Removal**: Delete duplicate tickets
3. **Project Archival**: Remove all tickets from a cancelled project
4. **Bulk Maintenance**: Clean up test or demo data

## Testing

### Test Coverage

The implementation includes comprehensive tests:

1. **Batch Update Status Tests**
   - Update to completed
   - Update to open
   - Empty list validation
   - Nonexistent ticket handling
   - Tag preservation

2. **Batch Delete Tests**
   - Delete multiple tickets
   - Partial deletion (mixed IDs)
   - Empty list validation
   - Cascade deletion of associations

### Running Tests

```bash
cd server
pytest tests/test_tickets.py::TestBatchOperations -v
```

## API Documentation

Full API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Look for the "Batch Operations" section in the API documentation.

## Migration Notes

If you're upgrading from a version without batch operations:

1. **No database changes required** - uses existing tables
2. **Frontend changes required** - add UI for selection and batch actions
3. **Backward compatible** - existing single-operation endpoints unchanged

## Security Considerations

- No additional authentication required (uses same auth as single operations)
- Rate limiting should be applied at the API gateway level
- Consider adding audit logging for batch deletions
- Validate batch sizes to prevent DoS attacks

## Future Enhancements

Potential improvements for future versions:

1. **Batch Tag Operations**: Add/remove tags from multiple tickets
2. **Batch Assignment**: Assign multiple tickets to users
3. **Batch Priority Update**: Change priority of multiple tickets
4. **Undo Support**: Temporary soft-delete with recovery option
5. **Progress Tracking**: WebSocket updates for large batches
6. **Filtered Batch Operations**: Apply operations to filtered results

## Summary

Batch operations provide efficient ways to manage multiple tickets:

- ✅ **Batch Status Update** - Update completion status of multiple tickets
- ✅ **Batch Delete** - Delete multiple tickets at once
- ✅ **Efficient** - Single database queries
- ✅ **Safe** - Validation and error handling
- ✅ **Tested** - Comprehensive test coverage

Both frontend and backend implementations are ready to use!
