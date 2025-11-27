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
import { DepartmentFormDialog } from "./_components/department-form-dialog";

export const Route = createFileRoute("/(dashboard)/employees/departments")({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const {
    data: departments,
    isLoading,
    refetch,
  } = useQuery(orpc.departments.list.queryOptions());

  const { data: employees } = useQuery(orpc.employees.list.queryOptions());

  const deleteMutation = useMutation(
    orpc.departments.delete.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Department deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete department");
      },
    })
  );

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Manager",
        accessorKey: "manager",
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
                  NiceModal.show(DepartmentFormDialog, {
                    mode: "update",
                    employees: employees ?? [],
                    refetch,
                    department: row.original,
                  });
                }}
              >
                <SquarePenIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  NiceModal.show(BaseAlertDialog, {
                    title: "Delete Department",
                    description:
                      "Are you sure you want to delete this department?",
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
    [employees, refetch, deleteMutation.mutate]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Departments</h1>
        <Button
          onClick={() =>
            NiceModal.show(DepartmentFormDialog, {
              mode: "create",
              employees: employees ?? [],
              refetch,
            })
          }
        >
          <PlusIcon />
          New Department
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={departments ?? []}
        loading={isLoading}
      />
    </div>
  );
}
