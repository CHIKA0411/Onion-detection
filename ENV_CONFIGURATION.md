# Environment Configuration Templates

## 1. Frontend Environment (.env.local)

Create `moa_app/.env.local`:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# For production (after deploying backend)
# VITE_API_URL=https://api.yourdomain.com

# Application Settings
VITE_APP_NAME=Onion Quality Grader
VITE_APP_VERSION=1.0.0

# Debug Mode
VITE_DEBUG=false
```

---

## 2. Backend Environment (.env)

Create `sih_onion/.env`:

```env
# Database
DATABASE_URL=sqlite:///./sih_onion/storage/onion_inspection.db

# ML Model Paths
YOLO_MODEL_PATH=sih_onion/ml_pipeline/models/onion_yolov8_seg.pt
CLASSIFIER_MODEL_PATH=sih_onion/ml_pipeline/models/onion_classifier_finetuned.pt

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Settings (for development)
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:5000","*"]

# File Upload Settings
MAX_UPLOAD_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=sih_onion/storage/uploads
REPORT_DIR=sih_onion/storage/reports

# Security (change these for production)
SECRET_KEY=your-secret-key-here-change-in-production
API_KEY=your-api-key-here
```

---

## 3. Mobile App Environment (Flutter)

Create `sih_onion/mobile_app/.env`:

```env
# API Configuration
API_BASE_URL=http://localhost:8000

# For production
# API_BASE_URL=https://api.yourdomain.com

# App Settings
APP_NAME=Onion Quality App
APP_VERSION=1.0.0
```

---

## 4. Production Environment Template

For production deployment, use stricter settings:

### moa_app/.env.production

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Onion Quality Grading System
VITE_DEBUG=false
```

### sih_onion/.env.production

```env
DATABASE_URL=postgresql://user:password@db.host:5432/onion_db
DEBUG=False
ALLOWED_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
SECRET_KEY=your-production-secret-key-keep-secure
```

---

## 5. Docker Environment (Optional for Backend)

Create `sih_onion/Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY ml_pipeline/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 6. Docker Compose for Full Stack

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build: ./sih_onion
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./storage/onion_inspection.db
      - ALLOWED_ORIGINS=["*"]
    volumes:
      - ./sih_onion/storage:/app/storage
      - ./sih_onion/ml_pipeline/models:/app/models
    command: uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

  web:
    build: ./moa_app
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
```

---

## 7. Environment Setup Checklist

- [ ] Created `moa_app/.env.local`
- [ ] Created `sih_onion/.env`
- [ ] Verified model file paths exist
- [ ] Set correct API URLs
- [ ] Updated CORS origins for your domain
- [ ] Created database directory with write permissions
- [ ] Set up file upload directories
- [ ] (Production) Secured SECRET_KEY and API_KEY
- [ ] (Production) Configured database credentials
- [ ] (Docker) Built and tested docker images
- [ ] (Docker Compose) Verified services start correctly

---

## 8. Quick Environment Setup Script

Save as `setup-env.bat`:

```batch
@echo off

echo Creating environment files...

cd moa_app
echo VITE_API_URL=http://localhost:8000 > .env.local
echo VITE_DEBUG=false >> .env.local
cd ..

cd sih_onion
echo DATABASE_URL=sqlite:///./storage/onion_inspection.db > .env
echo YOLO_MODEL_PATH=ml_pipeline/models/onion_yolov8_seg.pt >> .env
echo CLASSIFIER_MODEL_PATH=ml_pipeline/models/onion_classifier_finetuned.pt >> .env
echo HOST=0.0.0.0 >> .env
echo PORT=8000 >> .env
echo DEBUG=True >> .env
cd ..

echo Environment files created!
echo Edit them with your actual values before deploying.
pause
```

Run with: `setup-env.bat`

---

## 9. Verifying Environment Configuration

After setting up environments, verify with:

```powershell
# Check frontend config
cd moa_app
type .env.local

# Check backend config
cd ..\sih_onion
type .env

# Test API connection
curl http://localhost:8000/docs
```

---

## 10. Production Deployment Checklist

- [ ] Use strong, unique SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Use production database (PostgreSQL/MySQL, not SQLite)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set proper ALLOWED_ORIGINS
- [ ] Enable rate limiting
- [ ] Setup logging and monitoring
- [ ] Backup database regularly
- [ ] Use environment-specific configs
- [ ] Never commit sensitive keys to git
- [ ] Use secrets management (HashiCorp Vault, AWS Secrets Manager)
