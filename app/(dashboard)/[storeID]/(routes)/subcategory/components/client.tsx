"use client"


import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { Billboard } from '@prisma/client';
import { SubcategoryColumn, columns } from './columns';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface Props{
  data: SubcategoryColumn[],
}

export const BillboardClient: React.FC<Props> = ({data}) => {

    const router = useRouter();
    const params = useParams();  

  return (
    <>
        <div className='flex items-center justify-between'>
           
            <Heading title={`Subcategorias -  (${data.length})`} description='Maneja y Edita tus Billboards' />

            <Button onClick={ () => router.push(`/${params.storeID}/subcategory/new`)}>
                <Plus className=' mr-2 h-4 w.4' />
                Agregar.
            </Button>

        </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data}  />

      <Heading title="API" description='API Calls to Subcategory'/>
      <Separator />
      <ApiList entityName='subcategory' entityIdName='subcategoryID'/>
    
    </>
  )
}
