# Onion Quality Detection & Grading System (SIH26031)
## Complete Website & Application Deployment Guide

This project is configured to be deployed both as a **Live Web Application** and as an **Installable Mobile & Desktop Application**.

---

### Part 1: Deploy as a Website

The production bundle is generated in the `dist/` directory via `npm run build`.

#### Option 1: Instant Deployment via Vercel (Recommended — 1 Minute)
Vercel is the fastest, free, production-grade cloud platform for React/Vite web applications.

1. Open your terminal in `moa_app`:
   ```powershell
   cd "c:\Users\BINA\Downloads\sih onion\sih onion\moa_app"
   ```
2. Run the deployment command:
   ```powershell
   npx vercel
   ```
3. Follow the quick terminal prompts:
   - Confirm your email/account
   - Confirm project settings (preset `Vite`, output directory `dist` — already preconfigured in `vercel.json`)
4. You will receive a live public HTTPS URL (e.g., `https://onion-quality-grader.vercel.app`) with free global CDN and SSL.

---

#### Option 2: Instant Drag-and-Drop Deployment via Netlify (No CLI required)
1. Open [https://app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop the `dist/` folder located at:
   `c:\Users\BINA\Downloads\sih onion\sih onion\moa_app\dist`
3. Netlify will immediately publish your website live and give you a public URL!

Alternatively, deploy via the command line:
```powershell
npm run deploy:netlify
```

---

#### Option 3: Automated Deployment via GitHub Pages
A GitHub Actions workflow is preconfigured at [deploy-pages.yml](file:///c:/Users/BINA/Downloads/sih%20onion/sih%20onion/.github/workflows/deploy-pages.yml).
1. Push your repository to GitHub:
   ```powershell
   git add .
   git commit -m "Configure web deployment & PWA"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. GitHub will automatically build and publish your site at `https://<your-username>.github.io/<repo-name>/`.

---

#### Option 4: Instant Live Network & Mobile Testing (Local & Wi-Fi)
To test the site live on any smartphone, tablet, or PC connected to the same Wi-Fi:
```powershell
npm run host
```
The console will display:
- **Local URL:** `http://localhost:5000/`
- **Network URL:** `http://192.168.x.x:5000/` (open this on your phone's browser!)

To share with judges or external reviewers remotely using a public link:
```powershell
npx localtunnel --port 5000
```

---

### Part 2: Deploy as an Application

#### 1. Progressive Web Application (PWA — Works on Android, iOS, Windows, Mac)
The application is pre-configured with a Web App Manifest ([manifest.webmanifest](file:///c:/Users/BINA/Downloads/sih%20onion/sih%20onion/moa_app/public/manifest.webmanifest)) and a Service Worker ([sw.js](file:///c:/Users/BINA/Downloads/sih%20onion/sih%20onion/moa_app/public/sw.js)).

- **On Android (Chrome / Edge / Firefox):**
  1. Open the deployed website link.
  2. Tap the browser menu (`⋮`) or the prompt **"Add to Home screen"** / **"Install App"**.
  3. The app installs as a native application with an official icon, splash screen, and full-screen standalone mode.
- **On iOS (Safari):**
  1. Open the website link in Safari.
  2. Tap the **Share** button (`⎙`).
  3. Select **"Add to Home Screen"**.
- **On Windows / Mac (Chrome / Edge):**
  1. Look at the address bar and click the **Install** icon (or menu > *Apps > Install Onion Quality Grader*).
  2. Launches as an independent desktop window with its own taskbar shortcut.

---

#### 2. Native Android Application (.APK via Capacitor)
The project is integrated with `@capacitor/android` and has a native Android project in `moa_app/android`.

1. Sync the latest web build to the Android project:
   ```powershell
   cd "c:\Users\BINA\Downloads\sih onion\sih onion\moa_app"
   npm run build
   npx cap sync
   ```
2. Open the project in Android Studio:
   ```powershell
   npx cap open android
   ```
3. In Android Studio:
   - Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - The generated debug APK will be located in:
     `moa_app/android/app/build/outputs/apk/debug/app-debug.apk`
   - Transfer this `.apk` to any Android phone and install it directly!
