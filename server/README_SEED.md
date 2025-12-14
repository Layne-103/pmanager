# Seed Data Quick Reference

## Load Seed Data

```bash
cd server
./seed.sh
```

## What You Get

- ✅ **10 tags** - iOS, Android, Web, Backend, CI/CD, Documentation, Auto Release, Autocomplete, Bug, Enhancement
- ✅ **50 tickets** - Realistic development tasks across multiple platforms
- ✅ **87 tag associations** - Multiple tags per ticket
- ✅ **12 completed** - 24% completion rate (realistic backlog)

## Quick Tests

### View All Data
```bash
curl http://localhost:8000/api/tags/         # All tags with counts
curl http://localhost:8000/api/tickets/      # All 50 tickets
```

### Filter by Platform
```bash
curl 'http://localhost:8000/api/tickets/?tags=1'  # iOS (9 tickets)
curl 'http://localhost:8000/api/tickets/?tags=2'  # Android (7 tickets)
curl 'http://localhost:8000/api/tickets/?tags=3'  # Web (9 tickets)
curl 'http://localhost:8000/api/tickets/?tags=4'  # Backend (10 tickets)
```

### Filter by Type
```bash
curl 'http://localhost:8000/api/tickets/?tags=9'   # Bugs (18 tickets)
curl 'http://localhost:8000/api/tickets/?tags=10'  # Enhancements (16 tickets)
curl 'http://localhost:8000/api/tickets/?tags=6'   # Documentation (5 tickets)
```

### Search
```bash
curl 'http://localhost:8000/api/tickets/?search=iOS'
curl 'http://localhost:8000/api/tickets/?search=authentication'
curl 'http://localhost:8000/api/tickets/?search=optimize'
```

### Combined Filters
```bash
# Open iOS bugs
curl 'http://localhost:8000/api/tickets/?status=open&tags=1,9'

# Completed backend work
curl 'http://localhost:8000/api/tickets/?status=completed&tags=4'

# Mobile tickets (iOS + Android)
curl 'http://localhost:8000/api/tickets/?tags=1,2'
```

## Interactive Testing

Run the interactive menu:
```bash
./seed-commands.sh
```

## Reset Data

```bash
# Reset and reload
psql -d pmanager -c "TRUNCATE TABLE ticket_tags, tickets, tags RESTART IDENTITY CASCADE;"
./seed.sh
```

## Full Documentation

See `SEED_DATA.md` for complete details on:
- All 50 tickets with descriptions
- Tag distribution and statistics
- Testing scenarios
- Use cases demonstrated

## Example Queries

**Most common query patterns:**

```bash
# Platform-specific bugs
curl 'http://localhost:8000/api/tickets/?tags=1,9&status=open'

# Search in iOS tickets
curl 'http://localhost:8000/api/tickets/?tags=1&search=crash'

# All completed tickets
curl 'http://localhost:8000/api/tickets/?status=completed'

# Documentation tasks
curl 'http://localhost:8000/api/tickets/?tags=6'

# Performance issues
curl 'http://localhost:8000/api/tickets/?search=optimize'
```

## Files

- `seed.sql` - SQL file with all data
- `seed.sh` - Helper script to load data
- `seed-commands.sh` - Interactive testing menu
- `SEED_DATA.md` - Full documentation
- `README_SEED.md` - This file

---

Happy Testing! 🚀
