# 🧅 Onion Quality Detection & Grading System - Complete Deployment Guide

> **AI-Based Quality Assessment & Transparent Procurement System (SIH26031)**
> 
> Deploy as a **live website**, **native mobile app**, and **backend API** in minutes!

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Start the Deployment Manager
```powershell
cd "c:\Users\BINA\Downloads\sih onion\Onion-detection"
.\DEPLOY.bat
```

Choose from the interactive menu:
- 🌐 Deploy Website
- 📱 Build Android APK
- 🐍 Run Backend
- 📊 Full Stack Deployment

### 2️⃣ Deploy Website (Choose One)

**Option A: Vercel (Fastest)**
```powershell
cd moa_app
npm install && npm run build
vercel --prod
```
✅ **Live in 1 minute!** You'll get a public HTTPS URL

**Option B: Netlify (No CLI)**
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag `moa_app/dist/` folder
3. Done! ✨

### 3️⃣ Run Backend
```powershell
.\run-backend.bat
```
✅ Backend running at `http://localhost:8000/docs`

### 4️⃣ Build Mobile (Choose One)

**Android:**
```powershell
.\deploy-android.bat
```

**Flutter:**
```powershell
.\build-flutter.bat
```

---

## 📋 What's Included?

| Component | Technology | Deploy Status |
|-----------|-----------|---------------|
| **Web App** | React + Vite + Capacitor | ✅ Ready (Vercel/Netlify) |
| **Backend API** | FastAPI + YOLOv8 ML | ✅ Ready (Local/Cloud) |
| **Android App** | Capacitor Native | ✅ Ready (APK Build) |
| **iOS App** | Flutter | ✅ Ready (IPA Build) |
| **PWA** | Progressive Web App | ✅ Built-in |

---

## 🎯 Full Deployment Options

### Option 1: Website Only (Quickest)
⏱️ **Time**: 5 minutes
```bash
cd moa_app
npm install && npm run build && vercel --prod
```
Result: Public website at your-project.vercel.app

---

### Option 2: Website + Backend (Most Common)
⏱️ **Time**: 15 minutes

**Terminal 1 - Backend:**
```powershell
.\run-backend.bat
# Runs on http://localhost:8000
```

**Terminal 2 - Website:**
```powershell
cd moa_app
npm install && npm run build
vercel --prod
```

---

### Option 3: Website + Backend + Android (Full)
⏱️ **Time**: 30 minutes

1. Deploy website (see above)
2. Start backend (see above)
3. Build Android APK:
```powershell
.\deploy-android.bat
```

---

### Option 4: Full Stack (Website + Backend + Mobile)
⏱️ **Time**: 45 minutes

Use the deployment manager:
```powershell
.\DEPLOY.bat
# Choose: 6) Full Stack Deployment
```

---

## 🗂️ Project Structure

```
Onion-detection/
├── 🌐 moa_app/                 # Web Application
│   ├── src/                    # React components
│   ├── android/                # Capacitor Android
│   ├── public/                 # PWA manifest
│   └── dist/                   # Built website (deploy this!)
│
├── 🐍 sih_onion/              # Backend & ML
│   ├── backend/               # FastAPI server
│   │   └── app/main.py       # Main API
│   ├── ml_pipeline/           # ML models & training
│   │   ├── models/            # YOLOv8, classifier models
│   │   └── src/               # Inference & processing
│   └── storage/               # Uploads, reports, DB
│
├── 📱 mobile_app/             # Flutter App
│   ├── lib/main.dart
│   └── pubspec.yaml
│
└── 📄 Scripts & Docs
    ├── DEPLOY.bat             # Master deployment tool
    ├── DEPLOYMENT_SETUP.md    # Full guide
    ├── QUICK_REFERENCE.md     # Command cheat sheet
    └── ENV_CONFIGURATION.md   # Environment setup
```

---

## 🚀 Deployment Scripts Provided

