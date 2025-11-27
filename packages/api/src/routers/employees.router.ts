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
      })
    )
    .handler(async ({ input }) => {
      const id = crypto.randomUUID();
      await db.insert(employees).values({
        id,
        userId: input.userId,
        departmentId: input.departmentId,
        positionId: input.positionId,
        hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        departmentId: z.string().optional(),
        positionId: z.string().optional(),
        hireDate: z.string().optional(),
      })
    )
    .handler(async ({ input }) => {
      await db
        .update(employees)
        .set({
          departmentId: input.departmentId,
          positionId: input.positionId,
          hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
        })
        .where(eq(employees.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(employees).where(eq(employees.id, input.id));
    }),
};
