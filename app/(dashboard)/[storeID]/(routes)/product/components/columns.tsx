import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cellaction"


export type ProductColumn = {
    id: string
    name: string
    price: string;
    category: string
    subcategory: string
    isFeatured: boolean
    isArchived: boolean
  
  
   

  }
   
  export const columns: ColumnDef<ProductColumn>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "isArchived",
      header: "Archivado",
    },
    {
      accessorKey: "isFeatured",
      header: "Mostrado",
    },
    {
      accessorKey: "price",
      header: "Precio",
    },
    {
      accessorKey: "subcategory",
      header: "Subcategoria",
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