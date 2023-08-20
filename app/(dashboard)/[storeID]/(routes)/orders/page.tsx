import React from 'react'

import {format} from 'date-fns'
import { OrderClient } from './components/client'
import prismadb from '@/lib/prismadb'

import { Separator } from '@/components/ui/separator'
import { priceFormatter } from '@/lib/utils'
import { OrderColumn } from './components/columns'

const OrderPage = async({
  params
}:{
  params:{storeId: string}
}) => {

  const order = await prismadb.order.findMany({
    where:{
        id: params.storeId
    },
    include:{
        orderItem:{
            include:{
                product: true
            }
        }
    }
})

  const formattedOrders: OrderColumn[] = order.map((item) =>({
    id: item.id,
    phone: item.phone,
    address: item.address,
    product: item.orderItem.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: priceFormatter.format(item.orderItem.reduce((curr, item) =>{
      return curr + Number(item.product.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))
  return (
    <div className=' flex-col'>

      <div className='flex-1 space-y-4 p-8 pt-6'>

        <OrderClient data={formattedOrders}/>

      </div>
      <Separator />
    </div>
  )
}

export default OrderPage