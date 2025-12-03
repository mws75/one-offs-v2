import { TRPCError } from "@trpc/server";
import { profile } from "console";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.posts.findMany();
  }),

  getUserPosts: publicProcedure
    .input(z.object({ user_name: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.posts.findMany({
        where: { user_name: input.user_name },
      });
      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
      return posts;
    }),

  getAllLikedPosts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.likePosts.findMany({
      where: {
        user_id: ctx.userId,
      },
      include: {
        post: true,
      },
    });
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

  getByTitle: publicProcedure
    .input(z.object({ queryString: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.posts.findMany({
        where: { title: { contains: input.queryString } },
      });
      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
      return posts;
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        profile_image_url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const new_post = await ctx.prisma.posts.create({
        data: {
          user_name: ctx.userId,
          title: input.title,
          post: input.content,
          profile_image_url: input.profile_image_url,
        },
      });
      return new_post;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletePost = await ctx.prisma.posts.delete({
        where: {
          id: input.id,
        },
      });
      return deletePost;
    }),

  update: adminProcedure
    .input(z.object({ id: z.number(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatePost = await ctx.prisma.posts.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          post: input.content,
        },
      });
      return updatePost;
    }),
});
