ALTER TABLE "departments" ALTER COLUMN "manager_id" SET DATA TYPE integer USING "manager_id"::integer;--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "id" SET DATA TYPE integer USING "id"::integer;--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "metadata" jsonb;