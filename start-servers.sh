#!/bin/bash

# Kill any existing servers
pkill -9 -f "vite.*5174" 2>/dev/null
pkill -9 -f "wrangler.*8788" 2>/dev/null
sleep 2

echo "🚀 Starting Boundless OS Application..."
echo ""

# Start backend
echo "Starting backend server..."
cd worker
npx wrangler dev --port 8788 --local > /tmp/worker.log 2>&1 &
WORKER_PID=$!
cd ..

# Start frontend  
echo "Starting frontend server..."
cd web
rm -rf node_modules/.vite 2>/dev/null
npm run dev > /tmp/web.log 2>&1 &
WEB_PID=$!
cd ..

echo ""
echo "✅ Servers starting..."
echo "Frontend: http://localhost:5174"
echo "Backend: http://localhost:8788"
echo ""
echo "Waiting for servers to start..."
sleep 15

# Check status
echo ""
echo "📊 Status:"
if curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend not responding - check /tmp/web.log"
fi

if curl -s http://localhost:8788/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend not responding - check /tmp/worker.log"
fi

echo ""
echo "Servers are running in the background."
echo "Open http://localhost:5174 in your browser!"
echo ""
echo "To stop servers, run: pkill -f 'vite.*5174' && pkill -f 'wrangler.*8788'"

