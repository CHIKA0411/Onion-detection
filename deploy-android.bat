@echo off
REM Build Native Android APK using Capacitor
REM This script builds and prepares the native Android application

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Onion Quality Detection - Android Build
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

REM Check if Java is installed
where java >nul 2>nul
if errorlevel 1 (
    echo Error: Java JDK is not installed!
    echo Please download from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

echo [1/5] Installing Node dependencies...
call npm install
if errorlevel 1 (
    echo Error: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Building web assets for Android...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo [3/5] Installing Capacitor...
call npm install -g @capacitor/cli
call npm install @capacitor/core @capacitor/android

echo.
echo [4/5] Syncing with Android project...
call npx cap sync android
if errorlevel 1 (
    echo Error: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo [5/5] Building APK...
echo.
echo Opening Android Studio...
echo In Android Studio:
echo   1. Wait for Gradle sync to complete
echo   2. Click: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo   3. Wait for build to complete
echo.
echo APK will be generated at:
echo   moa_app\android\app\build\outputs\apk\debug\app-debug.apk
echo.

call npx cap open android

echo.
echo ✓ Android Studio opened with your project!
echo.
echo Alternative: Build via command line:
echo   cd moa_app\android
echo   gradlew.bat assembleDebug
echo.

pause
