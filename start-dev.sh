#!/bin/bash

# Start Development Servers
# This script starts both backend and frontend servers

echo "🚀 Starting Ticket Manager Development Servers"
echo "=============================================="

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first:"
    echo "   brew services start postgresql@15"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Start backend in background
echo "🔧 Starting backend server..."
cd server
source .venv/bin/activate
export DATABASE_URL="postgresql://$(whoami):@localhost:5432/pmanager"
export SECRET_KEY="dev-secret-key"
export ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
uvicorn app.main:app --reload --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend.log for errors."
    exit 1
fi

echo "✅ Backend running at http://localhost:8000 (PID: $BACKEND_PID)"
echo "📚 API docs at http://localhost:8000/docs"

# Start frontend
echo "🎨 Starting frontend server..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=============================================="
echo "✅ Both servers are running!"
echo ""
echo "Backend:  http://localhost:8000"
echo "          http://localhost:8000/docs (Swagger)"
echo "Frontend: http://localhost:5173"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: Check terminal output"
echo ""
echo "To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  Or press Ctrl+C twice"
echo "=============================================="
echo ""

# Wait for both processes
wait
