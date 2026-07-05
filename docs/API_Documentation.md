# REST API Specifications & Documentation

This document describes the endpoints, request payloads, and response structures for the Enterprise Secure SaaS Platform.

---

## 1. Authentication Endpoints

### POST /api/v1/auth/register
- **Description**: Registers a new user and returns JWT access/refresh tokens.
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@local.test",
    "password": "Password123!",
    "phone": "+15550102"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbG...",
    "refresh_token": "eyJhbG...",
    "token_type": "bearer",
    "mfa_required": false
  }
  ```

### POST /api/v1/auth/login
- **Description**: Authenticates user credentials. If MFA is active, returns `mfa_required: true`.
- **Request Body**:
  ```json
  {
    "email": "john@local.test",
    "password": "Password123!",
    "mfa_code": "123456"
  }
  ```

### POST /api/v1/auth/verify-email
- **Description**: Validates email verification token hashes.
- **Query Parameter**: `token` (string)

---

## 2. Organization & Multi-Tenancy

### GET /api/v1/organizations
- **Access**: Logged-in members.
- **Description**: Returns all organizations the current authenticated user belongs to.

### POST /api/v1/organizations
- **Request Body**:
  ```json
  {
    "name": "Stark Industries",
    "slug": "stark-ind"
  }
  ```

---

## 3. Secure File Vault

### POST /api/v1/files/upload
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (binary), `organization_id` (optional UUID)
- **Response (200 OK)**:
  ```json
  {
    "id": "e0a29a4a-...",
    "filename": "document.pdf",
    "file_size": 245030,
    "mime_type": "application/pdf",
    "storage_path": "user_id_245030_document.pdf",
    "created_at": "2026-07-05T09:00:00"
  }
  ```
