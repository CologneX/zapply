# Zapply AI Development Guide

## Project Overview
Zapply is a Next.js 15 (App Router) application for building CVs and cover letters with AI assistance. It uses React Server Components, Better Auth for authentication, MongoDB for data persistence, and TanStack Query for client-side state management.

## Tech Stack & Key Dependencies
- **Framework**: Next.js 15 with Turbopack, React 19
- **Authentication**: `better-auth` with email OTP verification and username plugins
- **Database**: MongoDB with `mongodb` driver (direct access, no ORM)
- **State Management**: `@tanstack/react-query` for async state
- **Forms**: `react-hook-form` + `@hookform/resolvers` with Zod schemas
- **UI**: shadcn/ui components (New York style) + Radix UI primitives
- **Styling**: Tailwind CSS v4 with `tailwind-merge` and `clsx` via `cn()` utility

## Architecture Patterns

### Server Actions & Client Separation
- **All service files** (`services/*.service.ts`) use `"use server"` directive for Next.js Server Actions
- **All React components** that use hooks/state require `"use client"` directive
- Server Actions handle auth, validation, database ops, and redirects
- Client components handle UI interaction and call mutations via TanStack Query

Example flow: Form submission → `useAuthQuery()` mutation → `SignInAction` server action → `auth.api` call → redirect

### Authentication Flow
Auth is centralized in `lib/auth.ts`:
- Better Auth with MongoDB adapter
- Database indexes created on startup: `profiles.user_id`, `resumes.user_id + createdAt`, `coverLetters.user_id + createdAt`
- Email OTP verification (10 min expiry) with Nodemailer
- Session cookies with 5-minute cache
- Middleware (`middleware.ts`) protects `/dashboard/*` routes
- On email verification failure (403), redirects to `RouteURL.CONFIRM_EMAIL` with email param

### Data Validation & Types
- Zod schemas in `types/*.types.ts` define both validation and TypeScript types
- Use `z.infer<typeof Schema>` pattern for type extraction
- Server Actions validate inputs with `.safeParse()` before processing
- Forms use `zodResolver` to integrate Zod with react-hook-form

### Form & Component Patterns
Forms use custom wrappers for consistency:
- `AppForm` wrapper handles form provider + global error display
- `AppFormField` wraps FormItem/FormLabel/FormControl/FormMessage
- `Button` component has `loading` prop that shows spinner and disables button
- Dialog system uses pub/sub pattern via `openDialog()`/`closeDialog()` - no prop drilling

### Route Organization
App Router structure:
- `(auth)/*` - Unauthenticated routes (signin, signup, confirm-email)
- `(main)/*` - Authenticated routes with shared Header layout
- Route constants in `lib/routes.ts` as `RouteURL` enum - always use these, never hardcode paths
- Dynamic routes: `/u/[username]` for user profiles

### State Management
- Server state via TanStack Query mutations (`hooks/query/use-*.ts`)
- Query hooks return mutation objects: `{ mutateAsync, isPending, error }`
- No global client state - prefer server state or URL params
- Session data fetched server-side in layouts via `auth.api.getSession({ headers: await headers() })`

### Styling Conventions
- Use `cn()` utility for conditional classes (from `lib/utils.ts`)
- Prefer Tailwind utilities over custom CSS
- Component variants via `class-variance-authority` (see `components/ui/button.tsx`)
- Custom CSS properties for theming (e.g., `--header-height`)

## Development Workflow

### Running the App
```bash
bun dev          # Start dev server with Turbopack
bun build        # Production build
bun start        # Start production server
bun lint         # Run ESLint
```

### Environment Variables Required
```
DB_CONN_STRING     # MongoDB connection string
SMTP_HOST          # Email service host
SMTP_PORT          # Email service port
SMTP_USER          # SMTP username
SMTP_PASS          # SMTP password
EMAIL_FROM         # Sender email address
```

### Adding New Features
1. **New service action**: Add to `services/*.service.ts` with `"use server"`, validate with Zod, use try/catch with `APIError` handling
2. **New query hook**: Create mutation in `hooks/query/use-*.ts`, call server action in `mutationFn`
3. **New form**: Use `AppForm` + `AppFormField`, integrate with `zodResolver`, handle submission via query hook
4. **New route**: Add to `RouteURL` enum first, then create page in appropriate route group
5. **New UI component**: If from shadcn, check `components.json` for config; use `"use client"` if interactive

### Database Access
- Direct MongoDB access via `db` export from `lib/auth.ts`
- Collections: `users`, `sessions`, `profiles`, `resumes`, `coverLetters`
- No schema migrations - indexes created on app startup
- Use ObjectId for `_id` and `user_id` fields (see `types/helper.types.ts`)

## Key Files Reference
- `lib/auth.ts` - Auth configuration, DB connection, email templates
- `middleware.ts` - Route protection logic
- `lib/routes.ts` - Centralized route constants
- `app/providers.tsx` - QueryClient and global providers setup
- `components/common/form.tsx` - Reusable form components
- `components/common/dialog.tsx` - Dialog pub/sub system

## Common Patterns

### Error Handling in Server Actions
```typescript
try {
  await auth.api.someMethod({ body: validatedData });
} catch (error) {
  const err = error as APIError;
  if (err.statusCode === 403) {
    redirect(`${RouteURL.CONFIRM_EMAIL}?email=${email}`);
  }
  return { error: err.body?.message || "Fallback message" };
}
```

### Form Component Structure
```typescript
const form = useForm<SchemaType>({
  defaultValues: { ... },
  resolver: zodResolver(Schema),
});
const { Mutation } = useQueryHook();

// In submission: set root error if server action returns error
if (req.error) {
  form.setError("root", { type: "manual", message: req.error });
}
```

### Session Access in Server Components
```typescript
const sessionData = await auth.api.getSession({
  headers: await headers(),
});
```
