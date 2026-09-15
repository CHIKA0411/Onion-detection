@echo off
REM Build Flutter Mobile Application
REM This script builds Flutter APK for Android and IPA for iOS

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Onion Quality Detection - Flutter Build
echo ========================================
echo.

cd /d "c:\Users\BINA\Downloads\sih onion\Onion-detection\sih_onion\mobile_app"

REM Check if Flutter is installed
where flutter >nul 2>nul
if errorlevel 1 (
    echo Error: Flutter is not installed!
    echo Please download from: https://flutter.dev/docs/get-started/install
    pause
    exit /b 1
)

echo [1/4] Checking Flutter setup...
call flutter doctor

echo.
echo [2/4] Getting Flutter dependencies...
call flutter pub get
if errorlevel 1 (
    echo Error: Flutter pub get failed
    pause
    exit /b 1
)

echo.
echo Choose build target:
echo 1) Android APK (Release)
echo 2) Android APK (Debug)
echo 3) iOS App
echo 4) Web
echo.

set /p choice="Enter your choice (1-4): "

if "!choice!"=="1" (
    echo.
    echo [3/4] Building Android Release APK...
    call flutter build apk --release
    echo.
    echo ✓ APK built successfully!
    echo Location: build\app\outputs\apk\release\app-release.apk
) else if "!choice!"=="2" (
    echo.
    echo [3/4] Building Android Debug APK...
    call flutter build apk --debug
    echo.
    echo ✓ APK built successfully!
    echo Location: build\app\outputs\apk\debug\app-debug.apk
) else if "!choice!"=="3" (
    echo.
    echo [3/4] Building iOS App...
    call flutter build ios
    echo.
    echo ✓ iOS app built successfully!
    echo You can now sign and publish from Xcode
) else if "!choice!"=="4" (
    echo.
    echo [3/4] Building Web App...
    call flutter build web
    echo.
    echo ✓ Web app built successfully!
    echo Location: build\web\
) else (
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo [4/4] Build complete!
echo.

pause
