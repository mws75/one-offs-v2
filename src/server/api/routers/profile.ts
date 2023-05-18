import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const UpdateRecentlyViewedSchema = z.object({
  userId: z.string(),
  recent_posts_json: z.string(),
});

export const profileRouter = createTRPCRouter({
  updateRecentlyViewed: privateProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const updated_content = await ctx.prisma.users.update({
        where: {
          user_id: userId,
        },
        data: {
          recent_posts_json: input.content,
        },
      });
      return updated_content;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recent_posts_json = await ctx.prisma.users.findUnique({
        where: {
          user_id: input.id,
        },
      });
      if (!recent_posts_json) {
        return "[]";
      }
      return recent_posts_json;
    }),
});
