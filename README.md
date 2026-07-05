# Enterprise Secure SaaS Platform

A complete, enterprise-grade web application built specifically for manual QA, API testing, and defensive application security testing.

---

## 🚀 Technology Stack

### Frontend
- **React 19**
- **Next.js App Router**
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**
- **Zod**
- **Axios**

### Backend
- **FastAPI**
- **SQLAlchemy 2.x**
- **PostgreSQL**
- **Alembic**
- **Redis**
- **JWT & OAuth2**
- **Passlib**
- **Pydantic v2**

---

## 📂 Project Structure

```
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Routers (auth, profile, orgs, teams, subs, chat, files, audit, vuln)
│   │   ├── config/           # Pydantic Settings
│   │   ├── models/           # SQLAlchemy 2.0 3NF Models
│   │   ├── repository/       # Data Access Layer
│   │   ├── security/         # Token Hashing, Bearer Guards, Dependencies
│   │   └── services/         # Core Business Logic Layer
├── frontend/                 # Next.js Client Application
│   ├── app/                  # App Router Pages & Components
│   ├── components/           # UI Components
│   ├── context/              # Authentication State Context
│   └── services/             # Axios API Client Interceptors
├── database/                 # SQL Schema & Seed Data
│   ├── schema.sql            # 3NF relational PostgreSQL schema
│   └── seed.sql              # Enterprise Mock seed scripts
├── docs/                     # Guides and Specifications
│   ├── Test_Cases_250.md     # Manual QA Suite (250 Cases)
│   ├── API_Documentation.md  # REST API Specs
│   ├── Database_Documentation.md # ER Diagram & Table Specs
│   ├── Deployment_Guide.md   # Deployment instructions
│   └── Architecture_And_Security_Guide.md # Diagrams & Security Guides
├── reports/                  # Compliance & Security Assessments
│   ├── test_plan.md          # Functional Testing Strategy
│   ├── security_test_plan.md # STRIDE Threat Model
│   ├── risk_matrix.md        # Risk Severity Matrix & CVSS Template
│   ├── bug_report_template.md# Bug reporting form
│   ├── vulnerability_report.md # OWASP Lab findings
│   └── executive_summary.md  # Executive summaries
└── docker-compose.yml        # Orchestration configuration
```

---

## 🛡️ Admin Control Panel & Security Sandbox

The application includes an advanced, interactive **Admin Control Panel** simulating an enterprise Security Operations Center (SOC) dashboard. Features include:
- **System Health Telemetry**: Live dashboard tracking server metrics (CPU load, memory occupancy, DB response latency, and system uptime) via a 5-second dynamic polling loop.
- **Configuration & Compliance Audit**: Checklists tracking critical system configurations (Database status, SSL status, CORS wildcard policies, and live Vulnerability Lab status).
- **Cyber Threat Simulator**: Admin tools enabling simulated threat events (e.g., SQL Injection, Brute Force attacks, unauthorized API accesses, and XSS filter triggers) that write directly to the audit log database, allowing developers to inspect logs in real-time.
- **Forensic Audit Purge**: Admin control to purge/clear all forensic audit logs for fresh security testing iterations.
- **SVG Threat Trend Chart**: A high-contrast SVG gradient chart visualising security events blocked over a rolling 7-day period.

---

## 🛠️ Setup & Running

For complete instructions, see the [Deployment Guide](file:///c:/Users/windows-11/Desktop/QA_project%201/docs/Deployment_Guide.md).

### Docker Compose Quick Start
```bash
docker-compose up --build
```

---

## 🧪 Testing Suites & Reports

- **Manual QA Test Cases**: Check the [250 Manual Test Cases](file:///c:/Users/windows-11/Desktop/QA_project%201/docs/Test_Cases_250.md) covering Smoke, Sanity, Regression, Functional, Boundary, Negative, Positive, Compatibility, Exploratory, API, and Performance.
- **Risk Assessment**: See the [Risk Severity Matrix](file:///c:/Users/windows-11/Desktop/QA_project%201/reports/risk_matrix.md).
- **Security Findings**: Refer to the [Vulnerability Assessment Report](file:///c:/Users/windows-11/Desktop/QA_project%201/reports/vulnerability_report.md).
