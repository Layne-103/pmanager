# Seed Data Documentation

This document describes the seed data included in `seed.sql` for testing and development.

## Overview

The seed data provides a realistic project management scenario with:
- **10 diverse tags** covering platforms, projects, and functional areas
- **50 meaningful tickets** representing real development tasks
- **~20% completion rate** (10 completed, 40 open tickets)
- **Multiple tags per ticket** demonstrating realistic categorization

## Quick Start

### Load Seed Data

```bash
# Make sure PostgreSQL is in your PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Run the seed script
cd server
./seed.sh
```

Or manually:

```bash
psql -d pmanager -f server/seed.sql
```

### Reset and Reload

To completely reset and reload seed data:

```sql
TRUNCATE TABLE ticket_tags, tickets, tags RESTART IDENTITY CASCADE;
```

Then run `./seed.sh` again.

## Tags (10 total)

### Platform Tags (4)
| Name | Color | Description |
|------|-------|-------------|
| iOS | `#147efb` | iOS/iPhone app development |
| Android | `#3ddc84` | Android app development |
| Web | `#f7df1e` | Web application development |
| Backend | `#68a063` | Backend/API development |

### Project/Process Tags (3)
| Name | Color | Description |
|------|-------|-------------|
| Auto Release | `#8b5cf6` | Automated release and deployment |
| Documentation | `#10b981` | Documentation tasks |
| CI/CD | `#f59e0b` | Continuous integration/deployment |

### Functional Tags (3)
| Name | Color | Description |
|------|-------|-------------|
| Autocomplete | `#06b6d4` | Autocomplete feature development |
| Bug | `#ef4444` | Bug fixes |
| Enhancement | `#3b82f6` | Feature enhancements |

## Tickets (50 total)

### By Platform

#### iOS Tickets (8 tickets, 2 completed)
1. Fix crash on iOS 17 when opening camera ❌
2. Implement biometric authentication for iOS ❌
3. Optimize iOS app launch time ❌
4. Fix iOS keyboard covering input fields ✅
5. Add iOS widget support ❌
6. Fix iOS dark mode color inconsistencies ✅
7. Implement iOS share extension ❌
8. Fix iOS push notification delivery ❌

#### Android Tickets (7 tickets, 2 completed)
9. Fix Android back button navigation ❌
10. Implement Android material design 3 ❌
11. Fix Android memory leak in list view ✅
12. Add Android adaptive icons ✅
13. Optimize Android APK size ❌
14. Fix Android notification channels ❌
15. Implement Android in-app updates ❌

#### Web Tickets (8 tickets, 2 completed)
16. Fix web app CORS issues in production ❌
17. Implement web app offline support ❌
18. Optimize web bundle size ❌
19. Fix web responsive layout on tablets ✅
20. Add web PWA install prompt ❌
21. Fix web Safari flexbox rendering bug ❌
22. Implement web keyboard shortcuts ❌
23. Fix web font loading flash ✅

#### Backend Tickets (7 tickets, 1 completed)
24. Optimize database query performance ❌
25. Implement API rate limiting ❌
26. Fix backend memory leak in websocket connections ✅
27. Add backend caching layer with Redis ❌
28. Implement backend database migrations rollback ❌
29. Fix backend API timeout on large datasets ❌
30. Add backend audit logging ❌

### By Function

#### Auto Release / CI/CD (6 tickets, 2 completed)
31. Set up automated iOS release pipeline ❌
32. Implement automated changelog generation ✅
33. Add automated E2E tests to CI pipeline ❌
34. Fix flaky CI tests ❌
35. Set up automatic dependency updates ❌
36. Implement automatic production deployment ✅

#### Documentation (5 tickets, 1 completed)
37. Write API integration guide ❌
38. Update user onboarding documentation ✅
39. Create architecture decision records ❌
40. Write database schema documentation ❌
41. Add inline code documentation ❌

#### Autocomplete Feature (4 tickets, 1 completed)
42. Implement autocomplete for ticket search ❌
43. Add autocomplete for tag selection ✅
44. Optimize autocomplete query performance ❌
45. Fix autocomplete keyboard navigation ❌

#### Bugs (3 tickets, 1 completed)
46. Fix race condition in ticket update ❌
47. Fix XSS vulnerability in ticket description ✅ (CRITICAL)
48. Fix timezone display issues ❌

#### Enhancements (2 tickets, 0 completed)
49. Add bulk ticket operations ❌
50. Implement ticket attachments ❌

## Statistics

### Overall
- **Total Tickets**: 50
- **Completed**: 10 (20%)
- **Open**: 40 (80%)
- **Total Tags**: 10
- **Tag Associations**: 85 (avg 1.7 tags per ticket)

### Completion Rate by Platform
- **iOS**: 25% (2/8)
- **Android**: 29% (2/7)
- **Web**: 25% (2/8)
- **Backend**: 14% (1/7)