| Script | Purpose | Time |
|--------|---------|------|
| `DEPLOY.bat` | Interactive deployment manager | - |
| `deploy-website.bat` | Build & deploy to Vercel/Netlify | 5 min |
| `deploy-android.bat` | Build Android APK via Capacitor | 15 min |
| `run-backend.bat` | Setup Python & run FastAPI | 10 min |
| `build-flutter.bat` | Build Flutter app (Android/iOS) | 20 min |

---

## 🔧 Prerequisites

Install these first:

- **Node.js 18+**: [Download](https://nodejs.org/)
- **Python 3.10+**: [Download](https://www.python.org/)
- **Java JDK 11+**: For Android
- **Git**: [Download](https://git-scm.com/)

Check installation:
```powershell
node --version      # Should be 18+
python --version    # Should be 3.10+
java -version       # Should be 11+
```

---

## 📝 Environment Setup

### 1. Create Web App Config
`moa_app/.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_DEBUG=false
```

### 2. Create Backend Config
`sih_onion/.env`:
```env
DATABASE_URL=sqlite:///./storage/onion_inspection.db
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

Or run the auto-setup:
```powershell
# (Auto-setup script coming soon)
```

---

## ✅ Testing Before Deployment

### Test Backend
```powershell
# Should return API docs
curl http://localhost:8000/docs

# Or open in browser:
http://localhost:8000/docs
```

### Test Website
```powershell
cd moa_app
npm run dev
# Open: http://localhost:5173
```

### Test on Mobile (Same WiFi)
```powershell
npm run host
# Open: http://192.168.x.x:5000 on your phone
```

---

## 🌐 Deployed URLs (After Deployment)

| Service | Local | Production |
|---------|-------|-----------|
| Website | `http://localhost:5173` | `https://your-project.vercel.app` |
| Backend | `http://localhost:8000` | `https://api.your-domain.com` |
| API Docs | `http://localhost:8000/docs` | `https://api.your-domain.com/docs` |

---

## 📱 Mobile Installation

### Android APK
1. Build: `.\deploy-android.bat`
2. Find APK at: `moa_app/android/app/build/outputs/apk/debug/app-debug.apk`
3. Transfer to phone and tap to install
4. Or use: `adb install app-debug.apk`

### iOS (Mac Only)
1. Build: `.\build-flutter.bat`
2. Open in Xcode
3. Sign & deploy

### Progressive Web App (Any Phone)
1. Open website in Chrome
2. Tap menu (⋮) → "Install app"
3. App appears on home screen!

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js |
| `python: command not found` | Install Python & add to PATH |
| CORS errors | Backend CORS config needs frontend URL |
| Port already in use | Kill process: `netstat -ano \| find "8000"` |
| Build fails | Try: `npm cache clean --force` |
| Capacitor errors | Run: `npm install @capacitor/cli` |

See [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md) for detailed troubleshooting.

---

## 📚 Documentation Files

- **[DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md)** - Comprehensive step-by-step guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheat sheet
- **[ENV_CONFIGURATION.md](ENV_CONFIGURATION.md)** - Environment variables reference
- **[moa_app/DEPLOYMENT_GUIDE.md](moa_app/DEPLOYMENT_GUIDE.md)** - Original web guide

---

## 🎓 Learning Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [FastAPI Guide](https://fastapi.tiangolo.com)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Flutter Guide](https://flutter.dev/docs)

---

## 🤝 Support

If you encounter issues:

1. Check the [Troubleshooting section in DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md#part-7-troubleshooting)
2. Review environment variables in [ENV_CONFIGURATION.md](ENV_CONFIGURATION.md)
3. Check logs in terminal output
4. Verify all prerequisites are installed

---

## ✨ Next Steps

After deployment:

1. ✅ Share website URL with judges/team
2. ✅ Test API endpoints (http://localhost:8000/docs)
3. ✅ Verify mobile app works
4. ✅ Collect feedback & iterate
5. ✅ Deploy to cloud for production

---

**Good luck with your deployment! 🚀**

*Last Updated: September 2026*
*Version: 1.0*
