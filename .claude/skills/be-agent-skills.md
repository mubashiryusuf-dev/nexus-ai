# BE Agent Skills

## Primary Skills

- NestJS module architecture (controllers, services, providers)
- DTO design with class-validator
- MongoDB schema modeling with Mongoose
- JWT authentication and session management
- OAuth 2.0 integration (Google, GitHub via Passport.js)
- TypeScript domain typing
- Query, filter, and pagination implementation
- API error handling and typed responses
- Webhook and third-party API integration (Slack, Twilio)
- Service-layer business logic isolation

## Feature Skills

### Auth
- User registration and login endpoints
- Google OAuth and GitHub OAuth strategy implementation
- JWT issuance, refresh, and guard middleware
- Password hashing (bcrypt) and reset flows
- Protected route enforcement

### Onboarding & Prompts
- Onboarding answer persistence and retrieval
- Personalized prompt generation from onboarding state
- Prompt CRUD (create, read, update, regenerate, delete)

### Models & Marketplace
- Model catalog CRUD with full filter support
- Provider, pricing, rating, license, and category filtering
- Model variant and benchmark data management
- Reviews and ratings APIs

### Agent Builder
- 5-step agent wizard state persistence
- Tool catalog management and tool configuration storage
- System prompt storage
- Agent memory management (short-term and long-term)
- Agent template seed data (6 default agents)

### Agent Testing & Playground
- Test scenario CRUD (predefined and custom)
- Pass/fail verdict storage per scenario
- Pass rate calculation
- Playground conversation session management

### Agent Deployment
- Deployment record management per channel (API, Embed, Slack, WhatsApp)
- Slack Bot provisioning API integration
- Twilio WhatsApp/SMS webhook registration
- Post-deployment metrics storage and retrieval

### Task Management
- Task CRUD with per-agent/project organization
- Completed/incomplete state management
- Per-task conversation thread persistence
- Task duplication and deletion

### Use Case App Discovery
- App catalog seed data (60+ apps, 6 categories)
- App browsing and filtering by category
- Launch-to-chat prompt generation from app context

### Chat Hub
- Chat session and message history management
- Model selection and active model context persistence

### Research Feed
- Research item CRUD with category and featured flags
- Paginated feed retrieval with category filtering

### Dashboard Metrics
- Per-user KPI storage: requests, latency, cost, token usage, quality, satisfaction
- Time-series sparkline data for usage trends
- Post-deployment agent performance metrics

### Localization
- Language preference persistence per user

## Quality Skills

- Input validation on all endpoints
- Contract consistency across DTOs and responses
- DRY backend abstractions and shared utilities
- Auth guard coverage on all user-owned resources
- Scalable domain module organization
