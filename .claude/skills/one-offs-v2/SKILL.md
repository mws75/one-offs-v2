---
name: one-offs-v2
description: Project context for Byte Size Tech (one-offs-v2) — a Next.js 13 Pages Router tech blog with Clerk auth, PlanetScale MySQL via Prisma, and tRPC. Load this at the start of a session so you don't have to re-read the whole codebase — covers architecture, data model, auth tiers, tRPC routers, pages, components, and conventions.
---

# Byte Size Tech — Project Context

A **personal tech blog** ("Byte Size Tech") where short-form markdown posts are displayed as tiles. Readers can like posts and track recently viewed ones. Only the admin (hardcoded email check + DB flag) can create, edit, and delete posts. Bootstrapped with `create-t3-app` v7.10.3.

## Stack

- **Next.js 13** Pages Router, **React 18**, **TypeScript**, **Tailwind CSS v3**.
- **MySQL on PlanetScale** accessed via **Prisma v5** ORM. Schema push: `npx prisma db push`.
- **Clerk** for auth (`@clerk/nextjs` v4.31). **tRPC v10** for the API layer with React Query v4. **superjson** as the transformer.
- **react-markdown** + **react-syntax-highlighter** (Prism `oneDark`) for post rendering. **html2canvas** + **jsPDF** for PDF export. **react-icons** (IoIos*, Md*, Lu*). **react-copy-to-clipboard**.
- `npm run dev` to run. `npm test` for Jest tests (co-located in `src/tests/`).

## Architecture (request flow)

```
Client component/page → api.<router>.<procedure>.useQuery/useMutation
  → tRPC handler (src/pages/api/trpc/[trpc].ts)
  → router procedure (src/server/api/routers/*.ts)
  → Prisma (ctx.prisma) → PlanetScale MySQL
```

- **tRPC context** (`src/server/api/trpc.ts`) is built per-request: calls `getAuth(req)` from Clerk to resolve `userId` and `profile_image_url`. Catches and ignores auth errors (unauthenticated users get `userId: null`).
- **All pages are client components** — no RSC data fetching. Pages gate themselves via Clerk's `useUser()` hook; there's no server-side route protection beyond the procedure middleware.
- `src/server/db.ts` — Prisma singleton client.

## Database (PlanetScale, `one-offs-v2` DB)

Schema defined in `prisma/schema.prisma`. Push changes with `npx prisma db push`.

| Model | Key fields | Notes |
|---|---|---|
| `Posts` | `id` (autoincrement), `user_name` (Clerk userId), `post` (markdown body ≤5000 chars), `title`, `profile_image_url` | Core content table |
| `Users` | `user_id` (Clerk userId, unique), `recent_posts_json` (JSON string, max 3 items), `liked_posts` (unused string), `profile_image_url`, `is_admin` (boolean) | App user record; created on first sign-in |
| `LikePosts` | `user_id`, `post_id` (FK → Posts), `post_liked` (always 1) | Many rows per user/post pair possible; deletion uses `findMany` + loop |
| `SearchQuery` | `id`, `query` | Not actively used in app |

Also contains `ltc_*` tables (`ltc_categories`, `ltc_emojis`, `ltc_macros_cache`, `ltc_recipes`, `ltc_users`) — these are shared from the Let Em Cook project's PlanetScale instance. Don't touch them from this app.

## Auth & Procedure tiers (`src/server/api/trpc.ts`)

Three procedure types — always use the right one:

| Procedure | Middleware | Use when |
|---|---|---|
| `publicProcedure` | None | Reads anyone can access (post list, single post, user profile) |
| `privateProcedure` | Throws `UNAUTHORIZED` if no `userId` | Mutations that require a logged-in user (likes, recently viewed, user creation) |
| `adminProcedure` | Throws `UNAUTHORIZED` or `FORBIDDEN`; checks `Users.is_admin` in DB | Post create/update/delete |

The Clerk middleware (`src/middleware.ts`) runs on all routes but just calls `NextResponse.next()` — it doesn't block or redirect. Pages handle their own auth checks.

## tRPC Routers (`src/server/api/routers/`)

### `posts` router

| Procedure | Type | Auth | Description |
|---|---|---|---|
| `getAll` | query | public | Returns all posts |
| `getUserPosts(user_name)` | query | public | Posts by Clerk userId |
| `getAllLikedPosts` | query | private | Full post objects for current user's likes (join via LikePosts) |
| `getById(id)` | query | public | Single post |
| `getByTitle(queryString)` | query | public | `contains` filter on title |
| `create(title, content, profile_image_url)` | mutation | admin | Creates post with `user_name = ctx.userId` |
| `delete(id)` | mutation | admin | Hard deletes a post |
| `update(id, title, content)` | mutation | admin | Updates title and body |

### `profile` router

| Procedure | Type | Auth | Description |
|---|---|---|---|
| `getAll` | query | public | All user records |
| `getById(id)` | query | public | Single user by Clerk userId |
| `getCurrentUser` | query | private | Returns `{ is_admin, user_id, profile_image_url }` for the current user |
| `insertNewUser(profile_image_url)` | mutation | private | Creates new `Users` row; called on first sign-in |
| `updateRecentlyViewed(content)` | mutation | private | Persists `recent_posts_json` string |

### `likedPosts` router

| Procedure | Type | Auth | Description |
|---|---|---|---|
| `getAllIDs` | query | private | Returns `[{ post_id }]` for all liked posts by current user |
| `create(user_id, post_id)` | mutation | private | Adds a like row |
| `delete(user_id, post_id)` | mutation | private | Deletes all matching like rows (findMany + loop, returns 1) |

## Pages (`src/pages/`)

