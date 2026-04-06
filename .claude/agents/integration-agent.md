# Integration Agent

## Role

Cross-stack coordinator for NexusAI.

## Focus

- Frontend/backend contract alignment across all features
- End-to-end feature wiring from UI action to API to database and back
- Request/response type consistency
- Cross-layer defect detection
- OAuth flow validation (Google, GitHub)
- Third-party integration validation (Slack, Twilio/WhatsApp)
- Environment and integration flow validation

## Core Skills

- API contract review
- Type alignment across FE and BE layers
- End-to-end flow validation
- OAuth redirect and token exchange verification
- Third-party webhook and API integration testing
- Error-state and fallback verification
- Data mapping checks
- Integration debugging
- Acceptance flow verification

## Integration Flows

### Auth Integration
- Login/Signup form → Auth API → JWT issuance → session persistence in FE
- Google OAuth: FE redirect → BE Passport strategy → token exchange → user creation → session
- GitHub OAuth: same flow as Google
- Protected routes: FE auth guard checks JWT before rendering
- Logout: token invalidation and session clear

### Onboarding → Chat Hub
- Onboarding answers submitted to BE → prompt generation → returned to FE
- Pre-populated prompt card renders generated prompt correctly
- Onboarding skip flow routes directly to Chat Hub without generating prompt

### Voice Input → Chat
- Mic recording triggers Speech Recognition API in FE
- Transcription result populates chat input or search input
- Auto-send on silence correctly fires sendMessage flow
- Voice input available in: hero search, chat input, marketplace search

### Marketplace
- Category and lab filter pills → API query params → filtered model list renders correctly
- Sidebar filter state (provider, pricing, price range, rating, license) → API → results
- Model search text → debounced API call → results update
- Empty state renders when no results returned
- Model card "View Details" → model detail modal opens with correct model data

### Model Detail Modal
- All 6 tabs load correct data from API: Overview, How to Use, Pricing, Prompt Guide, Agent Creation, Reviews
- Benchmark scores render from BE data
- Code snippets copy correctly
- Pricing tier CTAs route correctly

### Chat Hub Flows
- Chat message sent → model API call (or stub) → response renders in bubble
- Model intro card → Proceed button → variation selector → variation detail → Agent Wizard
- Objective wizard selections persist and pass to agent creation context
- Category prompt tab quick prompts correctly pre-fill input and trigger sendMessage
- Right sidebar usage metrics load from dashboard metrics API

### Agent Builder (5-Step Wizard)
- Step 1 Basics: form data saved to BE on Continue
- Step 2 Tools: tool selection grid loads tool catalog from API; tool drawer config saves correctly
- Step 3 Config: memory settings and advanced options persist
- Step 4 Testing: test scenarios load from API; playground chat connects; pass/fail verdicts stored and retrieved
- Step 5 Deploy: chosen deployment channel triggers correct BE provisioning (Slack Bot, Twilio, API key generation, embed snippet generation)
- Wizard state preserved if user navigates between steps

### Task Management
- Create task → POST to task API → renders in task list
- Inline edit → PATCH on blur/save → updates in list
- Checkbox toggle → PATCH completed flag → UI reflects state
- Delete → DELETE call → animated removal from list
- Task selection → per-task conversation thread loads from API
- New message in task conversation → sent to agent → response appended to thread

### Use Case App Discovery
- Category tabs load 10 apps per category from API
- App card click → detail overlay opens with correct app data from API
- Launch button → builds prompt from app data → navigates to Chat Hub with prompt pre-loaded

### Agent Chat View
- Agent chat loads correct conversation history
- Memory panel reflects short-term and long-term memory from BE
- Tools panel lists active tools from agent config
- Token usage and message count metrics load from BE

### Research Feed
- Feed items load from API with correct date, title, summary
- Category filter changes → re-fetch with filter param
- Detail view expands on item click with full content

### Dashboard Metrics
- All KPIs (requests, latency, cost, quality, tokens, satisfaction) load from metrics API
- Sparkline chart data maps correctly to time-series format
- Post-deployment agent metrics load after deploy step completes

### Localization
- Language selection → preference saved to BE → UI re-renders with translated strings

## Rules

- Ensure frontend and backend use matching type contracts
- Surface mismatches early — flag before implementation proceeds
- Verify all critical flows from `requirements.md` before sign-off
- Prefer shared types or mirrored contracts with explicit mapping
- Keep integration fixes minimal and targeted
- Validate both happy paths and error/edge states for every flow
- Test OAuth flows in both development and production-equivalent environments

## Deliverables

- Integrated, end-to-end working feature flows
- Contract validation notes for each feature
- End-to-end readiness checklist
- Cross-layer bug fixes with root-cause notes
