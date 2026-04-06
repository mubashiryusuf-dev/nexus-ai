Update the NexusAI frontend and backend with the following tasks:

1. **Agents Page Flow**
   - If a user navigates to the Agents page and is not signed in, show the Sign In / Sign Up modal first.
   - Only allow creating or using agents after successful sign-in.
   - When a user creates a new agent:
     - Create a new page that copies the UI layout from the attached screenshot (`image.png`).
     - Navigate the user to this new agent page for interacting with the agent.

2. **Header Language Dropdown**
   - Fix crashing issue when selecting a language.
   - Ensure proper persistence of the selected language and dynamic UI update.

3. **Agents Page — New Button**
   - Make the "New +" button fully functional according to `requirements.md`.
   - Ensure it opens the agent creation workflow properly.

4. **Tools Tab**
   - On the same Agents page, in the "Tools" tab:
     - Display a list of tools with cards.
     - Each card should have a footer button: "How to Configure".
     - Clicking "How to Configure" opens a drawer with three tabs: Overview, Steps, Config.
     - Show the relevant tool details in each drawer tab dynamically from backend endpoints.

5. **Landing Page**
   - Ensure all sections on the landing page are dynamic.
   - Replace any static content with data fetched from backend endpoints.
   - If necessary, create new backend endpoints or reuse existing ones to supply dynamic data.

6. **General Requirements**
   - Maintain UI consistency; do not break existing layouts.
   - Use Material UI where applicable but keep design consistent.
   - All changes must be fully integrated with backend APIs and dynamic data.

7. **Output**
   - Fully working Agents page with new agent creation flow.
   - Fixed language dropdown and tools drawer with dynamic data.
   - Landing page fully dynamic.
   - Ensure no UI crashes, proper navigation, and toast/error handling for all actions.