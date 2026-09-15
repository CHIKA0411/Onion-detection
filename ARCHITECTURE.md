# 🏗️ Deployment Architecture & System Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ONION QUALITY DETECTION SYSTEM                   │
│                          (SIH26031)                                 │
└─────────────────────────────────────────────────────────────────────┘

                            ┌─── END USERS ───┐
                            │                 │
                ┌───────────┼────────┬────────┼───────────┐
                │           │        │        │           │
                ▼           ▼        ▼        ▼           ▼
            Browser      Mobile    Tablet  Desktop     PWA
            (Chrome)     (Android)  (iPad)  (Windows)   App
                │           │        │        │           │
                └───────────┼────────┴────────┼───────────┘
                            │                │
                    ┌───────┴────────────────┴──────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐           ┌──────────────────┐
          │   WEB FRONTEND   │           │  MOBILE APP      │
          ├──────────────────┤           ├──────────────────┤
          │ Capacitor/Vite   │           │ Flutter/Capacitor│
          │ React Components │           │ Native UI        │
          │ PWA Features     │           │ Camera Plugin    │
          │ Service Worker   │           │ Local Storage    │
          └────────┬─────────┘           └────────┬─────────┘
                   │                             │
                   └─────────────┬───────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │   API REQUEST (HTTP)      │
                    │   REST Endpoints          │
                    │   JSON Response           │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │   BACKEND SERVER         │
                    │   (FastAPI)              │
                    │   - Route Handling       │
                    │   - CORS Middleware      │
                    │   - Request Processing   │
                    └────────────┬──────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │     ML       │  │   DATABASE   │  │    FILE      │
        │   PIPELINE   │  │   ENGINE     │  │  STORAGE     │
        ├──────────────┤  ├──────────────┤  ├──────────────┤
        │ YOLOv8 Seg   │  │  SQLite      │  │  Uploads     │
        │ Classifier   │  │  (Local)     │  │  Reports     │
        │ Preprocessing│  │  PostgreSQL  │  │  Cache       │
        │              │  │  (Prod)      │  │              │
        └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Deployment Layers

### Layer 1: Frontend (Web & Mobile)
```
┌─────────────────────────────────────────────────┐
│              FRONTEND LAYER                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Web App (React/Vite)        Mobile Apps        │
│  ├─ Components              ├─ Flutter iOS     │
│  ├─ Pages                   ├─ Capacitor APK   │
│  ├─ Services                └─ PWA Installation│
│  ├─ State Management                           │
│  └─ UI/UX                                       │
│                                                 │
│  Deployment: Vercel / Netlify / GitHub Pages   │
│  Public URL: https://your-domain.com           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Layer 2: Backend (API & Processing)
```
┌─────────────────────────────────────────────────┐
│              BACKEND LAYER                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  FastAPI Server (Python)                        │
│  ├─ REST API Endpoints                          │
│  │  ├─ POST /api/analyze (Image processing)     │
│  │  ├─ POST /api/grade (Quality grading)        │
│  │  ├─ GET /api/reports (Fetch results)         │
│  │  └─ GET /api/history (User history)          │
│  │                                              │
│  ├─ ML Pipeline Integration                     │
│  │  ├─ YOLO Segmentation                        │
│  │  ├─ Classification Model                     │
│  │  └─ Quality Assessment                       │
│  │                                              │
│  └─ CORS Configuration                          │
│     Allows requests from frontend               │
│                                                 │
│  Deployment: Render / Railway / Heroku / AWS    │
│  API URL: https://api.your-domain.com           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Layer 3: Data & Models
```
┌─────────────────────────────────────────────────┐
│           DATA & ML MODELS LAYER                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Storage:                                       │
│  ├─ Database                                    │
│  │  ├─ SQLite (Development)                     │
│  │  └─ PostgreSQL (Production)                  │
│  │                                              │
│  ├─ File System                                 │
│  │  ├─ /storage/uploads/ (Input images)         │
│  │  ├─ /storage/reports/ (PDF outputs)          │
│  │  └─ /storage/cache/   (Temporary files)      │
│  │                                              │
│  └─ ML Models                                   │
│     ├─ onion_yolov8_seg.pt (Segmentation)       │
│     └─ onion_classifier_finetuned.pt (Classify) │
│                                                 │
│  Deployment: Local storage or S3/Cloud storage  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Deployment Flow Diagram

```
START DEPLOYMENT
      │
      ▼
