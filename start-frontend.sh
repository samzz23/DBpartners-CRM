#!/bin/bash

echo "Starting DBpartners CRM Frontend..."
echo "===================================="
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a few minutes)..."
    npm install
fi

echo ""
echo "Frontend starting on http://localhost:3000"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

# Start the development server
npm run dev
