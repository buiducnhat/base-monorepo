import { db } from ".";
import { PERMISSIONS } from "./schema/permissions";
import { rolePermissions, roles } from "./schema/rbac";

const ROLES = [
  {
    id: "admin",
    name: "Admin",
    description: "Administrator with full access",
  },
];

async function main() {
  console.log("Seeding database...");

  // Seed Roles
  console.log("Seeding roles...");
  for (const role of ROLES) {
    await db.insert(roles).values(role).onConflictDoUpdate({
      target: roles.id,
      set: role,
    });
  }

  // Assign all permissions to Admin
  console.log("Assigning permissions to Admin...");
  const adminRole = ROLES.find((r) => r.id === "admin");
  if (adminRole) {
    for (const perm of PERMISSIONS) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: adminRole.id,
          permissionId: perm.id,
        })
        .onConflictDoNothing();
    }
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
