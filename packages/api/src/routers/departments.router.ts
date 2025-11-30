import { publicProcedure, requirePermission } from "@erp/api/index";
import { db } from "@erp/db";
import { departments } from "@erp/db/schema/index";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const departmentsRouter = {
  list: publicProcedure.handler(
    async () =>
      await db.query.departments.findMany({
        with: {
          manager: {
            with: {
              user: true,
            },
          },
        },
      })
  ),

  create: requirePermission("departments.create")
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        managerId: z.number().optional().nullable(),
      })
    )
    .handler(async ({ input }) => {
      await db.insert(departments).values({
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description,
        managerId: input.managerId,
      });
    }),

  update: requirePermission("departments.update")
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        managerId: z.number().optional().nullable(),
      })
    )
    .handler(async ({ input }) => {
      await db
        .update(departments)
        .set({
          name: input.name,
          description: input.description,
          managerId: input.managerId,
        })
        .where(eq(departments.id, input.id));
    }),

  delete: requirePermission("departments.delete")
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(departments).where(eq(departments.id, input.id));
    }),
};
