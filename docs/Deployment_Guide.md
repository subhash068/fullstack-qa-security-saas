# Enterprise Secure SaaS Platform - Deployment & Setup Guide

This document explains how to configure, deploy, and run the SaaS platform locally using Docker Compose or native services.

---

## 1. Prerequisites
- Docker & Docker Compose
- Node.js v18+ (for local frontend build)
- Python 3.10+ (for local backend development)
- PostgreSQL 15+ (if running natively)

---

## 2. Environment Configuration

Create a `.env` file in the root directory (or set environment variables):

```bash
# General
SECRET_KEY=supersecretkeychangeinprod1234567890!
ENABLE_VULNERABILITY_LAB=false  # Set to true only for educational security labs

# PostgreSQL
POSTGRES_SERVER=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=manager
POSTGRES_DB=qa_lab
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0
```

---

## 3. Docker Compose Deployment (Recommended)

To spin up the entire multi-container enterprise stack (FastAPI, Next.js, PostgreSQL, Redis, and Nginx proxy), run:

```bash
docker-compose up --build
```

### Containers Started:
1. **`db`**: PostgreSQL instance mapping to port 5432.
2. **`redis`**: Cache server for API rate-limiting middleware.
3. **`backend`**: FastAPI application exposed on port 8000.
4. **`frontend`**: Next.js client application exposed on port 3000.

---

## 4. Local Native Setup (Without Docker)

### 4.1 Database Setup
1. Create a PostgreSQL database named `qa_lab`.
2. Execute the migrations using Alembic, or run the baseline SQL schema:
   ```bash
   psql -U postgres -d qa_lab -f database/schema.sql
   psql -U postgres -d qa_lab -f database/seed.sql
   ```

### 4.2 Run FastAPI Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Start the Uvicorn dev server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 4.3 Run Next.js Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` in your web browser.