- `/` (`index.tsx`) — Landing/home. Signed-out: logo + Sign In / Sign Up / About buttons. Signed-in: `RecentlyViewedObject` + `PostFeed` (search + post tiles) + admin-only "Create New Post" button + Sign Out.
- `/about` — Static about page (inline markdown via ReactMarkdown).
- `/post/[id]` — Single post detail. **Requires sign-in** (redirects with `RedirectToSignIn`). Renders full markdown with syntax highlighting + copy-to-clipboard. Updates recently-viewed on load. "Export PDF" button (html2canvas → jsPDF).
- `/newPost` — Create post. Admin only (checks `user.primaryEmailAddress` + uses `adminProcedure`). Live markdown preview while typing. Max 5000 chars.
- `/editPost/[id]` — Edit post. Admin only. Loads existing content, live preview, saves with `posts.update`.
- `/userProfile` — User profile. Shows liked posts (`LikedPostsSection`). If admin: also shows all their posts with delete and edit buttons.
- `/search` — Minimal; calls `posts.getByTitle` but only `console.log`s the result (unfinished).

## Components (`src/components/`)

- **`PageLayout`** (`layouts.tsx`) — Wraps all pages. `flex min-h-screen justify-center`, content capped at `lg:max-w-4xl`. Sets `document.title = "Byte-Size-Tech"`.
- **`PostFeed`** (`postFeed.tsx`) — The main content area on home. Fetches all posts + liked post IDs. Has inline search form (filter by title). Auto-creates the user DB record if it doesn't exist yet (first sign-in detection). Renders a grid of `PostObject` tiles.
- **`PostObject`** (`postobject.tsx`) — Individual post tile (w-64, h-40, slate-100). Shows title + author avatar. Thumbs-up toggle (filled `MdThumbUp` if liked, outline `LuThumbsUp` if not). Clicking the tile navigates to `/post/[id]`.
- **`LikedPostsSection`** (`likedPosts.tsx`) — List of liked posts with titles and avatars. Shown on user profile.
- **`RecentlyViewedObject`** (`recentlyViewedObject.tsx`) — Shows the last ≤3 viewed posts from `Users.recent_posts_json`.
- **`SearchBar`** (`searchBar.tsx`) — Standalone search bar component (also exists inline in PostFeed).
- **`LoadingSpinner` / `LoadingPage`** (`loadingspinner.tsx`) — Full-page and inline spinners.

## Utilities

### `src/server/helpers/dataHelper.ts`

Helpers for the `recent_posts_json` string (stored as a JSON-array-as-string):

- `udpatedRecentlyViewedJson(json, new_object)` — Maintains a max-3-item FIFO queue. Adds item if array < 3; if full and item not already there, pops last and prepends. No-op if already present. Called from `post/[id].tsx` `useEffect`.
- `convertJSONtoArray(jsonString, key)` — Parses a JSON string of objects and extracts a specific key into a flat array. Used to turn liked-post IDs into a plain number array.
- `combineJSONObjects(json1, json2)` — Merges two JSON-object strings into one (spread merge). Used in PostFeed to attach `liked` flag to post data.
- `checkIfValueExistsInJSONObject`, `checkLengthOfJSON` — Internal helpers.

### `src/utils/exportPDF.ts`

Client-side PDF export via html2canvas (scale 2, CORS enabled) + jsPDF (A4, 10mm margin). Targets a DOM element by ID. Paginates multi-page content. Called from `post/[id].tsx` targeting `#post-content`. Known issue: top-margin misalignment on page 2+ (see TODO.md item 4).

## UI / Style conventions

- **Color scheme:** `bg-gradient-to-r from-purple-300 to-pink-200` on most pages.
- **Buttons:** `rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700` (purple for nav/primary actions), blue for form actions, pink for sign-out.
- **Card style:** `rounded-lg bg-slate-100 shadow-md` with `hover:bg-slate-300` for interactive items.
- **Error handling:** `alert()` everywhere — no toast library. Keep this pattern for new mutations.
- **Admin check in UI:** `api.profile.getCurrentUser.useQuery()` → `is_admin` flag. Always check this before rendering admin controls.

## Env vars

`DATABASE_URL` (PlanetScale connection string) · `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` · `CLERK_SECRET_KEY` · `NEXT_PUBLIC_CLERK_SIGN_IN_URL` · `NEXT_PUBLIC_CLERK_SIGN_UP_URL` · `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` · `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

## Conventions / gotchas

- **New feature** = add tRPC procedure to existing router (or new router registered in `src/server/api/root.ts`) → call from page/component with `api.<router>.<procedure>`. Add Prisma model to schema + push if DB change needed.
- **Admin gate:** use `adminProcedure` on the server. In the UI, check `currentUser?.is_admin` before rendering controls. The `newPost.tsx` also has a hardcoded email check (`mwspencer75@gmail.com`) as a double guard — follow the same pattern if adding new admin UI.
- **User auto-creation:** PostFeed creates the DB user on first load if `profile.getById` returns `null`. Any page that relies on the user existing should mirror this or ensure the user has visited the home page first.
- **Recently viewed** is a max-3 FIFO JSON string stored in `Users.recent_posts_json`. Always use `udpatedRecentlyViewedJson` to mutate it — don't hand-roll the logic.
- **`LikePosts` rows** are not unique-constrained — `delete` must use `findMany` + loop. Don't assume `deleteUnique` will work.
- **Prisma `relationMode = "prisma"`** is required for PlanetScale (no foreign-key enforcement at DB level; Prisma emulates it). Always set this on new datasources.
- **Tests** live in `src/tests/` and use Jest + ts-jest. Config in `jest.config.cjs`. Run with `npm test`.
- **`ltc_*` tables** are in the same PlanetScale DB but belong to Let Em Cook. Leave them alone.
