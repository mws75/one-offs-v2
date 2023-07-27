import { TRPCError } from "@trpc/server";
import { profile } from "console";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const likedPostsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        user_id: z.string(),
        post_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.userId;
      if (!user_id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not logged in",
        });
      }
      const new_likedPost = await ctx.prisma.likePosts.create({
        data: {
          user_id: input.user_id,
          post_id: input.post_id,
          post_liked: 1,
        },
      });
      return new_likedPost;
    }),
});
