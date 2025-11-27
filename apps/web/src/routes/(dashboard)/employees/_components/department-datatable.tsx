import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/datatable";

type Props = {
  data: any[];
  loading?: boolean;
};

export function DepartmentsDatatable({ data, loading }: Props) {
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
      },
    ],
    []
  );

  return <DataTable columns={columns} data={data} loading={loading} />;
}
