import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cellaction"


export type SubcategoryColumn = {
    id: string
    name: string
    hasPrice: boolean
    createdAt: string
   

  }
   
  export const columns: ColumnDef<SubcategoryColumn>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "value",
      header: "Valor",
    },
    {
      accessorKey: "hasPrice",
      header: "Cotizable",
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