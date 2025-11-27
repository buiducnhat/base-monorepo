import { db } from "@erp/db";
import { departments } from "@erp/db/schema/index";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

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

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        managerId: z.string().optional(),
      })
    )
    .handler(async ({ input }) => {
      const id = crypto.randomUUID();
      await db.insert(departments).values({
        id,
        name: input.name,
        description: input.description,
        managerId: input.managerId,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        managerId: z.string().optional(),
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(departments).where(eq(departments.id, input.id));
    }),
};
