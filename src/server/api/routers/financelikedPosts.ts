import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const financelikedPostsRouter = createTRPCRouter({
  getAllIDs: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.financeLikePosts.findMany({
      where: { user_id: ctx.userId },
      select: { post_id: true },
    });
  }),

  create: privateProcedure
    .input(z.object({ user_id: z.string(), post_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.userId;
      if (!user_id) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not logged in" });
      }
      return ctx.prisma.financeLikePosts.create({
        data: { user_id: input.user_id, post_id: input.post_id, post_liked: 1 },
      });
    }),

  delete: privateProcedure
    .input(z.object({ user_id: z.string(), post_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const toDelete = await ctx.prisma.financeLikePosts.findMany({
        where: { user_id: input.user_id, post_id: input.post_id },
      });
      await Promise.all(
        toDelete.map((lp) =>
          ctx.prisma.financeLikePosts.delete({ where: { id: lp.id } })
        )
      );
      return 1;
    }),
});
