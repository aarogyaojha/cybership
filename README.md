# RateLane

A production-ready shipping rate comparison platform with secure authentication, carrier integrations, rate history, and an admin-capable dashboard.

## Overview

RateLane helps shippers compare carrier rates, track pricing history, and manage users securely. The repository is a full-stack TypeScript monorepo with:

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** Next.js + Tailwind CSS + shadcn/ui
- **Security:** JWT auth, Helmet, CORS, rate limiting

## Features

- 🔐 JWT-based authentication
- 👤 Role-based user and admin access
- 🚚 Real-time carrier rate comparison
- 📈 Rate history persistence for each user
- 🛡️ API protection with CORS, Helmet, and throttling
- 📄 Swagger/OpenAPI documentation
- 📱 Responsive dashboard UI

## Tech Stack

- NestJS 11
- Prisma ORM
- PostgreSQL
- Next.js 14
- Tailwind CSS
- shadcn/ui
- Jest

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Docker & Docker Compose

### Setup

```bash
git clone https://github.com/aarogyaojha/ratelane.git
cd ratelane
```

```bash
cd backend
npm install
cd ../frontend
npm install
```

### Environment

Copy the example env files and set values for your environment.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` and `frontend/.env.local` with your local or production settings.

### Run the database

```bash
docker-compose up -d
```

### Migrate the database

```bash
cd backend
npx prisma migrate dev --name init
```

### Start development servers

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd ../frontend
npm run dev
```

Open `http://localhost:3001`

## Environment Variables

### Backend

Required variables in `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ratelane"
JWT_SECRET="a_long_random_secret_min_32_chars"
COOKIE_SECRET="a_long_random_cookie_secret_min_32_chars"
ALLOWED_ORIGINS="http://localhost:3001"
BACKEND_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
UPS_CLIENT_ID="your_ups_client_id"
UPS_CLIENT_SECRET="your_ups_client_secret"
UPS_ACCOUNT_NUMBER="your_ups_account_number"
UPS_BASE_URL="https://www.ups.com"
```

### Frontend

Required variables in `frontend/.env.local`:

```env
BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## API Reference

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Rates

- `POST /rates`
- `GET /rates/history`

### Admin

Admin endpoints require an admin role and include user management, audit logs, and rate limit analytics.

## Security and Production Readiness

This project is structured for production use with:

- enforced environment validation
- strong JWT secret requirements
- cookie signing with secure flags
- CORS origin whitelisting
- Helmet security headers
- request throttling
- validation and error filtering

### Production recommendations

- Use HTTPS
- Store secrets securely (Vault, environment management)
- Restrict `ALLOWED_ORIGINS`
- Run behind a reverse proxy
- Use a managed PostgreSQL instance

## Project Structure

```text
ratelane/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── carriers/
│   │   ├── rates/
│   │   ├── common/
│   │   └── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
└── docker-compose.yml
```

## Testing

```bash
cd backend
npm run test
npm run test:e2e
```

## Build

```bash
cd backend
npm run build
cd ../frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a topic branch
3. Open a pull request with a clear summary

## License

MIT

- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (min 32 characters)
- Configure `DATABASE_URL` with production PostgreSQL
- Set `ALLOWED_ORIGINS` to your domain
- Update carrier API keys (UPS, FedEx, etc.)

## Performance Considerations

- **Database Indexing** - Audit logs indexed on userId and createdAt
- **JWT Caching** - User tokens cached in localStorage
- **Rate Limiting** - Prevents API abuse and reduces server load
- **Pagination** - Admin endpoints support ?page and ?limit parameters

## Error Handling

- **400 Bad Request** - Invalid input or validation failure
- **401 Unauthorized** - Missing or invalid JWT token
- **403 Forbidden** - Insufficient permissions (admin required)
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server-side error (logged with request ID)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and branch strategy.

## License

[INSERT LICENSE HERE]

## Support

For issues, questions, or feature requests, please open a GitHub issue.

---

**Built with ❤️ for shipping logistics**

**Structured error responses** — carrier errors return a typed `CarrierError` shape with machine-readable codes and HTTP status mapping. No raw carrier error strings leaking to the client.

**Strict input validation** — `class-validator` on the backend, `zod` on the frontend. Invalid payloads are rejected before they ever hit a carrier network.

---

## Stack

| Layer    | Technology                                |
| -------- | ----------------------------------------- |
| Backend  | NestJS, TypeScript, Prisma ORM            |
| Database | PostgreSQL (Dockerized)                   |
| Auth     | OAuth 2.0 (UPS), HttpOnly session cookies |
| Frontend | Next.js 15, Shadcn/UI, Tailwind CSS       |
| Docs     | Swagger / OpenAPI at `/api/docs`          |
| Carrier  | UPS Rating API v2409                      |

---

## Getting started

**Prerequisites:** Node.js 18+, Docker, UPS developer credentials ([register here](https://developer.ups.com))

```bash
git clone https://github.com/aarogyaojha/ratelane.git
cd ratelane

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Environment variables
cp .env.example .env
```

| Variable             | Description                        |
| -------------------- | ---------------------------------- |
| `UPS_CLIENT_ID`      | UPS OAuth client ID                |
| `UPS_CLIENT_SECRET`  | UPS OAuth client secret            |
| `UPS_BASE_URL`       | UPS API base URL                   |
| `UPS_ACCOUNT_NUMBER` | UPS shipper account number         |
| `DATABASE_URL`       | PostgreSQL connection string       |
| `COOKIE_SECRET`      | Secret for signing session cookies |

```bash
# Start database
docker-compose up -d

# Run migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate

# Start services
cd backend && npm run start:dev
cd ../frontend && npm run dev
```

---

## API

```
POST /rates          — submit a rate request
GET  /rates/history  — session rate history
GET  /api/docs       — Swagger UI
```

---

## Tests

```bash
cd backend && npm run test
```

Integration tests use stubbed HTTP responses based on realistic UPS carrier payloads — no live API calls required for the test suite.

---

## What I'd add given more time

- FedEx and USPS carrier adapters (the architecture already supports them)
- Redis for OAuth token caching instead of PostgreSQL
- Rate result caching with TTL
- Tracking webhook events
- GitHub Actions CI/CD pipeline

---

## License

MIT © Aarogya Ojha
