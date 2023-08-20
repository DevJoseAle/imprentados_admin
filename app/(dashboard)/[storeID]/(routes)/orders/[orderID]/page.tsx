import prismadb from '@/lib/prismadb'
import React from 'react'
import { BillboardForm } from './components/billboardForm';

const OrdersPage = async({
    params
}:{
    params: {billboardID: string}
}) => {
    const order = await prismadb.order.findUnique({
        where:{
            id: params.billboardID
        },
        include:{
            orderItem:{
                include:{
                    product: true
                }
            }
        }
    })
  return (
    <>
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>

                {/* <BillboardForm initialData={billboard} /> */}

            </div>
        </div>
    </>
  )
}

export default OrdersPage

