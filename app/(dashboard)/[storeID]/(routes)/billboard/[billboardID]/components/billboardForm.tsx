"use client"
import  * as z from "zod";
import { useState } from "react";
import { Billboard} from "@prisma/client"
import { Trash } from "lucide-react";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage } from "@/components/ui/form";
import { useOrigin } from "@/hooks/use-origin";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";



const formSchema = z.object({
    label: z.string().min(0) ,
    imageUrl: z.string().min(1),

   
})
interface BillboardFormProps{
initialData: Billboard | null; 
} 

type BillboardFormValues = z.infer<typeof formSchema>

export const BillboardForm: React.FC<BillboardFormProps>= (
     {initialData}
    ) => {

        const params = useParams();
        const router = useRouter();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const origin = useOrigin()

        const title = initialData ? 'Editar Billboard' : 'Crear Billboard';
        const action = initialData ? 'Guardar Cambios' : 'Crear';
        const description = initialData ? 'Edita tu billboard  ' : 'Agrega nuevo Billboard';
        const toastMessage = initialData ? 'Billboard Actualizado' : ' Billboard creado';
        

        const form = useForm<BillboardFormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData || { label: '', imageUrl: ''},
        })

        const onSubmit = async(data:BillboardFormValues)=>{
            try {
                setLoading(true)
                if(initialData){
                    await axios.patch(`/api/${params.storeID}/billboard/${params.billboardID}`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/billboard`);
                }else{
                   
                    await axios.post(`/api/${params.storeID}/billboard`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/billboard`);      
                }
                toast.success(toastMessage)
                
            } catch (error) {
                toast.error('Ups! Algo pasó')
            }finally{
                setLoading(false)
            }
        }
        const onDelete = async()=>{
            try {
                setLoading(true)
                await axios.delete(`/api/${params.storeID}/billboard/${params.billboardID}`);
                router.refresh();
                router.push(`/${params.storeID}/billboard`)
                toast.success('Billboard Eliminado =(')
            } catch (error) {
                toast.error('Asegurate de borrar todo primero')
            }finally{
                setLoading(false)
                setOpen(false)
            }
        }
  return (
    <>  
        <AlertModal 
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className=" flex items-center justify-between">
            <Heading 
            title={title}
            description={description}
            />
            {
                initialData && (

                    <Button
                        disabled={loading}
                        variant={'destructive'}
                        size='sm'
                        onClick={()=>{setOpen(true)}}
                        >
                            <Trash
                            className="h-4 w-4"
                            />
                    </Button>
                )
            }

            
        </div>

        <Separator className="my-4 divide-slate-950"/>

        <Form {...form}>
            <form 
            className="space-y-8 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
            >
                  <FormField
                    control={form.control}
                    name='imageUrl'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Banner fondo</FormLabel>
                            <FormControl>
                               <ImageUpload 
                                value={ field.value ? [field.value] : [] } 
                                disabled={loading}
                                onChange={(url) => field.onChange(url)}
                                onRemove={() => field.onChange('')}

                               />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />

                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name='label'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Etiqueta</FormLabel>
                            <FormControl>
                                <Input
                                disabled={loading}
                                placeholder={'Billboard nombre'} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                   

                </div>

                <Button
                disabled={loading}
                className="ml-auto"
                type="submit"
                >
                    {action}
                </Button>
            </form>
        </Form>

        <Separator className="my-4 divide-slate-950"/>

        <ApiAlert 
            variant='public' 
            title='NEXT_PUBLIC_API_URL ' 
            description={`${origin}/api/${params.storeID}`}
        />
        

    </>
  )
}
