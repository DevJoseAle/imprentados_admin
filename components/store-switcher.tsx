"use client"

import { useParams, useRouter  } from "next/navigation"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useEffect, useState } from 'react';
import { Store } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import prismadb from "@/lib/prismadb";



type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[],

}

export const StoreSwitcher = ({
    className,
    items=[],

}:StoreSwitcherProps) => {

   
    
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    
    const formattedItems = items.map( (item) =>({
        label: item.name,
        value: item.id
    }))
    
    const currentStore = formattedItems.find((item) => (
        item.value === params.storeID
        ))
    const [isOpen, setIsOpen] = useState(false)
    const onStoreSelected = (store:{value:string, label:string})=>{
        setIsOpen(false);
        router.push(`/${store.value}`);

    }
    return (
        <>
    <Popover 
        open={isOpen}
        onOpenChange={setIsOpen}
        >
        <PopoverTrigger asChild>
            <Button
            variant={'outline'}
            size={'sm'}
            role="combobox"
            aria-expanded={isOpen}
            aria-label='Selecciona tienda'
            className={cn('w-[200px] justify-between', className)}>
                <StoreIcon className="mr-2 h-4 w-4"/>
                {currentStore?.label}
            <ChevronsUpDown className=" ml-auto h-4 w-4 shrink-0 opacity-50"/> 
            </Button>
        </PopoverTrigger>
         <PopoverContent className=" w-[200] p-0">
            <Command>
                <CommandList>
                    <CommandInput placeholder=" Buscar tienda"/>
                    <CommandEmpty> No hay Disponibles </CommandEmpty>
                    <CommandGroup heading='Tiendas:'>
                    {
                        formattedItems.map((store) =>(
                            <CommandItem 
                            key={store.value} 
                            onSelect={() => onStoreSelected(store)}
                            className="text-sm">
                                <StoreIcon 
                                className="mr-2 h-4 w-4"
                                />
                                {store.label}
                                <Check className={cn(
                                    'ml- auto h-4 w-4',
                                    currentStore?.value === store.value
                                    ? 'opacity-80'
                                    : 'opacity-0'
                                    )}/>
                            </CommandItem>
                        )
                        )
                    }
                    </CommandGroup>
                </CommandList>

                <CommandSeparator/>
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                         onSelect={() =>{
                             setIsOpen(false)
                             storeModal.onOpen();
                            }}    
                            >

                            <PlusCircle className="mr-2 h-5 w-5"/>
                            Crea una Tienda
                            
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</>
  )
}
