import prismadb from '@/lib/prismadb'
import React from 'react'
import { BillboardForm } from './components/billboardForm';

const BillboardPage = async({
    params
}:{
    params: {billboardID: string}
}) => {
    const billboard: any = await prismadb.billboard.findUnique({
        where:{
            id: params.billboardID
        }
    })
  return (
    <>
        <div className=' flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>

                <BillboardForm initialData={billboard} />

            </div>
        </div>
    </>
  )
}

export default BillboardPage

