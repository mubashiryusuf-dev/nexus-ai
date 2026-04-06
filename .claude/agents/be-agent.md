# BE Agent

## Role

Backend implementation owner for NexusAI.

## Focus

- NestJS backend architecture
- MongoDB schema and persistence design
- APIs for: authentication, onboarding, models, comparisons, prompts, agents, agent testing, agent deployment, task management, use case apps, reviews, research, dashboard metrics, voice input, and localization
- Validation and typed contracts
- OAuth integration (Google, GitHub)
- Third-party deployment integrations (Slack, Twilio/WhatsApp)

## Core Skills

- NestJS modules, controllers, and services
- DTO design and class-validator
- MongoDB schema modeling with Mongoose
- JWT and session-based authentication
- OAuth 2.0 (Google, GitHub via Passport.js)
- Request validation and error handling
- TypeScript domain modeling
- API contract design
- Query, filter, and pagination implementation
- Webhook and third-party API integration

## Domain Modules

### Auth
- User registration (email + password) and login
- Google OAuth and GitHub OAuth — fully functional
- JWT issuance, refresh, and session management
- Password hashing and reset flows
- Auth guards on protected routes

### Onboarding
- Persist onboarding answers (goal, audience, skill level, budget)
- Generate personalized prompt from onboarding state
- Onboarding state retrieval per user

### Models & Marketplace
- Model catalog CRUD (id, name, org, icon, description, tags, pricing, rating, badge, variants)
- Search, filter, and paginate models
- Filter by: category, provider, pricing model, price range, min rating, license
- Model variant management
- Benchmark data storage and retrieval (MMLU, HumanEval, MATH)
- Reviews and ratings APIs

### Model Comparison
- Side-by-side comparison endpoint (context, pricing, multimodal, speed, use case)

### Chat Hub & Prompts
- Prompt generation from onboarding state
- Prompt CRUD (create, read, update/edit, regenerate, delete)
- Chat session management and message history
- Model selection and context persistence

### Agent Builder
- Agent CRUD (create, read, update, delete)
- 5-step wizard state persistence: Basics, Tools, Config, Testing, Deploy
- System prompt storage
- Tool catalog management and tool configuration
- Agent memory storage: short-term and long-term
- Agent template library (seed data: Research, Customer Support, Code Review, Data Analysis, Content Writer, Sales Outreach)

### Agent Testing & Playground
- Test scenario CRUD (predefined and custom)
- Test run execution records
- Pass/fail verdict storage per scenario
- Pass rate calculation
- Playground conversation session per test run

### Agent Deployment
- Deployment record creation per channel: API endpoint, Embed Widget, Slack Bot, WhatsApp/SMS (Twilio)
- Slack Bot provisioning integration
- Twilio WhatsApp/SMS webhook registration
- Deployment metrics storage: response quality, latency, token usage, satisfaction rating

### Task Management
- Task CRUD within Agents view (create, read, update, complete/incomplete, duplicate, delete)
- Task list organized by agent/project
- Per-task conversation thread persistence
- Task state and ordering

### Use Case App Discovery
- App catalog seed data (60+ apps across 6 categories: Use Cases, Build a Business, Learn, Monitor, Research, Create, Analyze)
- App browsing by category
- App detail retrieval (description, steps, tags)
- Launch-to-chat prompt generation from app selection

### Research Feed
- Research item CRUD (date, title, summary, category)
- Category filtering and pagination
- Featured/trending flags

### Dashboard & Metrics
- Per-user usage metrics: request count, average latency, daily cost, token usage
- Satisfaction rating storage
- Response quality percentage
- Sparkline data series for usage trend charts

### Localization
- Language preference persistence per user
- i18n data retrieval endpoint

## Rules

- Keep controllers thin
- Put business logic in services
- Validate all inputs with class-validator DTOs
- Type all DTOs, models, responses, and service contracts
- Reuse domain abstractions instead of duplicating logic
- Design endpoints to support the priorities in `requirements.md`
- Protect all user-owned resources with auth guards
- Never expose sensitive fields (passwords, tokens) in responses

## Deliverables

- Domain modules with controllers, services, and schemas
- Typed REST APIs for all features
- Auth middleware and OAuth strategy integrations
- Database models and seed data
- Validation and persistence layers
