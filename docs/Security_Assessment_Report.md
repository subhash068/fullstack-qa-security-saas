# SECURITY ASSESSMENT REPORT
**Target Platform**: Local Security Training & QA Lab  
**Author**: Senior Cybersecurity & QA Engineer  
**Date**: July 2026  
**Classification**: Educational / Portfolio Reference  

---

## 1. Executive Summary

This assessment details the security architecture, risk posture, threat model, and validation procedures for the localized Security Training & QA Lab. Designed as a dual-state learning tool, the platform exposes seven distinct vulnerability classes aligned with the OWASP Top 10 alongside secure, hardened reference architectures. 

The lab successfully compiles on Next.js 16 (Turbopack) and FastAPI/PostgreSQL. Automated security checks verify that database-level PL/pgSQL audit triggers successfully intercept all table mutations and dynamically redact sensitive user keys (specifically `password_hash` string values) before writing logs to the `audit_trail` table.

---

## 2. Security Test Plan & Scope

### 2.1 Scope of Assessment
The security testing boundary is strictly defined. Any out-of-scope activity is prohibited to prevent stability issues in host systems:

* **In-Scope Boundaries**:
  * Core Authentication services (`/api/v1/auth/*`)
  * Profiles management endpoints (`/api/v1/profile/*`)
  * Administrator console systems (`/api/v1/admin/*`)
  * Isolated Vulnerability Lab controllers (`/api/v1/vuln/*`)
  * Client Routing Proxy policies (`frontend/proxy.ts`)

* **Out-of-Scope Activities**:
  * Denial of Service (DoS/DDoS) execution against local container network layers.
  * Attempted attacks against third-party public CDNs, API packages, or host machine processes.

### 2.2 Security Testing Methodology
Assessment follows a structured, three-phase framework:
1. **Reconnaissance & Map-out**: Crawling routes using OWASP ZAP and mapping parameter patterns.
2. **Dynamic Penetration Testing (DAST)**: Triggering manual payloads (SQL injections, script insertions) to test boundary limits.
3. **Source Code Review (SAST)**: Evaluating repository, model, and routing classes against secure database policies.

---

## 3. Asset Classification

To structure defense-in-depth policies, platform assets are classified by sensitivity:

| Asset ID | Asset Name | Description | Classification |
|---|---|---|---|
| AST-01 | Credentials Database | PostgreSQL `users` table housing email addresses and hashed passwords. | **Critical** |
| AST-02 | User Profiles | `profiles` table containing PII (names, phone, date of birth, bio). | **High** |
| AST-03 | JWT Signing Secret | Secret key (`SECRET_KEY`) used to sign and verify JWT session access tokens. | **Critical** |
| AST-04 | Audit Telemetry | Logs stored in `audit_logs` and low-level change logs in `audit_trail`. | **Medium** |

---

## 4. Threat Modeling (STRIDE)

Using the Microsoft STRIDE methodology, we model threat vectors targetting AST-01 through AST-04:

* **Spoofing**: Attackers guessing token signatures or intercepting weak cookie parameters to hijack accounts (AST-03).
  * *Mitigation*: Hardened RS256/HS256 signing keys and `HttpOnly; Secure; SameSite=Lax` cookie configurations.
* **Tampering**: Manipulating SQL input parameters to read or delete database tables (AST-01).
  * *Mitigation*: Parameters binded via SQLAlchemy ORM query compilation.
* **Repudiation**: Modifying records without transaction history records (AST-04).
  * *Mitigation*: PL/pgSQL database-level triggers writing all DML mutations to `audit_trail`.
* **Information Disclosure**: Accessing debug endpoints or error outputs to leak backend credentials (AST-03).
  * *Mitigation*: Disabling `/vuln/*` namespaces in production builds via environment toggles.
* **Elevation of Privilege**: Bypassing client-side filters to call admin functions (AST-02).
  * *Mitigation*: Server-side validation via `check_admin` dependencies in FastAPI route handlers.

---

## 5. Risk Assessment Matrix

Risks are evaluated using a Likelihood vs. Impact framework:

```
                      I M P A C T
                Low        Medium       High
             +------------+------------+------------+
        High |  Medium    |   High     |  Critical  |
             +------------+------------+------------+
 LIKELIHOOD  |  Low       |   Medium   |   High     |
             +------------+------------+------------+
        Low  |  Negligible|   Low      |   Medium   |
             +------------+------------+------------+
```

### Risk Level Definitions:
* **Critical**: Immediate hotfix required. System compromise or data loss is highly likely.
* **High**: Urgent remediation needed. Key security boundaries are absent.
* **Medium**: Scheduled remediation. Exploitation requires specialized preconditions.
* **Low**: Hardening opportunities. Low exploitation impact or likelihood.

---

## 6. OWASP Top 10 Mapping & Lab Coverage

The lab simulates representative vulnerabilities mapping to the **OWASP Top 10 (2021)**:

