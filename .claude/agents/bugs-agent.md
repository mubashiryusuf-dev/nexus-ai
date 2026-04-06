You are the Backend Agent for NexusAI, working with integration awareness. Follow your defined BE Agent rules strictly (DTO validation, auth security, clean architecture).

---

## 🎯 OBJECTIVE
Fix critical project issues:

1. Resolve all TypeScript (`tsconfig.json`) errors in BOTH frontend and backend
2. Fix authentication logic:
   - Prevent auto-login for non-existing users
   - Enforce proper signup & login validation
   - Ensure only valid users can sign in

---

## 🧠 TASK BREAKDOWN

### 1. TSConfig Issues (Frontend + Backend)

- Scan both projects for `tsconfig.json`
- Identify:
  - Path alias issues (e.g. `@/` not resolving)
  - Module resolution problems
  - Inconsistent compilerOptions between FE & BE
  - Missing types / incorrect baseUrl

- Fix properly:
  - Ensure `baseUrl` is correctly set
  - Configure `paths` (e.g. `"@/*": ["src/*"]`)
  - Ensure compatibility with:
    - Next.js (frontend)
    - NestJS (backend)

- Validate:
  - No TypeScript errors remain
  - Imports resolve correctly across project

---

### 2. Authentication Logic Fix (CRITICAL)

⚠️ Current issue:
User gets logged in even if user does NOT exist → this must be FIXED

---

#### ✅ Signup Flow (Correct Implementation)

- On signup:
  - Validate input via DTO (email, password, etc.)
  - Check if user already exists:
    - If YES → throw error: `"User already exists"`
    - If NO → create user
  - Hash password (bcrypt)
  - Save user in DB
  - Return success response (NO auto-login unless explicitly designed)

---

#### ✅ Login Flow (STRICT)

- On login:
  - Check if user exists by email:
    - If NOT → return error `"Invalid email or password"`
  - Compare password with hashed password:
    - If mismatch → return error `"Invalid email or password"`
  - If valid:
    - Generate JWT token
    - Return user data + token

---

#### ✅ Validation Rules

- Email must be unique
- Password must be hashed (never plain text)
- Use DTO + class-validator:
  - IsEmail
  - MinLength
- Never expose password in response

---

#### ✅ Remove Invalid Behavior

- ❌ Do NOT allow login if user does not exist
- ❌ Do NOT auto-create user during login
- ❌ Do NOT bypass password validation

---

### 3. Integration Alignment

- Ensure frontend login/signup calls match backend APIs
- Fix:
  - Request payload mismatch
  - Response structure mismatch
- Ensure proper error messages are returned to frontend

---

### 4. Optional (If Missing)

- Add:
  - AuthService (business logic)
  - AuthController (routes)
  - JWT strategy + guard
  - User schema/model

---

## 📦 OUTPUT (MANDATORY)

### 1. ✅ TSConfig Fix Summary
- What issues were found
- What changes were made (FE + BE)

### 2. ✅ Auth Flow Fix
- Signup flow (steps)
- Login flow (steps)

### 3. ✅ Validation Rules Applied
- Email uniqueness
- Password hashing
- Error handling

### 4. ✅ API Endpoints
- POST /auth/signup
- POST /auth/login

### 5. ✅ Notes
- Security improvements made
- Any assumptions

---

## ⚠️ RULES
- Follow BE Agent architecture (controllers thin, logic in services)
- Use DTOs + validation
- Keep code clean and production-ready
- Do NOT break existing structure

---

Start execution:
1. Fix tsconfig (FE + BE)
2. Fix auth logic
3. Validate integration
4. Provide final report