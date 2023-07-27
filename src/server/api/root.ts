import { createTRPCRouter } from "~/server/api/trpc";

import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { likedPostsRouter } from "./routers/likedPosts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  profile: profileRouter,
  likedPosts: likedPostsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
