# QA Tester Agent Skills

## Primary Skills

- Functional testing against `requirements.md` acceptance criteria
- Regression testing after fixes and new feature merges
- UI flow validation across all screens and modals
- API response verification
- Auth and OAuth flow testing
- Voice input testing (Speech Recognition API behavior)
- Third-party integration testing (Slack Bot, WhatsApp/Twilio)
- Edge-case and failure-state analysis
- Bug reproduction and reporting
- Cross-browser and responsive behavior verification

## Feature Skills

### Auth Testing
- Registration: valid input, duplicate email, weak password validation
- Login: correct credentials, wrong password, unknown account
- Google OAuth and GitHub OAuth: full redirect flow, account creation, session persistence
- Protected routes: access without auth redirects to login
- Logout: session cleared, re-access blocked

### Onboarding Testing
- All 4 question steps navigable; progress dots advance correctly
- Skip routes to Chat Hub without generating prompt
- Prompt card: Run, Edit (toggle and save), Regenerate, Delete
- Hero inline onboarding: 3-phase animation and redirect

### Voice Input Testing
- Mic activates with animation; transcription updates in real time
- Silence detection fires send at correct threshold
- Stop button cancels recording mid-session
- Graceful degradation when Speech Recognition API unsupported

### Landing Page Testing
- Hero stats display; live indicator visible
- All 14 quick action buttons route correctly
- Featured models render

### Chat Hub Testing
- Send/receive messages; typing indicator appears
- Full model selection flow (intro → proceed → variation → objective → agent wizard)
- Congratulations banner on completion
- All 7 category prompt tabs and quick prompts work
- Right sidebar: model data, metrics, sparkline, all quick action links
- Inspiration chips send correct messages

### Marketplace Testing
- Text search, category pills, labs filter, sidebar filters (all combinations)
- Price range slider applies correctly
- Empty state renders when no results
- View Details opens correct modal with all 6 tabs
- Comparison table renders correct data

### Agent Builder Testing
- All 5 wizard steps advance and preserve state on back navigation
- Tool catalog loads; tool drawer opens and saves config
- Test scenarios: predefined checkable, custom input saves, playground chat works
- Pass/fail verdicts display; pass rate progress bar reflects result
- Deploy: all 4 channel cards present; deploy triggers provisioning; post-deploy metrics appear

### Task Management Testing
- Create, inline edit, complete toggle, duplicate, delete — all with correct persistence
- Task selection shows per-task conversation; deselection hides it
- Messages in task thread persist across page reload

### Use Case App Testing
- All 6 category tabs load 10 apps each
- App detail overlay opens with correct content
- Launch button routes to Chat Hub with pre-built prompt

### Agent Chat View Testing
- Memory panel shows correct short-term and long-term entries
- Tools list matches agent configuration
- Metrics update after each exchange

### Research Feed Testing
- Feed loads items; category filter changes results
- Detail view expands on item click with full content

### Dashboard Testing
- All KPIs load correctly; sparkline renders
- Post-deploy metrics appear after agent deployment

### Localization Testing
- All 15 languages selectable; UI text updates on selection
- Language preference persists on reload

### Responsive Testing
- Sidebar collapses at 768px
- Modals and overlays usable on mobile viewport
- Core flows work on Chrome, Firefox, Safari

## Quality Skills

- Priority-based test coverage (Must Have first)
- Clear defect reports: steps, expected, actual, severity
- Retest after every fix
- Regression run after significant merges
- Acceptance criteria sign-off before feature is closed
