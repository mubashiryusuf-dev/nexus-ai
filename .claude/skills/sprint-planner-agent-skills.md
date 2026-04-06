# Sprint Planner Agent Skills

## Primary Skills

- MoSCoW prioritization from `requirements.md`
- Epic and story breakdown across all feature domains
- Jira-style ticket writing with acceptance criteria
- Dependency mapping and delivery sequencing
- Sprint slicing with parallel FE + BE workstreams
- Scope control and Won't Have enforcement
- Backlog hygiene and ticket clarity

## Feature Skills

### Must Have Planning
- Auth: email/password registration and login, Google OAuth, GitHub OAuth, session management
- Onboarding: 4-step guided flow, inline hero variant, prompt generation, prompt card actions
- Landing Page: hero section, stats, quick action grid, voice input, featured models
- Voice Input: Speech Recognition API, transcription, silence detection, wave animation
- Chat Hub: full chat flow, model intro → variation → objective wizard, prompt card, sidebars, quick actions
- Marketplace: search, all filters, labs bar, model cards, comparison table, 6-tab detail modal
- Agent Builder: 5-step wizard — Basics, Tools, Config, Testing, Deploy
- Agent Testing: scenario management, pass/fail, pass rate, playground chat
- Agent Deployment: API endpoint, Embed Widget, Slack Bot, WhatsApp/Twilio provisioning
- Task Management: full CRUD, per-task conversations, inline editing, completion state
- Use Case App Discovery: 60+ apps across 6 categories, detail overlays, launch-to-chat
- Dashboard Metrics: all KPIs, sparkline, usage overview, post-deploy metrics

### Should Have Planning
- Agent Chat View: memory (short/long-term), tools, token metrics
- Agent Computer Panel: suggested questions, 7 tabs, click-to-send
- Research Feed: two-column layout, category filters, detail view
- Model benchmarks in detail modal
- Reviews and ratings on model cards and modal
- Localization: 15 languages, preference persistence
- Context/session preservation for returning users

### Could Have Planning
- Weekly digest subscription
- Budget-oriented browsing
- Trend signals and benchmark summaries

### Dependency Sequencing
- Auth BE → all protected routes
- Models API BE → Marketplace FE
- Agent Builder BE → Agent Wizard FE wiring
- Task Management BE → per-task conversation integration
- App catalog seed data → App Discovery FE
- Deployment integrations BE (Slack, Twilio) → Deploy step FE
- Dashboard metrics API → metrics widgets FE

## Quality Skills

- Clear, testable ticket acceptance criteria
- Explicit dependency declarations per ticket
- Parallel FE + BE sprint slicing to maximize throughput
- Avoiding scope creep into Won't Have territory
- Backlog grooming to remove stale or superseded tickets
- Splitting stories into FE, BE, Integration, and QA sub-tasks when features span layers
