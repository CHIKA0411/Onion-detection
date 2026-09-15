# 📋 Pre-Deployment Checklist

Use this checklist before deploying your Onion Quality Detection System.

---

## ✅ System Requirements Check

### 1. Development Tools Installed
- [ ] Node.js 18+ installed
  ```powershell
  node --version  # Should show v18.0.0 or higher
  ```
- [ ] Python 3.10+ installed
  ```powershell
  python --version  # Should show 3.10.0 or higher
  ```
- [ ] Java JDK 11+ installed
  ```powershell
  java -version  # Should show 11 or higher
  ```
- [ ] Git installed
  ```powershell
  git --version  # Should show git version
  ```

### 2. npm Packages Available
- [ ] npm works without errors
  ```powershell
  npm --version
  npm cache verify
  ```

### 3. Python Virtual Environment
- [ ] Can create virtual environment
  ```powershell
  python -m venv test_env
  ```

---

## ✅ Project Files Check

### 1. Frontend Project Structure
- [ ] `moa_app/package.json` exists
- [ ] `moa_app/src/` directory exists
- [ ] `moa_app/public/` directory exists
- [ ] `moa_app/android/` directory exists (for APK)

### 2. Backend Project Structure
- [ ] `sih_onion/backend/app/main.py` exists
- [ ] `sih_onion/ml_pipeline/requirements.txt` exists
- [ ] `sih_onion/ml_pipeline/models/` directory exists
- [ ] `sih_onion/storage/` directory is writable

### 3. ML Models Present
- [ ] `sih_onion/ml_pipeline/models/onion_yolov8_seg.pt` exists (~100+ MB)
- [ ] `sih_onion/ml_pipeline/models/onion_classifier_finetuned.pt` exists
- [ ] Both files are readable

### 4. Configuration Files
- [ ] `moa_app/capacitor.config.ts` exists
- [ ] `moa_app/vite.config.ts` exists (or similar)
- [ ] `sih_onion/ml_pipeline/config.yaml` exists

---

## ✅ Environment Configuration

### 1. Frontend Environment
- [ ] Created `moa_app/.env.local` with:
  ```env
  VITE_API_URL=http://localhost:8000
  VITE_DEBUG=false
  ```
- [ ] API URL is correct for your deployment target
- [ ] No sensitive data in .env (or in .gitignore)

### 2. Backend Environment
- [ ] Created `sih_onion/.env` with:
  ```env
  DATABASE_URL=sqlite:///./storage/onion_inspection.db
  HOST=0.0.0.0
  PORT=8000
  DEBUG=True
  ```
- [ ] Database path is writable
- [ ] Storage directories exist and are writable

### 3. Storage Directories
- [ ] `sih_onion/storage/uploads/` exists
- [ ] `sih_onion/storage/reports/` exists
- [ ] Both directories have write permissions

---

## ✅ Dependency Installation

### 1. Frontend Dependencies
- [ ] Run: `cd moa_app && npm install`
- [ ] No error messages in output
- [ ] `node_modules/` directory created
- [ ] `package-lock.json` generated

### 2. Backend Dependencies
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate: `venv\Scripts\Activate.ps1`
- [ ] Run: `pip install -r ml_pipeline/requirements.txt`
- [ ] All packages installed successfully (watch for errors)

### 3. Mobile Dependencies (Optional)
- [ ] Flutter installed (if building Flutter app)
  ```powershell
  flutter doctor  # Should show no major issues
  ```
- [ ] Android SDK installed (if building APK)
- [ ] Capacitor CLI installed for native builds

---

## ✅ Local Testing (Critical!)

### 1. Backend API Testing
- [ ] Backend starts without errors:
  ```powershell
  cd sih_onion/backend
  uvicorn app.main:app --reload
  ```
- [ ] API docs accessible at `http://localhost:8000/docs`
- [ ] No database errors in console
- [ ] ML models load without errors

### 2. Frontend Testing
- [ ] Frontend builds without errors:
  ```powershell
  cd moa_app
  npm run build
  ```
- [ ] `dist/` folder created with files
- [ ] Frontend dev server runs:
  ```powershell
  npm run dev
  ```
- [ ] Website loads at `http://localhost:5173`

### 3. API Integration Testing
- [ ] Frontend connects to backend
- [ ] API calls work from frontend console (F12)
- [ ] No CORS errors in browser console
- [ ] Image upload feature works
- [ ] Quality grading produces results

### 4. Mobile Testing (Optional)
- [ ] Test on actual Android device or emulator
- [ ] Camera permission grants work
- [ ] Image capture works
- [ ] Upload to API succeeds
- [ ] Results display correctly

---

## ✅ Production Configuration

### 1. Security Setup
- [ ] Changed default passwords/keys in `.env`
- [ ] SECRET_KEY is strong and unique
- [ ] API_KEY is set and protected
- [ ] Database credentials secured (production)
- [ ] CORS origins configured for your domain
- [ ] No debug mode enabled in production:
  ```env
  DEBUG=False  # Should be False for production
  ```

### 2. Database Configuration
- [ ] Database file location configured
- [ ] Backup strategy in place
- [ ] Database user/password set (if using managed DB)
- [ ] Connection pool configured
- [ ] Migrations run successfully

