import { protectedProcedure } from "@erp/api/index";
import { db } from "@erp/db";
import { PERMISSIONS } from "@erp/db/schema/permissions";
import { rolePermissions, roles, userRoles } from "@erp/db/schema/rbac";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const rbacRouter = {
  listRoles: protectedProcedure.handler(
    async () =>
      await db.query.roles.findMany({
        with: {
          permissions: true,
        },
      })
  ),

  createRole: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        permissionIds: z.array(z.string()).optional(),
      })
    )
    .handler(async ({ input }) => {
      await db.transaction(async (tx) => {
        await tx.insert(roles).values({
          id: input.id,
          name: input.name,
          description: input.description,
        });

        if (input.permissionIds && input.permissionIds.length > 0) {
          await tx.insert(rolePermissions).values(
            input.permissionIds.map((permId) => ({
              roleId: input.id,
              permissionId: permId,
            }))
          );
        }
      });
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        permissionIds: z.array(z.string()).optional(),
      })
    )
    .handler(async ({ input }) => {
      await db.transaction(async (tx) => {
        if (input.name || input.description !== undefined) {
          await tx
            .update(roles)
            .set({
              name: input.name,
              description: input.description,
            })
            .where(eq(roles.id, input.id));
        }

        if (input.permissionIds) {
          // Remove existing permissions
          await tx
            .delete(rolePermissions)
            .where(eq(rolePermissions.roleId, input.id));

          // Add new permissions
          if (input.permissionIds.length > 0) {
            await tx.insert(rolePermissions).values(
              input.permissionIds.map((permId) => ({
                roleId: input.id,
                permissionId: permId,
              }))
            );
          }
        }
      });
    }),

  deleteRole: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(roles).where(eq(roles.id, input.id));
    }),

  listPermissions: protectedProcedure.handler(async () => PERMISSIONS),

  assignRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
      })
    )
    .handler(async ({ input }) => {
      await db.insert(userRoles).values({
        userId: input.userId,
        roleId: input.roleId,
      });
    }),

  revokeRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
      })
    )
    .handler(async ({ input }) => {
      await db
        .delete(userRoles)
        .where(
          eq(userRoles.userId, input.userId) &&
            eq(userRoles.roleId, input.roleId)
        );
    }),
};
