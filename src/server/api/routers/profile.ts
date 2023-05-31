import { TRPCError } from "@trpc/server";
import { Input } from "postcss";
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
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.users.findMany();
  }),

  insertNewUser: privateProcedure
    .input(z.object({ profile_image_url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const profile_image_url = ctx.profile_image_url;
      const update_table = await ctx.prisma.users.create({
        data: {
          user_id: userId,
          recent_posts_json: "[]",
          liked_posts: "[]",
          profile_image_url: input.profile_image_url,
        },
      });
      return update_table;
    }),
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
      const user_profile = await ctx.prisma.users.findUnique({
        where: {
          user_id: input.id,
        },
      });
      if (!user_profile) {
        return "[]";
      }
      return user_profile;
    }),
});
