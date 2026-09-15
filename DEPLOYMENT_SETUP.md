# 🚀 Onion Quality Detection System - Complete Deployment Guide

This guide provides step-by-step instructions to deploy the Onion Quality Detection and Grading System as both a **live website** and **native mobile applications**.

**System Overview:**
- 🌐 **Web Application**: React/Vite + Capacitor (deployed to Vercel/Netlify)
- 📱 **Mobile (Android)**: Native APK via Capacitor
- 📱 **Mobile (iOS)**: Flutter app or Capacitor
- ⚡ **Backend API**: FastAPI (Python) with ML models
- 🤖 **ML Pipeline**: YOLOv8 for onion segmentation + classification

---

## Prerequisites

Install on your system:
- **Node.js** (v18+): [Download](https://nodejs.org/)
- **Python** (3.10+): [Download](https://www.python.org/)
- **Java JDK** (11+): For Android build
- **Android Studio**: For APK building
- **Flutter SDK** (optional): For iOS/native Android builds

---

## Part 1: Deploy as a Live Website

### Step 1.1: Build the Web Application

Open PowerShell in the `moa_app` directory:

```powershell
cd "c:\Users\BINA\Downloads\sih onion\Onion-detection\moa_app"

# Install dependencies
npm install

# Build for production (creates dist/ folder)
npm run build
```

### Step 1.2: Deploy to Vercel (Fastest - Recommended)

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel --prod
```

**Result**: Your website gets a public URL like `https://onion-quality-grader.vercel.app`

### Step 1.3: Alternative - Deploy to Netlify

**Option A: Via CLI**
```powershell
npm run deploy:netlify
```

**Option B: Drag & Drop (No CLI)**
1. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `moa_app/dist/` folder
3. Get an instant public URL!

### Step 1.4: Test Locally Before Deployment

```powershell
# Run dev server locally
npm run dev

# Access: http://localhost:5173

# Test on mobile on same WiFi network
npm run host
# Then open the Network URL on your phone
```

---

## Part 2: Deploy as a Progressive Web App (PWA)

The application automatically works as an installable PWA once deployed!

**On Android:**
1. Open the deployed website in Chrome
2. Tap menu (⋮) → "Install app" or wait for the install prompt
3. App appears on home screen as a native app

**On iPhone:**
1. Open in Safari
2. Tap Share (⎙) → "Add to Home Screen"

---

## Part 3: Build Native Android Application (.APK)

### Step 3.1: Setup Capacitor

```powershell
cd "c:\Users\BINA\Downloads\sih onion\Onion-detection\moa_app"

# Install Capacitor CLI
npm install -g @capacitor/cli

# Install Capacitor packages
npm install @capacitor/core @capacitor/android @capacitor/camera @capacitor/file-system
```

### Step 3.2: Build and Sync

```powershell
# Build the web assets
npm run build

# Sync to Android project
npx cap sync android
```

### Step 3.3: Build APK

#### Option A: Using Android Studio (Easiest)
```powershell
npx cap open android
```
In Android Studio:
- Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Wait for completion
- Find APK at: `moa_app/android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Using Gradle CLI
```powershell
cd moa_app/android
./gradlew assembleDebug
```

APK location: `moa_app/android/app/build/outputs/apk/debug/app-debug.apk`

### Step 3.4: Install on Android Device

```powershell
# Via ADB (Android Debug Bridge)
adb install -r moa_app/android/app/build/outputs/apk/debug/app-debug.apk

# Or manually: Transfer the .apk file and tap to install
```

---

## Part 4: Setup Backend API (FastAPI)

### Step 4.1: Install Python Dependencies

```powershell
cd "c:\Users\BINA\Downloads\sih onion\Onion-detection\sih_onion"

# Create Python virtual environment
python -m venv venv

# Activate it
venv\Scripts\Activate.ps1

# Install dependencies
pip install -r ml_pipeline/requirements.txt
pip install fastapi uvicorn python-multipart pydantic python-dotenv
```

### Step 4.2: Run Backend Server

```powershell
cd backend

# Run with auto-reload for development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# For production with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**API available at:**
- Local: `http://localhost:8000`
- Docs: `http://localhost:8000/docs` (Swagger UI)
- ReDoc: `http://localhost:8000/redoc`

### Step 4.3: Configure API Endpoint in Frontend

Edit `moa_app/src/config.ts` or environment variables:

```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';
```

Update `.env.local` in `moa_app/`:
```
VITE_API_URL=https://your-deployed-backend.com
```

### Step 4.4: Deploy Backend (Optional Cloud Options)

**Option A: Render.com (Free Tier)**
- Push code to GitHub
- Connect repo on [render.com](https://render.com)
- Configure: Runtime Python, Command `uvicorn app.main:app --host 0.0.0.0 --port 8000`

**Option B: Heroku (CLI)**
```powershell
# Install Heroku CLI, then:
heroku create onion-api
git push heroku main
```

**Option C: AWS EC2/Lambda**
- Package as Docker container
- Deploy to ECR + ECS

---

## Part 5: Build Flutter Mobile App (iOS/Android)

### Step 5.1: Setup Flutter

```powershell
# Install Flutter: https://flutter.dev/docs/get-started/install
flutter doctor  # Verify setup

cd "c:\Users\BINA\Downloads\sih onion\Onion-detection\sih_onion\mobile_app"

# Get dependencies
flutter pub get
```

### Step 5.2: Build for Android

```powershell
flutter build apk
# OR for release with split APKs (smaller size):
flutter build apk --split-per-abi

# Output: build/app/outputs/apk/release/app-release.apk
```

### Step 5.3: Build for iOS

```powershell
flutter build ios
# Follow Xcode steps to code sign and deploy to App Store
```

---

## Part 6: Deployment Checklist

### Before Going Live:

- [ ] Backend API running and accessible
- [ ] CORS configured properly in FastAPI
- [ ] Environment variables set (API URLs, secrets)
- [ ] ML models (YOLOv8) in correct paths
- [ ] Database initialized
- [ ] All dependencies installed
- [ ] Built artifacts tested locally

### For Web Deployment:

- [ ] `npm run build` completes without errors
- [ ] Test built app with `npm run preview`
- [ ] Deploy to Vercel/Netlify
- [ ] Test deployed site on mobile devices
- [ ] PWA install works (check manifest.webmanifest)

### For Android APK:

- [ ] APK built successfully
- [ ] Tested on multiple Android versions
- [ ] File size acceptable (<100MB)
- [ ] Signed with release key for Play Store

### For Flutter:

- [ ] All dependencies resolve
- [ ] Built APK/IPA without errors
- [ ] Tested on actual devices

---

## Part 7: Troubleshooting

### Build Issues

**npm install fails:**
```powershell
npm cache clean --force
del node_modules
npm install
```

**Capacitor sync errors:**
```powershell
npx cap sync
npx cap update
```

**Python dependencies fail:**
```powershell
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt --no-cache-dir
```

### Runtime Issues

**CORS errors:**
- Backend CORS middleware is configured in `main.py`
- Ensure frontend and backend URLs match allowed origins

**ML model not found:**
- Check paths in `inference.py`
- Ensure `.pt` files exist in `ml_pipeline/models/`

**Database locked:**
```powershell
# Stop all Python processes and restart
```

---

## Part 8: Live Testing URLs

Once deployed:

| Component | URL |
|-----------|-----|
| Web App | `https://onion-quality-grader.vercel.app` |
| API Docs | `https://api.example.com/docs` |
| Android APK | Local install via ADB or sideload |
| iOS App | App Store (if published) |

---

## Support & Deployment Help

For issues or questions:
1. Check the individual deployment guides in each folder
2. Review logs in terminal output
3. Test backend with: `curl http://localhost:8000/docs`
4. Check frontend console (F12) for errors

Good luck with your deployment! 🎉
