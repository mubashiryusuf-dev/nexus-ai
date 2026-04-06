# FE Agent

## Role

Frontend implementation owner for NexusAI.

## Focus

- Next.js frontend architecture
- Tailwind UI implementation matching the NexusAI design system
- All screens, modals, overlays, flows, and interactive components defined in `requirements.md`
- Pixel-faithful implementation of `NexusAI-Dashboard-Updated-15.html` reference design

## Core Skills

- Next.js App Router
- React functional components and hooks
- Tailwind CSS with design tokens (colors, typography, spacing, radius, shadows)
- TypeScript-first component design
- Responsive layouts (mobile-first, 768px breakpoint)
- Accessibility and semantic HTML
- Typed API consumption
- State modeling for complex multi-step UI flows
- Animation and micro-interaction implementation (transitions, fade, pulse, bounce)
- Empty, loading, and error state design

## Screens and Flows

### Auth
- Login/Signup modal: branded left panel, right form panel, tab switcher
- Email/password form with validation
- Social login buttons: Google OAuth and GitHub OAuth — fully functional
- Forgot password link
- Session persistence across page reloads

### Landing Page
- Hero section with animated floating orbs background
- Hero stats bar: 525+ AI Models, 82K Builders, 28 AI Labs, 4.8★
- Live indicator badge (347 models, updated daily)
- Multi-modal search input: text, voice, file attach, image upload
- Inline onboarding expansion (Phase 1 → 2 → 3 animation)
- Quick action grid: 14 labeled emoji buttons
- Featured models section
- Top navigation: logo, nav links, language selector, Sign In, Get Started

### Guided Onboarding
- Full-screen overlay with progress dots and skip
- 4 question cards (Goal → Audience → Skill Level → Budget)
- 2-column emoji option grid per question
- "Building prompt" animation before redirect to Chat Hub
- Inline hero card version with same question flow

### Chat Hub
- Left sidebar: model list with search, active highlight, status indicators
- Central chat area: user/AI message bubbles, typing indicator, message metadata
- Pre-populated prompt card: display/edit toggle, Run/Edit/Regenerate/Delete
- Inspiration chips (8 questions)
- Model intro card with stats and Proceed button
- Variation selector card with radio buttons and Confirm
- Variation detail card (specs, benefits, action buttons)
- Objective wizard cards (Quality/Speed/Cost, Context, Tools)
- Congratulations banner
- Category prompt panel with 7 tabs and 2-column quick prompts grid
- Right sidebar: Active Model Card, Usage Overview with sparkline, Quick Actions (3 collapsible sections)
- Chat input: textarea, voice/file/image toolbar icons, send button, model selector dropdown

### Voice Input
- Mic button with active pulsing state across hero, chat, and marketplace
- Voice wave animation while recording
- Real-time transcription display (interim + final)
- Silence detection auto-send
- Stop recording button

### Marketplace
- Search bar with voice, file, and image upload buttons
- Quick filter pills: All, Language, Vision, Code, Image Gen, Audio, Open Source
- AI Labs filter bar: horizontal scrollable pill buttons
- Active lab banner with clear option
- Sidebar filters: Provider, Pricing Model, Price range slider, Min Rating, License, Quick Guides
- "Need help choosing?" CTA card
- Responsive auto-fill model card grid
- Model cards: icon, name, org, badge, description, tags, rating, price, View Details
- Empty-state display
- Model comparison table (column view)

### Model Detail Modal
- 6-tab navigation: Overview, How to Use, Pricing, Prompt Guide, Agent Creation, Reviews
- Overview: description, use cases grid, prompt/output example, benchmark scores
- How to Use: 5-step guide, code snippet with copy button
- Pricing: 3 tier cards, feature checklists, free tier callout
- Prompt Guide: 4 principles each with copyable code box
- Agent Creation: embedded 6-step wizard
- Reviews: reviewer name, role, stars, review text

### Agents View — Agent Computer Panel (ACP)
- Perplexity-style suggested questions panel
- 7-tab category navigation
- Icon + text suggestion rows with hover arrow
- Click-to-send to agent chat

### Agents View — Task Management
- Task list with per-agent/project sections
- Create task (inline input)
- Inline contenteditable task name editing
- Checkbox complete/incomplete toggle
- Three-dot context menu: duplicate, delete
- Active task highlighting
- Per-task conversation panel (show/hide on selection)
- Conversation panel: agent chat thread tied to selected task

### Agent Library
- Left sidebar: inline list of created agents
- Main area: grid with tabs (All, Featured, Custom)
- Agent cards: icon, name, description, tags, tool count
- Build from Scratch card (dashed border)
- New Agent button

### Agent Creation Wizard (5 steps)
- Step 1 — Basics: name, icon, purpose, system prompt editor
- Step 2 — Tools: tool catalog grid, tool configuration drawer (right slide-out), tool count bar
- Step 3 — Configuration: memory setup, advanced settings
- Step 4 — Testing: scenario checkboxes, custom input, playground chat, pass/fail verdicts, pass rate progress bar
- Step 5 — Deploy: API Endpoint, Embed Widget, Slack Bot, WhatsApp/SMS cards; deploy button; post-deploy metrics

### Agent Chat View
- Agent avatar and name at top
- Agent profile card (description, use cases)
- Short-term and long-term memory display
- Tools list
- Message count and token usage metrics
- Chat message thread with typing indicator

### Use Case App Discovery
- 6 category tabs: Use Cases, Build a Business, Learn, Monitor, Research, Create, Analyze
- 10-app emoji card grid per category (60+ total)
- App detail overlay: gradient preview, title, type badge, description, steps, tags, Launch button
- Launch routes to Chat Hub with pre-built prompt

### Research / Discover New
- Two-column layout: feed list (left), detail view (right)
- Research cards: date, title, summary
- Category filters
- Feed item click expands detail panel

### Dashboard Widgets
- Usage metrics: request count, latency, daily cost, token usage, satisfaction rating, response quality %
- Sparkline usage trend chart
- Active model summary panel

### Localization
- Language selector dropdown in nav (15 languages)
- UI text swap on language change

## Design System

- **Font**: Syne (headings), Instrument Sans (body)
- **Accent**: #C8622A | Background: #F4F2EE / #ECEAE4 / #E4E1D8
- **Text**: #1C1A16 / #5A5750 / #9E9B93
- **Colors**: Blue #1E4DA8, Teal #0A5E49, Amber #8A5A00, Rose #9B2042, Green #2E9E5B
- **Radius**: 8px, 12px, 20px, 28px | **Shadows**: shadow, shadow-md, shadow-lg
- **Badges**: NEW (teal), HOT (orange), OPEN SOURCE (blue), BETA (amber)

## Rules

- Use functional components only
- Keep components small and composable
- Avoid duplicating UI logic; extract reusable primitives when patterns repeat
- Keep business logic outside presentation components
- Type props, state, handlers, API payloads, and utility return values
- Match design system tokens exactly — no ad-hoc colors or spacing
- Every interactive element must have loading, empty, and error states

## Deliverables

- Reusable UI components and design system primitives
- All page and modal implementations
- Frontend hooks and typed API service layer
- Polished responsive user flows with animations
