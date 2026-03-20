# Railway Deployment Guide (Monorepo)

This repository should be deployed as **2 separate Railway services** from the same GitHub repo:

1. `techzone-backend` (root directory: `backend`)
2. `techzone-frontend` (root directory: `frontend`)

## Config as code

Each service includes a `railway.toml`. If Railway does not pick it up automatically, set **Settings → Config-as-code path** to:

- Backend: `/backend/railway.toml`
- Frontend: `/frontend/railway.toml`

Backend deploy runs `flask db upgrade` before start (**preDeployCommand**). Ensure Postgres is attached and `DATABASE_URL` is set so migrations can connect.

## 1) Backend Service (`backend`)

- Service root: `backend`
- Builder / start: see `backend/railway.toml` and `Dockerfile` (Gunicorn binds `0.0.0.0:$PORT`)

Set these Railway environment variables:

- `FLASK_APP=run.py`
- `FLASK_ENV=production`
- `SECRET_KEY=<strong-random-secret>`
- `JWT_SECRET_KEY=<strong-random-secret>`
- `DATABASE_URL=<Railway Postgres connection URL>`
- `CORS_ORIGINS=<frontend-domain>`
- `REDIS_URL=<Railway Redis URL>` (optional but recommended)
- `CELERY_BROKER_URL=<redis-url>` (optional if running workers)
- `CELERY_RESULT_BACKEND=<redis-url>` (optional if running workers)
- `ELASTICSEARCH_URL` — omit on Railway unless you run Elasticsearch; search falls back to SQL
- `REDIS_URL` — optional; without it, defaults target localhost (add Railway Redis or a valid URL for cache/Celery)
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD` (if email features are used)
- `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (if payments are used)

## 2) Frontend Service (`frontend`)

- Service root: `frontend`
- Build: `frontend/Dockerfile` (multi-stage: `npm run build` + `serve` on `0.0.0.0:$PORT`)

Set:

- `REACT_APP_API_URL=<backend-public-url>` — you may omit `https://` (e.g. `my-backend.up.railway.app`); the frontend now prepends `https://` so API calls do not hit the static host as a bogus path like `/my-backend.../categories`.

**Critical:** Create React App bakes `REACT_APP_*` at **build** time. Add `REACT_APP_API_URL` as a service variable and include it in the **Docker build** (Railway UI: variable → “Add to Dockerfile” / build-time), then redeploy so the image rebuilds. The `Dockerfile` declares `ARG REACT_APP_API_URL` for this. Example value: `https://your-backend-service.up.railway.app`. If it is missing at build time, the SPA falls back to relative `/api` on the frontend host — API calls will fail.

Backend `CORS_ORIGINS` must match the exact frontend URL (scheme + host, no trailing slash), comma-separated if multiple.

## 3) Post-deploy checks

- Open backend URL and verify `GET /health` returns `{"status":"ok"}`.
- Open backend URL and verify `/api/products` returns JSON with an `items` array (may be empty until you add data).
- **Empty catalog:** run `flask seed` once (Railway: open a shell on the backend service, `cd` to app dir if needed, `flask seed`). This creates categories, brands, **~19 demo products with Unsplash images**, admin `admin@techzone.com` / `Admin123!`, and customer `customer@techzone.com` / `Customer123!`. Catalog products are skipped if the `products` table is already non-empty.
- Open frontend URL and verify product list loads.
- Verify login/register requests hit backend domain (network tab).
- Confirm backend `CORS_ORIGINS` exactly includes frontend URL.

