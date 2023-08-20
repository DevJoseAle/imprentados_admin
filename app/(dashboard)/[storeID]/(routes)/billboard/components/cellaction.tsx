"use client"


import { 
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { BillboardColumn } from './columns'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { AlertModal } from '@/components/modals/alert-modal'

interface CellActionProps{
    data: BillboardColumn,

}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const params = useParams()
    const router = useRouter();
    const onDelete = async()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeID}/billboard/${data.id}`);
            router.refresh();
            toast.success('Billboard Eliminado =(')
        } catch (error) {
            toast.error('Asegurate de borrar todo primero')
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }
    const onCopy = (id: string) =>{
        navigator.clipboard.writeText(id)
        toast.success('ID de Billboard Copiado')
    }
  return (
    <>
        <AlertModal 
            isOpen={open} 
            loading={loading}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className=' h-8 w-8 p-0' > 
                    <span className="sr-only"> Open Menu</span>
                    <MoreHorizontal className='h-4 w-4'/>
                    </Button>
                
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                    <Copy className='mr-2 h-4 w-4'  />
                    Copiar ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> router.push(`/${params.storeID}/billboard/${data.id}`)} >
                    <Edit 
                        className='mr-2 h-4 w-4' 
                        />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className='mr-2 h-4 w-4'  />
                    Borrar
                </DropdownMenuItem>

            </DropdownMenuContent>
            

        </DropdownMenu>
    </>
  )
}
