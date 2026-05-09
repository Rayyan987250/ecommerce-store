# E-Commerce Backend API

Express + TypeScript backend using PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```
2. Copy `backend/.env.example` to `backend/.env`.
3. Fill in the database URL and strong JWT secrets.
4. Start the API:
```bash
npm run dev
```

## Security notes

- The server now requires strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values at startup.
- Password reset requests return the same response for existing and unknown emails.
- Reset links are only logged when `ENABLE_PASSWORD_RESET_DEBUG_LOG=true` in non-production development.
- The admin/system status endpoint is protected by authentication and admin authorization.
- Demo seed data is disabled by default and only runs once per database when `ENABLE_DEMO_SEED=true`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEON_DATABASE_URL` or `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | No | `development` / `production` / `test` |
| `FRONTEND_URL` | No | Comma-separated allowed origins for CORS |
| `JWT_ACCESS_SECRET` | Yes | Access token secret, at least 32 characters |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret, at least 32 characters |
| `JWT_ACCESS_EXPIRE` | No | Access token expiry (`15m`) |
| `JWT_REFRESH_EXPIRE` | No | Refresh token expiry (`7d`) |
| `COOKIE_SAME_SITE` | No | `strict`, `lax`, or `none` |
| `COOKIE_SECURE` | No | Force secure cookies (`true` / `false`) |
| `ENABLE_DEMO_SEED` | No | Enables one-time demo seeding when `true` |
| `SEED_ADMIN_EMAIL` | When seeding | Initial admin email for demo seed |
| `SEED_ADMIN_PASSWORD` | When seeding | Initial admin password for demo seed |
| `ENABLE_PASSWORD_RESET_DEBUG_LOG` | No | Logs reset links in local development only |

## Available endpoints

- `GET /health`
- `GET /api/auth/csrf-token`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password/request`
- `POST /api/auth/reset-password/confirm`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `GET /api/products`
- `GET /api/products/recommended/list`
- `GET /api/products/:id/related`
- `GET /api/products/:id`
- `POST /api/products` (admin + CSRF)
- `PUT /api/products/:id` (admin + CSRF)
- `DELETE /api/products/:id` (admin + CSRF)
