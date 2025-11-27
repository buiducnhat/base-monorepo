import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/datatable";

type Props = {
  data: any[];
  loading?: boolean;
  columns?: ColumnDef<any>[];
};

export function EmployeesDatatable({ data, loading, columns = [] }: Props) {
  const defaultColumns = React.useMemo<ColumnDef<any>[]>(
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
    ],
    []
  );

  const finalColumns = React.useMemo(
    () => (columns.length > 0 ? columns : defaultColumns),
    [columns, defaultColumns]
  );

  return <DataTable columns={finalColumns} data={data} loading={loading} />;
}
