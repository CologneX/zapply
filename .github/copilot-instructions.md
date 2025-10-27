# Zapply - Copilot Instructions

## Project Overview

**Zapply** is a Next.js 15 AI-powered resume and cover letter tailoring platform. Users input job descriptions, and Gemini AI generates suggestions to optimize their resumes/cover letters for job matching.

**Tech Stack:**
- Frontend: Next.js 15 (with Turbopack), React 19, TypeScript
- Styling: Tailwind CSS 4 + shadcn/ui components
- Database: MongoDB with better-auth for authentication
- AI: Google Gemini API for resume suggestions
- Data fetching: TanStack React Query
- Forms: React Hook Form + Zod validation

---

## Architecture Patterns

### 1. **Authentication with Better Auth**
- Located: `lib/auth.ts`
- **Flow:** Email/password + OTP verification → session via cookies
- **Key Plugins:** `emailOTP`, `username`, `nextCookies`, Google OAuth
- **Session Access:** `auth.api.getSession({ headers: await headers() })` in Server Components
- **Client Access:** Use `useSession()` hook from `lib/auth-client` (auto-managed)
- **Middleware:** Protects routes in `middleware.ts` (dashboard, profile, resume, coverletter)
- **Pattern:** Use `headers()` server-side; never pass session as props

### 2. **Database Structure**
- MongoDB collections auto-indexed: `profiles`, `resumes`, `coverLetters`
- **Field Convention:** All timestamps use ISO strings (`createdAt`, `updatedAt`), soft deletes via `deletedAt`
- **ID Pattern:** `_id: ObjectId` in DB, converted to strings via Zod schemas for API responses
- **User Scoping:** All user data linked via `user_id: ObjectId` foreign key

### 3. **Server Actions & API Routes**
- **Server Actions** (`"use server"`) for mutations → `services/[resource].service.ts`
  - Example: `CreateResumeAction`, `DeleteResumeAction` in `services/resume.service.ts`
  - Always: Extract session → validate user ID → validate data with Zod → mutate DB
- **API Routes** (ReST) for GET operations → `app/api/v1/[resource]/route.ts`
  - Example: `GET /api/v1/resume` returns all user resumes
- **Return Pattern:** Server Actions return `{ error?: string, id?: string }` or `undefined`; APIs return JSON

### 4. **Type Safety with Zod**
- **Convention:** Define schemas, then derive types: `z.infer<typeof Schema>`
- **Files:** `types/[resource].types.ts` contain all Zod schemas
- **Client vs Server Types:** Separate schemas for client input (`ClientCreateResumeSchema`) vs DB storage (`CreateResumeSchema`)
- **Validation Pattern:** Always validate API responses: `Schema.safeParse(data)` before consuming
- **Example:** `ResumeSuggestionSchema` + `GenerateResumeRequestSchema` combine into `GeneratedResumeSuggestionReturnSchema`

### 5. **AI Integration (Gemini)**
- **Setup:** `lib/gen-ai.ts` exports `geminiClient` configured with API key
- **Schema Validation:** Define response structure with JSON schema (e.g., `ResumeSuggestionsGeminiSchema`)
- **Use Pattern:** Prompt Gemini with structured output schema → validate response → return typed data
- **Current Use:** Resume/cover letter suggestions based on job description

### 6. **Data Fetching & Caching**
- **React Query Setup:** `lib/query-client.ts` with default options (5min stale time, no auto-refetch)
- **Query Hooks:** `hooks/query/use-*.ts` (e.g., `use-resume.ts`)
- **Pattern:** Custom hooks handle query + mutations + side-effects (toast, navigation)
- **Query Keys:** Centralized in `types/query-keys/` (e.g., `resumeKeys.all`)
- **Mutations:** Use `.mutateAsync()` for controlled promises; `.onSuccess()` for cache invalidation

### 7. **Form Handling**
- **Wrapper:** `AppForm` + `AppFormField` in `components/common/form.tsx` (DRY error/label handling)
- **Pattern:** Use React Hook Form + Zod resolver; `useForm<TypeFromSchema>()`
- **Multi-Form Example:** `create-resume/_components/form.tsx` uses two forms (generate + create) with state toggle
- **Dynamic Fields:** Use `FormField` with `field` object `{...field}` pattern

### 8. **Routing**
- **Centralized:** `lib/routes.ts` exports `RouteURL` enum and `routesMap`
- **Structure:**
  - `(auth)` group: signin, signup, confirm-email
  - `(main)` group: dashboard, profile, create-resume, create-cover-letter, `u/` (public profiles)
- **Navigation:** Always use enum constants: `router.push(RouteURL.DASHBOARD)`

### 9. **Component Organization**
- **Layout:** `app/` → `(auth)/`, `(main)/`, `api/`; grouped by route feature
- **UI Components:** `components/ui/` (shadcn/ui primitives + custom) + Tailwind classes
- **Common Components:** `components/common/` (reusable form, dialog, header, etc.)
- **PDF Components:** `components/pdf/` (React PDF templates)
- **Feature Components:** `_components/` subfolder in feature routes (e.g., `create-resume/_components/form.tsx`)

---

## Developer Workflows

### Build & Development
```bash
# Start dev server (uses Turbopack for faster builds)
bun run dev

# Build for production
bun run build

# Linting
bun run lint
```

### Adding shadcn/ui Components
```bash
# Use bun with shadcn CLI (configured in components.json)
bun x shadcn@latest add [component-name]
```

### Environment Setup
Required `.env.local`:
- `DB_CONN_STRING`: MongoDB connection
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: OAuth
- `GOOGLE_GENAI_API_KEY`: Gemini API
- `SMTP_*`: Email service credentials
- `EMAIL_FROM`: Sender email

---

## Project-Specific Conventions

1. **Imports:** Use `@/` alias for all imports (configured in `tsconfig.json`)
2. **Styling:** Tailwind + OKLch CSS variables (modern color space) → check `globals.css`
3. **Dynamic Imports:** Use for heavy components (Rich Text Editor, PDF Renderer) with SSR: false fallback
4. **Error Handling:** Toast errors from mutations; form-level errors via `.setError("root", { ... })`
5. **Timestamps:** Always store/compare as ISO strings; use `transformProfileDates()` for client normalization
6. **Session Checks:** Every server action checks `session?.user?.id` first → return `{ error: "Unauthorized" }`

---

## Critical Integration Points

- **Resume Generation Flow:** Client inputs job → calls `GenerateResume.mutateAsync()` → fetch `/api/v1/resume/generate` → returns suggestions + profile → populate create form → user refines → `CreateResume.mutateAsync()` → save to DB
- **Authentication Flow:** SignUp/SignIn → email OTP verification → session cookie → accessible in server/client contexts
- **PDF Export:** Resume/cover letter data → React PDF component → server-side rendering → `generateServerPDF()`

---

## Quick Reference

| Task | Location |
|------|----------|
| Add new route | `app/(main)/[feature]/page.tsx` or `(auth)/[page]/page.tsx` |
| Add new mutation | `services/[resource].service.ts` + `hooks/query/use-[resource].ts` |
| Add schema/types | `types/[resource].types.ts` |
| Styled form field | Use `AppFormField` wrapper in `components/common/form.tsx` |
| Toast notification | `import { toast } from "sonner"`; use in mutations `.onError()` |
| Protect route | Add matcher to `middleware.ts`; middleware runs before render |
| Database collection | Auto-indexed in `lib/db.ts`; define in collection update hook |

---

**For AI agents:** Start with `app/(main)` for feature development; understand the auth flow before adding protected endpoints; validate all external data with Zod. Reference `create-resume/` as the most complex feature example.
