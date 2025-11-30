export const PERMISSIONS = [
  // Employees
  {
    id: "employees.read",
    resource: "employees",
    action: "read",
    description: "Read employees",
  },
  {
    id: "employees.create",
    resource: "employees",
    action: "create",
    description: "Create employees",
  },
  {
    id: "employees.update",
    resource: "employees",
    action: "update",
    description: "Update employees",
  },
  {
    id: "employees.delete",
    resource: "employees",
    action: "delete",
    description: "Delete employees",
  },
  // Departments
  {
    id: "departments.read",
    resource: "departments",
    action: "read",
    description: "Read departments",
  },
  {
    id: "departments.create",
    resource: "departments",
    action: "create",
    description: "Create departments",
  },
  {
    id: "departments.update",
    resource: "departments",
    action: "update",
    description: "Update departments",
  },
  {
    id: "departments.delete",
    resource: "departments",
    action: "delete",
    description: "Delete departments",
  },
  // Positions
  {
    id: "positions.read",
    resource: "positions",
    action: "read",
    description: "Read positions",
  },
  {
    id: "positions.create",
    resource: "positions",
    action: "create",
    description: "Create positions",
  },
  {
    id: "positions.update",
    resource: "positions",
    action: "update",
    description: "Update positions",
  },
  {
    id: "positions.delete",
    resource: "positions",
    action: "delete",
    description: "Delete positions",
  },
] as const;

export type PermissionId = (typeof PERMISSIONS)[number]["id"];