| OWASP Category | Vulnerability Class | Lab Endpoint | Risk Rating |
|---|---|---|---|
| **A01:2021** - Broken Access Control | Insecure Direct Object Reference (IDOR) | `GET /vuln/access-control/user/{id}` | **High** |
| **A01:2021** - Broken Access Control | Cross-Site Request Forgery (CSRF) | `POST /vuln/csrf/change-email` | **High** |
| **A03:2021** - Injection | SQL Injection (SQLi) | `GET /vuln/sqli/user` | **Critical** |
| **A03:2021** - Injection | Reflected Cross-Site Scripting (XSS) | `GET /vuln/xss/echo` | **High** |
| **A05:2021** - Security Misconfiguration | Debug Environment Leak | `GET /vuln/misconfig/debug-env` | **High** |
| **A07:2021** - Identification and Authentication Failures | Weak Password Reset Token | `POST /vuln/auth/weak-reset-request` | **High** |
| **A07:2021** - Identification and Authentication Failures | Insecure Session Cookie | `POST /vuln/auth/cookie-login` | **Medium** |

---

## 7. Templates

### 7.1 Vulnerability Report Template
```markdown
# [VULN-ID]: [Vulnerability Title]

**Vulnerability Class**: (e.g. SQL Injection, IDOR)
**CVSS v3.1 Vector**: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (**9.8 Critical**)

## Description
[Detailed description of the issue, root cause, and affected parameters.]

## Proof of Concept (PoC)
1. Step 1...
2. Step 2...
```http
GET /api/v1/example?input=payload HTTP/1.1
Host: localhost:8000
```

## Remediation
[Code snippet or config changes showing how to resolve the issue.]
```

### 7.2 Bug Report Template
```markdown
# BUG-LNK: [Title Describing Unexpected/Erroneous Behavior]

**Priority**: High | Medium | Low  
**Severity**: Block-level | Major | Minor  

**Preconditions**:  
[User states, logins, or configurations needed to reproduce the issue.]

**Steps to Reproduce**:  
1. Navigate to...  
2. Input value...  
3. Click button...  

**Expected Behavior**:  
[What the system should have done under standard conditions.]

**Actual Behavior**:  
[The error, crash, or unexpected behavior observed.]
```

### 7.3 CVSS v3.1 Scoring Calculator Template
```
Base Score Metrics:
- Attack Vector (AV): [Network (N), Adjacent (A), Local (L), Physical (P)]
- Attack Complexity (AC): [Low (L), High (H)]
- Privileges Required (PR): [None (N), Low (L), High (H)]
- User Interaction (UI): [None (N), Required (R)]
- Scope (S): [Unchanged (U), Changed (C)]
- Confidentiality (C): [None (N), Low (L), High (H)]
- Integrity (I): [None (N), Low (L), High (H)]
- Availability (A): [None (N), Low (L), High (H)]
```

---

## 8. Vulnerability Remediation Logs

### 8.1 SQL Injection (SQLi)
* **Mechanics**: Raw string interpolation compiled directly into a PostgreSQL query engine instance.
* **Remediation**: Replaced raw string interpolation with **SQLAlchemy ORM query parameter binding**:
  ```python
  # Hardened Code
  db.query(User).filter(User.email == email).first()
  ```

### 8.2 Insecure Session Cookie
* **Mechanics**: Session cookies missing `HttpOnly` and `Secure` attributes, exposing session tokens to theft via cross-site scripting (XSS).
* **Remediation**: Added flags to enforce browser-side script isolation and TLS-only transmission:
  ```python
  # Hardened Code
  response.set_cookie(key="session_token", value=token, httponly=True, secure=True, samesite="Lax")
  ```

### 8.3 Cross-Site Request Forgery (CSRF)
* **Mechanics**: State-changing endpoints processed without origin validation or anti-CSRF token verification while relying on cookie-based authentication.
* **Remediation**: Shifted default authorization mechanics to **Header-based Bearer JWT authentication**. Browsers do not automatically attach authorization headers during cross-origin requests, neutralizing CSRF vectors.

---

## 9. Regression Validation Report

To verify that core system updates do not introduce security regression flaws, we run automated validation test cases against standard routes:

* **Registry Operations Validation**:
  * Validated that registration forms utilize Zod schemas to reject invalid emails, short passwords (<8 characters), and mismatched password entries before API submission.
* **Route Guard Verification**:
  * Confirmed that `frontend/proxy.ts` rejects direct browser entries to `/dashboard`, `/profile`, and `/admin` paths when the session cookie is missing.
  * Verified that attempting to enter administrative `/admin` pages as a standard User (Role ID = 3) results in an immediate redirect to `/error/403`.
* **Pytest Verification**:
  * Ran standard unit test runs verifying that user creations write clean records to both `users` and `profiles` tables under a single transaction without integrity or database schema constraints conflicts.
```
