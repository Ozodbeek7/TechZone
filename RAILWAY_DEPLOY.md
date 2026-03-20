# Railway Deployment Guide (Monorepo)

This repository should be deployed as **2 separate Railway services** from the same GitHub repo:

1. `techzone-backend` (root directory: `backend`)
2. `techzone-frontend` (root directory: `frontend`)

## 1) Backend Service (`backend`)

- Service root: `backend`
- Builder: Dockerfile (auto-detected)
- Start command: from `Procfile` (`gunicorn -w 4 -b 0.0.0.0:$PORT run:app`)

Set these Railway environment variables:

- `FLASK_ENV=production`
- `SECRET_KEY=<strong-random-secret>`
- `JWT_SECRET_KEY=<strong-random-secret>`
- `DATABASE_URL=<Railway Postgres connection URL>`
- `CORS_ORIGINS=<frontend-domain>`
- `REDIS_URL=<Railway Redis URL>` (optional but recommended)
- `CELERY_BROKER_URL=<redis-url>` (optional if running workers)
- `CELERY_RESULT_BACKEND=<redis-url>` (optional if running workers)
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD` (if email features are used)
- `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (if payments are used)

## 2) Frontend Service (`frontend`)

- Service root: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start:prod`

Set:

- `REACT_APP_API_URL=<backend-domain>/api`

## 3) Post-deploy checks

- Open backend URL and verify `/api/products` returns JSON.
- Open frontend URL and verify product list loads.
- Verify login/register requests hit backend domain (network tab).
- Confirm backend `CORS_ORIGINS` exactly includes frontend URL.

