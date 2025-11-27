import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/datatable";

type Props = {
  data: any[];
  loading?: boolean;
  columns?: ColumnDef<any>[];
};

export function PositionsDatatable({ data, loading, columns = [] }: Props) {
  const defaultColumns = React.useMemo<ColumnDef<any>[]>(
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
    ],
    []
  );

  const finalColumns = React.useMemo(
    () => (columns.length > 0 ? columns : defaultColumns),
    [columns, defaultColumns]
  );

  return <DataTable columns={finalColumns} data={data} loading={loading} />;
}
