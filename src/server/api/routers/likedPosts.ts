import { TRPCError } from "@trpc/server";
import { profile } from "console";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const likedPostsRouter = createTRPCRouter({
  getAllIDs: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.likePosts.findMany({
      where: {
        user_id: ctx.userId,
      },
      select: {
        post_id: true,
      },
    });
  }),

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

  delete: privateProcedure
    .input(
      z.object({
        user_id: z.string(),
        post_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const likedPostsToDelete = await ctx.prisma.likePosts.findMany({
        where: {
          user_id: input.user_id,
          post_id: input.post_id,
        },
      });

      const deletedCount = await Promise.all(
        likedPostsToDelete.map(async (likedPost) => {
          await ctx.prisma.likePosts.delete({
            where: {
              id: likedPost.id,
            },
          });
          return 1; // Indicate successful deletion
        })
      );
      return 1;
    }),
});