┌─────────────┐
│ Choose Mode │
└─────────────┘
      │
      ├─────────────────────┬────────────────────┐
      │                     │                    │
      ▼                     ▼                    ▼
  Website Only        Website +              Full Stack
    (5 min)          Backend (15 min)        (45 min)
      │                     │                    │
      ▼                     ▼                    ▼
   npm build          npm build          npm build
   ├─ Install         ├─ Install         ├─ Install
   ├─ Build           ├─ Build           ├─ Build
   └─ Deploy          └─ Deploy          └─ Deploy
        │                  │                    │
        │                  ├─ pip install       ├─ pip install
        │                  ├─ Start API        ├─ Start API
        │                  ├─ Sync Capacitor   ├─ Sync Capacitor
        │                  └─ Build APK        └─ Build APK
        │                                      │
        ▼                  ▼                    ▼
   Live at            Live at                Complete
   Vercel             Vercel +              Deployment:
                      http://              - Website
                      localhost:8000       - Backend
                                          - Android APK
```

---

## Multi-Platform Deployment Map

```
                    ┌──────────────────────────────┐
                    │  BUILD & DEPLOY SYSTEM       │
                    └──────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
            WEB APPS     MOBILE APPS    BACKEND
                │            │            │
    ┌───────────┼───────┐    │    ┌───────┴──────────┐
    │           │       │    │    │                  │
    ▼           ▼       ▼    ▼    ▼                  ▼
 Vercel     Netlify  GitHub  Android  iOS        Cloud
 Pages      (Drag&   Pages   APK      App        Hosting
            Drop)    (CI/CD) (Capacitor)(Flutter) (Render/
                                                  Railway/
 Domain:                                          Heroku)
 your-domain.vercel.app                
                            Domain:
                            api.your-domain.com
```

---

## Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  End Users                                                      │
│  │                                                              │
│  ├─ Web: https://onion-grader.com (Vercel CDN)                 │
│  │  └─ Auto-deployed from git push                             │
│  │  └─ SSL/TLS Included                                        │
│  │  └─ Global CDN                                              │
│  │                                                              │
│  ├─ Mobile: Google Play / App Store                            │
│  │  └─ APK built locally                                       │
│  │  └─ Signed with production key                              │
│  │  └─ Published to stores                                     │
│  │                                                              │
│  └─ API: https://api.onion-grader.com (Render/Railway)         │
│     └─ Auto-deployed from git push                             │
│     └─ SSL/TLS Included                                        │
│     └─ Database: PostgreSQL (Managed)                          │
│     └─ Storage: S3 or equivalent                               │
│                                                                 │
│  Monitoring & Analytics                                        │
│  ├─ Sentry (Error tracking)                                    │
│  ├─ Datadog (Performance)                                      │
│  └─ GitHub Actions (CI/CD)                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   TECHNOLOGY STACK                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND                                                       │
│  ├─ React 18+ (UI Framework)                                    │
│  ├─ Vite (Build Tool)                                          │
│  ├─ TypeScript (Type Safety)                                    │
│  ├─ Capacitor (Native Bridge)                                   │
│  ├─ PWA (Progressive Web App)                                   │
│  └─ Service Worker (Offline Support)                            │
│                                                                 │
│  BACKEND                                                        │
│  ├─ FastAPI (Python Web Framework)                              │
│  ├─ Uvicorn (ASGI Server)                                       │
│  ├─ SQLAlchemy (ORM)                                            │
│  ├─ Pydantic (Data Validation)                                  │
│  └─ CORS Middleware (Cross-Origin)                              │
│                                                                 │
│  MACHINE LEARNING                                               │
│  ├─ YOLOv8 (Object Detection)                                   │
│  ├─ PyTorch (Deep Learning)                                     │
│  ├─ OpenCV (Image Processing)                                   │
│  ├─ Albumentations (Data Augmentation)                          │
│  └─ NumPy/Pandas (Data Science)                                 │
│                                                                 │
│  DATABASE                                                       │
│  ├─ SQLite (Development)                                        │
│  └─ PostgreSQL (Production)                                     │
│                                                                 │
│  MOBILE                                                         │
│  ├─ Flutter (Cross-Platform)                                    │
│  ├─ Capacitor Android (Native)                                  │
│  ├─ Camera Plugin (Image Capture)                               │
│  └─ HTTP Client (API Communication)                             │
│                                                                 │
│  DEPLOYMENT                                                     │
│  ├─ Vercel (Website Hosting)                                    │
│  ├─ Netlify (Alternative Website)                               │
│  ├─ Render/Railway (Backend Hosting)                            │
│  ├─ GitHub Actions (CI/CD)                                      │
│  └─ Docker (Containerization)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Communication Flow

```
                    ┌─────────────────────┐
                    │   Mobile/Web App    │
                    │  (React/Flutter)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  HTTP Request       │
                    │  (JSON Payload)     │
                    │  Authorization      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  FastAPI Endpoint   │
                    │  Request Handler    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Data Validation    │
                    │  (Pydantic)         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  ML Pipeline        │
                    │  - Load image       │
                    │  - Preprocess       │
                    │  - YOLO inference   │
                    │  - Classify         │
                    │  - Grade quality    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Data Processing    │
                    │  - Store results    │
                    │  - Generate report  │
                    │  - Save to DB       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  HTTP Response      │
                    │  (JSON Result)      │
                    │  Status: 200 OK     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Mobile/Web App     │
                    │  Display Results    │
                    └─────────────────────┘
