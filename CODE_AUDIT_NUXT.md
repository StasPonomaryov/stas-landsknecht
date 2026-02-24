# Nuxt Frontend Audit (Senior-level)

## Critical issues

1. **Potential cross-user data leakage in analytics**  
   `getTasksOfTheYear` queries all tasks by year and does not filter by current user, while other pages rely on user-scoped `fetchUserTasks`. This can expose other users' task data in charts and metrics if Firestore rules are permissive/misconfigured.

2. **Incorrect previous-year logic on analytics page**  
   In `pages/index.vue`, the condition uses `tasksStore.tasks.values.length`, but `tasks` is an array and has no `values.length` property. This makes the branch logic incorrect and can break comparisons for “last period”.

3. **Auth persistence model is unsafe/inconsistent**  
   The entire Firebase `User` object is persisted in Pinia storage (`persist: true`). Firebase User includes volatile/non-serializable internals and can become stale across reloads/tabs. This should be replaced with `onAuthStateChanged` hydration and a minimal serializable auth snapshot.

4. **Global auth middleware can produce false redirects/flicker**  
   `auth.global.ts` checks only `authStore.user` synchronously and redirects immediately. On first load (before auth rehydration), authenticated users can be redirected to `/login` incorrectly.

## High-priority issues

5. **Composable initialization race and weak typing in auth helper**  
   `useFirebaseAuth` delays store init via `onNuxtReady` + timeout fallback and uses `any`. This is brittle and can still race in edge cases. The composable should get store synchronously within setup context and rely on Firebase auth state events.

6. **Runtime config for Firebase is incomplete by default**  
   In `nuxt.config.ts`, most Firebase public config fields are empty strings by default (`authDomain`, `projectId`, etc.). This silently initializes Firebase with invalid config and shifts failures to runtime.

7. **Wrong exported client form types in validators**  
   `EditClientFormData` and `EditClientFormErrors` are mistakenly derived from task schema types (`editTaskFormSchema`, `EditTaskFormData`). This is a type-level defect that can hide real bugs and break DX.

8. **Duplicate state updates after create actions**  
   `addTask` and `addClient` call fetch methods and then additionally `push` the created item, risking duplicates depending on fetch timing and backend consistency.

## Medium-priority issues

9. **UI className typos in table columns**  
   Both task and client column renderers contain `class: 'text-left font-medium]'` (extra bracket), leading to unintended CSS class values.

10. **Type mismatch around task status**  
   Domain types define `Task.status` as `number`, while validation uses enum strings (`processing/done/cancelled`) and conversion utility. This split model is fragile and should be unified (single source of truth + explicit mapping type).

11. **Dead/unused code and imports in key files**  
   Multiple files contain unused imports and variables (`tailwindcss` import in `nuxt.config.ts`, unused `event` in submit handler, some table imports). This increases noise and maintenance cost.

12. **No lint/typecheck quality gate in scripts**  
   `package.json` has no lint/typecheck scripts, so many static issues won’t fail CI by default.

## Build/runtime warnings observed

- Build reports repeated failures to fetch external font providers (google, bunny, fontsource, fontshare) in current environment. The build completes but with warning/error noise and risk of non-deterministic assets.
- Bundle warnings show very large client chunks (>500 kB), indicating code-splitting and dependency optimization opportunities.
- Third-party `vue3-charts` bundle uses `eval`, flagged by Rollup security/perf warning.

## Fix plan

### Phase 1 — Security & auth correctness

1. Add strict user scoping to analytics queries (`where('users', 'array-contains', uid)`) and pass `uid` explicitly.
2. Replace persisted full `User` object with controlled auth state:
   - subscribe to `onAuthStateChanged`
   - store only needed serializable fields (`uid`, `displayName`, `email`, avatar)
   - expose `isAuthResolved` flag to middleware.
3. Update global middleware to wait for auth resolution before redirecting.

### Phase 2 — Data correctness

4. Fix `tasksStore.tasks.values.length` bug and align previous-period calculation logic.
5. Remove duplicate post-create pushes; pick one source-of-truth flow (optimistic insert or refetch, not both).
6. Correct validator exports for client edit types.

### Phase 3 — Type/model consistency

7. Unify task status model (prefer string literal union in UI + DB or strongly typed enum mapping layer).
8. Strengthen composables/stores typing; remove `any` from auth composable.

### Phase 4 — UX/performance hardening

9. Fix table class typos and run UI regression checks.
10. Add scripts: `lint`, `typecheck`, `test` (at least smoke).
11. Add route-level/code-level dynamic imports for heavy chart/editor blocks and split oversized chunks.
12. Decide deterministic font strategy (local/self-hosted fallback or disable remote provider in CI).

### Phase 5 — CI enforcement

13. Gate PRs with `pnpm typecheck`, `pnpm lint`, and production build.
14. Add minimal e2e smoke for auth redirect + add/edit flows.
