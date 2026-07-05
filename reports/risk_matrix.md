# Vulnerability Risk Matrix & CVSS Scoring Template

This document provides a structured framework for assessing security risks, categorizing bugs, and reporting CVSS scores.

## 1. Risk Matrix

The Risk Severity is calculated as a product of **Likelihood** and **Impact**:

| Likelihood \ Impact | Low (1) | Medium (2) | High (3) |
|---|---|---|---|
| **Low (1)** | Low Risk (1) | Low Risk (2) | Medium Risk (3) |
| **Medium (2)** | Low Risk (2) | Medium Risk (4) | High Risk (6) |
| **High (3)** | Medium Risk (3) | High Risk (6) | Critical Risk (9) |

### Severity Scale:
- **Critical (9)**: Immediate remediation required. System takeover or total data compromise possible.
- **High (6)**: Escalation needed. Sensitive data exposed or core features tampered with.
- **Medium (3-4)**: Remediation in next sprint cycle. Minor data disclosure or restricted functionality bypass.
- **Low (1-2)**: Informational or low impact. Security hardening recommendations.

---

## 2. CVSS v3.1 Scoring Calculator Template

Use this template to calculate the Common Vulnerability Scoring System (CVSS) score for newly discovered security issues.

### Base Metrics

#### Exploitability Metrics:
1. **Attack Vector (AV)**: [Physical (P) / Local (L) / Adjacent Network (A) / Network (N)]
2. **Attack Complexity (AC)**: [High (H) / Low (L)]
3. **Privileges Required (PR)**: [High (H) / Low (L) / None (N)]
4. **User Interaction (UI)**: [Required (R) / None (N)]

#### Scope Metric:
5. **Scope (S)**: [Unchanged (U) / Changed (C)]

#### Impact Metrics:
6. **Confidentiality (C)**: [None (N) / Low (L) / High (H)]
7. **Integrity (I)**: [None (N) / Low (L) / High (H)]
8. **Availability (A)**: [None (N) / Low (L) / High (H)]

---

## 3. Sample CVSS Calculation (SQL Injection Example)

- **Vector String**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`
- **Likelihood**: High (3)
- **Impact**: High (3)
- **Calculated CVSS Base Score**: **9.8 (Critical)**
- **Risk Classification**: **Critical Risk (9)**
