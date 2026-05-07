# E-Commerce Backend API (Neon Postgres)

Express + TypeScript backend using Neon PostgreSQL.

## One-time setup

1. Install dependencies:
```bash
npm install
```
2. Set only this required variable in `backend/.env`:
```bash
NEON_DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```
3. Start server:
```bash
npm run dev
```

On startup, the app automatically:
- connects to Neon
- creates required tables if missing
- creates a demo admin user if missing
- seeds starter products if products table is empty

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEON_DATABASE_URL` | Yes | Neon connection URL |
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | No | `development` / `production` / `test` |
| `FRONTEND_URL` | No | Comma-separated allowed origins for CORS |
| `JWT_SECRET` | No | Fallback JWT secret |
| `JWT_ACCESS_SECRET` | No | Access token secret |
| `JWT_REFRESH_SECRET` | No | Refresh token secret |
| `JWT_ACCESS_EXPIRE` | No | Access token expiry (`15m`) |
| `JWT_REFRESH_EXPIRE` | No | Refresh token expiry (`7d`) |
| `SEED_ADMIN_EMAIL` | No | Initial admin email |
| `SEED_ADMIN_PASSWORD` | No | Initial admin password |

## Available endpoints

- `GET /health`
- `GET /api/auth/csrf-token`
- `POST /api/auth/register`
- `POST /api/auth/login`
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
