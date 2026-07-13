# NexaCode Labs Auth Postman Testing

This folder contains a Postman collection and local environment for testing the NexaCode Labs authentication API.

## Files

- `NexaCode-Labs-Auth.postman_collection.json`
- `NexaCode-Labs-Local.postman_environment.json`

No real secrets, credentials, raw tokens or production values are stored in these files.

## Before Importing

Start MySQL and make sure the local database is available:

```text
Database: vertex
```

Run the database scripts in this order:

```text
schema.sql
seed.sql
```

Then start the backend:

```bash
cd server
npm install
npm run dev
```

Confirm the health endpoint:

```text
GET http://localhost:5000/api/health
```

Expected success body:

```json
{
  "success": true,
  "message": "NexaCode Labs API is healthy.",
  "data": {
    "service": "nexacode-labs-server",
    "environment": "development",
    "database": "connected"
  }
}
```

## Import Into Postman

1. Open Postman.
2. Select **Import**.
3. Import `NexaCode-Labs-Auth.postman_collection.json`.
4. Import `NexaCode-Labs-Local.postman_environment.json`.
5. Select the **NexaCode Labs Local** environment before running requests.

## Required Environment Values

Set these manually before testing:

```text
testUserEmail
testUserPassword
adminPassword
```

Recommended local test values:

```text
testUserEmail=test.user+local@nexacodelabs.local
testUserPassword=Password123!
adminEmail=admin@nexacodelabs.local
```

`adminPassword` must match the password represented by the development admin hash in your local `seed.sql`.

The collection stores these automatically when successful responses are received:

```text
accessToken
adminAccessToken
resetToken
```

Set these manually when needed:

```text
verificationToken
otp
```

## Getting Email Verification Tokens

During local development, enable the email fallback in `server/.env`:

```env
DEV_LOG_EMAIL_CONTENT=true
```

When registration or resend-verification runs, the backend prints a development-only email payload to the terminal. Copy the verification token from the verification link and paste it into the Postman environment variable:

```text
verificationToken
```

If you do not see an email payload, check SMTP settings or confirm `DEV_LOG_EMAIL_CONTENT=true`.

## Getting Password Reset OTPs

Run:

```text
Password Reset -> Forgot Password
```

With `DEV_LOG_EMAIL_CONTENT=true`, the backend prints the OTP email content to the terminal. Copy the six-digit code into:

```text
otp
```

Then run:

```text
Password Reset -> Verify Valid OTP
```

The request test saves `resetToken` automatically.

## Postman Cookies and Refresh Tokens

The backend stores the refresh token in an HTTP-only cookie. Postman preserves cookies automatically per domain.

Useful requests:

- `Login and Tokens -> Valid Login` sets the refresh cookie.
- `Login and Tokens -> Refresh Token` uses the refresh cookie.
- `Login and Tokens -> Logout` clears the refresh cookie.
- `Login and Tokens -> Refresh Without Cookie` requires manually clearing Postman cookies for `localhost`.

To inspect or clear cookies, use Postman's cookie manager near the request URL bar.

## Recommended Execution Order

1. `Health -> GET Health`
2. `Registration -> Register Valid User`
3. Obtain `verificationToken` from the development email log.
4. `Email Verification -> Verify Email Successfully`
5. `Login and Tokens -> Valid Login`
6. `Authenticated User -> Get Current Profile`
7. `Password Reset -> Forgot Password`
8. Obtain `otp` from the development email log.
9. `Password Reset -> Verify Valid OTP`
10. `Password Reset -> Reset Password Valid Token`
11. `Password Reset -> Login Using New Password`
12. `Admin -> Admin Login`
13. `Admin -> List Users as ADMIN`
14. Run negative/security tests selectively.

## Requests That Intentionally Affect Account State

These can lock accounts or consume security counters:

- `Login and Tokens -> Repeated Failed Login Attempts`
- `Login and Tokens -> Locked Account Behavior`
- `Password Reset -> Exceed OTP Attempt Limit`
- `Password Reset -> Resend Before Cooldown`
- `Password Reset -> Exceed Resend Limit`
- `Negative and Security Tests -> Rate-limit Testing Guidance`

Use a disposable test user for these requests.

## Expected Status Codes

Typical success responses:

- `200 OK`: health, login, refresh, logout, verification, password reset operations
- `201 Created`: successful registration

Typical error responses:

- `400 Bad Request`: validation errors, invalid token or OTP, unexpected fields
- `401 Unauthorized`: missing or invalid access/refresh token, invalid credentials
- `403 Forbidden`: authenticated user lacks ADMIN role
- `409 Conflict`: duplicate registration email
- `423 Locked`: account locked after repeated failed login attempts
- `429 Too Many Requests`: rate limit exceeded

All JSON responses use:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

or:

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": []
}
```

## Beekeeper Studio Checks

After running requests, inspect:

```sql
SELECT id, email, role, status, is_email_verified, failed_login_attempts, locked_until
FROM users
ORDER BY created_at DESC;

SELECT user_id, expires_at, used_at, created_at
FROM email_verification_tokens
ORDER BY created_at DESC;

SELECT user_id, expires_at, used_at, attempt_count, resend_count, last_sent_at
FROM password_reset_otps
ORDER BY created_at DESC;

SELECT user_id, expires_at, revoked_at, replaced_by_token_id, created_at
FROM refresh_tokens
ORDER BY created_at DESC;

SELECT email_attempted, was_successful, failure_reason, created_at
FROM login_attempts
ORDER BY created_at DESC;

SELECT user_id, action, entity_type, entity_id, created_at
FROM audit_logs
ORDER BY created_at DESC;
```

Never expect to see raw passwords, raw OTPs or raw tokens in the database. Only hashes should be stored.

## Resetting Local Test Data

For a full local reset, run the destructive reset script from Loop 02 only in development:

```text
reset.sql
schema.sql
seed.sql
```

If you only need to unlock a test account:

```sql
UPDATE users
SET failed_login_attempts = 0,
    locked_until = NULL
WHERE email = 'test.user+local@nexacodelabs.local';
```

## CORS Notes

Postman does not enforce browser CORS. Use the collection's CORS guidance request for header inspection, but verify browser CORS through the React frontend or browser developer tools using the `CLIENT_URL` origin.

## Manual Test Values

Some requests require manual values:

- `verificationToken`: copy from development email log.
- `otp`: copy from development email log.
- Expired access token: paste a real expired JWT if you need to test expiration.
- Old access token after password change: save an access token before reset, then paste it into that request after reset.
