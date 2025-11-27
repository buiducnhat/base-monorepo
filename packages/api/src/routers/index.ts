import { protectedProcedure, publicProcedure } from "@erp/api/index";
import type { RouterClient } from "@orpc/server";

import { departmentsRouter } from "./departments.router";
import { employeesRouter } from "./employees.router";
import { positionsRouter } from "./positions.router";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  departments: departmentsRouter,
  employees: employeesRouter,
  positions: positionsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