### 3. ML Model Configuration
- [ ] Model paths correct and accessible
- [ ] Model weights downloaded completely
- [ ] Inference speed acceptable (<5 seconds/image)
- [ ] GPU available if needed (optional)
- [ ] Model performance meets requirements

### 4. File Upload Configuration
- [ ] Max upload size configured (50MB recommended)
- [ ] Allowed file types restricted
- [ ] Upload directory has space available
- [ ] Cleanup strategy for old files
- [ ] Storage backed up regularly

---

## ✅ Deployment Readiness

### 1. Code Repository
- [ ] All changes committed to Git
- [ ] `.gitignore` includes `.env`, `node_modules/`, etc.
- [ ] No sensitive data in Git history
- [ ] README updated with setup instructions
- [ ] Repository is public or access configured

### 2. Deployment Platform Preparation

#### For Vercel/Netlify (Website)
- [ ] Vercel/Netlify account created
- [ ] GitHub repository connected
- [ ] Build settings correct (`npm run build`)
- [ ] Output directory set to `dist/`
- [ ] Environment variables added to platform
- [ ] Custom domain configured (optional)

#### For Backend Hosting
- [ ] Render/Railway/Heroku account created
- [ ] Repository connected
- [ ] Environment variables configured
- [ ] Python version selected (3.10+)
- [ ] Startup command configured
- [ ] Database created (if using managed DB)

#### For Mobile Deployment
- [ ] Google Developer account created (Android)
- [ ] Apple Developer account created (iOS, optional)
- [ ] Signing keys generated
- [ ] Build configuration reviewed

### 3. Monitoring & Logging
- [ ] Logging configured in backend
- [ ] Log levels appropriate (INFO for production)
- [ ] Error tracking service enabled (optional: Sentry)
- [ ] Performance monitoring enabled (optional: Datadog)

---

## ✅ Pre-Deployment Testing Scenarios

### Scenario 1: User uploads an image
- [ ] User can access website
- [ ] Image upload form loads
- [ ] File picker works
- [ ] Image selected correctly
- [ ] Upload progresses
- [ ] API processes image
- [ ] Results display
- [ ] PDF report generates
- [ ] Report downloads

### Scenario 2: User views analysis history
- [ ] History page loads
- [ ] Previous analyses listed
- [ ] Can filter by date/grade
- [ ] Can view details
- [ ] Can download reports

### Scenario 3: Admin grading override
- [ ] Admin login works
- [ ] Can see all analyses
- [ ] Can override grade with reason
- [ ] Changes saved to database
- [ ] Audit trail recorded

### Scenario 4: Mobile app usage
- [ ] App installs on Android device
- [ ] App launches successfully
- [ ] Camera permission granted
- [ ] Can take photo
- [ ] Can upload photo
- [ ] Results display in app
- [ ] Can save/share results

---

## ✅ Post-Deployment Verification

### After Website Deployment
- [ ] Website loads at public URL
- [ ] HTTPS works (lock icon in browser)
- [ ] All pages accessible
- [ ] API calls successful
- [ ] No console errors (F12)
- [ ] Mobile responsive
- [ ] PWA installable

### After Backend Deployment
- [ ] API accessible at public URL
- [ ] API docs load (`/docs` endpoint)
- [ ] Image upload works
- [ ] Quality grading works
- [ ] Reports generate
- [ ] Database queries fast
- [ ] Errors logged properly

### After Mobile Deployment
- [ ] APK installs without errors
- [ ] App launches successfully
- [ ] Camera works
- [ ] Can upload images
- [ ] Results display
- [ ] App doesn't crash
- [ ] Uninstall/reinstall works

---

## ✅ Communication & Sharing

### Before Sharing with Others
- [ ] Website URL documented
- [ ] Backend API URL documented
- [ ] Android APK hosted or ready to share
- [ ] Installation instructions written
- [ ] Known issues documented
- [ ] Support contact provided

### Sharing With Judges/Stakeholders
- [ ] Website URL available
- [ ] Demo account credentials ready
- [ ] Sample images prepared for testing
- [ ] Expected results documented
- [ ] Features documented
- [ ] Performance metrics available

---

## ✅ Final Sign-Off

Before deploying to production, verify:

- [ ] All system requirements met
- [ ] All files and structures present
- [ ] Dependencies installed successfully
- [ ] Local testing passed (all scenarios)
- [ ] Production config in place
- [ ] Security measures implemented
- [ ] Deployment platforms configured
- [ ] Post-deployment verification plan ready
- [ ] Team/judges notified
- [ ] Support plan in place

---

## 📝 Deployment Log

Use this section to log your deployment:

```
Date Deployed: _______________
Time Started: _______________
Time Completed: _______________

Website URL: _______________
Backend API URL: _______________
Android APK: _______________

Issues Encountered:
_______________________________________________
_______________________________________________

Solutions Applied:
_______________________________________________
_______________________________________________

Additional Notes:
_______________________________________________
_______________________________________________

Person Deploying: _______________
Signed Off By: _______________
```

---

## 🚀 Ready to Deploy?

If all checkboxes are marked ✅, you're ready to:

1. Run: `.\DEPLOY.bat`
2. Choose deployment option
3. Follow prompts
4. Monitor deployment
5. Test live system
6. Share with users

**Good luck! 🎉**

---

*Last Updated: September 2026*
*Version: 1.0*
