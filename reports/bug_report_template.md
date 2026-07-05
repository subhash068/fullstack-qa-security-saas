# QA Bug Report Template

Use this standard markdown template to log bugs found during manual testing.

---

## [BUG-ID] Short, Descriptive Bug Summary

### 1. General Metadata
- **Module**: [e.g., Subscriptions / File Upload / Login]
- **Environment**: [e.g., Local development - Chrome v124 / Windows 11]
- **Priority**: [High / Medium / Low]
- **Severity**: [Critical / High / Medium / Low]
- **Reporter**: [Your Name / QA Lead]
- **Assigned To**: [Developer Name / Tech Lead]

### 2. Preconditions
- State any account types, roles, or configurations required before starting the test steps.
- *Example*: User is logged in as a "Standard User" with role_id=3.

### 3. Steps to Reproduce
1. Navigate to `[URL Path]`
2. Enter `[Value]` in the `[Input field]`
3. Click on the `[Button]`
4. Observe the interface response.

### 4. Expected Result
- A clear description of what the system *should* do.
- *Example*: System should throw a validation warning and prevent the form from submitting.

### 5. Actual Result
- A clear description of what the system *actually* did.
- *Example*: System successfully submitted the form and updated the database with raw unescaped values.

### 6. Screenshots & API Logs
- Paste any terminal stack traces, console warnings, or screenshots demonstrating the bug.
- *Example*:
```json
{
  "detail": "Internal Server Error",
  "status_code": 500
}
```
---
