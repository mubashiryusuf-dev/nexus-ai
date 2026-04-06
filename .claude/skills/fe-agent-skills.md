# FE Agent Skills

## Primary Skills

- Next.js App Router structure and routing
- React functional components and custom hooks
- Tailwind CSS with NexusAI design tokens
- TypeScript props, state, and API payload typing
- Responsive layout implementation (mobile-first, 768px breakpoint)
- Accessible form and navigation patterns
- Complex multi-step UI state modeling
- Typed API service layer consumption
- Reusable component extraction and composition
- Animation and micro-interaction implementation

## Feature Skills

### Auth
- Login/Signup modal with tab switcher
- Email/password form with validation states
- Google OAuth and GitHub OAuth button flows
- Session-aware route guards and redirects

### Onboarding
- Full-screen overlay with 4-step question flow
- Progress dots, skip, and phase transition animations
- Hero inline onboarding expansion (3 phases)
- Pre-populated prompt card (display/edit/regenerate/delete)

### Landing Page
- Animated hero with floating orbs
- Multi-modal search input (text, voice, file, image)
- Quick action grid (14 buttons)
- Hero stats bar and live indicator badge

### Voice Input
- Mic button with pulsing active state
- Voice wave animation component
- Real-time transcription display (interim + final)
- Silence detection and auto-send trigger
- Stop recording button

### Chat Hub
- Left/right sidebar layout with central chat area
- User and AI message bubbles with avatars and metadata
- Typing indicator animation
- Model intro card, variation selector, variation detail, objective wizard
- Category prompt panel (7 tabs, 2-column quick prompts grid)
- Right sidebar: active model card, usage sparkline, quick actions (3 collapsible sections)
- Chat input toolbar with voice/file/image icons and model selector

### Marketplace
- Category pills, AI Labs scrollable bar, active lab banner
- Sidebar filters: checkboxes, price range slider, rating selector
- Responsive auto-fill model card grid
- Model comparison table (column view)
- Empty-state and loading-state components

### Model Detail Modal
- 6-tab navigation panel
- Benchmark score display
- Code snippet with copy-to-clipboard
- Pricing tier cards and free tier callout
- Reviews list with stars and reviewer info

### Agents View
- Agent Computer Panel (ACP): Perplexity-style suggested questions, 7 tabs
- Task Management: inline CRUD list, checkbox toggle, three-dot context menu, per-task conversation panel
- Agent Library: grid with All/Featured/Custom tabs, agent cards, Build from Scratch card

### Agent Creation Wizard
- 5-step wizard: Basics, Tools, Config, Testing, Deploy
- System prompt editor
- Tool catalog grid and right slide-out tool drawer
- Test scenario checkboxes, playground chat, pass/fail verdicts, pass rate progress bar
- Deployment channel cards (API, Embed, Slack, WhatsApp) and deploy button

### Agent Chat View
- Memory panel (short-term / long-term)
- Tools list
- Token usage and message count metrics display

### Use Case App Discovery
- 6-category tab grid with 10 app cards each
- App detail overlay (gradient preview, steps, launch button)
- Launch-to-chat routing with pre-built prompt

### Research Feed
- Two-column layout: feed list and detail panel
- Category filter bar
- Research card and expandable detail view

### Dashboard Widgets
- KPI cards: requests, latency, cost, token usage, quality %, satisfaction
- Sparkline chart component

### Localization
- Language selector dropdown (15 languages)
- UI text swap on language change

## Quality Skills

- Loading, empty, and error states for every data-driven component
- DRY component composition — no duplicated layout or logic
- Consistent design system token usage (no ad-hoc colors or spacing)
- Typed API contracts matched to BE DTOs
- Accessible interactive elements (keyboard navigation, aria labels)
