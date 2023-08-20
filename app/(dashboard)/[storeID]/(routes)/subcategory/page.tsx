import React from 'react'

import {format} from 'date-fns'
import { BillboardClient } from './components/client'
import prismadb from '@/lib/prismadb'
import { useParams } from 'next/navigation'
import { SubcategoryColumn } from './components/columns'
import { Separator } from '@/components/ui/separator'

const SubcategoryPage = async({
  params
}:{
  params:{storeID: string}
}) => {

  const subcategory = await prismadb.subcategory.findMany({
    where:{
      storeId: params.storeID
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedSubcategory: SubcategoryColumn[] = subcategory.map((item) =>({
    id: item.id,
    name: item.name,
    value: item.value,
    hasPrice: item.hasPrice, 
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))
  return (
    <div className=' flex-col'>

      <div className='flex-1 space-y-4 p-8 pt-6'>

        <BillboardClient data={formattedSubcategory}/>

      </div>
      <Separator />
    </div>
  )
}

export default SubcategoryPage