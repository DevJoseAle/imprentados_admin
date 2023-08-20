"use client"


import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { CategoriesColumn, columns } from './columns';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface Props{
  data: CategoriesColumn[],
}

export const CategoriesClient: React.FC<Props> = ({data}) => {

    const router = useRouter();
    const params = useParams();  

  return (
    <>
        <div className='flex items-center justify-between'>
           
            <Heading title={`Categorias -  (${data.length})`} description='Maneja y Edita tus Categorias' />

            <Button onClick={ () => router.push(`/${params.storeID}/categories/new`)}>
                <Plus className=' mr-2 h-4 w.4' />
                Agregar.
            </Button>

        </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data}  />

      <Heading title="API" description='API Calls to Categories'/>
      <Separator />
      <ApiList entityName="categories" entityIdName='categoryID'/>
    
    </>
  )
}
