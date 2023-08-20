"use client"
import  * as z from "zod";
import { useEffect, useState } from "react";
import { Billboard, Category} from "@prisma/client"
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
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage } from "@/components/ui/form";
import { useOrigin } from "@/hooks/use-origin";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";





const formSchema = z.object({
    name: z.string().min(1),
    billboardID: z.string().min(1),
   
})
interface CategoryFormProps{
    initialData: Category | null; 
    billboard: Billboard[];
} 

type CategoryFormValues = z.infer<typeof formSchema>

export const CategoryForm: React.FC<CategoryFormProps>= (
     {initialData, billboard}
    ) => {

        

        const params = useParams();
        const router = useRouter();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const origin = useOrigin()

        const title = initialData ? 'Editar Categoria' : 'Crear Categoria';
        const action = initialData ? 'Guardar Cambios' : 'Crear';
        const description = initialData ? 'Editar Categoria  ' : 'Agrega nueva Categoria';
        const toastMessage = initialData ? 'Category Actualizado' : ' Categoria creado';
        

        const form = useForm<CategoryFormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData || { name: '', billboardID: ''},
        })

        const onSubmit = async(data:CategoryFormValues)=>{
            try {
                setLoading(true)
                if(initialData){
                    await axios.patch(`/api/${params.storeID}/categories/${params.categoryID}`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/categories`);
                }else{
                   
                    await axios.post(`/api/${params.storeID}/categories`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/categories`);      
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
                await axios.delete(`/api/${params.storeID}/categories/${params.categoryID}`);
                router.refresh();
                router.push(`/${params.storeID}/categories`)
                toast.success('Categoria Eliminada =(')
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

                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name='name'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input
                                disabled={loading}
                                placeholder={'Nombre Categoria'} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='billboardID'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Nombre de billboard</FormLabel>
                            <Select 
                            disabled={loading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value} >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona Billboard"
                                        />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {billboard.map((billboard) =>(
                                        <SelectItem key={billboard.id} value={billboard.id} >
                                            {billboard.label}
                                        </SelectItem>
                                        
                                        ))}
                                </SelectContent>
                            </Select>
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
