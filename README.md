# ClipSphere Backend - Phase 1

Foundational Express + MongoDB backend for ClipSphere.

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- MongoDB running locally (or reachable via `MONGODB_URI`)

## Setup and Run

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env` if needed.
   - Ensure `.env` has:
     - `PORT=5000`
     - `MONGODB_URI=mongodb://localhost:27017/clipsphere`
     - `JWT_SECRET=<your-secure-secret>`

3. Start the API:

```bash
npm run dev
```

4. Verify server heartbeat:
   - `GET http://localhost:5000/health`

5. Open Swagger docs:
   - `http://localhost:5000/api-docs`

## Seed Data

Run the seed script to reset and populate test data:

```bash
npm run seed
```

This creates:
- 1 admin user
- 3 standard users
- 6 videos
- reviews and follower relationships for social + moderation + admin stats testing

Seeded IDs are exported to:
- `postman/seed-ids.json`

## Postman QA Checklist (Strict Order)

Use:
- Collection: `postman/ClipSphere-Phase1.postman_collection.json`
- Environment: `postman/ClipSphere-Local.postman_environment.json`

### 1) Seed first
- Run `npm run seed`
- Open `postman/seed-ids.json`
- Copy IDs into Postman environment:
  - `targetUserId`
  - `deactivateUserId`

### 2) Login and capture tokens
- Run `POST /api/v1/auth/login (User)` (sets `jwt_token`)
- Run `POST /api/v1/auth/login (Admin)` (sets `admin_jwt_token`)

### 3) Validate admin stats
- Run `GET /api/v1/admin/stats`
- Expect `200` and totals + activity payload

### 4) Validate moderation queue
- Run `GET /api/v1/admin/moderation`
- Expect `200` and flagged/low-rated content data

## Optional Full Endpoint Smoke Test

After the strict checklist above, run remaining requests in collection order:
- System -> Auth -> Users -> Social Graph -> Videos and Reviews -> Admin

Each request includes basic Postman tests for status validation.
