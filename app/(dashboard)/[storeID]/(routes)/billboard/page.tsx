import React from 'react'

import {format} from 'date-fns'
import { BillboardClient } from './components/client'
import prismadb from '@/lib/prismadb'
import { useParams } from 'next/navigation'
import { BillboardColumn } from './components/columns'
import { Separator } from '@/components/ui/separator'

const BillboardPage = async({
  params
}:{
  params:{storeID: string}
}) => {

  const billboard = await prismadb.billboard.findMany({
    where:{
      storeId: params.storeID
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedBillboards: BillboardColumn[] = billboard.map((item) =>({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))
  return (
    <div className=' flex-col'>

      <div className='flex-1 space-y-4 p-8 pt-6'>

        <BillboardClient data={formattedBillboards}/>

      </div>
      <Separator />
    </div>
  )
}

export default BillboardPage