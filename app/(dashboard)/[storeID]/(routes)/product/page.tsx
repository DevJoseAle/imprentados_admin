import React from 'react'

import {format} from 'date-fns'
import { ProductClient } from './components/client'
import prismadb from '@/lib/prismadb'

import {  ProductColumn } from './components/columns'
import { Separator } from '@/components/ui/separator'
import { priceFormatter } from '@/lib/utils'

const ProductPage = async({
  params
}:{
  params:{storeID: string, }
}) => {

  const product = await prismadb.product.findMany({
    where:{
      storeId: params.storeID
    },
    include:{
      category: true,
      subcategory: true,
    },
    orderBy:{
      createdAt: 'desc'
    }
  
  })



  const formattedProducts: ProductColumn[] | any= product.map((item) =>({
    id: item.id,
    name: item.name,
    price: priceFormatter.format(item.price.toNumber() ),
    category: item.category,
    subcategory: item.subcategory, 
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    createdAt: format(item.createdAt, 'MMMM do, yyyy').toString(),
    updatedAt: format(item.createdAt, 'MMMM do, yyyy').toString()
  }))
  return (
    <div className=' flex-col'>

      <div className='flex-1 space-y-4 p-8 pt-6'>

        <ProductClient data={formattedProducts}/>

      </div>
      <Separator />
    </div>
  )
}

export default ProductPage