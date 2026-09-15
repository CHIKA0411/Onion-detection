# ✅ ANDROID APK BUILD GUIDE

## Step-by-Step Instructions to Build APK in Android Studio

### **Your Project Location:**
```
C:\Users\BINA\Downloads\sih onion\Onion-detection\moa_app\android
```

---

## **STEP 1: Android Studio Already Opened ✓**

Android Studio has opened with your Capacitor Android project. You should see:
- Project name: `moa_app` 
- Build variant: `debug` (pre-selected)
- Package: `in.yourcompany.app`

---

## **STEP 2: Wait for Gradle Sync**

⏱️ **Wait 30-60 seconds** for Gradle to sync. You'll see:
```
Gradle Build: SUCCEEDED
```

This might take longer the first time (downloading dependencies).

**If sync fails:**
- Click: `File` → `Invalidate Caches` → `Invalidate and Restart`
- Click: `Build` → `Sync Now`

---

## **STEP 3: Build APK**

### **Method 1: Using Menu (Easiest)**

1. Click: **Build** (top menu)
2. Select: **Build Bundle(s) / APK(s)**
3. Click: **Build APK(s)**

```
Build Menu Flow:
Build
  ├─ Build Project
  ├─ Build Bundle(s) / APK(s)  ← Click here
  │   ├─ Build APK(s)          ← Then click here
  │   └─ Build Bundle(s)
  ├─ Rebuild Project
  ├─ Generate Signed Bundle/APK
  └─ Clean Project
```

### **Method 2: Using Gradle (Terminal in Android Studio)**

In Android Studio, open Terminal (bottom of screen):
```powershell
.\gradlew assembleDebug
```

---

## **STEP 4: Wait for Build Completion**

⏱️ **Build takes 2-5 minutes**

You'll see progress in the **Build** window:
```
:app:compileDebugKotlin
:app:compileDebugJavaWithJavac
:app:mergeDebugResources
:app:assembleDebug
✓ Built successfully
```

**Success message:**
```
BUILD SUCCESSFUL in XXXms
```

---

## **STEP 5: Locate Your APK File**

Once build completes, you'll see a notification:

**"Locate" button → Click it**

Or manually navigate to:
```
C:\Users\BINA\Downloads\sih onion\Onion-detection\moa_app\android\app\build\outputs\apk\debug\
```

**APK file name:**
```
app-debug.apk (approximately 50-100 MB)
```

---

## **STEP 6: Test the APK (Optional but Recommended)**

### **Option A: Install on Android Device**

**Requirements:**
- Android phone/tablet
- USB cable
- USB debugging enabled on device

**Steps:**
1. Connect phone to computer via USB
2. In Android Studio: **Run** → **Run 'app'**
3. Select your device
4. Android Studio installs and launches the app
5. Test the app:
   - ✓ Camera works
   - ✓ Upload image
   - ✓ Get quality grade
   - ✓ Download report

### **Option B: Use Android Emulator**

1. Open Android Studio
2. Tools → Device Manager
3. Start an emulator
4. Run → Run 'app'
5. App launches in emulator

### **Option C: Just Sideload the APK**

1. Transfer `app-debug.apk` to Android phone
2. Open file manager on phone
3. Tap the APK file
4. Tap "Install"
5. Launch app from home screen

---

## **TROUBLESHOOTING**

### **Build Fails: "SDK not found"**
✓ Already fixed! We created `local.properties` with SDK path.
- If still failing: File → Project Structure → SDK Location → Set to `C:\Users\BINA\AppData\Local\Android\Sdk`

### **Build Fails: "Gradle cache error"**
- Click: File → Invalidate Caches
- Restart Android Studio
- Try building again

### **Build Too Slow**
- This is normal for first build (20-30 min first time)
- Subsequent builds: 2-5 minutes

### **Out of Memory Error**
- Click: Help → Edit Custom VM Options
- Change: `-Xmx` to `4096m` (4GB)
- Restart Android Studio

### **APK File Not Generated**
- Check: Build window shows "BUILD SUCCESSFUL"
- Navigate manually to folder shown above
- APK filename: `app-debug.apk`

---

## **WHAT THE APK CONTAINS**

Your `app-debug.apk` includes:
- ✅ React web app (built from `dist/` folder)
- ✅ Capacitor native bridge
- ✅ Camera plugin
- ✅ File system access
- ✅ Network communication
- ✅ All assets and images

**File size:** ~50-100 MB (typical)

---

## **NEXT STEPS AFTER BUILD**

### **1. Share the APK with Judges**
```
Transfer app-debug.apk to:
  → Google Drive
  → Email
  → USB drive
  → QR code link
```

### **2. Create Release APK (Optional)**
For publishing to Google Play Store:
```
Build → Generate Signed Bundle/APK
```

### **3. Get App Statistics**
```
Build → Analyze APK
Shows: Size breakdown, permissions, resources
```

---

## **DEPLOYMENT OPTIONS**

### **Option 1: Sideload Only**
- Users download APK
- Install manually on phone
- ⚠️ Requires "Unknown Sources" enabled
- ✓ FREE
- ✓ No Google Play required

### **Option 2: Google Play Store** ($25 one-time)
- Professional distribution
- Automatic updates
- Wider reach
- Reviews and ratings
- ⚠️ Requires developer account + app signing

### **Option 3: Share APK Link**
- Host on GitHub releases
- Create QR code
- Share via WhatsApp/Email
- ✓ Easy for judges

---

## **LIVE URL REFERENCE**

After deployment:

**Website:** (Share this with judges)
```
https://your-project.vercel.app
```

**Backend API:**
```
https://api.your-domain.com/docs
```

**Android APK:**
```
Download from [Your sharing method]
Then: Install → Run → Test
```

---

## **VERIFICATION CHECKLIST**

After building APK:

- [ ] Build completed successfully (BUILD SUCCESSFUL message)
- [ ] APK file exists at: `app/build/outputs/apk/debug/app-debug.apk`
- [ ] File size is 50-100 MB (not too small/large)
- [ ] Can transfer APK to another device
- [ ] APK installs without errors
- [ ] App launches successfully
- [ ] Camera permission works
- [ ] Can upload images
- [ ] API communication works
- [ ] PDF reports generate

---

## **QUESTIONS OR ISSUES?**

**In Android Studio:**
- Help → Documentation
- Help → Contact Support
- Right-click → Quick Actions

**In Terminal:**
```powershell
# Show detailed error
.\gradlew assembleDebug --info

# Show stack trace
.\gradlew assembleDebug --stacktrace
```

---

## **SUMMARY**

✅ **What we did:**
1. Installed Android Studio
2. Configured Android SDK path
3. Opened Capacitor project in Android Studio
4. Built APK from React web app

✅ **What you need to do:**
1. Wait for Gradle sync in Android Studio
2. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)
3. Wait 2-5 minutes for build
4. Share `app-debug.apk` with judges

**Total time: 10-15 minutes** ⏱️

---

**Android APK Build Complete! 🎉**

Next: Share APK link + Website URL with judges!

---

*Last Updated: September 15, 2026*
