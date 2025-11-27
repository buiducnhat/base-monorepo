import { db } from "@erp/db";
import { positions } from "@erp/db/schema/employees";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const positionsRouter = {
  list: publicProcedure.handler(
    async () =>
      await db.query.positions.findMany({
        with: {
          department: true,
        },
      })
  ),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        departmentId: z.string().min(1),
      })
    )
    .handler(async ({ input }) => {
      const id = crypto.randomUUID();
      await db.insert(positions).values({
        id,
        name: input.name,
        description: input.description,
        departmentId: input.departmentId,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        departmentId: z.string().min(1),
      })
    )
    .handler(async ({ input }) => {
      await db
        .update(positions)
        .set({
          name: input.name,
          description: input.description,
          departmentId: input.departmentId,
        })
        .where(eq(positions.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(positions).where(eq(positions.id, input.id));
    }),
};
