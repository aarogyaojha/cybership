# Cybership

A shipping carrier integration service built around one architectural principle: adding a new carrier should never require touching existing carrier code.

Most shipping integrations end up as a pile of `if carrier === 'UPS'` branches. Cybership uses a capability-based engine instead — each carrier is a self-contained plugin that declares what it can do. The core routing layer reads capabilities and dispatches accordingly. FedEx or USPS can be added without opening a single existing file.

Currently integrates the UPS Rating API (v2409) with full OAuth 2.0 token lifecycle management.

---

## Architecture decisions

**Capability-based carrier engine**

```typescript
// Each carrier declares its own capabilities
const UPSCarrier: Carrier = {
  id: 'ups',
  capabilities: ['rate', 'shop_time_in_transit'],
  execute: (op, payload) => { ... }
}

// Core never checks carrier identity — only capabilities
const carrier = registry.findCapable('rate');
```

Adding FedEx: implement the `Carrier` interface, register it, done. No existing code changes.

**OAuth 2.0 token lifecycle** — token acquisition, storage, and refresh are handled transparently in the background. The rest of the application calls carrier endpoints without managing auth state.

**Structured error responses** — carrier errors return a typed `CarrierError` shape with machine-readable codes and HTTP status mapping. No raw carrier error strings leaking to the client.

**Strict input validation** — `class-validator` on the backend, `zod` on the frontend. Invalid payloads are rejected before they ever hit a carrier network.

---

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL (Dockerized) |
| Auth | OAuth 2.0 (UPS), HttpOnly session cookies |
| Frontend | Next.js 15, Shadcn/UI, Tailwind CSS |
| Docs | Swagger / OpenAPI at `/api/docs` |
| Carrier | UPS Rating API v2409 |

---

## Getting started

**Prerequisites:** Node.js 18+, Docker, UPS developer credentials ([register here](https://developer.ups.com))

```bash
git clone https://github.com/aarogyaojha/cybership.git
cd cybership

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Environment variables
cp .env.example .env
```

| Variable | Description |
|---|---|
| `UPS_CLIENT_ID` | UPS OAuth client ID |
| `UPS_CLIENT_SECRET` | UPS OAuth client secret |
| `UPS_BASE_URL` | UPS API base URL |
| `UPS_ACCOUNT_NUMBER` | UPS shipper account number |
| `DATABASE_URL` | PostgreSQL connection string |
| `COOKIE_SECRET` | Secret for signing session cookies |

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
