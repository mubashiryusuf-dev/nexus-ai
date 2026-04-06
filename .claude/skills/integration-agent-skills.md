# Integration Agent Skills

## Primary Skills

- Frontend/backend API contract matching
- Request and response type validation
- Shared type alignment across FE and BE layers
- End-to-end flow tracing from UI action to DB and back
- OAuth redirect and token exchange verification
- Third-party webhook and API integration testing (Slack, Twilio)
- Error propagation and fallback analysis
- Environment and config coordination (dev, staging, prod)

## Feature Skills

### Auth Integration
- Login/Signup form → Auth API → JWT → session persistence
- Google OAuth and GitHub OAuth: redirect, token exchange, user creation, session
- Protected route guard verification in FE
- Logout: token invalidation and session clear

### Onboarding → Chat Hub
- Onboarding answers → BE prompt generation → FE pre-populated prompt card
- Skip flow bypasses prompt generation and routes directly

### Voice Input → Chat
- Speech Recognition API → transcription → chat/search input population
- Auto-send on silence triggers sendMessage correctly
- Voice input wired in hero, chat, and marketplace inputs

### Marketplace Integration
- All filter combinations → correct API query params → filtered results render
- Search debounce → API call → results update
- Model card → modal opens with correct full model data from API

### Model Detail Modal
- All 6 tabs load correct data from their respective endpoints
- Code copy, pricing CTAs, and review list all wired correctly

### Chat Hub Flows
- Full model selection flow: intro card → proceed → variations → objective wizard → agent wizard
- Category prompt quick prompts fire sendMessage correctly
- Right sidebar metrics and sparkline load from dashboard API

### Agent Builder (5 Steps)
- Each step's data is saved to BE on Continue; state survives back navigation
- Tool catalog loads from API; tool drawer config saved and retrieved
- Testing step: scenarios load, playground chat connects, verdicts stored and retrieved
- Deploy step: channel provisioning triggered correctly; post-deploy metrics load

### Task Management
- Full CRUD operations wired: create, update, complete toggle, delete
- Per-task conversation loads and persists correctly
- New messages in task thread sent to correct agent and appended to thread

### Use Case App Discovery
- App catalog loads by category from API
- Detail overlay data loaded from API on card click
- Launch builds correct prompt and navigates to Chat Hub with it pre-loaded

### Agent Chat View
- Memory (short/long-term) loads from agent config API
- Tools list reflects agent configuration
- Metrics (tokens, messages) update after each exchange

### Research Feed
- Feed loads with correct data; category filter triggers re-fetch
- Detail view expands with full item content on click

### Dashboard Metrics
- All KPI fields map correctly from API response to UI widgets
- Sparkline time-series data renders in correct chart format

### Localization
- Language preference saved to BE; UI re-renders with translated strings on change

## Quality Skills

- Regression spotting across FE and BE after any change
- Minimal, targeted integration fixes
- Contract mismatch detection before implementation is complete
- Integration readiness review checklist per feature
- Happy path and error/edge state validation for every wired flow
