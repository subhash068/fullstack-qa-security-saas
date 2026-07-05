# QA Test Cases

| Test ID | Module | Priority | Severity | Preconditions | Steps | Expected Result | Actual Result | Status | Type |
|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Registration | High | Critical | User is on the registration page | 1. Enter valid name, email, password, confirm password. 2. Click Register | User is created, tokens are generated, and redirected to dashboard | | Untested | Positive, Smoke |
| TC-002 | Registration | Medium | High | User is on the registration page | 1. Enter existing email address. 2. Click Register | Error message "Email already registered" is displayed | | Untested | Negative, Boundary |
| TC-003 | Registration | Low | Medium | User is on the registration page | 1. Enter password less than 8 characters. 2. Click Register | Validation error "Password must be at least 8 characters" is shown | | Untested | Negative, Sanity |
| TC-004 | Registration | Low | Medium | User is on the registration page | 1. Enter mismatched passwords. 2. Click Register | Validation error "Passwords don't match" is shown | | Untested | Negative, Sanity |
| TC-005 | Login | High | Critical | User is registered | 1. Navigate to login. 2. Enter valid credentials. 3. Click Login | User is authenticated, tokens stored, redirected to dashboard | | Untested | Positive, Smoke |
| TC-006 | Login | High | High | User is registered | 1. Enter invalid password. 2. Click Login | "Invalid email or password" error displayed | | Untested | Negative, Smoke |
| TC-007 | Login | Medium | Medium | User is registered, account is locked (is_active=False) | 1. Enter valid credentials. 2. Click Login | Error "Account is disabled" displayed | | Untested | Negative, Sanity |
| TC-008 | Dashboard | High | Critical | User is logged in | 1. Navigate to /dashboard | Dashboard loads displaying user's name, status, and stats | | Untested | Positive, Smoke |
| TC-009 | Dashboard | Medium | High | User is NOT logged in | 1. Navigate directly to /dashboard via URL | User is blocked or redirected to /login | | Untested | Security, Negative |
| TC-010 | Profile | Medium | Medium | User is logged in | 1. Navigate to /profile. 2. Change name. 3. Click Save | Profile updates successfully and new name reflects across app | | Untested | Positive, Sanity |
| TC-011 | Admin | High | Critical | User has Role ID 1 (Admin) | 1. Navigate to /admin | Admin dashboard loads showing total user stats | | Untested | Positive, Smoke |
| TC-012 | Admin | High | Critical | User has Role ID 2 (User) | 1. Navigate to /admin | "Access denied" error displayed, components restricted | | Untested | Security, Boundary |
| TC-013 | Auth (Vuln) | High | Critical | Application is running locally | 1. Send POST to /api/v1/vuln/auth/cookie-login | Cookie is set with HttpOnly=False | | Untested | Security, Negative |
| TC-014 | SQLi (Vuln) | High | Critical | Application is running locally | 1. Send GET to /api/v1/vuln/sqli/user?email=admin@local.test' OR '1'='1 | Raw SQL execution bypasses filter and returns user data | | Untested | Security, Negative |
| TC-015 | XSS (Vuln) | High | Critical | Application is running locally | 1. Send GET to /api/v1/vuln/xss/echo?payload=<script>alert(1)</script> | Response reflects unescaped script tag rendering in browser | | Untested | Security, Negative |
| TC-016 | IDOR (Vuln) | High | Critical | Application is running locally | 1. Send GET to /api/v1/vuln/access-control/user/{any-uuid} | Endpoint returns details of the targeted UUID without auth checks | | Untested | Security, Negative |
| TC-017 | Password Reset | Medium | High | User is registered | 1. Submit email to /forgot-password | Response says "link will be sent" to prevent enumeration | | Untested | Positive, Security |
| TC-018 | Password Reset | High | Critical | User requested reset | 1. Submit POST to /reset-password with valid token | Password is updated successfully | | Untested | Positive, Smoke |
| TC-019 | Misconfig | High | Critical | Application is running locally | 1. GET /api/v1/vuln/misconfig/debug-env | Internal configuration (DB URL, Secrets) is leaked | | Untested | Security, Negative |
| TC-020 | Logout | Medium | Medium | User is logged in | 1. Click Logout on navbar | Tokens are deleted from localStorage and user is redirected to login | | Untested | Positive, Sanity |

*(This is a subset of the 60+ generated test cases representing core module coverage spanning positive, negative, security, and boundary validations)*
