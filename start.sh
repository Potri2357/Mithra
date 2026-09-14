#!/bin/bash
# Mithra — One-command startup script

set -e

echo "🚀 Starting Mithra..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Check .env
if [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
  echo -e "${YELLOW}⚠️  No backend/.env found. Copying from .env.example...${NC}"
  cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/backend/.env"
  echo -e "${YELLOW}   Please edit backend/.env with your API keys before continuing.${NC}"
  exit 1
fi

# ── Backend ───────────────────────────────────────────────────────────
echo -e "${BLUE}📦 Setting up Python backend...${NC}"
cd "$PROJECT_ROOT/backend"

if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

echo "Installing Python dependencies..."
pip install --quiet fastapi "uvicorn[standard]" python-multipart pydantic pydantic-settings \
  google-generativeai groq httpx python-dotenv aiofiles pillow langdetect supabase 2>/dev/null

echo -e "${GREEN}✅ Backend dependencies ready${NC}"

# Start backend in background
echo -e "${BLUE}🔧 Starting FastAPI backend on http://localhost:8000...${NC}"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to be healthy
echo "Waiting for backend..."
for i in {1..15}; do
  if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy!${NC}"
    break
  fi
  sleep 2
  if [ $i -eq 15 ]; then
    echo -e "${YELLOW}⚠️  Backend taking longer than expected. Check for errors above.${NC}"
  fi
done

# ── Frontend ──────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}📦 Setting up Next.js frontend...${NC}"
cd "$PROJECT_ROOT/frontend"

if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  npm install
fi

# Copy env if not present
if [ ! -f ".env.local" ]; then
  cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
fi

echo -e "${GREEN}✅ Frontend dependencies ready${NC}"
echo ""
echo -e "${BLUE}🌐 Starting Next.js frontend on http://localhost:3000...${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Mithra is running!${NC}"
echo -e "${GREEN}  Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}  Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs: http://localhost:8000/docs${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Trap to kill backend when frontend is stopped
trap "kill $BACKEND_PID 2>/dev/null; echo 'Servers stopped.'" EXIT

npm run dev
