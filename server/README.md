# NexaCode Labs Authentication Backend

Node.js, Express and MySQL backend for the NexaCode Labs authentication system.

## Prerequisites

- Node.js 18 or newer
- MySQL running locally
- The `vertex` database with the authentication tables from Loop 02
- SMTP credentials, or `DEV_LOG_EMAIL_CONTENT=true` for local-only email logging

This backend assumes these tables already exist:

- `users`
- `email_verification_tokens`
- `password_reset_otps`
- `refresh_tokens`
- `login_attempts`
- `audit_logs`

`database/schema.sql` was not present in this repository when this backend was created, so the code targets the Loop 02 schema contract.

## Installation

```bash
cd server
npm install
```

## Environment Setup

Copy the example file and fill in secrets:

```bash
cp .env.example .env
```

Required secrets must be strong random values:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `PASSWORD_RESET_SECRET`

For local development without SMTP, set:

```env
DEV_LOG_EMAIL_CONTENT=true
```

Do not enable the development email fallback in production.

## Database Setup

Create the `vertex` database and auth tables before starting the server.

Run the schema first, then the development seed if needed:

```text
schema.sql
seed.sql
```

The reset script from Loop 02 is destructive and should only be used locally when you want to drop the auth tables and recreate them.

## Development

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/api/health
```

## Production

```bash
npm start
```

Use production environment variables and real SMTP credentials. Keep cookies secure in production:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

## Routes

Auth:

- `POST /api/auth/register`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-reset-otp`
- `POST /api/auth/resend-reset-otp`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

Admin:

- `GET /api/admin/users?page=1&limit=20`

Health:

- `GET /api/health`

## Cookie Behavior

Login and refresh set the refresh token in an HTTP-only cookie named by `COOKIE_NAME`.

The access token is returned in the JSON response and should be sent as:

```text
Authorization: Bearer <accessToken>
```

Local development can use `COOKIE_SECURE=false`. Production should use secure cookies.

## Security Behavior

- Public registration always creates `USER` accounts.
- Public requests cannot assign `ADMIN`.
- Passwords are hashed with bcrypt.
- Email verification tokens, refresh tokens and OTPs are stored only as hashes.
- OTP hashes use keyed HMAC-SHA256.
- Refresh tokens are rotated and old tokens are revoked.
- Failed logins are recorded.
- Accounts lock for 15 minutes after five consecutive failed login attempts.
- Forgot-password responses are generic to reduce user enumeration.
- Request bodies are validated with Zod and unknown fields are rejected.
- SQL uses mysql2 prepared statements.
- Helmet, CORS and rate limiting are enabled.
- Stack traces are hidden in production responses.

Never store passwords, tokens or OTP codes in audit metadata.

## Local Email Testing

If SMTP is configured, email is sent through Nodemailer.

If SMTP is not configured and `DEV_LOG_EMAIL_CONTENT=true`, email content is printed to the server console with a clear development-only label.

If neither SMTP nor the development fallback is configured, email-dependent routes return a service configuration error instead of pretending that email was sent.

## Postman Testing Prerequisites

Before testing protected routes:

1. Start MySQL.
2. Run the Loop 02 schema and seed.
3. Configure `.env`.
4. Start the server.
5. Register or use the seeded admin account.
6. Keep cookies enabled in Postman for refresh/logout routes.
7. Send the access token in the `Authorization` header for `/api/auth/me` and `/api/admin/users`.

## Tests

```bash
npm test
```

Current tests cover critical crypto helpers used for token and OTP hashing.
