"use client"


import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { Billboard } from '@prisma/client';
import { BillboardColumn, columns } from './columns';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface Props{
  data: BillboardColumn[],
}

export const BillboardClient: React.FC<Props> = ({data}) => {

    const router = useRouter();
    const params = useParams();  

  return (
    <>
        <div className='flex items-center justify-between'>
           
            <Heading title={`Billboard -  (${data.length})`} description='Maneja y Edita tus Billboards' />

            <Button onClick={ () => router.push(`/${params.storeID}/billboard/new`)}>
                <Plus className=' mr-2 h-4 w.4' />
                Agregar.
            </Button>

        </div>
      <Separator />
      <DataTable searchKey='label' columns={columns} data={data}  />

      <Heading title="API" description='API Calls to Billboards'/>
      <Separator />
      <ApiList entityName='billboard' entityIdName='billboardID'/>
    
    </>
  )
}
