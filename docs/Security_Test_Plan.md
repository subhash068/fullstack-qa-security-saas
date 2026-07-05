# Security Test Plan & Threat Model

## 1. Executive Summary
This document outlines the security assessment methodology, scope, and threat model for the internal QA Lab Application. The objective is to identify security flaws by actively testing intentionally vulnerable modules and verifying the robustness of the core authentication logic.

## 2. Test Scope
**In-Scope:**
- `http://localhost:8000/api/v1/auth/*` (Authentication & Session Management)
- `http://localhost:8000/api/v1/profile/*` (Profile Data)
- `http://localhost:8000/api/v1/admin/*` (Access Control & Privilege Escalation)
- `http://localhost:8000/api/v1/vuln/*` (Intentional OWASP Top 10 Lab modules)

**Out-of-Scope:**
- Denial of Service (DoS/DDoS) testing against the local container network.
- Exploiting underlying host infrastructure (OS-level exploitation).
- Phishing or Social Engineering the lab administrator.

## 3. Assets
- **Primary Asset:** PostgreSQL Database containing User PII (Name, Email, Phone) and password hashes.
- **Secondary Asset:** JWT signing keys (stored in environment).
- **Tertiary Asset:** Audit Logs (tracking system behavior).

## 4. Threat Model (STRIDE)
- **Spoofing:** Attackers attempting to guess session tokens or bypass authentication (mitigated by strong JWTs and secure password hashes, tested via the Weak Cookie/Reset lab).
- **Tampering:** Modifying database records via injection (tested via SQLi lab module).
- **Repudiation:** Actions performed without logs (mitigated by `audit_logs` table tracking sensitive events).
- **Information Disclosure:** Leaking internal system states (tested via Debug Info Leak module).
- **Denial of Service:** (Out of scope for this localized test).
- **Elevation of Privilege:** Standard user accessing Admin dashboard routes (tested via IDOR / Broken Access Control lab).

## 5. OWASP Top 10 Mapping (Lab Objectives)
1. **A01:2021 - Broken Access Control:** Addressed via `/vuln/access-control/user/{id}`.
2. **A03:2021 - Injection:** Addressed via `/vuln/sqli/user`.
3. **A05:2021 - Security Misconfiguration:** Addressed via `/vuln/misconfig/debug-env`.
4. **A07:2021 - Identification and Authentication Failures:** Addressed via `/vuln/auth/cookie-login` and `/vuln/auth/weak-reset-request`.

## 6. Vulnerability Report Template
If a new, unintended vulnerability is discovered outside the `/vuln` namespace, use this format:

**Title:** [Vulnerability Class] in [Endpoint/Component]
**CVSS Score:** (e.g., 8.5 High)
**Description:**
**Steps to Reproduce:**
1.
2.
**Impact:**
**Remediation Recommendation:**

---
*Note: This environment is exclusively for defensive testing and QA practice. Never deploy the `/vuln` namespace to production.*
