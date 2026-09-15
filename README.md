# Onion Quality Detection & Automated Grading System (SIH26031)

An end-to-end AI-powered computer vision platform designed for transparent, objective, and standardized onion inspection, quality grading, and certified PDF report generation for the onion procurement supply chain.

---

## 📌 Highlights

- 🔍 **AI-Driven Detection & Segmentation**: Utilizes YOLOv8 instance segmentation (`yolov8n-seg.pt`) to detect individual onions, extract contours, and compute millimeter-scale dimension estimates.
- 🏷️ **Multi-Factor Quality Classification**:
  - Detects defects: sprouting, root presence, brown rot, black mold spots, blemishes, and mechanical damage.
  - Grades onions into standardized tiers: **Grade A** (Premium export), **Grade B** (Standard commercial), **Grade C** (Culinary/Local process), and **Reject** (Rot/Sprouted).
- ⚖️ **Human-in-the-Loop Override**: Transparent web dashboard enabling authorized inspectors to audit, correct, or approve AI grading with recorded justifications.
- 📄 **Certified PDF Reports**: Produces downloadable inspection certificates containing labeled crops, defect metrics, batch summary histograms, and audit timestamps via ReportLab.
- 📱 **Cross-Platform Access**: Includes both a responsive React + Vite web dashboard (packaged with Capacitor for Android APK builds) and backend REST APIs built with FastAPI.

---

## 🏗️ Architecture & Project Structure

```text
Onion-detection/
├── sih_onion/                     # Core Backend & AI Engine
│   ├── backend/
│   │   ├── main.py                # FastAPI Application & REST Endpoints
│   │   ├── schemas.py             # Pydantic Schemas & Data Contracts
│   │   ├── database.py            # SQLite / Persistence Models
│   │   └── pdf_generator.py       # Quality Certificate PDF Generator
│   ├── ml_pipeline/
│   │   ├── segmentation.py        # YOLOv8 Instance Segmentation & Metrics
│   │   ├── classifier.py          # Quality Grading & Defect Decision Logic
│   │   └── pipeline.py            # Unified Pipeline Orchestrator
│   ├── venv_deploy/               # Python Virtual Environment
│   ├── backend-requirements.txt   # Python Dependencies
│   └── run_finetuning.py          # Script for Training/Fine-tuning YOLO models
│
├── moa_app/                       # Frontend Web Application & Mobile Shell
│   ├── src/                       # React 18 + TypeScript Source Code
│   │   ├── pages/                 # UI Views (Grading, Analytics, Upload)
│   │   └── components/            # Reusable UI Controls & Previews
│   ├── android/                   # Capacitor Android Studio Native Project
│   ├── capacitor.config.ts        # Capacitor App Configuration
│   ├── vite.config.ts             # Vite Bundler Setup
│   └── package.json               # Node.js Dependencies & Scripts
│
├── yolov8n-seg.pt                 # Pre-trained YOLOv8 Segmentation Weights
├── run-backend.bat                # Shortcut: Start FastAPI Backend Server
├── deploy-website.bat             # Shortcut: Build & Launch Web Frontend
├── deploy-android.bat             # Shortcut: Open Native Android Project
├── ARCHITECTURE.md                # System Architecture & Pipeline In-depth Docs
├── ANDROID_BUILD_GUIDE.md         # Step-by-Step Android APK Build Guide
└── README.md                      # Project Overview & Quickstart Guide
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Python 3.10+** (with `pip` and virtual environment support)
- **Node.js 18+** & `npm`
- **Android Studio** (optional, only required if compiling native Android APK)

---

### 2. Backend Setup (FastAPI & ML Engine)

1. Open a terminal in `sih_onion/`:
   ```bash
   cd sih_onion
   ```
2. Activate the virtual environment:
   - **Windows (PowerShell/CMD):**
     ```cmd
     .\venv_deploy\Scripts\activate
     ```
   - *Or create a fresh one:*
     ```bash
     python -m venv venv
     venv\Scripts\activate
     pip install -r backend-requirements.txt
     ```
3. Start the FastAPI server:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *Alternatively, run `run-backend.bat` from the root directory.*

Interactive API documentation will be available at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 3. Frontend Web Dashboard (React + TypeScript)

1. Navigate to the `moa_app/` folder:
   ```bash
   cd moa_app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Alternatively, run `deploy-website.bat` from the root directory.*

The app will be accessible at [http://localhost:5173](http://localhost:5173).

---

### 4. Building the Android Mobile App (Capacitor)

1. Build the web distribution inside `moa_app/`:
   ```bash
   npm run build
   npx cap sync
   ```
2. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
3. In Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the `.apk` file.
   *See [ANDROID_BUILD_GUIDE.md](file:///c:/Users/BINA/Downloads/sih%20onion/Onion-detection/ANDROID_BUILD_GUIDE.md) for step-by-step instructions.*

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` or `/health` | Service health status check |
| `POST` | `/api/analyze` | Accepts multipart image(s), returns detected instances, coordinates, metrics, and quality grades |
| `POST` | `/api/override-grade` | Allows authorized inspectors to record grade changes with reasoning |
| `POST` | `/api/generate-report` | Creates and downloads a certified PDF inspection report |
| `GET` | `/api/batches` | Retrieves historical analysis logs and audit entries |

---

## 🧪 Testing & Validation

To test the backend and ML pipeline directly from CLI:
```bash
cd sih_onion
python test_pipeline.py
python test_backend.py
python test_image_eval.py
```

---

## 🛡️ License & Acknowledgements

Built for **Smart India Hackathon (SIH Challenge 26031)** to advance objective, automated grading in the agricultural commodity supply chain.
