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
import { PositionFormDialog } from "./_components/position-form-dialog";

export const Route = createFileRoute("/(dashboard)/employees/positions")({
  component: PositionsPage,
});

function PositionsPage() {
  const {
    data: positions,
    isLoading,
    refetch,
  } = useQuery(orpc.positions.list.queryOptions());
  const { data: departments } = useQuery(orpc.departments.list.queryOptions());

  const deleteMutation = useMutation(
    orpc.positions.delete.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toast.success("Position deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete position");
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
        header: "Department",
        accessorKey: "department.name",
        cell: ({ row }) => row.original.department?.name || "-",
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
                  NiceModal.show(PositionFormDialog, {
                    mode: "update",
                    departments: departments ?? [],
                    refetch,
                    position: row.original,
                  });
                }}
              >
                <SquarePenIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  NiceModal.show(BaseAlertDialog, {
                    title: "Delete Position",
                    description:
                      "Are you sure you want to delete this position?",
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
    [departments, refetch, deleteMutation.mutate]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Positions</h1>
        <Button
          onClick={() =>
            NiceModal.show(PositionFormDialog, {
              mode: "create",
              departments: departments ?? [],
              refetch,
            })
          }
        >
          <PlusIcon />
          New Position
        </Button>
      </div>

      <DataTable columns={columns} data={positions ?? []} loading={isLoading} />
    </div>
  );
}