### Ticket Distribution
- **Platform-specific**: 30 tickets (60%)
- **CI/CD/Release**: 6 tickets (12%)
- **Documentation**: 5 tickets (10%)
- **Features**: 4 tickets (8%)
- **General Bugs**: 3 tickets (6%)
- **Enhancements**: 2 tickets (4%)

## Testing Scenarios

### Filter by Platform

```bash
# Get all iOS tickets
curl "http://localhost:8000/api/tickets/?tags=1"

# Get all Android tickets
curl "http://localhost:8000/api/tickets/?tags=2"

# Get all Web tickets
curl "http://localhost:8000/api/tickets/?tags=3"

# Get all Backend tickets
curl "http://localhost:8000/api/tickets/?tags=4"
```

### Filter by Type

```bash
# Get all bugs
curl "http://localhost:8000/api/tickets/?tags=9"

# Get all enhancements
curl "http://localhost:8000/api/tickets/?tags=10"

# Get all documentation tasks
curl "http://localhost:8000/api/tickets/?tags=6"
```

### Search Examples

```bash
# Search for iOS issues
curl "http://localhost:8000/api/tickets/?search=iOS"

# Search for performance issues
curl "http://localhost:8000/api/tickets/?search=optimize"

# Search for security issues
curl "http://localhost:8000/api/tickets/?search=security"

# Search for authentication
curl "http://localhost:8000/api/tickets/?search=authentication"
```

### Combined Filters

```bash
# Open iOS bugs
curl "http://localhost:8000/api/tickets/?status=open&tags=1,9"

# Completed backend tickets
curl "http://localhost:8000/api/tickets/?status=completed&tags=4"

# Open documentation tasks
curl "http://localhost:8000/api/tickets/?status=open&tags=6"

# All mobile tickets (iOS + Android)
curl "http://localhost:8000/api/tickets/?tags=1,2"

# Search for crashes in iOS
curl "http://localhost:8000/api/tickets/?tags=1&search=crash"
```

### Tag Statistics

```bash
# Get all tags with ticket counts
curl "http://localhost:8000/api/tags/"
```

Expected output shows distribution like:
- iOS: 8 tickets
- Android: 7 tickets
- Web: 8 tickets
- Backend: 10 tickets
- Bug: 15 tickets
- Enhancement: 13 tickets
- etc.

## Use Cases Demonstrated

### 1. Cross-Platform Development
Tickets span iOS, Android, Web, and Backend, demonstrating how teams manage multi-platform projects.

### 2. Bug Tracking
Multiple bug tickets with varying severity, from UI glitches to critical security issues (XSS).

### 3. Feature Development
Complete feature lifecycle shown with Autocomplete tickets (planning, implementation, optimization, bug fixes).

### 4. DevOps Integration
CI/CD and Auto Release tickets show modern development workflow concerns.

### 5. Technical Debt
Performance optimization, refactoring, and maintenance tasks included.

### 6. Documentation Management
Various documentation needs from user guides to technical architecture docs.

## Data Quality

### Realistic Descriptions
Each ticket has a detailed description explaining:
- The problem or requirement
- Impact and context
- Technical details where relevant

### Proper Tagging
Tickets have appropriate multiple tags:
- Platform tag (where applicable)
- Type tag (Bug/Enhancement)
- Functional area (CI/CD, Documentation, etc.)

### Completion Status
- Completed tickets represent finished work
- Mix of simple and complex completed tasks
- Realistic 20% completion rate

## Customization

### Add More Tickets

```sql
INSERT INTO tickets (title, description, is_completed) VALUES
('Your ticket title', 'Your description', false);

-- Add tags (assuming ticket_id is 51 and tag_ids are known)
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
(51, 1), (51, 9);  -- iOS + Bug
```

### Add More Tags

```sql
INSERT INTO tags (name, color) VALUES
('Your Tag Name', '#hexcolor');
```

### Update Completion Status

```sql
-- Mark ticket as completed
UPDATE tickets SET is_completed = true WHERE id = 1;

-- Mark ticket as open
UPDATE tickets SET is_completed = false WHERE id = 1;
```

## Troubleshooting

### Duplicate Key Errors

If you get duplicate key errors, the database already has data. Either:

1. **Reset the database:**
   ```sql
   TRUNCATE TABLE ticket_tags, tickets, tags RESTART IDENTITY CASCADE;
   ```

2. **Or use a fresh database:**
   ```bash
   dropdb pmanager
   createdb pmanager
   cd server
   uv run alembic upgrade head
   ./seed.sh
   ```

### Permission Errors

Make sure PostgreSQL user has INSERT permissions:
```sql
GRANT INSERT ON ALL TABLES IN SCHEMA public TO your_username;
```

### Connection Errors

Verify PostgreSQL is running:
```bash
pg_isready
# or
brew services list | grep postgresql
```

## Related Files

- `seed.sql` - The SQL seed file
- `seed.sh` - Helper script to load seed data
- `test.rest` - REST Client tests that can use this data
- `docs/QUICK_REFERENCE.md` - API reference for querying this data

---

Happy Testing! 🚀
