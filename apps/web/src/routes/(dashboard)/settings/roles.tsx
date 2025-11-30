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
import { RoleFormDialog } from "./_components/role-form-dialog";

export const Route = createFileRoute("/(dashboard)/settings/roles")({
  component: RolesPage,
});

function RolesPage() {
  const {
    data: roles,
    isLoading,
    refetch,
  } = useQuery(orpc.rbac.listRoles.queryOptions());

  const deleteMutation = useMutation(
    orpc.rbac.deleteRole.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Role deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete role");
      },
    })
  );

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Permissions",
        accessorKey: "permissions",
        cell: ({ row }) =>
          row.original.permissions?.length
            ? `${row.original.permissions.length} permissions`
            : "No permissions",
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
                  NiceModal.show(RoleFormDialog, {
                    mode: "update",
                    refetch,
                    role: row.original,
                  });
                }}
              >
                <SquarePenIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  NiceModal.show(BaseAlertDialog, {
                    title: "Delete Role",
                    description: "Are you sure you want to delete this role?",
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
    [refetch, deleteMutation.mutate]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Roles & Permissions</h1>
        <Button
          onClick={() =>
            NiceModal.show(RoleFormDialog, {
              mode: "create",
              refetch,
            })
          }
        >
          <PlusIcon />
          New Role
        </Button>
      </div>

      <DataTable columns={columns} data={roles ?? []} loading={isLoading} />
    </div>
  );
}
