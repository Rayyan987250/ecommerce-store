# E-Commerce Frontend

Next.js storefront and admin frontend for the ecommerce project.

## Getting started

1. Install dependencies:
```bash
npm install
```
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. Point `NEXT_PUBLIC_API_URL` to the backend API base URL.
4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Frontend behavior

- Authentication uses HTTP-only cookies issued by the backend.
- The frontend automatically retries one request after a successful `/auth/refresh`.
- Guest cart items are merged with the server cart after sign-in instead of overwriting it.
- Admin product management expects the backend pagination limit of `100`.
- Supplier inquiry and newsletter forms are intentionally labeled as demo-only until real backend integrations are added.

## Deployment notes

- Prefer serving the frontend and backend on the same site or behind a reverse proxy so cookie-based auth works reliably.
- If you use different subdomains, keep them under the same registrable domain and align backend cookie settings.
- Images currently stay as local static assets; no remote image host is required.

## Commands

- `npm run dev` starts the development server
- `npm run lint` runs the frontend lint checks
- `npm run build` creates a production build

## Notes

- The current repo keeps image assets as-is, per the project brief.
- Placeholder UI has been relabeled where backend integrations are not implemented yet.
