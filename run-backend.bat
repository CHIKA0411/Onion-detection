@echo off
REM Setup and Run Backend API Server
REM This script sets up Python dependencies and starts the FastAPI server

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Onion Quality Detection - Backend Setup
echo ========================================
echo.

cd /d "c:\Users\BINA\Downloads\sih onion\Onion-detection\sih_onion"

REM Check if Python is installed
where python >nul 2>nul
if errorlevel 1 (
    echo Error: Python is not installed!
    echo Please download from: https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/4] Installing Python dependencies...
echo This may take a few minutes...
pip install --upgrade pip setuptools wheel
pip install -r ml_pipeline/requirements.txt
pip install fastapi uvicorn python-multipart pydantic python-dotenv pillow
if errorlevel 1 (
    echo Error: pip install failed
    pause
    exit /b 1
)

echo.
echo [4/4] Starting FastAPI server...
echo.
echo Server will be available at:
echo   Local:  http://localhost:8000
echo   Docs:   http://localhost:8000/docs
echo   ReDoc:  http://localhost:8000/redoc
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
