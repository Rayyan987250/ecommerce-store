# Ecommerce Fullstack Store

A full-stack ecommerce web application built with **Next.js**, **Express**, **TypeScript**, and **PostgreSQL (Neon)**. Features a complete shopping experience with product browsing, cart management, order placement, user authentication, and an admin dashboard for product management.

**Live Demo:**
- Frontend: [https://ecommerce-store-frontend-uzfs.onrender.com](https://ecommerce-store-frontend-uzfs.onrender.com)
- Backend API: [https://ecommerce-store-90ng.onrender.com](https://ecommerce-store-90ng.onrender.com)
- Health Check: [https://ecommerce-store-90ng.onrender.com/health](https://ecommerce-store-90ng.onrender.com/health)

---

## Features

### Customer
- Browse products with search, filter, and pagination
- Product detail pages with related item recommendations
- Shopping cart (guest + authenticated, with merge on login)
- Place and view orders
- User registration and login
- Password reset flow
- Multi-currency display with live exchange rates
- Fully responsive design — mobile, tablet, and desktop

### Admin
- Admin dashboard with metrics
- Create, update, and delete products
- Protected admin-only routes

### Security
- HTTP-only cookie authentication (access + refresh tokens)
- CSRF protection on all mutating endpoints
- Rate limiting on all routes
- Zod schema validation on all inputs
- Helmet-style security headers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Server State | TanStack React Query |
| Backend | Express 5, TypeScript 6, Node.js 20+ |
| Database | PostgreSQL via Neon (serverless) |
| Auth | JWT (access + refresh), HTTP-only cookies |
| Validation | Zod |
| Deployment | Render (two Web Services) |

---

## Project Structure

```
ecommerce-fullstack-design/
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/        # Auth, error, rate-limit, validation
│   │   ├── routes/           # Express routers
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── utils/            # Auth tokens, cart utils
│   │   └── index.ts          # App entry point
│   ├── tests/                # Vitest unit tests
│   ├── .env.example
│   └── package.json
├── frontend/                 # Next.js app
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # UI components by feature
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer + React Query
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── .env.example
│   └── package.json
├── render.yaml               # Render deployment config
└── .gitignore
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/Rayyan987250/ecommerce-store.git
cd ecommerce-store
```

### 2. Setup the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in your values (see [Environment Variables](#environment-variables) below).

```bash
npm run dev
```

API runs on `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | `development` / `production` |
| `PORT` | No | API port (default: `5000`) |
| `NEON_DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `DATABASE_URL` | Yes | Fallback PostgreSQL connection string |
| `FRONTEND_URL` | Yes | Comma-separated CORS allowed origins |
| `JWT_ACCESS_SECRET` | Yes | Access token secret (32+ characters) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret (32+ characters) |
| `JWT_ACCESS_EXPIRE` | No | Access token TTL (default: `15m`) |
| `JWT_REFRESH_EXPIRE` | No | Refresh token TTL (default: `7d`) |
| `COOKIE_SAME_SITE` | No | `lax` (dev) / `none` (cross-domain prod) |
| `COOKIE_SECURE` | No | `false` (dev) / `true` (prod) |
| `ENABLE_DEMO_SEED` | No | `true` to seed demo data on first run |
| `SEED_ADMIN_EMAIL` | Seeding | Admin account email |
| `SEED_ADMIN_PASSWORD` | Seeding | Admin account password |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

---

## API Documentation

Base URL: `https://ecommerce-store-90ng.onrender.com`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check |
| `GET` | `/api/auth/csrf-token` | None | Get CSRF token |
| `POST` | `/api/auth/register` | None | Register new user |
| `POST` | `/api/auth/login` | None | Login |
| `POST` | `/api/auth/logout` | Cookie | Logout |
| `POST` | `/api/auth/refresh` | Cookie | Refresh access token |
| `GET` | `/api/auth/profile` | Cookie | Get current user |
| `POST` | `/api/auth/reset-password/request` | None | Request password reset |
| `POST` | `/api/auth/reset-password/confirm` | None | Confirm password reset |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | None | List products (paginated, filterable) |
| `GET` | `/api/products/:id` | None | Get single product |
| `GET` | `/api/products/:id/related` | None | Get related products |
| `GET` | `/api/products/recommended/list` | None | Get recommended products |
| `POST` | `/api/products` | Admin + CSRF | Create product |
| `PUT` | `/api/products/:id` | Admin + CSRF | Update product |
| `DELETE` | `/api/products/:id` | Admin + CSRF | Delete product |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Cookie | Get cart |
| `POST` | `/api/cart/items` | Cookie + CSRF | Add item |
| `PUT` | `/api/cart/items/:id` | Cookie + CSRF | Update item quantity |
| `DELETE` | `/api/cart/items/:id` | Cookie + CSRF | Remove item |
| `DELETE` | `/api/cart` | Cookie + CSRF | Clear cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/orders` | Cookie | Get user orders |
| `POST` | `/api/orders` | Cookie + CSRF | Place order |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@demo.com` | `ChangeThisToAStrongPassword!2026` |

> The admin account is created automatically on first deploy when `ENABLE_DEMO_SEED=true`.

---

## Authentication

Authentication uses **HTTP-only cookies** with a dual-token strategy:

- **Access token** (short-lived, 15 min) — sent as an HTTP-only cookie on every request
- **Refresh token** (long-lived, 7 days) — used automatically to obtain a new access token
- **CSRF token** — required on all state-changing requests to prevent CSRF attacks
- The frontend automatically retries a failed request once after a successful token refresh

---

## Responsive Design

The application is fully responsive across all breakpoints:
- Mobile (< 640px) — stacked layout, hamburger nav
- Tablet (640px–1024px) — adaptive grid
- Desktop (1024px+) — full multi-column layout

Built with Tailwind CSS utility classes throughout — no custom media query overrides needed.

---

## Deployment

Deployed on [Render](https://render.com) using two Web Services defined in `render.yaml`:

| Service | Root Dir | Build | Start |
|---|---|---|---|
| Backend | `backend` | `npm install --include=dev && npm run build` | `node dist/index.js` |
| Frontend | `frontend` | `npm install --include=dev && npm run build` | `npm start` |

Both services run in the `Ohio (US East)` region and use Node.js 20+.
