# Post-Mortem: API Data Loading Issues - December 10, 2025

## Summary

The one-offs-v2 project experienced complete API failure where no tRPC endpoints could return data. All API calls were returning HTML instead of JSON, causing `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` errors in the browser.

**Root Causes:**
1. Clerk middleware incompatibility with API routes (Clerk v4.16.4)
2. Prisma version mismatch (Prisma 7 vs Prisma 5 schema)
3. Typo in component code
4. Environment variable configuration issues

**Resolution Time:** ~3 hours
**Final Solution:** Upgrade Clerk from v4.16.4 to v4.29.0

---

## Timeline of Issues and Fixes

### Issue #1: Prettier Timeout Errors

**Problem:**
When saving files, getting "prettier timeout" errors despite the formatter being configured.

**Root Cause:**
The `one-offs-v2` project had Prettier installed and configured, but the `let-em-cook` project didn't use Prettier. User was getting confused between the two projects' setups.

**What We Tried:**
- Checked for `.prettierrc` files
- Compared configurations between projects

**Solution:**
Removed Prettier completely to match `let-em-cook` project setup:

1. **Deleted `prettier.config.cjs`**
2. **Removed from `package.json`:**
   ```json
   // REMOVED:
   "prettier": "^2.8.6",
   "prettier-plugin-tailwindcss": "^0.2.6",
   ```
3. **Ran `npm install`** to update dependencies
4. **Restarted editor**

**Files Changed:**
- `package.json` (removed prettier dependencies)
- Deleted `prettier.config.cjs`

---

### Issue #2: Environment Variable Configuration

**Problem:**
User had `DATABASE_URL` in `.env.local` but Prisma CLI commands were failing with:
```
Error: Environment variable not found: DATABASE_URL.
```

Also had spaces in environment variable assignments:
```bash
ADMINUSER_EMAIL = "email@example.com"  # ❌ Wrong
```

**Root Cause:**
- Prisma CLI doesn't automatically load `.env.local` (only Next.js does)
- Spaces around `=` in environment variables cause parsing issues

**What We Tried:**
- Ran `npx prisma db pull` to test database connection
- Checked which .env files exist

**Solution:**

1. **Fixed spacing in `.env.local`:**
   ```bash
   # BEFORE (wrong):
   ADMINUSER_EMAIL = "email@example.com"

   # AFTER (correct):
   ADMINUSER_EMAIL="email@example.com"
   ```

2. **Created `.env` file** with all secrets (Prisma needs this):
   ```bash
   DATABASE_URL="mysql://user:password@host:3306/database"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ADMINUSER_EMAIL="admin@example.com"
   NODE_ENV="development"
   ```

3. **Verified `.gitignore` was correct:**
   ```gitignore
   .env
   .env*.local
   ```

4. **Created `.env.example`** for documentation:
   ```bash
   DATABASE_URL="mysql://user:password@localhost:3306/dbname"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ADMINUSER_EMAIL="admin@example.com"
   NODE_ENV="development"
   ```

**Key Learning:**
- `.env` - Real secrets, gitignored, used for local development and Prisma CLI
- `.env.local` - Local overrides, gitignored, loaded by Next.js (higher priority)
- `.env.example` - Template with dummy values, safe to commit

**Files Changed:**
- Created `.env` with actual secrets
- Updated `.env.local` to fix spacing
- Created `.env.example` for documentation
- Verified `.gitignore` includes `.env` and `.env*.local`

---

### Issue #3: Prisma Version Incompatibility

**Problem:**
Running `npx prisma generate` failed with:
```
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
```

**Root Cause:**
Prisma 7.x was installed (latest version), but the project schema was written for Prisma 4/5. Prisma 7 has breaking changes to the schema format.

**What We Tried:**
- Checked Prisma CLI version: `7.1.0`
- Checked `package.json`: specified `^5.0.0` but npm pulled v7

**Solution:**
Downgraded to Prisma 5:

```bash
npm install prisma@^5.0.0 @prisma/client@^5.0.0
npx prisma generate
```

**Files Changed:**
- `package.json` (updated Prisma versions)
- `package-lock.json` (via npm install)
- Regenerated `node_modules/@prisma/client`

---

### Issue #4: JSON Parsing Error in Component

**Problem:**
After fixing database issues, getting error:
```
SyntaxError: "undefined" is not valid JSON
Source: src/components/recentlyViewedObject.tsx (53:11)
```

