@echo off
echo Starting DBpartners CRM Backend...
echo ==================================
echo.

cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -q -r requirements.txt

echo.
echo Backend server starting on http://localhost:8000
echo API Documentation available at http://localhost:8000/docs
echo.
echo Press CTRL+C to stop the server
echo.

python run.py
