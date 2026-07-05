# Enterprise Secure SaaS Platform - 250 Manual Test Cases

This document contains the complete manual test suite of **250 test cases** for verifying the enterprise-grade Secure SaaS platform.

| Test ID | Module | Priority | Severity | Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|
| **LGN-001** | Login | High | Critical | User is on the login page | 1. Enter valid email. 2. Enter valid password. 3. Click Login. | Tokens are generated, session saved, redirected to dashboard. | | Untested |
| **LGN-002** | Login | High | High | User is on the login page | 1. Enter unregistered email. 2. Enter random password. 3. Click Login. | "Invalid email or password" error is displayed. | | Untested |
| **LGN-003** | Login | High | High | User is on the login page | 1. Enter registered email. 2. Enter wrong password. 3. Click Login. | "Invalid email or password" error is displayed. | | Untested |
| **LGN-004** | Login | Medium | Medium | User is on the login page | 1. Leave email empty. 2. Enter valid password. 3. Click Login. | "Email is required" validation error shown. | | Untested |
| **LGN-005** | Login | Medium | Medium | User is on the login page | 1. Enter valid email. 2. Leave password empty. 3. Click Login. | "Password is required" validation error shown. | | Untested |
| **LGN-006** | Login | High | High | Account is disabled (is_active=False) | 1. Enter credentials for disabled account. 2. Click Login. | "Account is disabled" error displayed, login blocked. | | Untested |
| **LGN-007** | Login | Low | Medium | User is on the login page | 1. Enter invalid email structure (e.g., "test@"). 2. Click Login. | Client-side/server-side email validation blocks submission. | | Untested |
| **LGN-008** | Login | Medium | Medium | User is on the login page | 1. Press Tab in email input. 2. Verify cursor focus moves to password. | Cursor focus moves correctly following page tab-order. | | Untested |
| **LGN-009** | Login | Medium | Medium | User is on the login page | 1. Enter email. 2. Enter password. 3. Press Enter key. | Form submits automatically on Enter key press. | | Untested |
| **LGN-010** | Login | Medium | High | User is logged in | 1. Attempt to navigate back to /login. | Next.js/Middleware redirects user automatically to dashboard. | | Untested |
| **LGN-011** | Login | Low | Low | User is on the login page | 1. View page in dark mode. 2. Confirm text readability. | Text contrast meets WCAG AAA standards in dark/light modes. | | Untested |
| **LGN-012** | Login | Low | Medium | User is on the login page | 1. Verify responsive layout on mobile resolution. | Layout scales dynamically without horizontal scrolling. | | Untested |
| **LGN-013** | Login | Medium | High | MFA is enabled on the account | 1. Enter valid credentials. 2. Click Login. | Screen redirects to MFA code prompt page. | | Untested |
| **LGN-014** | Login | High | Critical | MFA is enabled, on MFA code prompt page | 1. Enter correct MFA code. 2. Click Verify. | User authenticated successfully, redirected to dashboard. | | Untested |
| **LGN-015** | Login | High | High | MFA is enabled, on MFA code prompt page | 1. Enter incorrect MFA code. 2. Click Verify. | "Invalid MFA passcode" error displayed, login blocked. | | Untested |
| **LGN-016** | Login | Medium | Medium | MFA is enabled, on MFA code prompt page | 1. Leave MFA code blank. 2. Click Verify. | Client-side validation blocks empty code submission. | | Untested |
| **LGN-017** | Login | Low | Low | MFA is enabled, on MFA code prompt page | 1. Click "Back to Login" link. | User returned to core email/password form cleanly. | | Untested |
| **LGN-018** | Login | Medium | High | User session expires | 1. Trigger token expiration. 2. Make an API request. | Interceptor attempts token refresh silently. | | Untested |
| **LGN-019** | Login | High | Critical | Both access and refresh tokens expired | 1. Perform api call. | Tokens cleared, user redirected to login immediately. | | Untested |
| **LGN-020** | Login | Medium | High | User is logged in | 1. Perform session hijacking attempt with stale cookie. | Server-side validation rejects invalid cookie signatures. | | Untested |
| **LGN-021** | Login | High | Critical | Multiple failed logins | 1. Perform 10 consecutive failed logins. | Account locked temporarily or rate limiting triggers. | | Untested |
| **LGN-022** | Login | Medium | Medium | User is on the login page | 1. View password visibility toggle. | Toggle updates input type to "text" showing characters. | | Untested |
| **LGN-023** | Login | Low | Low | User is on the login page | 1. Inspect password input element in browser. | Element type is set to "password" to mask characters. | | Untested |
| **LGN-024** | Login | Medium | High | User is logged in on 1 device | 1. Login on second device. | User is authenticated successfully on both or limits apply. | | Untested |
| **LGN-025** | Login | Low | Low | User is on the login page | 1. Click register link. | Redirection to register page works without latency. | | Untested |
| **REG-026** | Register | High | Critical | User is on the registration page | 1. Enter valid details. 2. Submit. | Account created, automatic login, redirected to dashboard. | | Untested |
| **REG-027** | Register | High | High | User is on the registration page | 1. Enter email already registered. 2. Submit. | "Email already registered" error shown. | | Untested |
| **REG-028** | Register | Medium | Medium | User is on the registration page | 1. Enter mismatched passwords. 2. Submit. | "Passwords don't match" error is displayed. | | Untested |
| **REG-029** | Register | Medium | Medium | User is on the registration page | 1. Enter password under 8 characters. 2. Submit. | "Password must be at least 8 characters" displayed. | | Untested |
| **REG-030** | Register | Medium | Medium | User is on the registration page | 1. Leave First Name blank. 2. Submit. | "First name is required" validation error shown. | | Untested |
| **REG-031** | Register | Medium | Medium | User is on the registration page | 1. Leave Last Name blank. 2. Submit. | "Last name is required" validation error shown. | | Untested |
| **REG-032** | Register | Medium | Medium | User is on the registration page | 1. Leave Email blank. 2. Submit. | "Email is required" validation error shown. | | Untested |
| **REG-033** | Register | Low | Low | User is on the registration page | 1. Enter 100+ chars in name. 2. Submit. | App handles long strings safely without breaking layout. | | Untested |
| **REG-034** | Register | Low | Medium | User is on the registration page | 1. Enter letters in phone input. 2. Submit. | Validation message shown or database sanitizes phone. | | Untested |
| **REG-035** | Register | Medium | High | User is already logged in | 1. Navigate to /register. | User is redirected back to /dashboard. | | Untested |
| **REG-036** | Register | Low | Low | User is on the registration page | 1. Check layout in mobile viewport. | Form elements stack vertically and remain clickable. | | Untested |
| **REG-037** | Register | Medium | Medium | User is on the registration page | 1. Enter special characters in names. 2. Submit. | Characters sanitized safely on backend. | | Untested |
| **REG-038** | Register | High | Critical | User registers successfully | 1. Verify verification email table record. | Email verification record added with unique token hash. | | Untested |
| **REG-039** | Register | Low | Low | User is on the registration page | 1. Click "Login" redirect link. | User navigated back to /login page. | | Untested |
| **REG-040** | Register | Low | Low | User is on the registration page | 1. Tab through inputs. | Tabs move in registration sequence: first, last, email, pwd. | | Untested |
| **REG-041** | Register | Medium | Medium | User is on the registration page | 1. Enter spaces in email input. 2. Submit. | Leading/trailing spaces trimmed automatically. | | Untested |
| **REG-042** | Register | Low | Low | User is on the registration page | 1. Check password strength indicator. | Visual prompt updates as criteria (length, digits) are met. | | Untested |
| **REG-043** | Register | Medium | High | User registers via OAuth | 1. Click Google OAuth button. | Auth flow completes, logs user in. | | Untested |
| **REG-044** | Register | Medium | High | User registers via OAuth | 1. Cancel OAuth permissions. | Registration aborted cleanly, user remains on register page. | | Untested |
| **REG-045** | Register | Low | Low | User is on the registration page | 1. Check compliance link (terms/privacy). | Link opens correct policy window. | | Untested |
| **REG-046** | Register | Medium | Medium | User is on the registration page | 1. Enter email in uppercase. 2. Submit. | Email normalized to lowercase before saving in database. | | Untested |
| **REG-047** | Register | High | Critical | Multi-threaded registration submission | 1. Click register button multiple times quickly. | Only one account is created; subsequent clicks ignored. | | Untested |
| **REG-048** | Register | Low | Medium | User is on the registration page | 1. Verify cross-browser layout consistency. | Page renders identical forms across Chrome, Safari, Firefox. | | Untested |
| **REG-049** | Register | Medium | High | User registers with valid profile details | 1. Verify database `profiles` record. | Profile record added with correct reference fields. | | Untested |
| **REG-050** | Register | Medium | Medium | User is on the registration page | 1. Click register with no inputs filled. | Standard Zod/Form validations trigger, preventing post. | | Untested |
| **FGT-051** | Forgot Password | High | High | User is on /forgot-password page | 1. Enter valid registered email. 2. Submit. | Success message displayed, reset link logged on backend. | | Untested |
| **FGT-052** | Forgot Password | High | High | User is on /forgot-password page | 1. Enter unregistered email. 2. Submit. | Success message displayed to prevent user enumeration. | | Untested |
| **FGT-053** | Forgot Password | Medium | Medium | User is on /forgot-password page | 1. Leave email empty. 2. Submit. | Validation block shown: "Email is required". | | Untested |
| **FGT-054** | Forgot Password | Low | Low | User is on /forgot-password page | 1. Click "Back to Login" link. | User redirected back to /login. | | Untested |
| **FGT-055** | Forgot Password | Low | Medium | User is on /forgot-password page | 1. Tab focus through elements. | Focus shifts logically: email, send button, return link. | | Untested |
| **FGT-056** | Forgot Password | Medium | High | User requests reset multiple times | 1. Submit reset request 5 times in 1 minute. | Rate limiter limits requests or throttles token generation. | | Untested |
| **FGT-057** | Forgot Password | Medium | High | Reset code generated in logs | 1. Verify token is cryptographically random. | Token generated is a secure UUID. | | Untested |
| **FGT-058** | Forgot Password | Low | Low | User is on /forgot-password page | 1. Adjust screen size. | Layout remains clean with centered elements. | | Untested |
| **FGT-059** | Forgot Password | Medium | Medium | User is on /forgot-password page | 1. Enter malformed email. 2. Submit. | Form rejects submission on client side. | | Untested |
| **FGT-060** | Forgot Password | High | High | User is logged in | 1. Navigate to /forgot-password. | Middleware redirects user to /dashboard. | | Untested |
| **RST-061** | Reset Password | High | Critical | Reset request has been initiated | 1. Paste valid token. 2. Enter matching new password. 3. Update. | Password updated successfully, redirects to /login. | | Untested |
| **RST-062** | Reset Password | High | High | User is on /reset-password page | 1. Paste expired token. 2. Enter new password. 3. Update. | "Invalid or expired reset token" error shown. | | Untested |
| **RST-063** | Reset Password | High | High | User is on /reset-password page | 1. Enter invalid token format. 2. Attempt submit. | "Invalid or expired reset token" error shown. | | Untested |
| **RST-064** | Reset Password | Medium | Medium | User is on /reset-password page | 1. Enter mismatched passwords. 2. Click update. | "Passwords don't match" error displayed. | | Untested |
| **RST-065** | Reset Password | Medium | Medium | User is on /reset-password page | 1. Enter password under 8 characters. 2. Update. | "Password must be at least 8 characters" displayed. | | Untested |
| **RST-066** | Reset Password | High | High | Reset token already used once | 1. Submit reset again with same token. | "Invalid or expired reset token" error displayed. | | Untested |
| **RST-067** | Reset Password | Low | Low | User is on /reset-password page | 1. Inspect elements structure. | Inputs are masked as password type. | | Untested |
| **RST-068** | Reset Password | Low | Medium | User is on /reset-password page | 1. View responsiveness on tablets. | Component adapts width cleanly. | | Untested |
| **RST-069** | Reset Password | Medium | Medium | User resets password successfully | 1. Attempt login with old password. | Login rejected; old hash invalidated. | | Untested |
| **RST-070** | Reset Password | Medium | Medium | User resets password successfully | 1. Attempt login with new password. | Login successful; new password works. | | Untested |
| **VFY-071** | Email Verification | High | High | Email verification code generated | 1. Send token to /verify-email endpoint. | Email marked verified in database, login unlocked. | | Untested |
| **VFY-072** | Email Verification | High | High | Email verification code expired | 1. Send stale token to endpoint. | Verification rejected, error returned. | | Untested |
| **VFY-073** | Email Verification | Medium | Medium | Send dummy token to endpoint | 1. Send random string. | Verification fails with "Invalid verification token". | | Untested |
| **VFY-074** | Email Verification | Medium | High | Token already verified | 1. Resend verified token. | Action rejected or returns success with no database changes. | | Untested |
| **VFY-075** | Email Verification | Low | Medium | User logged in but unverified | 1. Check dashboard notification prompts. | Verification alert banner shown on top of the dashboard. | | Untested |
| **VFY-076** | Email Verification | Low | Low | Verification banner shown | 1. Click "Resend verification" link. | Prints new token in server console, banner confirms send. | | Untested |
| **VFY-077** | Email Verification | Medium | High | Click verify link from email simulation | 1. Trigger verification routing in browser. | System processes token, updates page to verified status. | | Untested |
| **VFY-078** | Email Verification | Low | Low | User verified | 1. Check if banner disappeared. | Banner is no longer visible on dashboard. | | Untested |
| **VFY-079** | Email Verification | Medium | Medium | Multiple resend requests | 1. Click resend button 10 times in row. | Rate limiter limits email delivery triggers. | | Untested |
| **VFY-080** | Email Verification | Medium | High | User email modified in settings | 1. Change email. | System auto-resets status to unverified, sends new token. | | Untested |
| **PRF-081** | Profile | High | High | User is logged in | 1. Navigate to /profile page. | Profile details load: name, email, phone, role, last login. | | Untested |
| **PRF-082** | Profile | High | High | User is on edit profile page | 1. Modify bio and phone. 2. Click Save. | Profile is saved, changes reflect on profile view. | | Untested |
| **PRF-083** | Profile | Medium | Medium | User is on edit profile page | 1. Change avatar URL. 2. Save. | New avatar renders correctly on top right nav. | | Untested |
| **PRF-084** | Profile | Medium | Medium | User is on edit profile page | 1. Enter invalid avatar URL. 2. Save. | Client-side validation blocks: "Invalid URL". | | Untested |
| **PRF-085** | Profile | High | High | User is on change password screen | 1. Enter correct old, valid new password. 2. Save. | Credentials updated successfully. | | Untested |
| **PRF-086** | Profile | High | High | User is on change password screen | 1. Enter incorrect old password. 2. Save. | "Incorrect old password" error displayed. | | Untested |
| **PRF-087** | Profile | Medium | Medium | User is on change password screen | 1. Enter new password under 8 chars. | Validation error blocks: "Must be 8 characters". | | Untested |
| **PRF-088** | Profile | Low | Low | User is on profile page | 1. Click edit profile. | Navigates to edit form cleanly. | | Untested |
| **PRF-089** | Profile | Low | Low | User is on edit profile page | 1. Click cancel button. | Returns to profile details without updating data. | | Untested |
| **PRF-090** | Profile | High | High | Edit profile POST payload intercepted | 1. Modify role_id parameter to 1. 2. Send. | Backend rejects parameter, role remains standard. | | Untested |
| **PRF-091** | Profile | Medium | Medium | User updates profile info | 1. Check database record. | `updated_at` column updates to current timestamp. | | Untested |
| **PRF-092** | Profile | Low | Low | Profile view | 1. Toggle dark mode theme. | Profile card colors transition seamlessly. | | Untested |
| **PRF-093** | Profile | Medium | Medium | Profile date of birth input | 1. Select date from calendar. | Value binds correctly in date formatting schema. | | Untested |
| **PRF-094** | Profile | Medium | Medium | Profile date of birth input | 1. Select future date. | Validation blocks selection (birth must be in past). | | Untested |
| **PRF-095** | Profile | Low | Low | Profile page | 1. Check last login timestamp accuracy. | Shows correct timestamp matching last login session. | | Untested |
| **PRF-096** | Profile | Medium | Medium | User is on profile page | 1. Edit bio with 1000+ characters. 2. Save. | Content truncated or handles large text safely. | | Untested |
| **PRF-097** | Profile | High | High | MFA toggle in settings | 1. Toggle MFA switch to ON. | System prompts user to save MFA setup. | | Untested |
| **PRF-098** | Profile | High | High | MFA switch set to ON | 1. System displays MFA secret key and recovery. | Key is generated and visible. | | Untested |
| **PRF-099** | Profile | High | High | MFA switch set to ON | 1. Enter "123456" passcode. 2. Confirm. | MFA status updated to True in database. | | Untested |
| **PRF-100** | Profile | High | High | MFA status is True in DB | 1. Toggle MFA switch to OFF. 2. Save. | Switch turned off, MFA disabled. | | Untested |
| **ORG-101** | Organization | High | Critical | User is logged in | 1. Navigate to /organization. | Organization dashboard loads listing current workspaces. | | Untested |
| **ORG-102** | Organization | High | High | User is on /organization | 1. Enter Name and Slug. 2. Click Create. | Organization created, user added as Manager. | | Untested |
| **ORG-103** | Organization | High | High | User is on /organization | 1. Enter duplicate Slug. 2. Click Create. | "Slug already taken" error is shown. | | Untested |
| **ORG-104** | Organization | Medium | Medium | User is on /organization | 1. Leave org Name empty. 2. Create. | Client validation blocks empty name. | | Untested |
| **ORG-105** | Organization | Medium | Medium | User is on /organization | 1. Leave Slug empty. 2. Create. | Client validation blocks empty slug. | | Untested |
| **ORG-106** | Organization | Medium | High | Select an organization | 1. Click organization card. | Main panel loads teams and members of that organization. | | Untested |
| **ORG-107** | Organization | High | High | Update organization details | 1. Change name and slug. 2. Click Update. | Info updated in DB and matches on refresh. | | Untested |
| **ORG-108** | Organization | High | High | Update org slug to duplicate slug | 1. Change slug to existing slug. 2. Save. | "Slug already taken" error displayed. | | Untested |
| **ORG-109** | Organization | Low | Low | Organization details | 1. Check layout on mobile screen. | Columns stack correctly, no layout overlap. | | Untested |
| **ORG-110** | Organization | High | Critical | Non-admin attempts to delete org | 1. Send DELETE request to org endpoint. | Request rejected with 403 Forbidden. | | Untested |
| **ORG-111** | Organization | High | Critical | Admin attempts to delete org | 1. Send DELETE request to org endpoint. | Organization deleted cleanly along with memberships. | | Untested |
| **ORG-112** | Organization | Medium | High | Invite new member to org | 1. Enter email of registered user. 2. Invite. | User receives notification or membership record is added. | | Untested |
| **ORG-113** | Organization | Medium | Medium | Invite unregistered user | 1. Enter unregistered email. 2. Invite. | System creates invite link or logs simulation. | | Untested |
| **ORG-114** | Organization | Medium | Medium | Invite empty email | 1. Click invite with blank email input. | Form validation blocks submission. | | Untested |
| **ORG-115** | Organization | Medium | High | Access organization settings | 1. Select organization. 2. Verify access to settings page. | Settings panel displays containing name, slug inputs. | | Untested |
| **ORG-116** | Organization | High | Critical | Access org from unauthorized account | 1. Try to fetch org details user is not a member of. | API returns 403 Forbidden. | | Untested |
| **ORG-117** | Organization | High | Critical | Global Admin accesses any org | 1. Query any org as Admin role. | Access allowed; returns correct org structure. | | Untested |
| **ORG-118** | Organization | Low | Low | List organizations | 1. Check list display formatting. | Names and slugs render clearly. | | Untested |
| **ORG-119** | Organization | Low | Low | Create organization form | 1. Click cancel. | Form fields clear, drawer collapses. | | Untested |
| **ORG-120** | Organization | Medium | Medium | Org Slug validation format | 1. Enter slug with spaces (e.g. "my slug"). | Spaces replaced by hyphens or validation blocks. | | Untested |
| **ORG-121** | Organization | Medium | Medium | Org Slug with uppercase | 1. Enter slug with uppercase characters. | Automatically converted to lowercase. | | Untested |
| **ORG-122** | Organization | Medium | High | Verify membership list | 1. Load organization. | Table lists correct member names, emails, and roles. | | Untested |
| **ORG-123** | Organization | Low | Low | Page navigation | 1. Navigate from Billing to Org. | Org page loads quickly with updated records. | | Untested |
| **ORG-124** | Organization | High | High | Remove member from organization | 1. Click remove member. | Membership record deleted; user loses access on refresh. | | Untested |
| **ORG-125** | Organization | High | High | Owner tries to leave organization | 1. Attempt to remove self. | Action blocked if owner is the sole administrator of org. | | Untested |
| **TEM-126** | Teams | High | High | Org is selected | 1. Click Team creation tab. 2. Enter Team name. 3. Save. | Team is added to list, saved in database. | | Untested |
| **TEM-127** | Teams | High | High | Team list | 1. View team list under Org. | Displays all engineering/QA teams for select org. | | Untested |
| **TEM-128** | Teams | Medium | Medium | Create team with empty name | 1. Submit blank name. | Form validation blocks submit. | | Untested |
| **TEM-129** | Teams | High | High | Update team name | 1. Change team name. 2. Click Save. | Team name updated in DB. | | Untested |
| **TEM-130** | Teams | High | High | Delete team | 1. Click Delete team. 2. Confirm. | Team deleted from database, lists refresh. | | Untested |
| **TEM-131** | Teams | High | Critical | Access team of different org | 1. Send GET request to /teams/{id} of another org. | API rejects with 403 Forbidden. | | Untested |
| **TEM-132** | Teams | Low | Low | Team card details | 1. Check ID truncation in UI. | ID is formatted nicely (e.g. UUID suffix). | | Untested |
| **TEM-133** | Teams | Low | Low | Team lists responsiveness | 1. View teams on mobile screen. | Cards wrap cleanly. | | Untested |
| **TEM-134** | Teams | Medium | Medium | Large character team name | 1. Enter 100+ character team name. | Database handles and truncates or validates size. | | Untested |
| **TEM-135** | Teams | Medium | High | Add member to team | 1. Select member. 2. Add to team. | Member assigned to team record successfully. | | Untested |
| **TEM-136** | Teams | Medium | High | Remove member from team | 1. Remove member. | Team assignment removed, member retains general org access. | | Untested |
| **TEM-137** | Teams | Low | Low | Check team stats | 1. Verify member count on card. | Matches actual team member count. | | Untested |
| **TEM-138** | Teams | High | High | Create duplicate team in same org | 1. Enter existing team name. 2. Save. | Permitted or validation warns (depends on spec). | | Untested |
| **TEM-139** | Teams | Low | Low | Click team settings | 1. Click settings icon. | Redirects/opens team configurations panel. | | Untested |
| **TEM-140** | Teams | High | Critical | Query team list as anonymous | 1. Send GET /teams without authorization header. | API returns 401 Unauthorized. | | Untested |
| **SUB-141** | Subscription | High | Critical | User is logged in | 1. Navigate to /billing. | Billing page loads displaying subscriptions and invoices. | | Untested |
| **SUB-142** | Subscription | High | High | Select plan | 1. Click "Simulate Renewal" on Enterprise Tier. | Sandbox transaction completes, period updates. | | Untested |
| **SUB-143** | Subscription | Medium | Medium | Pricing comparison | 1. Verify pricing tiers list correctly. | Enterprise ($999/mo) and Pro ($199/mo) cards render. | | Untested |
| **SUB-144** | Subscription | High | High | Cancel subscription | 1. Click Cancel subscription. | Subscription status updates to canceled in database. | | Untested |
| **SUB-145** | Subscription | High | Critical | Expired subscription logic | 1. Set subscription date to past. 2. Access app. | Access to premium SaaS features blocked, prompts billing. | | Untested |
| **SUB-146** | Subscription | High | High | Invoice lists verification | 1. Verify invoice records display correctly. | Invoice table matches DB billing history. | | Untested |
| **SUB-147** | Subscription | Low | Low | Invoice download | 1. Click download invoice. | Simulates invoice download (CSV/PDF) file. | | Untested |
| **SUB-148** | Subscription | Low | Medium | Subscription timeline | 1. Verify start/end date details. | Period aligns with current sandbox activation logic. | | Untested |
| **SUB-149** | Subscription | Low | Low | Mobile layout compatibility | 1. Scroll billing page on mobile screen. | Tables scroll horizontally, cards stack. | | Untested |
| **SUB-150** | Subscription | High | Critical | Sandbox payment processing | 1. Perform simulation with negative amount. | API rejects with validation error, no invoice added. | | Untested |
| **SUB-151** | Subscription | Medium | High | Multi-tenant billing separation | 1. Check invoices of Stark Industries. | Acme Corp users cannot view or fetch invoices. | | Untested |
| **SUB-152** | Subscription | Low | Low | Payment method details | 1. Check listed payment method (e.g. credit_card). | Renders standard card type correctly. | | Untested |
| **SUB-153** | Subscription | Medium | Medium | Simulating pending payment state | 1. Trigger pending status in DB. | UI displays "Pending Payment" status indicator. | | Untested |
| **SUB-154** | Subscription | Low | Low | Invoices sorting | 1. Click date column. | Invoices sort chronological. | | Untested |
| **SUB-155** | Subscription | High | Critical | Payment bypass attempt | 1. Try to directly insert invoice in DB via API. | Blocked by API authorization checks. | | Untested |
| **FIL-156** | File Vault | High | Critical | User is logged in | 1. Navigate to /files. | File Manager dashboard loads successfully. | | Untested |
| **FIL-157** | File Vault | High | High | File upload | 1. Choose valid file (e.g., test.pdf). 2. Click Upload. | File saved in storage folder, database record added. | | Untested |
| **FIL-158** | File Vault | High | High | Upload file exceeding 5MB | 1. Select 6MB PDF file. 2. Attempt upload. | "File exceeds maximum size of 5 MB" error shown. | | Untested |
| **FIL-159** | File Vault | High | High | Upload disallowed MIME type | 1. Select shell.exe file. 2. Attempt upload. | "MIME type is not allowed" validation error shown. | | Untested |
| **FIL-160** | File Vault | High | High | File download | 1. Click download icon on a file. | File streams successfully to client download folder. | | Untested |
| **FIL-161** | File Vault | High | High | Delete file | 1. Click Delete. 2. Confirm. | Physical file deleted from storage, record deleted. | | Untested |
| **FIL-162** | File Vault | Medium | High | Access control validation | 1. Request file download of another user. | Request rejected with 403 Forbidden. | | Untested |
| **FIL-163** | File Vault | Low | Low | File list display | 1. Verify columns: filename, size, mime, upload date. | Displays all fields accurately. | | Untested |
| **FIL-164** | File Vault | Low | Low | Drag and drop trigger | 1. Drag file onto drop area. | File is detected and staged for upload. | | Untested |
| **FIL-165** | File Vault | Low | Low | Responsive file list | 1. Inspect elements on mobile. | Row actions collapse into dropdown or list wrap. | | Untested |
| **FIL-166** | File Vault | Medium | Medium | Empty file upload | 1. Upload 0 byte file. | Blocked by validation or server returns size error. | | Untested |
| **FIL-167** | File Vault | Medium | High | SQL injection in filename | 1. Name file `'; DROP TABLE uploaded_files; --.pdf`. 2. Upload. | Filename sanitized, database remains unhurt. | | Untested |
| **FIL-168** | File Vault | Medium | High | Directory traversal in filename | 1. Name file `../../etc/passwd`. 2. Upload. | Filename resolved safely inside sandbox upload folder. | | Untested |
| **FIL-169** | File Vault | Low | Low | File preview | 1. Click on file. | Displays inline preview for images/PDFs/txt. | | Untested |
| **FIL-170** | File Vault | Low | Low | File preview for unsupported files | 1. Click on large JSON. | Displays text data or prompts download instead. | | Untested |
| **FIL-171** | File Vault | High | Critical | Anonymous file upload | 1. Send file POST without token. | API rejects with 401 Unauthorized. | | Untested |
| **FIL-172** | File Vault | High | Critical | Anonymous file download | 1. Request download without token. | API rejects with 401 Unauthorized. | | Untested |
| **FIL-173** | File Vault | Medium | High | Multi-tenant file isolation | 1. User of Stark Ind. requests Acme Corp org file. | API blocks access; returns 403 Forbidden. | | Untested |
| **FIL-174** | File Vault | Low | Low | File size rendering | 1. Check size formatting. | Formatted in KB/MB cleanly (e.g. "500 KB"). | | Untested |
| **FIL-175** | File Vault | Low | Low | Search files | 1. Enter filename in search. | Table filters dynamically. | | Untested |
| **AI-176** | AI Chat | High | High | User is logged in | 1. Navigate to /chat. | Chat dashboard loads with conversation thread sidebar. | | Untested |
| **AI-177** | AI Chat | High | High | Create new conversation | 1. Enter topic name. 2. Click Add. | Session created, loads blank chat panel. | | Untested |
| **AI-178** | AI Chat | High | High | Send security question | 1. Type "How to fix SQLi?". 2. Click Send. | Message saved, assistant returns secure coding advice. | | Untested |
| **AI-179** | AI Chat | Medium | Medium | Send generic text | 1. Type "Hello". 2. Send. | Assistant returns fallback greeting message. | | Untested |
| **AI-180** | AI Chat | Medium | Medium | Chat history loading | 1. Refresh chat page. | Saved sessions and messages load accurately. | | Untested |
| **AI-181** | AI Chat | Low | Low | Empty message submit | 1. Click send with empty input. | Form submission is blocked on client. | | Untested |
| **AI-182** | AI Chat | Low | Low | Mobile chat viewport | 1. View chat on iPhone dimensions. | Inputs and message logs adjust layout cleanly. | | Untested |
| **AI-183** | AI Chat | Medium | High | SQLi injection in chat input | 1. Send query statements as chat content. | System processes input strictly as text; no code triggers. | | Untested |
| **AI-184** | AI Chat | Medium | High | XSS injection in chat input | 1. Send `<script>alert(1)</script>`. | Text renders safely in chat bubbles without executing code. | | Untested |
| **AI-185** | AI Chat | Low | Low | Scroll behavior | 1. Send multiple messages. | Message container scrolls automatically to bottom. | | Untested |
| **AI-186** | AI Chat | Medium | High | Unauthorized session reading | 1. Request chat history of another user's session. | API returns 404 Not Found or 403. | | Untested |
| **AI-187** | AI Chat | Low | Low | Long chat message handling | 1. Send 500+ word message. | Renders bubble layout correctly without overflow. | | Untested |
| **AI-188** | AI Chat | Low | Low | Sidebar collapse | 1. Click sidebar toggle. | Sidebar collapses giving chat panel full width. | | Untested |
| **AI-189** | AI Chat | Medium | Medium | AI response speed | 1. Verify answer returns. | Answer returns in under 1 second. | | Untested |
| **AI-190** | AI Chat | Low | Low | Clear chat session | 1. Click clear/delete session. | Session and all messages removed from DB. | | Untested |
| **ADM-191** | Admin Panel | High | Critical | Admin logged in | 1. Navigate to /admin. | Admin panel dashboard loads with statistics cards. | | Untested |
| **ADM-192** | Admin Panel | High | Critical | Standard user logged in | 1. Attempt to load /admin. | Blocked, page shows 403 Forbidden error. | | Untested |
| **ADM-193** | Admin Panel | High | Critical | List user accounts | 1. Navigate to /admin/users. | Table lists users, email addresses, roles, statuses. | | Untested |
| **ADM-194** | Admin Panel | High | High | Create new user by admin | 1. Click Create User. 2. Enter valid details. 3. Save. | Account added in DB with correct password hash. | | Untested |
| **ADM-195** | Admin Panel | High | High | Edit user status | 1. Edit user account. 2. Uncheck active. 3. Save. | Account status set to inactive. User cannot login. | | Untested |
| **ADM-196** | Admin Panel | High | High | Delete user account | 1. Click Delete. 2. Confirm. | User account and profile purged from database. | | Untested |
| **ADM-197** | Admin Panel | Medium | Medium | Audit log inspection | 1. Navigate to audit logs subpage. | Lists application event log records correctly. | | Untested |
| **ADM-198** | Admin Panel | Medium | Medium | Database change log inspection | 1. Navigate to Database Audit Trail tab. | Lists DML mutations with JSONB changes. | | Untested |
| **ADM-199** | Admin Panel | Medium | High | Audit logs search | 1. Search logs for "LOGIN". | List filters, showing only login-related audits. | | Untested |
| **ADM-200** | Admin Panel | Low | Low | Audit logs pagination | 1. Click next page in audits table. | Next offset set loaded cleanly. | | Untested |
| **ADM-201** | Admin Panel | Low | Low | Export logs | 1. Click Export CSV. | File download initialized containing CSV data. | | Untested |
| **ADM-202** | Admin Panel | Medium | High | System password hash check in audits | 1. Inspect audit trail record of user update. | Password hashes are redacted from JSON states. | | Untested |
| **ADM-203** | Admin Panel | High | Critical | Admin deletes self | 1. Look for self-delete button. | Button disabled or hidden to prevent lockout. | | Untested |
| **ADM-204** | Admin Panel | Low | Low | Admin stats card check | 1. Compare total users to database size. | Counter shows correct count. | | Untested |
| **ADM-205** | Admin Panel | Low | Low | Responsive admin panel layout | 1. Load panel on mobile. | Menu shifts to burger, tables become scrollable. | | Untested |
| **ADM-206** | Admin Panel | Medium | High | Modify role parameters | 1. Edit user. 2. Select Admin role. 3. Save. | Role ID updated in database, user gains permissions. | | Untested |
| **ADM-207** | Admin Panel | High | Critical | Modify global permissions | 1. Edit role permissions matrix. 2. Save. | Role-permission mappings updated in junction table. | | Untested |
| **ADM-208** | Admin Panel | High | Critical | Access audit APIs anonymously | 1. Trigger /api/v1/audit/logs without tokens. | Request blocked with 401. | | Untested |
| **ADM-209** | Admin Panel | High | Critical | Access audit APIs as standard user | 1. Trigger /api/v1/audit/logs as User role. | Request blocked with 403. | | Untested |
| **ADM-210** | Admin Panel | Low | Low | Admin logs refresh | 1. Click refresh on audit trail table. | Logs reload with latest records. | | Untested |
| **SEC-211** | Security Lab | High | Critical | Security Lab toggled OFF | 1. Send request to /api/v1/vuln/sqli/user. | Returns 404 Not Found error. | | Untested |
| **SEC-212** | Security Lab | High | Critical | Security Lab toggled ON | 1. Navigate to /security-lab. | Security Lab controls active, lab status shows "Enabled". | | Untested |
| **SEC-213** | Security Lab | High | Critical | Test SQLi vulnerability | 1. Input `admin@local.test' OR '1'='1`. 2. Run. | Vulnerable API executes raw string, dumping database records. | | Untested |
| **SEC-214** | Security Lab | High | High | Test SQLi secure mitigation | 1. Inspect core dashboard profile request. | Blocked by ORM parameter binding, returns 404 on bad input. | | Untested |
| **SEC-215** | Security Lab | High | Critical | Test XSS vulnerability | 1. Load Reflected XSS link with alert script. | Script execute in browser sandbox. | | Untested |
| **SEC-216** | Security Lab | High | High | Test XSS secure mitigation | 1. Verify standard inputs in chat. | HTML tags are escaped and rendered as text. | | Untested |
| **SEC-217** | Security Lab | High | Critical | Test IDOR vulnerability | 1. GET /api/v1/vuln/access-control/user/{uuid}. | Returns account information of target user without auth. | | Untested |
| **SEC-218** | Security Lab | High | High | Test IDOR secure mitigation | 1. GET /api/v1/profile for another user's session. | Returns 403 Forbidden. | | Untested |
| **SEC-219** | Security Lab | High | High | Test cookie login vulnerability | 1. GET /api/v1/vuln/auth/cookie-login. | Cookie returned with HttpOnly=False, Secure=False. | | Untested |
| **SEC-220** | Security Lab | High | High | Test cookie login mitigation | 1. Check credentials storage. | App uses header-based JWT tokens; cookies not used for auth. | | Untested |
| **SEC-221** | Security Lab | High | High | Test weak reset token | 1. POST /api/v1/vuln/auth/weak-reset-request. | Token format leaked directly in JSON response. | | Untested |
| **SEC-222** | Security Lab | High | High | Test weak reset mitigation | 1. POST /forgot-password. | Token printed to console only, response contains generic info. | | Untested |
| **SEC-223** | Security Lab | High | Critical | Test debug configurations dump | 1. GET /api/v1/vuln/misconfig/debug-env. | PRIVATE_KEY and database URL printed in plain text. | | Untested |
| **SEC-224** | Security Lab | High | High | Test configuration mitigation | 1. Check production main routes. | Settings variables remain locked on server process. | | Untested |
| **SEC-225** | Security Lab | High | Critical | Test CSRF vulnerability | 1. Send cross-origin form request to vulnerable endpoint. | State-changing action executes without verification. | | Untested |
| **SEC-226** | Security Lab | Low | Low | Interactive lab guide | 1. Check mitigation code snippets. | Code formatting matches SQLAlchemy/FastAPI files. | | Untested |
| **SEC-227** | Security Lab | Low | Low | Security lab design | 1. Verify tabs display: SQLi, XSS, IDOR, Misconfig. | Navigation works and toggles active card sections. | | Untested |
| **SEC-228** | Security Lab | Low | Low | Visual warning signs | 1. Observe warnings for active lab. | High visibility alerts clearly visible on page load. | | Untested |
| **SEC-229** | Security Lab | Medium | High | Automated scan detection | 1. Run OWASP ZAP scan against vuln router. | ZAP successfully highlights critical alerts on vuln paths. | | Untested |
| **SEC-230** | Security Lab | Medium | High | Automated scan mitigation check | 1. Run OWASP ZAP scan against secure routers. | ZAP logs zero critical/medium alerts. | | Untested |
| **SYS-231** | System Integrity | High | Critical | Application startup | 1. Run Docker compose up. | Next.js and FastAPI start cleanly on designated ports. | | Untested |
| **SYS-232** | System Integrity | High | High | Nginx proxy check | 1. Query port 80 proxy routes. | Requests proxy to backend/frontend appropriately. | | Untested |
| **SYS-233** | System Integrity | Medium | Medium | Redis session check | 1. Start Redis container. | System connects to cache for rate limiting. | | Untested |
| **SYS-234** | System Integrity | High | Critical | Database migration setup | 1. Run alembic upgrade head. | Table structures matching 18 tables build successfully. | | Untested |
| **SYS-235** | System Integrity | Medium | High | Database seeding validation | 1. Seed database using script. | Mock organizations, users, billing logs insert with zero errors. | | Untested |
| **SYS-236** | System Integrity | Low | Low | System Logs checks | 1. Inspect server stderr/stdout. | Output is free of stack trace errors or unhandled warnings. | | Untested |
| **SYS-237** | System Integrity | Medium | Medium | API rate limits | 1. Send 101 requests in 1 minute. | Server blocks request 101 with 429 Too Many Requests. | | Untested |
| **SYS-238** | System Integrity | Medium | Medium | CORS header checks | 1. Options request to API. | Headers return correct Allowed-Origins matching localhost. | | Untested |
| **SYS-239** | System Integrity | High | Critical | Pytest execution | 1. Run pytest in backend. | Test cases run and return 100% pass rate. | | Untested |
| **SYS-240** | System Integrity | Low | Low | Docker health check | 1. Verify container statuses. | Containers show status "healthy". | | Untested |
| **SYS-241** | System Integrity | Medium | Medium | Environment variable load | 1. Omit SECRET_KEY from environment variables. | System falls back safely or fails startup with configuration error. | | Untested |
| **SYS-242** | System Integrity | Low | Low | Nginx static files compression | 1. Fetch main chunk. | Verify gzip compression is active in responses. | | Untested |
| **SYS-243** | System Integrity | Medium | Medium | SQL Query execution speed | 1. Query dashboard logs. | Response returns within 100ms. | | Untested |
| **SYS-244** | System Integrity | High | High | Token signature verification | 1. Attempt token forge. | Decode fails and request is rejected. | | Untested |
| **SYS-245** | System Integrity | Low | Low | System version info | 1. Check API metadata endpoint. | API responds with correct version ("1.0.0"). | | Untested |
| **SYS-246** | System Integrity | Medium | High | JWT payload alteration | 1. Alter role in access token payload. | Signature check fails on backend, rejects request. | | Untested |
| **SYS-247** | System Integrity | Medium | Medium | DB Connection pool timeout | 1. Leave connections open. | SQLAlchemy pool recycles connections safely without leaks. | | Untested |
| **SYS-248** | System Integrity | High | High | CSRF validation check | 1. Inspect Axios header attachments. | Header "Authorization" successfully appended on all secure routes. | | Untested |
| **SYS-249** | System Integrity | Medium | High | Alembic history track | 1. Check alembic migrations folder. | History matches database upgrades. | | Untested |
| **SYS-250** | System Integrity | Low | Low | GitHub actions setup | 1. Run dry build test pipeline. | GitHub Actions CI logs successful build. | | Untested |
