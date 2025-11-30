import { publicProcedure, requirePermission } from "@erp/api/index";
import { db } from "@erp/db";
import { positions } from "@erp/db/schema/employees";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const positionsRouter = {
  list: publicProcedure.handler(
    async () =>
      await db.query.positions.findMany({
        with: {
          department: true,
        },
      })
  ),

  create: requirePermission("positions.create")
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        departmentId: z.string().min(1),
      })
    )
    .handler(async ({ input }) => {
      await db.insert(positions).values({
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description,
        departmentId: input.departmentId,
      });
    }),

  update: requirePermission("positions.update")
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional().nullable(),
      })
    )
    .handler(async ({ input }) => {
      await db
        .update(positions)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(positions.id, input.id));
    }),

  delete: requirePermission("positions.delete")
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(positions).where(eq(positions.id, input.id));
    }),
};
