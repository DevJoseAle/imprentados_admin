import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cellaction"


export type BillboardColumn = {
    id: string
    createdAt: string
    label: string
   

  }
   
  export const columns: ColumnDef<BillboardColumn>[] = [
    {
      accessorKey: "label",
      header: "label",
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