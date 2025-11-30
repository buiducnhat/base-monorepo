ALTER TABLE "permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "permissions" CASCADE;--> statement-breakpoint
ALTER TABLE "role_permissions" DROP CONSTRAINT IF EXISTS "role_permissions_permission_id_permissions_id_fk";
