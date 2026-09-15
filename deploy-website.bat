@echo off
REM Deploy Web Application to Vercel/Netlify
REM This script builds and deploys the Capacitor/Vite web app

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Onion Quality Detection - Web Deployment
echo ========================================
echo.

cd /d "c:\Users\BINA\Downloads\sih onion\Onion-detection\moa_app"

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Building web application...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo [3/5] Testing build locally...
echo Opening preview at http://localhost:4173
timeout /t 2 >nul
start http://localhost:4173

echo.
echo [4/5] Deployment Options:
echo.
echo Choose deployment platform:
echo 1) Vercel (Recommended - Fast)
echo 2) Netlify (Drag & Drop)
echo 3) GitHub Pages (Automatic)
echo 4) Exit

set /p choice="Enter your choice (1-4): "

if "!choice!"=="1" (
    echo.
    echo Installing Vercel CLI...
    call npm install -g vercel
    echo.
    echo [5/5] Deploying to Vercel...
    echo Follow the prompts to connect your account
    call vercel --prod
    echo.
    echo ✓ Website deployed! Check terminal for URL
) else if "!choice!"=="2" (
    echo.
    echo [5/5] Deploying to Netlify...
    call npm run deploy:netlify
    echo.
    echo ✓ Drag-and-drop or CLI deployment complete!
) else if "!choice!"=="3" (
    echo.
    echo [5/5] Deploying to GitHub Pages...
    git add .
    git commit -m "Deploy web app"
    git push origin main
    echo.
    echo ✓ GitHub Actions will build and deploy automatically!
) else (
    echo Exiting...
    exit /b 0
)

pause
