"use client"


import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { Billboard } from '@prisma/client';
import { OrderColumn, columns } from './columns';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface Props{
  data: OrderColumn[],
}

export const OrderClient: React.FC<Props> = ({data}) => {

    const router = useRouter();
    const params = useParams();  

  return (
    <>
        <div className='flex items-center justify-between'>
           
            <Heading title={`Ordenes -  (${data.length})`} description='Listado de Órdenes' />

        </div>
      <Separator />
      <DataTable searchKey='label' columns={columns} data={data}  />

      <Heading title="API" description='API Calls to Orders'/>
      <Separator />
      <ApiList entityName='order' entityIdName='orderID'/>
    
    </>
  )
}
