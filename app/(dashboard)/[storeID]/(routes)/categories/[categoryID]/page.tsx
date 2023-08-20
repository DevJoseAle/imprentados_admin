import prismadb from '@/lib/prismadb'
import React from 'react'
import { CategoryForm } from './components/categoryForm';

const CategoryPage = async({
    params
}:{
    params: {categoryID: string, storeID: string}
}) => {
    const category = await prismadb.category.findUnique({
        where:{
            id: params.categoryID
        }
    })

    const billboard = await prismadb.billboard.findMany({
        where:{
            storeId: params.storeID
        }
    })
  return (
    <>
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>

                <CategoryForm initialData={category} billboard={billboard} />

            </div>
        </div>
    </>
  )
}

export default CategoryPage

