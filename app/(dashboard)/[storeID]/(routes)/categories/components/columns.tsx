import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cellaction"


export type CategoriesColumn = {
    id: string,
    name: string,
    billboardLabel: string,
    createdAt: string  

  }
   
  export const columns: ColumnDef<CategoriesColumn>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "billboard",
      header: "Billboard",
      cell: ({row}) => row.original.billboardLabel
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
    },
    {
      id: "actions",
      cell: ({row}) => <CellAction data={row.original} />
    },
  ]