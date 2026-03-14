# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack) at http://localhost:3000
npm run build        # Production build
npm run type-check   # TypeScript check (tsc --noEmit)
```

> **Note**: The `.bin/next` and `.bin/tsc` files in `node_modules/.bin/` must be symlinks, not static copies. If they get corrupted (e.g. from a rsync/cp of node_modules), fix with:
> ```bash
> rm node_modules/.bin/next && ln -s ../next/dist/bin/next node_modules/.bin/next
> rm node_modules/.bin/tsc  && ln -s ../typescript/bin/tsc node_modules/.bin/tsc
> ```

## Architecture

### Tech Stack
- **Next.js 16** (App Router) · **TypeScript** · **Tailwind CSS v4** · **Auth.js v5 (next-auth@beta)**
- **Zod v4** + **react-hook-form** for form validation
- No external database — in-memory mock data (swap boundary for Payload CMS)

### Application Purpose
Hotel Lost-and-Found management. Two user roles:
- **Guest** — reports lost/forgotten items at `/guest/*`
- **Staff / Admin** — logs found items, reviews matches, resolves cases at `/staff/*`

### Route Structure
```
src/app/
├── (auth)/           # login, register, forgot-password (shared centered layout)
├── guest/            # Protected: role=guest → /guest/dashboard, /guest/report/*
├── staff/            # Protected: role=staff|admin → /staff/dashboard, etc.
└── api/              # REST API routes (auth, lost-items, found-items, matches, notifications)
middleware.ts         # Edge middleware: role-based redirects for /guest/* and /staff/*
```

### Data Flow — Repository Pattern
All data access goes through a service → repository chain. **This is the CMS swap boundary**:

```
API Route → Service (src/lib/services/) → IRepository<T> → MockRepo (now) / PayloadRepo (future)
```

- `src/lib/repositories/types.ts` — `IRepository<T>` interface (findAll/findById/create/update/delete)
- `src/lib/repositories/mock/` — In-memory repos seeded from `src/lib/mock-data/`. Each repo is pinned to `globalThis` so all API routes and server components share the same instance within a single Node.js process (same pattern as database connections)
- `src/lib/repositories/payload/` — Stub directory for future Payload CMS repos
- `src/lib/services/` — Business logic (matchService, lostItemService, foundItemService, notificationService, userService)

To swap to Payload CMS: implement each repo in `src/lib/repositories/payload/` and update the import in each service file. Nothing else changes.

### Auth
- Auth.js v5 with Credentials provider + JWT strategy
- Config: `src/lib/auth/auth.ts`
- Session augmented with `role` and `hotelId` in `src/types/next-auth.d.ts`
- Middleware guards `/guest/*` (role=guest) and `/staff/*` (role=staff|admin)

### Domain Types
All types in `src/types/models.ts`. Key entities: `User`, `Hotel`, `LostItemReport`, `FoundItem`, `Match`, `Notification`.

### Component Tiers
1. `src/components/ui/` — Primitive components (Button, Input, Select, Card, Badge, Spinner, Textarea) — hand-written shadcn-compatible components
2. `src/components/layout/` — Shell components (GuestNav, StaffSidebar, NotificationBell)
3. `src/components/features/` — Domain composites per feature (lost-items, found-items, matches, notifications, dashboard)

### Matching System
`src/lib/services/matchService.ts` implements `runAutoMatch()` which scores candidate found items against a new lost report using category match (50pts) + date proximity (up to 30pts) + same hotel (20pts). Matches ≥70 are auto-created as `pending`.

### Notifications
`src/context/NotificationContext.tsx` polls `/api/notifications` every 30s for unread count. Used by `NotificationBell` in both nav components.

### Demo Credentials (mock data)
| Role  | Email                         | Password    |
|-------|-------------------------------|-------------|
| Guest | alice@example.com             | password123 |
| Staff | staff@grandseaside.com        | password123 |
| Admin | admin@grandseaside.com        | password123 |

### Environment
`.env.local` requires `AUTH_SECRET` and `NEXTAUTH_URL`. See `.env.local` for current dev values.

### Zod v4 Notes
- `z.enum()` message syntax: `z.enum(values, "message")` not `{ errorMap: ... }`
- `photoUrls` is `.optional()` in schemas to avoid react-hook-form resolver type mismatch
