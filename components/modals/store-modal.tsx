"use client";
import { useState } from "react";

import * as  z  from "zod";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Checkbox } from "../ui/checkbox";



const formSchema = z.object({
    name: z.string().min(4),
    isFeatured: z.boolean().default(false).optional(),
})


export const StoreModal = () => {

    const storeModal = useStoreModal();
    const [loading, setLoading] = useState(false)

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        isFeatured: false,
        
    }
 })
    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/stores', values)
         
            window.location.assign(`/${response.data.id}`)
            toast.success('Vamos! Tienda creada')
        } catch (error) {
            console.log(error)
            toast.error('Ups! Algo pasó!')
        }finally{
            setLoading(false)
        }
        
    }
    return(

        <Modal 
            title='Crea una tienda'
            description="Agrega nueva tienda para manejar productos y categorias"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            >
            {/* Futuro Form para crear tiendas */}
            Form para Crear tiendas

            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                            control={form.control}
                            name='name'
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel>
                                        Nombre de Tienda:
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder='Tienda'
                                            {...field}
                                            />
                                    </FormControl>
                                    <FormMessage/>

                                    
                                </FormItem>
                            )}
                            />
                           
                           
                             <FormField
                                control={form.control}
                                name='isFeatured'
                                render={ ({field}) => (
                                    <FormItem className=" flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}

                                            />
                                    </FormControl>
                                        <div className=" space-y-1 leading-none">
                                            <FormLabel>
                                                Mostrar en tienda
                                            </FormLabel>
                                            <FormDescription>
                                                Esta tienda estará destacada en el homepage
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                
                                />
                                 <div className=" pt-6 space-x-6 flex items-center justify-center">
                                <Button disabled={loading} type="submit">Continue</Button>
                                <Button 
                                    disabled={loading}
                                    variant='outline'
                                    onClick={storeModal.onClose}
                                    >
                                        Cancel
                                    </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