**Root Cause:**
Typo in component code - accessing wrong property name.

**The Bug:**
```typescript
// Line 53 - WRONG (typo: "recent_postts" instead of "recent_posts_json")
const recentPostsJson = user_profile.data?.recent_posts_json
  ? JSON.parse(String(user_profile.data.recent_postts))  // ❌ Typo here!
  : [];
```

**Solution:**
Fixed the typo:

```typescript
// CORRECT:
const recentPostsJson = user_profile.data?.recent_posts_json
  ? JSON.parse(String(user_profile.data.recent_posts_json))  // ✅ Fixed
  : [];
```

**Files Changed:**
- `src/components/recentlyViewedObject.tsx` (line 53)

---

### Issue #5: Clerk Middleware Blocking API Routes (MAJOR ISSUE)

**Problem:**
All tRPC API calls returned HTML instead of JSON:
```
TRPCClientError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Network tab showed Clerk's authentication interstitial HTML page being returned for API requests.

**Root Cause:**
Clerk v4.16.4's `withClerkMiddleware` was intercepting API routes and returning HTML authentication interstitials instead of allowing API requests through with auth context attached.

This created a catch-22:
- **Exclude `/api/` from middleware** → `getAuth()` fails → `UNAUTHORIZED` errors
- **Include `/api/` in middleware** → Clerk returns HTML interstitial → JSON parse errors

**What We Tried (That Didn't Work):**

1. **Excluded API routes from middleware matcher:**
   ```typescript
   // TRIED - didn't work
   export const config = {
     matcher: "/((?!_next/static|_next/image|favicon.ico|api/).*)",
   };
   ```
   Result: `getAuth()` in tRPC context failed with "You need to use withClerkMiddleware"

2. **Added manual skip logic in middleware:**
   ```typescript
   // TRIED - didn't work
   export default withClerkMiddleware((req: NextRequest) => {
     if (req.nextUrl.pathname.startsWith('/api/')) {
       return NextResponse.next();
     }
     return NextResponse.next();
   });
   ```
   Result: Still returned HTML interstitials

3. **Added publicRoutes option:**
   ```typescript
   // TRIED - didn't work (option doesn't exist in v4.16.4)
   export default withClerkMiddleware(() => {
     return NextResponse.next();
   }, {
     publicRoutes: ['/api/(.*)'],
   });
   ```
   Result: Invalid option, still returned HTML

4. **Added try/catch in tRPC context:**
   ```typescript
   // TRIED - partial workaround but still had issues
   try {
     const sesh = getAuth(req);
     userId = sesh.userId;
   } catch (error) {
     console.log("No auth context available");
   }
   ```
   Result: Prevented crashes but auth still didn't work properly

5. **Temporarily disabled middleware entirely:**
   ```typescript
   // TRIED - for debugging only
   export default function middleware(req: NextRequest) {
     return NextResponse.next();
   }
   ```
   Result: APIs worked but got error "You need to use withClerkMiddleware"

**The Actual Solution:**
Upgraded Clerk from v4.16.4 to v4.29.0:

```bash
npm install @clerk/nextjs@^4.29.0 @clerk/clerk-js@^4.73.0
rm -rf .next
npm run dev
```

**Why This Worked:**
Clerk v4.29.0 has improved API route handling that doesn't inject HTML interstitials into API responses. The middleware properly attaches auth context without breaking tRPC's JSON responses.

**Final Working Middleware:**
```typescript
// src/middleware.ts
import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  // API routes INCLUDED (no |api/ exclusion)
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
```

**Files Changed:**
- `package.json` (updated Clerk versions)
- `src/middleware.ts` (reverted to simple config)

---

## Supporting Issues Encountered

### Issue: Wrong User ID Format

**Problem:**
Database has `user_id` as string but component was trying to parse as number.

**Solution:**
Already correctly implemented - user IDs are strings from Clerk, stored as `VARCHAR(255)` in database.

---

## Final System State

### Working Configuration

**Environment Variables (`.env`):**
```bash
DATABASE_URL="mysql://user:password@host:3306/database"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
ADMINUSER_EMAIL="admin@example.com"
NODE_ENV="development"
```

**Package Versions:**
```json
{
  "@clerk/nextjs": "^4.29.0",
  "@clerk/clerk-js": "^4.73.0",
  "prisma": "^5.0.0",
  "@prisma/client": "^5.0.0"
}
```

**Middleware (`src/middleware.ts`):**
```typescript
import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
```

**tRPC Context (`src/server/api/trpc.ts`):**
```typescript
export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  let userId: string | null = null;
  let profile_image_url: string | undefined = undefined;

  try {
    const sesh = getAuth(req);
    userId = sesh.userId;
    profile_image_url = sesh.user?.profileImageUrl;
  } catch (error) {
    console.log("No auth context available, user is not authenticated");
  }

  return {
    prisma,
    userId,
    profile_image_url,
  };
};
```

**Component Fix (`src/components/recentlyViewedObject.tsx`):**
```typescript
const recentPostsJson = user_profile.data?.recent_posts_json
  ? JSON.parse(String(user_profile.data.recent_posts_json))
  : [];
