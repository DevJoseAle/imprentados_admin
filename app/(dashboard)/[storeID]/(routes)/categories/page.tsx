import React from 'react'

import {format} from 'date-fns'
import { CategoriesClient } from './components/client'
import prismadb from '@/lib/prismadb'
import { useParams } from 'next/navigation'
import { CategoriesColumn } from './components/columns'
import { Separator } from '@/components/ui/separator'

const CategoryPage = async({
  params
}:{
  params:{storeID: string}
}) => {

  const categories = await prismadb.category.findMany({
    where:{
      storeId: params.storeID
    },
    include:{
      billboard: true
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedCategories: CategoriesColumn[] = categories.map((item) =>({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))
  return (
    <div className=' flex-col'>

      <div className='flex-1 space-y-4 p-8 pt-6'>

        <CategoriesClient data={formattedCategories}/>

      </div>
      <Separator />
    </div>
  )
}

export default CategoryPage