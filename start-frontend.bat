@echo off
echo Starting DBpartners CRM Frontend...
echo ====================================
echo.

cd frontend

if not exist "node_modules" (
    echo Installing dependencies (this may take a few minutes)...
    call npm install
)

echo.
echo Frontend starting on http://localhost:3000
echo.
echo Press CTRL+C to stop the server
echo.

call npm run dev
