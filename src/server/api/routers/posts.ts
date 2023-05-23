import { TRPCError } from "@trpc/server";
import { profile } from "console";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.posts.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.posts.findUnique({
        where: { id: input.id },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        profile_image_url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      if (!authorId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const new_post = await ctx.prisma.posts.create({
        data: {
          user_name: authorId,
          title: input.title,
          post: input.content,
          profile_image_url: input.profile_image_url,
        },
      });
      return new_post;
    }),
});
