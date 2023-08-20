import prismadb from '@/lib/prismadb'
import React from 'react'
import { ProductForm } from './components/productForm';

const ProductPage = async({
    params
}:{
    params: {productID: string, storeId: string}
}) => {
    const product = await prismadb.product.findUnique({
        where:{
            id: params.productID
        },
        include:{
            images: true
        }
    })

  const category = await prismadb.category.findMany({
    where:{
      storeId: params.storeId
    }
  })
  const subcategory = await prismadb.subcategory.findMany({
    where:{
      storeId: params.storeId
    }
  })
  return (
    <>
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>

                <ProductForm 
                initialData={product}
                category={category}
                subcategory={subcategory}
                />

            </div>
        </div>
    </>
  )
}

export default ProductPage

