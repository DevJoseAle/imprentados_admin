import prismadb from '@/lib/prismadb'
import React from 'react'
import { SubcategoryForm } from './components/subcategoryForm';

const SubcategoryPage = async({
    params
}:{
    params: {subcategoryID: string, storeId: string}
}) => {
    const subcategory = await prismadb.subcategory.findUnique({
        where:{
            id: params.subcategoryID
        }
    })
    const category = await prismadb.category.findMany()
    const store = await prismadb.store.findMany({
        where:{
            id: params.storeId
        }
    })

    // console.log('----------------')
    console.log('Subcategory', subcategory)
    // console.log('----------------')
    // console.log('Category', category)  
    // console.log('----------------')
    // console.log('Store', store)
    
  return (
    <>
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>

                <SubcategoryForm store={store} initialData={subcategory} category={category}  />

            </div>
        </div>
    </>
  )
}

export default SubcategoryPage

