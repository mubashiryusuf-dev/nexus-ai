You are the Backend Agent for NexusAI. Follow your defined role, domain modules, and rules strictly.

Your task is to upgrade and finalize the backend + align it with the frontend so the system becomes fully functional, testable via Swagger, and runnable locally.

---

## 🎯 OBJECTIVE
Enhance the existing backend by:
1. Adding full Swagger (OpenAPI) documentation
2. Switching database to local MongoDB
3. Ensuring all domain modules have working endpoints (with dummy/mock responses where needed)
4. Aligning all APIs with frontend usage

---

## 🧠 EXECUTION PLAN

### 1. Project Analysis
- Scan the entire backend structure (modules, controllers, services, schemas).
- Identify missing or incomplete implementations across all domain modules.
- Ensure architecture follows NestJS best practices (modular, scalable, clean).

---

### 2. Swagger Integration
- Install and configure Swagger in NestJS (`@nestjs/swagger`)
- Initialize Swagger in main.ts
- Add:
  - @ApiTags for each module (Auth, Agents, Models, etc.)
  - @ApiOperation, @ApiResponse for each endpoint
  - DTO-based request/response schemas
- Ensure Swagger UI runs at: `/api-docs`
- Every endpoint must be visible and testable in Swagger

---

### 3. Database Refactor
- Remove any cloud/cluster MongoDB connection
- Replace with local MongoDB connection:
  - mongodb://localhost:27017/nexusai
- Update `.env` and config files
- Ensure app runs locally without errors

---

### 4. Endpoint Completion (VERY IMPORTANT)
For ALL domain modules defined in your agent:

- Ensure each module has:
  - Controller
  - Service
  - DTOs
  - Schema (Mongoose)

- If real logic is incomplete:
  → Add realistic dummy/mock responses
  → Responses must follow proper structure (success, data, message)

- Cover especially:
  - Auth (register, login, JWT, guards)
  - Agents (CRUD, wizard steps, memory)
  - Models & Marketplace (filters, pagination)
  - Tasks
  - Chat & Prompts
  - Deployment
  - Dashboard metrics

---

### 5. Authentication Enforcement
- Implement JWT auth properly
- Add guards to all protected routes
- Hide sensitive fields (passwords, tokens)
- Ensure Swagger supports auth (Bearer token)

---

### 6. Frontend Alignment
- Analyze frontend API usage (endpoints, payloads)
- Map frontend calls to backend APIs
- Fix mismatches:
  - Routes
  - Request body
  - Response structure
- Ensure all frontend APIs have working backend equivalents

---

### 7. Code Quality Rules (STRICT)
- Keep controllers thin
- Business logic only in services
- Use DTOs with class-validator
- Strong typing everywhere
- Reusable logic (no duplication)
- Clean folder structure

---

## 📦 FINAL OUTPUT (MANDATORY)

Provide a clear structured output:

### 1. ✅ Swagger API Endpoints
- Grouped by modules (Auth, Agents, Models, etc.)
- Include route + method + description

### 2. ✅ Frontend API Mapping
- List all frontend APIs
- Show mapped backend endpoint for each

### 3. ✅ Backend Run Instructions
- Install dependencies
- Setup `.env`
- Start command (e.g. npm run start:dev)

### 4. ✅ Swagger Access
- URL (e.g. http://localhost:3000/api-docs)

### 5. ✅ Notes
- Dummy data added
- Any assumptions made
- Missing frontend/backend gaps fixed

---

## ⚠️ IMPORTANT CONSTRAINTS
- Do NOT break existing working logic
- Ensure backend runs without errors
- Ensure all endpoints are testable via Swagger
- Ensure system works end-to-end (frontend ↔ backend)

---

Start execution step-by-step:
1. Analyze backend
2. Add Swagger
3. Fix DB
4. Complete modules
5. Align frontend
6. Provide final output