# NexusAI

NexusAI is an AI model discovery and evaluation product with a Next.js frontend and a NestJS + MongoDB backend.

The project is based on the product scope described in [requirements.md](F:/nexus-ai/requirements.md): guided onboarding, chat-based discovery, model marketplace, flagship comparison, agent builder, research feed, localization, and usage analytics.

## Repository Layout

- [frontend](F:/nexus-ai/frontend): Next.js 15 frontend
- [backend](F:/nexus-ai/backend): NestJS backend with Mongoose schemas and Swagger
- [requirements.md](F:/nexus-ai/requirements.md): product reference and scope basis
- [backend/docs/endpoints.json](F:/nexus-ai/backend/docs/endpoints.json): current endpoint inventory

## Frontend

The frontend uses:

- Next.js 15
- React 19
- Tailwind CSS

Current frontend integration status:

- Auth modal and header state are wired to a JWT-style auth session shape
- Marketplace, research feed, agent builder, and chat hub are connected to the backend API client
- If backend APIs are unavailable or return empty data, the frontend falls back to dummy JSON so the UI still works

Key frontend files:

- [api-client.ts](F:/nexus-ai/frontend/src/lib/api-client.ts)
- [dummy-data.ts](F:/nexus-ai/frontend/src/lib/dummy-data.ts)
- [auth-provider.tsx](F:/nexus-ai/frontend/src/components/auth/auth-provider.tsx)

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:3000
```

Optional environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Backend

The backend uses:

- NestJS
- Mongoose
- Swagger / OpenAPI
- JWT-style auth responses

Implemented backend modules:

- `auth`
- `discovery`
- `catalog`
- `agents`
- `analytics`
- `content`

Swagger is configured in:

- [main.ts](F:/nexus-ai/backend/src/main.ts)

Expected docs URLs when running:

```text
http://localhost:3001/docs
http://localhost:3001/docs/swagger.json
```

Run backend:

```bash
cd backend
npm install
npm run start:dev
```

Default backend environment values:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/nexus-ai
JWT_SECRET=nexus-ai-dev-secret
PORT=3001
```

## API Coverage

Current API surface includes:

- Auth: sign in, sign up, guest session, profile
- Discovery: onboarding, chat sessions, prompt draft CRUD
- Catalog: providers, models, guides, comparisons, reviews
- Agents: templates, create, read, update
- Analytics: overview and usage
- Content: research feed, digest subscriptions, languages, localization

For the full endpoint list, see:

- [endpoints.json](F:/nexus-ai/backend/docs/endpoints.json)

## Notes

- The frontend is designed to keep working before the backend is fully populated with data.
- Dummy fallback data is intentional and can be removed later once real APIs are stable.
- The backend structure was generated from the product requirements and is ready for deeper business logic, validation, persistence rules, and real auth/security hardening.
