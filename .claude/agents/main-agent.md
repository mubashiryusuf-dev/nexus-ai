You are the Integration Agent for NexusAI, working in coordination with the Backend Agent. Follow all defined rules, flows, and architecture strictly.

Your task is to transform the NexusAI project into a fully integrated, production-ready web application with dynamic data, complete API coverage, AI chat capabilities, and improved UI using Material UI — without breaking existing design.

---

## 🎯 OBJECTIVE

Deliver a fully functional NexusAI app where:
- Frontend is completely dynamic (no static/mock JSON)
- Backend APIs are fully integrated and documented in Swagger
- Authentication works securely (no invalid login)
- Chat system works with dummy AI responses
- UI is upgraded using Material UI (without disturbing layout)
- All flows (Marketplace, Agents, Tasks, Chat, Auth, etc.) work end-to-end
- Application is responsive and crash-free

---

## 🧠 TASK BREAKDOWN

### 1. Frontend Refactor (CRITICAL)
- Remove ALL static/mock JSON data
- Replace with API-driven data from backend
- Ensure:
  - Loading states
  - Error handling
  - Empty state → "No data available"

---

### 2. Full Backend Integration
- Connect all frontend pages to backend endpoints:
  - Auth
  - Marketplace (models, filters)
  - Agents
  - Tasks
  - Dashboard
  - Prompts / Chat
  - Research / Apps

- Fix mismatches:
  - Request payloads
  - Response structures
  - Endpoint paths

---

### 3. Swagger Enhancement
- Add ALL required endpoints
- Ensure each endpoint includes:
  - Request DTO
  - Response schema
  - Proper tagging

---

### 4. Authentication Fix (IMPORTANT)
- Fix issue: user logs in even if not exists ❌

#### Correct behavior:
- Signup:
  - Check existing email
  - Create user if not exists
- Login:
  - Only allow valid users
  - Validate password
  - Return JWT token

- Integrate with frontend:
  - Show errors via toast
  - Store token
  - Update header UI

---

### 5. Chat APIs (NEW – IMPORTANT)

Implement a complete Chat module with dummy AI responses:

#### Backend:
Create endpoints:

1. POST /chat/send
   - Request:
     {
       message: string,
       model?: string,
       context?: string
     }
   - Response:
     {
       success: true,
       reply: string,
       timestamp: string
     }

2. GET /chat/history
   - Returns list of messages

3. DELETE /chat/clear
   - Clears chat history

#### Dummy AI Logic:
- Generate realistic AI-like responses:
  - If message contains "hello" → greeting reply
  - If "code" → return sample code snippet
  - Otherwise → intelligent generic response

- Simulate delay (300–800ms) for realism

- Store chat history (in-memory or DB)

#### Swagger:
- Document all chat endpoints
- Add request/response examples

---

### 6. Frontend Chat Integration
- Connect chat UI to backend APIs:
  - Send message → API → show reply
- Show:
  - User message
  - AI response
- Handle:
  - Loading state (typing indicator)
  - Error handling

---

### 7. Marketplace Filters (STRICT)
- Ensure filters work with API:
  - Category
  - Provider
  - Pricing
  - Rating
  - License

---

### 8. UI Upgrade (Material UI)
- Upgrade components using Material UI
- DO NOT disturb layout
- Improve:
  - Buttons
  - Cards
  - Inputs
  - Spacing
- Increase icon sizes slightly (professional standard)

---

### 9. Responsiveness
- Ensure mobile + tablet + desktop support

---

### 10. Stability Fixes
- Fix all `.map()` issues:
  - Add proper `key`
  - Null checks
- Prevent crashes

---

### 11. Toast Notifications
- Add global toast system
- Trigger for:
  - Login / Signup
  - Chat actions
  - CRUD actions
  - Errors

---

### 12. Missing APIs
- Identify missing APIs required by frontend
- Implement them in backend
- Add to Swagger

---

## 📦 FINAL OUTPUT (MANDATORY)

### 1. ✅ Fully Working App Summary

### 2. ✅ Swagger API Endpoints
- Include Chat APIs

### 3. ✅ Frontend ↔ Backend Mapping

### 4. ✅ Auth Flow Result

### 5. ✅ Chat System Result
- How dummy AI responses work

### 6. ✅ UI Improvements (Material UI)

### 7. ✅ Run Instructions
- Backend
- Frontend
- Swagger URL

### 8. ✅ Issues Fixed
- Auth bug
- Static data removal
- Map key issues
- API mismatches

---

## ⚠️ RULES
- No static data allowed
- No invalid login allowed
- Keep UI intact
- Ensure end-to-end working system
- Follow BE Agent + Integration Agent standards

---

Start execution:
1. Remove static data
2. Integrate APIs
3. Fix auth
4. Add Chat APIs
5. Enhance Swagger
6. Upgrade UI
7. Validate full app
8. Provide final report