```

---

## Local Development vs. Production Deployment

```
┌──────────────────────────┐          ┌──────────────────────────┐
│  LOCAL DEVELOPMENT       │          │  PRODUCTION DEPLOYMENT   │
├──────────────────────────┤          ├──────────────────────────┤
│                          │          │                          │
│  Frontend:               │          │  Frontend:               │
│  http://localhost:5173   │          │  https://domain.vercel   │
│  - Hot reload            │          │  .app (Global CDN)       │
│  - Debug mode ON         │          │  - Optimized build       │
│  - Local assets          │          │  - Cached assets         │
│                          │          │  - No debugging          │
│  Backend:                │          │                          │
│  http://localhost:8000   │          │  Backend:                │
│  - Python reload ON      │          │  https://api.domain.com  │
│  - Full logs             │          │  - Optimized serving     │
│  - Debug mode ON         │          │  - Load balancing        │
│  - SQLite DB             │          │  - PostgreSQL DB         │
│                          │          │                          │
│  CORS:                   │          │  CORS:                   │
│  - Allow all origins     │          │  - Only specific origins  │
│  - No auth checks        │          │  - Auth tokens required  │
│                          │          │                          │
│  Storage:                │          │  Storage:                │
│  - Local files           │          │  - S3 / Cloud storage    │
│  - No persistence        │          │  - Backed up             │
│                          │          │                          │
└──────────────────────────┘          └──────────────────────────┘
```

---

## CI/CD Pipeline (GitHub Actions)

```
Developer pushes code to GitHub
        │
        ▼
GitHub Actions Workflow Triggered
        │
        ├─ Install Dependencies
        │  └─ npm install / pip install
        │
        ├─ Run Tests (if configured)
        │  └─ pytest / npm test
        │
        ├─ Build Frontend
        │  └─ npm run build → dist/
        │
        ├─ Build Backend
        │  └─ pip freeze / docker build
        │
        ├─ Deploy to Vercel
        │  └─ Auto-deploy dist/
        │
        ├─ Deploy to Render/Railway
        │  └─ Auto-deploy to backend
        │
        └─ Deployment Complete
           ✓ Website live at https://domain.vercel.app
           ✓ API live at https://api.domain.com
```

---

## This diagram shows:
- **Multi-layer architecture** (Frontend, Backend, Data)
- **Multi-platform deployment** (Web, Mobile, Desktop)
- **Technology stack** for each component
- **Deployment flow** from development to production
- **CI/CD pipeline** for automated deployments

Use this as a reference when deploying different components!

