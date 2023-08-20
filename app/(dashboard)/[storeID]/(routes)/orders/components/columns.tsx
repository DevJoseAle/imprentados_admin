import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cellaction"


export type OrderColumn = {
    id: string
    createdAt: string
    phone: string
    address: string
    isPaid: boolean
    totalPrice: string
    product: string
   

  }
   
  export const columns: ColumnDef<OrderColumn>[] = [
    {
      accessorKey: "products",
      header: "Productos",
    },
    {
      accessorKey: "phone",
      header: "Telefono",
    },
    {
      accessorKey: "address",
      header: "Direccion",
    },
    {
      accessorKey: "totalPrice",
      header: "Precio Total",
    },
    {
      accessorKey: "isPaid",
      header: "Pagado",
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
    },

  ]