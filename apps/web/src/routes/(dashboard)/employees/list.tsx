import NiceModal from "@ebay/nice-modal-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { BaseAlertDialog } from "@/components/base-alert-dialog";
import { DataTable } from "@/components/datatable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orpc } from "@/lib/orpc";
import { EmployeeFormDialog } from "./_components/employee-form-dialog";

export const Route = createFileRoute("/(dashboard)/employees/list")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const {
    data: employees,
    isLoading,
    refetch,
  } = useQuery(orpc.employees.list.queryOptions());
  const { data: departments } = useQuery(orpc.departments.list.queryOptions());
  const { data: positions } = useQuery(orpc.positions.list.queryOptions());

  const deleteMutation = useMutation(
    orpc.employees.delete.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Employee deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete employee");
      },
    })
  );

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "user.name",
      },
      {
        header: "Email",
        accessorKey: "user.email",
      },
      {
        header: "Department",
        accessorKey: "department.name",
        cell: ({ row }) => row.original.department?.name || "-",
      },
      {
        header: "Position",
        accessorKey: "position.name",
        cell: ({ row }) => row.original.position?.name || "-",
      },
      {
        header: "Hire Date",
        accessorKey: "hireDate",
        cell: ({ row }) =>
          row.original.hireDate
            ? new Date(row.original.hireDate).toLocaleDateString()
            : "-",
      },
      {
        header: () => <></>,
        accessorKey: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  NiceModal.show(EmployeeFormDialog, {
                    mode: "update",
                    departments: departments ?? [],
                    positions: positions ?? [],
                    refetch,
                    employee: row.original,
                  });
                }}
              >
                <SquarePenIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  NiceModal.show(BaseAlertDialog, {
                    title: "Delete Employee",
                    description:
                      "Are you sure you want to delete this employee?",
                    onConfirm: () => {
                      deleteMutation.mutate({ id: row.original.id });
                    },
                  })
                }
                variant="destructive"
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [departments, positions, refetch, deleteMutation.mutate]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Employees</h1>
        <Button
          onClick={() =>
            NiceModal.show(EmployeeFormDialog, {
              mode: "create",
              departments: departments ?? [],
              positions: positions ?? [],
              refetch,
            })
          }
        >
          <PlusIcon />
          New Employee
        </Button>
      </div>

      <DataTable columns={columns} data={employees ?? []} loading={isLoading} />
    </div>
  );
}