```

---

## Key Learnings

### 1. Clerk Middleware and API Routes
- **Clerk v4.16.4 has poor API route support** with `withClerkMiddleware`
- **Upgrading to v4.29.0+ is essential** for projects using tRPC or API routes
- **Excluding API routes from middleware** breaks `getAuth()`
- **Including API routes in middleware** (in older Clerk versions) returns HTML

### 2. Environment Variables
- **Prisma CLI only reads `.env`**, not `.env.local`
- **No spaces around `=`** in environment variable assignments
- **`.env` should be gitignored** but committed to production servers
- **`.env.example` should be committed** for documentation

### 3. Prisma Version Management
- **Prisma 7 has breaking schema changes**
- **Use `^5.0.0` not `~5.0.0`** to prevent auto-upgrades to v7
- **Always run `npx prisma generate`** after schema/version changes

### 4. Debugging Strategies
- **Check Network tab for HTML responses** - indicates middleware/routing issues
- **Compare server logs vs browser logs** - helps identify client vs server issues
- **Test with middleware disabled** - helps isolate middleware problems
- **Use enhanced error logging in tRPC** - `onError` handler with full details

---

## Prevention Recommendations

### 1. Lock Dependency Versions
Update `package.json` to prevent auto-upgrades:

```json
{
  "dependencies": {
    "@clerk/nextjs": "4.29.0",
    "prisma": "5.0.0"
  }
}
```

Use exact versions (no `^` or `~`) for critical dependencies.

### 2. Document Environment Setup
Create `docs/ENVIRONMENT_SETUP.md`:
- List all required environment variables
- Explain which files they go in
- Provide examples
- Document Prisma CLI requirements

### 3. Add Pre-commit Hooks
Use `husky` to verify:
- Prisma client is generated
- Environment variables are set
- No `.env` files are committed

### 4. Version Compatibility Matrix
Document tested versions:
```markdown
| Package | Version | Notes |
|---------|---------|-------|
| @clerk/nextjs | 4.29.0+ | Older versions break API routes |
| prisma | 5.x | v7 has breaking changes |
| Next.js | 13.4.13 | Current version |
```

---

## Time Breakdown

- **Prettier issues:** 15 minutes
- **Environment variable debugging:** 30 minutes
- **Prisma version issues:** 20 minutes
- **Component typo fix:** 5 minutes
- **Clerk middleware debugging:** 90 minutes (MAJOR)
- **Documentation:** 30 minutes

**Total:** ~3 hours

---

## Files Modified

### Critical Fixes:
1. `package.json` - Updated Clerk and Prisma versions
2. `src/components/recentlyViewedObject.tsx` - Fixed typo (line 53)
3. `.env` - Created with proper formatting
4. `src/middleware.ts` - Maintained simple config after Clerk upgrade

### Supporting Changes:
5. Deleted `prettier.config.cjs`
6. Created `.env.example`
7. Verified `.gitignore` includes environment files

---

## Conclusion

The primary issue was **Clerk v4.16.4's incompatibility with API routes**, which manifested as HTML responses instead of JSON. This was compounded by several smaller configuration issues (environment variables, Prisma version, typos) that made debugging more complex.

**The single most important fix was upgrading Clerk from v4.16.4 to v4.29.0**, which resolved the API route authentication issue completely. All other fixes were necessary but would not have solved the core problem without the Clerk upgrade.

**Success Criteria Met:**
- ✅ All tRPC API endpoints return JSON
- ✅ User authentication works on API routes
- ✅ Data loads in components (`recentlyViewedObject`, `postFeed`, etc.)
- ✅ No HTML parsing errors in browser console
- ✅ Prisma commands work correctly
- ✅ Environment variables properly configured
