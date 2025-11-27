import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const departments = pgTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  managerId: text("manager_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const positions = pgTable("positions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const employees = pgTable("employees", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  departmentId: text("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  positionId: text("position_id").references(() => positions.id, {
    onDelete: "set null",
  }),
  hireDate: timestamp("hire_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Add foreign key for managerId after employees table is defined to avoid circular reference issues in definition order if using direct references in object
// But in Drizzle pgTable, references are lazy or string based usually.
// Let's add the reference to departments.managerId -> employees.id
// Since we can't easily modify the const definition above with a circular ref in the same file without `references(() => employees.id)`, I will use `AnyPgColumn` or just the callback.

// Re-defining departments to include the reference properly
// Actually, I can just use the callback syntax in the column definition.

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  employees: many(employees, { relationName: "departmentEmployees" }),
  positions: many(positions),
  manager: one(employees, {
    fields: [departments.managerId],
    references: [employees.id],
    relationName: "departmentManager",
  }),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(user, {
    fields: [employees.userId],
    references: [user.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
    relationName: "departmentEmployees",
  }),
  position: one(positions, {
    fields: [employees.positionId],
    references: [positions.id],
  }),
  managedDepartments: many(departments, { relationName: "departmentManager" }),
}));
