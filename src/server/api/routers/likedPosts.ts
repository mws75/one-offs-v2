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
      select: {
        id: true,
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
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const delete_likedPost = await ctx.prisma.likePosts.delete({
        where: {
          id: input.id,
        },
      });
      return delete_likedPost;
    }),
});
