# Security Test Plan & Threat Model

This document outlines the security assessment strategy, STRIDE threat modeling, and OWASP Top 10 mappings for testing the Enterprise Secure SaaS Platform.

## 1. STRIDE Threat Model

| Threat Category | Target Component | Threat Scenario | Mitigation Status |
|---|---|---|---|
| **Spoofing** | Authentication | Attacker gains unauthorized credentials. | **Mitigated**: MFA support and bcrypt secure password hashing. |
| **Tampering** | File Uploads | Attacker uploads malicious script (XSS/shell). | **Mitigated**: MIME type checks, filename sanitization, and 5MB size limits. |
| **Repudiation** | DB Mutations | Changes to user roles or profiles are modified. | **Mitigated**: Automated PL/pgSQL triggers logging modifications to `audit_trail`. |
| **Info Disclosure** | Configurations | Attacker views backend DB URL and SECRET_KEY. | **Mitigated**: Debug APIs isolated behind `ENABLE_VULNERABILITY_LAB` toggle. |
| **Denial of Service** | API Routers | Attacker floods login endpoint to crash database. | **Mitigated**: Rate Limiter Middleware restricting requests to 100 per minute. |
| **Elevation of Priv.** | Admin Panel | Standard User modifies role parameters. | **Mitigated**: JWT payload checks and strict role enforcement server-side. |

## 2. OWASP Top 10 Mapping & Verification

We isolate vulnerable examples to `/api/v1/vuln/*` to demonstrate core web security issues, alongside secure implementations in our production routes:

- **A01:2021-Broken Access Control**: Demonstrated via IDOR user lookup (`/api/v1/vuln/access-control/user/{id}`). Mitigated in `api/profile.py` via session validation.
- **A03:2021-Injection**: SQL Injection demonstrated via raw queries (`/api/v1/vuln/sqli/user`). Mitigated via SQLAlchemy ORM parameter binding.
- **A05:2021-Security Misconfiguration**: Demonstrated via debug env leakage (`/api/v1/vuln/misconfig/debug-env`). Mitigated by turning debug flags off in production.

## 3. Tool Configurations
- **OWASP ZAP**: Used for automated vulnerability scanning of API routes.
- **Burp Suite Community Edition**: Used for intercepting and altering requests (e.g., IDOR parameter tampering, SQLi payloads).
