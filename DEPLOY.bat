@echo off
REM Complete Deployment Orchestrator
REM Manages deployment of website, backend, and mobile applications

setlocal enabledelayedexpansion

:main_menu
cls
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║    Onion Quality Detection - Deployment Manager    ║
echo ║                    Version 1.0                      ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo Deployment Options:
echo.
echo   1) Quick Start: Website + Backend
echo   2) Deploy Website (Vercel/Netlify)
echo   3) Build Android APK (Capacitor)
echo   4) Build Flutter App
echo   5) Run Backend Server
echo   6) Full Stack Deployment (All Components)
echo   7) Configuration & Environment Setup
echo   8) Troubleshooting & Logs
echo   9) Exit
echo.

set /p choice="Enter your choice (1-9): "

if "!choice!"=="1" goto quick_start
if "!choice!"=="2" goto deploy_web
if "!choice!"=="3" goto deploy_android
if "!choice!"=="4" goto build_flutter
if "!choice!"=="5" goto run_backend
if "!choice!"=="6" goto full_stack
if "!choice!"=="7" goto config_setup
if "!choice!"=="8" goto troubleshooting
if "!choice!"=="9" exit /b 0

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto main_menu

:quick_start
cls
echo.
echo ========================================
echo Quick Start: Website + Backend
echo ========================================
echo.
echo This will:
echo   1. Build the web application
echo   2. Prepare backend for deployment
echo   3. Show deployment options
echo.

echo Starting in 3 seconds...
timeout /t 3 >nul

REM Start backend in background
start "Backend Server" cmd /k "c:\Users\BINA\Downloads\sih onion\Onion-detection\run-backend.bat"

timeout /t 5 >nul

REM Start website deployment
call "c:\Users\BINA\Downloads\sih onion\Onion-detection\deploy-website.bat"

goto main_menu

:deploy_web
call "c:\Users\BINA\Downloads\sih onion\Onion-detection\deploy-website.bat"
goto main_menu

:deploy_android
call "c:\Users\BINA\Downloads\sih onion\Onion-detection\deploy-android.bat"
goto main_menu

:build_flutter
call "c:\Users\BINA\Downloads\sih onion\Onion-detection\build-flutter.bat"
goto main_menu

:run_backend
call "c:\Users\BINA\Downloads\sih onion\Onion-detection\run-backend.bat"
goto main_menu

:full_stack
cls
echo.
echo ========================================
echo Full Stack Deployment
echo ========================================
echo.
echo This will deploy:
echo   1. Website (Vercel/Netlify)
echo   2. Backend API (FastAPI)
echo   3. Android APK (Capacitor)
echo   4. Flutter App
echo.
echo This process takes 15-30 minutes.
echo Continue? (Y/N)

set /p continue="Enter your choice: "

if /i "!continue!"=="Y" (
    echo.
    echo [1/4] Deploying website...
    call "c:\Users\BINA\Downloads\sih onion\Onion-detection\deploy-website.bat"
    
    echo.
    echo [2/4] Running backend...
    start "Backend Server" cmd /k "c:\Users\BINA\Downloads\sih onion\Onion-detection\run-backend.bat"
    
    echo.
    echo [3/4] Building Android APK...
    call "c:\Users\BINA\Downloads\sih onion\Onion-detection\deploy-android.bat"
    
    echo.
    echo [4/4] Building Flutter App...
    call "c:\Users\BINA\Downloads\sih onion\Onion-detection\build-flutter.bat"
    
    echo.
    echo ✓ Full stack deployment initiated!
) else (
    echo Cancelled.
)

timeout /t 3 >nul
goto main_menu

:config_setup
cls
echo.
echo ========================================
echo Configuration & Environment Setup
echo ========================================
echo.
echo 1) Configure API endpoints
echo 2) Setup environment variables
echo 3) Test backend connection
echo 4) Verify dependencies
echo 5) Back to main menu
echo.

set /p config_choice="Enter your choice (1-5): "

if "!config_choice!"=="1" (
    echo.
    echo Edit the following files to configure API endpoints:
    echo   - moa_app/src/config.ts
    echo   - moa_app/.env.local
    echo   - sih_onion/backend/app/main.py
    echo.
    pause
) else if "!config_choice!"=="2" (
    echo.
    echo Create a .env file in each directory:
    echo.
    echo moa_app/.env.local:
    echo   VITE_API_URL=http://localhost:8000
    echo.
    echo sih_onion/.env:
    echo   DB_PATH=sih_onion/storage/onion_inspection.db
    echo   MODEL_PATH=sih_onion/ml_pipeline/models/
    echo.
    pause
) else if "!config_choice!"=="3" (
    echo.
    echo Testing backend connection...
    echo Ensure backend is running at http://localhost:8000
    echo.
    curl http://localhost:8000/docs
    echo.
    if errorlevel 1 (
        echo ✗ Backend not accessible
    ) else (
        echo ✓ Backend is running!
    )
    pause
) else if "!config_choice!"=="4" (
    echo.
    echo Checking dependencies...
    echo.
    where node >nul && echo ✓ Node.js installed || echo ✗ Node.js NOT installed
    where python >nul && echo ✓ Python installed || echo ✗ Python NOT installed
    where java >nul && echo ✓ Java installed || echo ✗ Java NOT installed
    echo.
    pause
)

goto config_setup

:troubleshooting
cls
echo.
echo ========================================
echo Troubleshooting & Logs
echo ========================================
echo.
echo Common Issues:
echo.
echo 1) npm install fails
echo    Solution: npm cache clean --force ^&^& npm install
echo.
echo 2) Python dependencies fail
echo    Solution: pip install --upgrade pip ^&^& pip install -r requirements.txt
echo.
echo 3) CORS errors
echo    Check: Backend CORS configuration in app/main.py
echo.
echo 4) APK build fails
echo    Check: Java JDK is installed and JAVA_HOME is set
echo.
echo 5) API connection fails
echo    Check: Backend running ^& port 8000 accessible
echo.
echo 6) View logs
echo    - Check terminal output where command was run
echo    - Backend logs: http://localhost:8000/docs
echo.

pause
goto main_menu

:end
exit /b 0
