import { protectedProcedure, publicProcedure } from "@erp/api/index";
import { db } from "@erp/db";
import { employees } from "@erp/db/schema/employees";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const employeesRouter = {
  list: publicProcedure.handler(
    async () =>
      await db.query.employees.findMany({
        with: {
          user: true,
          department: true,
          position: true,
        },
      })
  ),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        departmentId: z.string().optional(),
        positionId: z.string().optional(),
        hireDate: z.string().optional(), // ISO date string
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .handler(async ({ input }) => {
      const [result] = await db
        .insert(employees)
        .values({
          userId: input.userId,
          departmentId: input.departmentId,
          positionId: input.positionId,
          hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
          metadata: input.metadata,
        })
        .returning({ id: employees.id });

      if (!result) {
        throw new Error("Failed to create employee");
      }

      return { id: result.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        departmentId: z.string().optional(),
        positionId: z.string().optional(),
        hireDate: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .handler(async ({ input }) => {
      await db
        .update(employees)
        .set({
          departmentId: input.departmentId,
          positionId: input.positionId,
          hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
          metadata: input.metadata,
        })
        .where(eq(employees.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      await db.delete(employees).where(eq(employees.id, input.id));
    }),
};
