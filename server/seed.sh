#!/bin/bash

# Seed Database Script
# This script loads sample data into the pmanager database

set -e  # Exit on error

echo "🌱 Seeding Database with Sample Data..."
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql command not found"
    echo "   PostgreSQL client tools are required to run this script"
    echo ""
    echo "   On macOS with Homebrew:"
    echo "   export PATH=\"/opt/homebrew/opt/postgresql@15/bin:\$PATH\""
    exit 1
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw pmanager; then
    echo "❌ Error: Database 'pmanager' does not exist"
    echo "   Please create it first with: createdb pmanager"
    exit 1
fi

echo "📊 Current database status:"
psql -d pmanager -c "
    SELECT 
        'Tags' as type, 
        COUNT(*) as count 
    FROM tags
    UNION ALL
    SELECT 
        'Tickets' as type, 
        COUNT(*) as count 
    FROM tickets;
" 2>/dev/null || echo "   Database tables not yet created"

echo ""
read -p "⚠️  This will add 10 tags and 50 tickets. Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Seeding cancelled"
    exit 0
fi

echo ""
echo "🚀 Loading seed data..."
psql -d pmanager -f seed.sql

echo ""
echo "✅ Seeding completed successfully!"
echo ""
echo "📈 Summary:"
psql -d pmanager -c "
    SELECT 
        'Tags' as type, 
        COUNT(*) as count 
    FROM tags
    UNION ALL
    SELECT 
        'Tickets' as type, 
        COUNT(*) as count 
    FROM tickets
    UNION ALL
    SELECT 
        'Completed' as type, 
        COUNT(*) as count 
    FROM tickets 
    WHERE is_completed = true
    UNION ALL
    SELECT 
        'Open' as type, 
        COUNT(*) as count 
    FROM tickets 
    WHERE is_completed = false;
"

echo ""
echo "🎉 You can now test the API with realistic data!"
echo ""
echo "Try these:"
echo "  curl http://localhost:8000/api/tickets/"
echo "  curl http://localhost:8000/api/tags/"
echo "  curl 'http://localhost:8000/api/tickets/?tags=1,2'"
echo "  curl 'http://localhost:8000/api/tickets/?search=iOS'"
