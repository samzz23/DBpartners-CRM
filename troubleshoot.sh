#!/bin/bash

echo "DBpartners CRM - Troubleshooting Script"
echo "========================================"
echo ""

# Test 1: Check if backend is running
echo "Test 1: Checking if backend is running on port 8000..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    curl -s http://localhost:8000/health
else
    echo "❌ Backend is NOT running!"
    echo "   → Start backend with: ./start-backend.sh"
    exit 1
fi
echo ""

# Test 2: Check if frontend is running
echo "Test 2: Checking if frontend is running on port 3000..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running!"
else
    echo "❌ Frontend is NOT running!"
    echo "   → Start frontend with: ./start-frontend.sh"
    exit 1
fi
echo ""

# Test 3: Test API proxy
echo "Test 3: Testing API proxy (creating a test client)..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Client","email":"test@example.com","status":"active"}')

if echo "$RESPONSE" | grep -q "id"; then
    echo "✅ Client creation works!"
    echo "   Response: $RESPONSE"
else
    echo "❌ Client creation failed!"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 4: Direct backend test
echo "Test 4: Testing backend directly (bypassing frontend)..."
DIRECT_RESPONSE=$(curl -s -X POST http://localhost:8000/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Direct Test","email":"direct@example.com","status":"active"}')

if echo "$DIRECT_RESPONSE" | grep -q "id"; then
    echo "✅ Backend API works directly!"
    echo "   Response: $DIRECT_RESPONSE"
else
    echo "❌ Backend API failed!"
    echo "   Response: $DIRECT_RESPONSE"
fi
echo ""

# Test 5: Get all clients
echo "Test 5: Fetching all clients..."
curl -s http://localhost:8000/clients | python3 -m json.tool 2>/dev/null || echo "No clients or JSON error"
echo ""

echo "========================================"
echo "Troubleshooting complete!"
echo ""
echo "If you see errors, check:"
echo "1. Backend terminal for error messages"
echo "2. Browser console (F12) for errors"
echo "3. Make sure database file has write permissions"
