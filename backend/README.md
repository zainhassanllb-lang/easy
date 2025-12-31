# EASY Backend (Node.js + Express + MongoDB)

This backend is built to match the **API paths used in your frontend** (`/api/...`) and replaces the mock `lib/database.ts` + Next.js route handlers with a real database.

## 1) Setup

```bash
cd easy_backend
cp .env.example .env
npm i
npm run dev
```

### Required `.env`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (your frontend URL, e.g. `http://localhost:3000`)

## 2) What gets seeded
- **Packages**: basic / standard / premium (30 days)
- **Admin user**: `ADMIN_EMAIL` + `ADMIN_PASSWORD` (defaults: `admin@easy.com / admin123`)

## 3) Routes (match your frontend)

### Auth
- `POST /api/register-client` (customer registration)
- `POST /api/login`
- `POST /api/logout`
- `GET /api/current-user`

### Worker
- `POST /api/register-worker` (supports `multipart/form-data` or JSON)
- `POST /api/update-worker-profile` (worker auth)
- `GET /api/check-worker-profile` (auth)
- `GET /api/workers?category&city&locality` (public)
- `GET /api/workers/:id` (public)
- `GET /api/workers/:id/reviews` (public) — list reviews for a worker
- `POST /api/workers/:id/reviews` (client auth) — submit a review (1-5 stars, text)
- `GET /api/workers-featured?limit=6` (public)

### Payments
- `POST /api/process-payment` (worker auth) — expects `paymentProof` as base64 dataURL
- `POST /api/purchase-package` (worker auth)

### Admin
- `POST /api/admin/verify-worker` (admin auth)
- `POST /api/admin/verify-payment` (admin auth)
- `GET /api/admin/unverified-workers` (admin auth)
- `GET /api/admin/payments-pending` (admin auth)

### Stats
- `POST /api/stats/increment`

## 4) Important frontend notes

Your frontend currently calls **Next.js server actions** for login/register (`lib/auth.ts`). With a separate backend, update:
- Login: call `POST /api/login`
- Customer register: call `POST /api/register-client`

Also, your worker registration form validates CNIC files but sends JSON and **does not upload files**. For real uploads, switch the request body to `FormData` and send fields:
- `profileImage`, `cnicFront`, `cnicBack` as files

## 5) Uploads
Files are stored locally in `uploads/` and served at:
- `/uploads/workers/...`
- `/uploads/payments/...`

> In production, replace this with S3/Cloudinary.
