# Agent Instructions: Professional UI Upgrades & System Integrity

## 1. Core Principle: Zero-Regression Policy
*   **Preservation:** Do NOT change, refactor, or delete existing core functionalities, CSS variables, or backend API logic unless explicitly requested.
*   **Compatibility:** All new features (webcam, model icons) must be wrapped in existing component structures to maintain the current layout and site flow.

## 2. Professional Media & Webcam Suite
*   **Availability:** Integrate webcam triggers in **Landing Page**, **Agent Chat**, and **Chat Hub** search fields.
*   **Capture Logic:**
    *   **Photos:** Instant high-res snapshot with a professional shutter effect.
    *   **Videos:** Record with a "Live" red-dot indicator and timer. 
*   **Professional Preview:** Show a high-quality thumbnail with a "Remove" button above the input field. 
*   **Persistence:** Media captured on the Landing Page must survive the "Let's Go" redirect and appear in the Chat Hub input field automatically.

## 3. Global UI Consistency (Agent Button)
*   **Mirroring:** The "Agent Button" from the Landing Page must be implemented identically on the **Chat Hub** and **Agent Chat** pages.
*   **Behavior:** Ensure the button maintains its position, styling, and functionality (state) across all routes.

## 4. Chat Hub Cleanup (Models & Text)
*   **Encoding Fix:** Remove all garbled text (e.g., `ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢`). Replace them with professional bullet points (`•`) or clean typography.
*   **Visual Branding:** Add professional logos/icons next to every model name in the listing. If a logo is missing, use a high-quality generic AI placeholder icon.
*   **Alignment:** Ensure the model list is perfectly aligned and matches the site’s professional aesthetic.

## 5. The "Let's Go" Navigation Protocol
*   **Data Transfer:** When "Let's Go" is pressed, the agent must collect:
    *   Text input + Voice transcripts.
    *   Attached Files/Images.
    *   Captured Webcam Photos/Videos.
*   **Seamless Handoff:** Redirect to the Chat Hub and immediately inject all collected data into the Chat Hub search field so the user can continue without re-uploading.

## 6. Technical Constraints
*   **Hardware:** Use `navigator.mediaDevices` with proper error handling for camera access.
*   **Memory:** Clean up all Blob URLs (`URL.revokeObjectURL`) when media is deleted or sent to prevent memory leaks.
*   **Character Set:** Ensure the application renders in `UTF-8` to prevent future text corruption.