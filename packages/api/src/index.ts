import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

export const requirePermission = (permission: string) =>
  protectedProcedure.use(async ({ context, next }) => {
    const user = context.session?.user;
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    // Check if user has the required permission
    // We need to fetch user roles and their permissions
    // This might be expensive to do on every request, ideally we should cache this or store in session
    // For now, let's query the DB
    const { db } = await import("@erp/db"); // Dynamic import to avoid circular dependency if any
    const { userRoles } = await import("@erp/db/schema/rbac");
    const { eq } = await import("drizzle-orm");

    const userPermissions = await db.query.userRoles.findMany({
      where: eq(userRoles.userId, user.id),
      with: {
        role: {
          with: {
            permissions: true,
          },
        },
      },
    });

    const hasPermission = userPermissions.some((ur) =>
      ur.role.permissions.some((rp) => rp.permissionId === permission)
    );

    if (!hasPermission) {
      throw new ORPCError("FORBIDDEN", {
        message: `Missing permission: ${permission}`,
      });
    }

    return next({
      context,
    });
  });
