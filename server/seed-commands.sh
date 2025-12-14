#!/bin/bash

# Quick Commands for Testing with Seed Data
# This file contains useful curl commands to explore the seeded data

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8000"

echo -e "${BLUE}=== Ticket Manager API - Seed Data Test Commands ===${NC}"
echo ""

# Check if server is running
if ! curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Server is not running at ${BASE_URL}${NC}"
    echo "   Start it with: cd server && uv run uvicorn app.main:app --reload --port 8000"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"
echo ""

show_menu() {
    echo "Choose a command to run:"
    echo ""
    echo "  ${BLUE}TAGS${NC}"
    echo "  1) Get all tags with counts"
    echo ""
    echo "  ${BLUE}TICKETS BY PLATFORM${NC}"
    echo "  2) Get all iOS tickets (9 tickets)"
    echo "  3) Get all Android tickets (7 tickets)"
    echo "  4) Get all Web tickets (9 tickets)"
    echo "  5) Get all Backend tickets (10 tickets)"
    echo ""
    echo "  ${BLUE}TICKETS BY TYPE${NC}"
    echo "  6) Get all Bug tickets (18 tickets)"
    echo "  7) Get all Enhancement tickets (16 tickets)"
    echo "  8) Get all Documentation tickets (5 tickets)"
    echo "  9) Get all CI/CD tickets (6 tickets)"
    echo ""
    echo "  ${BLUE}SEARCH & FILTERS${NC}"
    echo "  10) Search for 'iOS' (should find iOS-related tickets)"
    echo "  11) Search for 'authentication' (should find auth tickets)"
    echo "  12) Search for 'optimize' (performance-related)"
    echo "  13) Get open tickets only (38 tickets)"
    echo "  14) Get completed tickets only (12 tickets)"
    echo ""
    echo "  ${BLUE}COMBINED FILTERS${NC}"
    echo "  15) Open iOS bugs (platform + type + status)"
    echo "  16) Completed backend tickets"
    echo "  17) Mobile tickets (iOS + Android combined)"
    echo "  18) All bug and enhancement tickets"
    echo ""
    echo "  ${BLUE}STATISTICS${NC}"
    echo "  19) Show ticket counts by completion status"
    echo "  20) Show all 50 tickets (summary)"
    echo ""
    echo "  0) Exit"
    echo ""
}

run_command() {
    local cmd=$1
    local description=$2
    
    echo -e "${YELLOW}Running: ${description}${NC}"
    echo -e "${GREEN}Command: ${cmd}${NC}"
    echo ""
    
    eval "$cmd"
    
    echo ""
    echo "---"
    echo ""
}

while true; do
    show_menu
    read -p "Enter choice [0-20]: " choice
    echo ""
    
    case $choice in
        1)
            run_command \
                "curl -s ${BASE_URL}/api/tags/ | python3 -m json.tool" \
                "Get all tags with ticket counts"
            ;;
        2)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=1' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} iOS tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'])]\"" \
                "iOS tickets (tag_id=1)"
            ;;
        3)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=2' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} Android tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'])]\"" \
                "Android tickets (tag_id=2)"
            ;;
        4)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=3' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} Web tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'])]\"" \
                "Web tickets (tag_id=3)"
            ;;
        5)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=4' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} Backend tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'])]\"" \
                "Backend tickets (tag_id=4)"
            ;;
        6)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=9' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} Bug tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'][:10])]\"" \
                "Bug tickets (tag_id=9)"
            ;;
        7)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=10' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} Enhancement tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'][:10])]\"" \
                "Enhancement tickets (tag_id=10)"
            ;;
        8)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=6' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} Documentation tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'])]\"" \
                "Documentation tickets (tag_id=6)"
            ;;
        9)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=7' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} CI/CD tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]} - {\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}') for i, t in enumerate(data['tickets'])]\"" \
                "CI/CD tickets (tag_id=7)"
            ;;
        10)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?search=iOS' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} tickets matching \\\"iOS\\\":'); [print(f'{i+1}. {t[\\\"title\\\"]}') for i, t in enumerate(data['tickets'][:5])]\"" \
                "Search for 'iOS'"
            ;;
        11)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?search=authentication' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} tickets matching \\\"authentication\\\":'); [print(f'{i+1}. {t[\\\"title\\\"]}') for i, t in enumerate(data['tickets'])]\"" \
                "Search for 'authentication'"
            ;;
        12)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?search=optimize' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} tickets matching \\\"optimize\\\":'); [print(f'{i+1}. {t[\\\"title\\\"]}') for i, t in enumerate(data['tickets'])]\"" \
                "Search for 'optimize'"
            ;;
        13)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?status=open' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} open tickets')\"" \
                "Get open tickets"
            ;;
        14)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?status=completed' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} completed tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]}') for i, t in enumerate(data['tickets'])]\"" \
                "Get completed tickets"
            ;;
        15)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?status=open&tags=1,9' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} open iOS bugs:'); [print(f'{i+1}. {t[\\\"title\\\"]}') for i, t in enumerate(data['tickets'])]\"" \
                "Open iOS bugs (iOS + Bug + Open)"
            ;;
        16)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?status=completed&tags=4' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} completed backend tickets:'); [print(f'{i+1}. {t[\\\"title\\\"]}') for i, t in enumerate(data['tickets'])]\"" \
                "Completed backend tickets"
            ;;
        17)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=1,2' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} mobile tickets (iOS + Android)')\"" \
                "Mobile tickets (iOS + Android)"
            ;;
        18)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/?tags=9,10' | python3 -c \"import sys, json; data = json.load(sys.stdin); print(f'Found {len(data[\\\"tickets\\\"])} tickets (Bugs + Enhancements)')\"" \
                "Bugs and Enhancements"
            ;;
        19)
            run_command \
                "echo 'Ticket Statistics:' && curl -s '${BASE_URL}/api/tickets/' | python3 -c \"import sys, json; data = json.load(sys.stdin); total = len(data['tickets']); completed = sum(1 for t in data['tickets'] if t['isCompleted']); open_count = total - completed; print(f'Total: {total}'); print(f'Completed: {completed} ({100*completed//total}%)'); print(f'Open: {open_count} ({100*open_count//total}%)')\"" \
                "Ticket statistics"
            ;;
        20)
            run_command \
                "curl -s '${BASE_URL}/api/tickets/' | python3 -c \"import sys, json; data = json.load(sys.stdin); tickets = data['tickets']; print(f'All {len(tickets)} tickets:\\n'); [print(f'{i+1}. [{\\\"✅\\\" if t[\\\"isCompleted\\\"] else \\\"❌\\\"}] {t[\\\"title\\\"]}') for i, t in enumerate(tickets)]\"" \
                "List all tickets"
            ;;
        0)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Invalid choice. Please try again.${NC}"
            echo ""
            ;;
    esac
    
    read -p "Press Enter to continue..."
    clear
done
