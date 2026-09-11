import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const financePostsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.financePosts.findMany();
  }),

  getUserPosts: publicProcedure
    .input(z.object({ user_name: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.financePosts.findMany({
        where: { user_name: input.user_name },
      });
      if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
      return posts;
    }),

  getAllLikedPosts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.financeLikePosts.findMany({
      where: { user_id: ctx.userId },
      include: { post: true },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.financePosts.findUnique({
        where: { id: input.id },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  getByTitle: publicProcedure
    .input(z.object({ queryString: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.financePosts.findMany({
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
      return ctx.prisma.financePosts.create({
        data: {
          user_name: ctx.userId,
          title: input.title,
          post: input.content,
          profile_image_url: input.profile_image_url,
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.financePosts.delete({ where: { id: input.id } });
    }),

  update: adminProcedure
    .input(z.object({ id: z.number(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.financePosts.update({
        where: { id: input.id },
        data: { title: input.title, post: input.content },
      });
    }),
});
