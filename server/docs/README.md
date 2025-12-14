# API Testing Documentation

This directory contains API testing resources for the Ticket Manager backend.

## Files

- `test.rest` - Comprehensive REST Client test file with all API endpoints

## Using the REST Client Test File

### Prerequisites

1. **Install REST Client Extension** (VS Code)
   - Open VS Code
   - Go to Extensions (Cmd/Ctrl + Shift + X)
   - Search for "REST Client" by Huachao Mao
   - Install the extension

2. **Start the Backend Server**
   ```bash
   cd server
   uv run uvicorn app.main:app --reload --port 8000
   ```

### Running Tests

1. **Open the test file**
   ```
   server/docs/test.rest
   ```

2. **Execute requests**
   - Click "Send Request" above any request
   - Or use keyboard shortcut: `Cmd/Ctrl + Alt + R`

3. **View responses**
   - Responses appear in a new panel
   - JSON is automatically formatted
   - HTTP status and headers are shown

### Test File Organization

The `test.rest` file is organized into sections:

1. **Health Check** - Basic server status
2. **Tag Management** - CRUD operations for tags
3. **Tag Error Cases** - Validation and error handling
4. **Ticket Management** - CRUD operations for tickets
5. **Ticket Tag Operations** - Adding/removing tags from tickets
6. **Filtering and Search** - Query parameter testing
7. **Ticket Error Cases** - Validation and error handling
8. **Complex Scenarios** - Real-world usage patterns
9. **Cleanup** - Optional cleanup commands
10. **API Documentation** - Links to Swagger UI

### Running Tests in Order

For best results, run sections in order:

1. Start with **Health Check** to verify server is running
2. Run **Tag Management** to create test tags
3. Run **Ticket Management** to create test tickets
4. Test **Filtering and Search** with existing data
5. Try **Error Cases** to verify validation
6. Explore **Complex Scenarios** for real-world patterns

### Tips

- **Variables**: The `@baseUrl` variable is defined at the top. Update it if your server runs on a different port.
- **Sequential Testing**: Some requests depend on previous ones (e.g., updating a ticket requires creating it first)
- **IDs in URLs**: Replace ID placeholders with actual IDs from previous responses
- **JSON Formatting**: Responses are automatically formatted for readability
- **Request History**: REST Client keeps a history of all requests

### Example Workflow

```rest
### 1. Create a tag
POST {{baseUrl}}/api/tags/
Content-Type: application/json

{
  "name": "Bug",
  "color": "#ef4444"
}

### 2. Create a ticket with that tag (use ID from response above)
POST {{baseUrl}}/api/tickets/
Content-Type: application/json

{
  "title": "Fix critical bug",
  "tagIds": [1]
}

### 3. List all tickets
GET {{baseUrl}}/api/tickets/
```

## Alternative Testing Methods

### 1. Swagger UI (Recommended for Exploration)

Open http://localhost:8000/docs in your browser for an interactive API explorer.

**Pros:**
- Visual interface
- Auto-completion
- Schema documentation
- No setup required

**Cons:**
- Less convenient for repeated testing
- No test history

### 2. curl (Command Line)

```bash
# Create a tag
curl -X POST http://localhost:8000/api/tags/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Bug", "color": "#ef4444"}'

# List tickets
curl http://localhost:8000/api/tickets/
```

**Pros:**
- Works everywhere
- Easy to script
- Good for CI/CD

**Cons:**
- Verbose
- Manual JSON formatting
- No response history

### 3. Postman

Import the OpenAPI spec from http://localhost:8000/openapi.json

**Pros:**
- Full-featured API client
- Collections and environments
- Team collaboration features

**Cons:**
- Separate application
- Heavier than REST Client
- May require account

## Common Test Scenarios

### Creating a Complete Ticket Workflow

```rest
# 1. Create tags
POST {{baseUrl}}/api/tags/
{"name": "Bug", "color": "#ef4444"}

POST {{baseUrl}}/api/tags/
{"name": "Priority", "color": "#dc2626"}

# 2. Create ticket
POST {{baseUrl}}/api/tickets/
{"title": "Fix login issue", "tagIds": [1, 2]}

# 3. Update ticket
PUT {{baseUrl}}/api/tickets/1
{"description": "Added more details"}

# 4. Complete ticket
PATCH {{baseUrl}}/api/tickets/1/complete

# 5. Verify
GET {{baseUrl}}/api/tickets/1
```

### Testing Filters

```rest
# Create diverse tickets first, then:

# Open tickets only
GET {{baseUrl}}/api/tickets/?status=open

# Search
GET {{baseUrl}}/api/tickets/?search=bug

# By tags
GET {{baseUrl}}/api/tickets/?tags=1,2

# Combined
GET {{baseUrl}}/api/tickets/?status=open&tags=1&search=login
```

### Testing Error Handling

```rest
# Invalid color format
POST {{baseUrl}}/api/tags/
{"name": "Test", "color": "red"}
# Expected: 400 Bad Request

# Duplicate tag name
POST {{baseUrl}}/api/tags/
{"name": "Bug", "color": "#ef4444"}
# Expected: 400 Bad Request (if Bug already exists)

# Non-existent ticket
GET {{baseUrl}}/api/tickets/9999
# Expected: 404 Not Found
```

## Troubleshooting

### Server Not Responding

```bash
# Check if server is running
curl http://localhost:8000/health

# If not, start it
cd server
uv run uvicorn app.main:app --reload --port 8000
```

### Database Errors

```bash
# Run migrations
cd server
uv run alembic upgrade head
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -ti:8000

# Kill it
kill -9 $(lsof -ti:8000)

# Or use a different port
uv run uvicorn app.main:app --reload --port 8001
# Then update @baseUrl in test.rest
```

### CORS Errors

If testing from a browser-based tool, ensure CORS is configured in `server/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Additional Resources

- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **OpenAPI Spec**: http://localhost:8000/openapi.json
- **REST Client Docs**: https://marketplace.visualstudio.com/items?itemName=humao.rest-client

## Contributing

When adding new endpoints:

1. Add corresponding tests to `test.rest`
2. Organize them in the appropriate section
3. Include both success and error cases
4. Add comments explaining complex scenarios

---

Happy Testing! 🚀
