# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Dev server at http://localhost:5000
pnpm build      # Production build
pnpm preview    # Preview production build
```

Typecheck: `pnpm typecheck` (or `npx nuxi typecheck`). No lint script yet (see `CODE_AUDIT_NUXT.md` issue #12).

## Environment

All Firebase variables use the `NUXT_PUBLIC_` prefix so Nuxt auto-maps them to `runtimeConfig.public`. The app disables Firebase auth/Firestore when any value is missing (see `plugins/firebase.ts`):

```
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
BASE_URL=http://localhost:5000
```

## Architecture

### Stack
- **Nuxt 3** (SSR disabled for auth-sensitive routes via `import.meta.server` guards)
- **Firebase** — Firestore (database), GitHub OAuth (auth only)
- **Pinia** + `pinia-plugin-persistedstate` — state management; auth store persists only serializable user fields
- **Shadcn-nuxt** + **Nuxt UI** + **Tailwind CSS v4** — UI components
- **TanStack Vue Table** — tables for tasks and clients
- **Zod** — form validation (`shared/utils/validators.ts`)
- **TipTap** — rich text editor in task forms
- **vue3-charts** — analytics charts

### Auth flow

1. `plugins/firebase.ts` — validates config, initializes Firebase app, provides `$auth` and `$firestore` to the Nuxt app (or `null` if config invalid).
2. `plugins/auth-state.client.ts` — calls `authStore.initializeAuth($auth)`, which subscribes to `onAuthStateChanged` and sets `isAuthResolved = true` after the first Firebase callback.
3. `middleware/auth.global.ts` — on client, waits (via `watch`) for `isAuthResolved` before checking `authStore.user`; redirects to `/login` if unauthenticated. Skips on server to avoid SSR deadlock.
4. `composables/useFirebaseAuth.ts` — exposes `signInWithGitHub`, `signOutUser`, `getCurrentUser`.

### State stores (`stores/`)

- **`auth.ts`** — `AuthUser` (uid, email, displayName, photoURL), `isAuthResolved`, `_authInitialized`. Persists only `user`.
- **`tasks.ts`** — `tasks: Task[]`. All write operations use `fetchUserTasks(uid)` to reload after mutations. Batch deletes via Firestore `writeBatch`.
- **`clients.ts`** — `clients: Client[]`. Same pattern as tasks.

### Data model (`types/index.ts`)

- **`Task`** — has `status: number` in the domain type, but validators and UI use string enums (`'processing' | 'done' | 'cancelled'`). `shared/utils/index.ts:convertStatusToText/convertStatusToNumber` maps between them. This split is a known inconsistency.
- **`Client`** — `{ id, name, description, contacts, users: string[] }`.
- Both entities use a `users: string[]` field for ownership; Firestore queries filter with `where('users', 'array-contains', uid)`.

### Page structure

- `/` — Analytics dashboard: year picker, 4 charts (monthly order count, monthly income, top clients by count, top clients by income). Data fetched via `composables/useAnalytics.ts`.
- `/tasks/` — CRUD: index table, add, edit, remove (confirm dialog at `pages/confirm.vue`).
- `/clients/` — CRUD: index table, add, edit, remove.
- `/login` — uses `guest` layout (no sidebar/header).

### Layouts

- `layouts/default.vue` — `Header + Sidebar + <slot> + Footer`
- `layouts/guest.vue` — bare layout for unauthenticated pages

### Key conventions

- Firestore is accessed inside store actions via `useNuxtApp().$firestore as Firestore` — always guard with `if (!db)`.
- `nanoid` is used to generate entity IDs client-side before writing to Firestore.
- `lib/utils.ts:cn()` is the standard Tailwind class merging utility (clsx + tailwind-merge).
- Form validators live in `shared/utils/validators.ts`; table column definitions live in `components/tasks/columns.ts` and `components/clients/columns.ts`.
