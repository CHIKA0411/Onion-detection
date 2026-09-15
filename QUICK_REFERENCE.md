# 🚀 Quick Reference: Deployment Commands

## One-Click Deployment Manager

**Start the deployment manager:**
```powershell
cd "c:\Users\BINA\Downloads\sih onion\Onion-detection"
.\DEPLOY.bat
```

---

## Website Deployment (5 minutes)

### Deploy to Vercel (Fastest)
```powershell
cd moa_app
npm install
npm run build
vercel --prod
```
✅ Result: Live public URL in 1-2 minutes

### Deploy to Netlify (Drag & Drop)
```powershell
cd moa_app
npm install
npm run build
# Then drag dist/ folder to https://app.netlify.com/drop
```
✅ Result: Live public URL instantly

---

## Backend Setup (10 minutes)

### Start Backend Server
```powershell
cd sih_onion
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r ml_pipeline/requirements.txt
pip install fastapi uvicorn python-multipart pydantic

cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
✅ API available at: `http://localhost:8000`
✅ Docs at: `http://localhost:8000/docs`

---

## Android App (APK) - 15 minutes

### Via GUI (Easiest)
```powershell
cd moa_app
npm install
npm run build
npx cap sync android
npx cap open android
```
Then in Android Studio:
1. Build > Build APK(s)
2. Find APK at: `moa_app/android/app/build/outputs/apk/debug/app-debug.apk`

### Via Command Line
```powershell
cd moa_app/android
gradlew.bat assembleDebug
```

### Install on Device
```powershell
adb install -r moa_app/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Flutter App - 20 minutes

### Build Android APK
```powershell
cd sih_onion/mobile_app
flutter pub get
flutter build apk --release
# Output: build/app/outputs/apk/release/app-release.apk
```

### Build iOS App
```powershell
cd sih_onion/mobile_app
flutter pub get
flutter build ios
```

---

## Testing Commands

### Test Web App Locally
```powershell
cd moa_app
npm run dev
# Open: http://localhost:5173
```

### Test Backend API
```powershell
# Swagger UI
curl http://localhost:8000/docs

# Health check
curl http://localhost:8000/health
```

### Test API from CLI
```powershell
# Upload image for analysis
curl -F "file=@image.jpg" http://localhost:8000/api/analyze
```

---

## Docker Deployment (If using containers)

### Build Images
```powershell
docker build -t onion-backend ./sih_onion
docker build -t onion-web ./moa_app
```

### Run with Docker Compose
```powershell
docker-compose up -d
# Backend: http://localhost:8000
# Web: http://localhost:3000
```

---

## Live Testing URLs

| Component | Local URL | Live URL |
|-----------|-----------|----------|
| Web App | `http://localhost:5173` | `https://your-domain.vercel.app` |
| Backend | `http://localhost:8000` | `https://api.your-domain.com` |
| API Docs | `http://localhost:8000/docs` | `https://api.your-domain.com/docs` |
| Android | Local install | Play Store (if published) |
| iOS | N/A (Mac only) | App Store (if published) |

---

## Environment Variables Quick Reference

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000
VITE_DEBUG=false
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./storage/onion_inspection.db
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

---

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| `python: command not found` | Install Python from python.org |
| `CORS error` | Check backend CORS config |
| `Port 8000 in use` | Kill process: `lsof -i :8000` |
| `Module not found` | Run `npm install` or `pip install -r requirements.txt` |
| `APK build fails` | Install Java JDK, set JAVA_HOME |
| `API connection fails` | Ensure backend is running and API_URL is correct |

---

## Deployment Checklist

### Before Going Live
- [ ] Backend running and tested
- [ ] Frontend builds without errors
- [ ] API endpoints configured correctly
- [ ] CORS settings proper
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Models downloaded and in correct paths
- [ ] Security settings configured

### For Website Deployment
- [ ] `npm run build` completes
- [ ] `npm run preview` works
- [ ] Deployed site loads on mobile
- [ ] API connection works from website

### For Android Deployment
- [ ] APK builds successfully
- [ ] Tested on actual Android device
- [ ] File size < 100MB
- [ ] Permissions requested properly

### For iOS Deployment (Mac)
- [ ] App builds without errors
- [ ] Tested on actual iOS device
- [ ] Signed with developer certificate
- [ ] Ready for App Store submission

---

## Next Steps After Deployment

1. **Get Feedback**: Share URLs with judges/stakeholders
2. **Monitor Performance**: Check server logs and usage analytics
3. **Fix Issues**: Address any bugs or UX problems
4. **Scale Up**: Deploy backend to production servers if needed
5. **Publish**: Submit to App Stores (Google Play, Apple App Store)

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Flutter Docs**: https://flutter.dev/docs

---

**Last Updated**: September 2026
**Version**: 1.0
