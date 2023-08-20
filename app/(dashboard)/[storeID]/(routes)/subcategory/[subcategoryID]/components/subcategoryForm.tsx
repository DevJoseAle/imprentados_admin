"use client"
import  * as z from "zod";
import { useState } from "react";
import { Category, Store, Subcategory} from "@prisma/client"
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
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";



const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
    hasPrice: z.boolean(),
    storeID: z.string().min(1),
    categoryID: z.string().min(1),
   
})
interface SubcategoryFormProps{
initialData: Subcategory | null; 
category: Category[],
store: Store[], 
} 

type SubcategoryFormValues = z.infer<typeof formSchema>

export const SubcategoryForm: React.FC<SubcategoryFormProps>= (
     {initialData, category, store}
    ) => {

        const params = useParams();
        const router = useRouter();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const origin = useOrigin()

        const title = initialData ? 'Editar Subcategoria' : 'Crear Subcategoria';
        const action = initialData ? 'Guardar Cambios' : 'Crear';
        const description = initialData ? 'Edita tu Subcategoria ' : 'Agrega nuevo Subcategoria';
        const toastMessage = initialData ? 'Subcategoria Actualizado' : ' Subcategoria creado';
        
        

        const form = useForm<SubcategoryFormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData || { 
                name: '', 
                value: '', 
                hasPrice: false, 
                storeID: '',
                categoryID: '' 
            },
        })
        const onSubmit = async(data:SubcategoryFormValues)=>{
            console.log(data) 
            try {
                
                setLoading(true)
                if(initialData){

                    await axios.patch(`/api/${params.storeID}/subcategory/${params.subcategoryID}`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/subcategory`);
                }else{

                    await axios.post(`/api/${params.storeID}/subcategory`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/subcategory`);      
                }
                toast.success(toastMessage)
                
            } catch (error) {
                console.log(data)
                toast.error('Ups! Algo pasó');
            }finally{
                setLoading(false)
            }
        }
        const onDelete = async()=>{
            try {
                setLoading(true)
                await axios.delete(`/api/${params.storeID}/subcategory/${params.subcategoryID}`);
                router.refresh();
                router.push(`/${params.storeID}/subcategory`)
                toast.success('Subcategoria Eliminada =(')
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
                                placeholder={'Nombre de Subcategoria'} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='value'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Valor</FormLabel>
                            <FormControl>
                                <Input
                                disabled={loading}
                                placeholder={'Valor Subcategoria'} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='hasPrice'
                    render={ ({field}) => (
                        <FormItem>
                            <FormMessage>¿Tiene Precio?</FormMessage>
                            <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='categoryID'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Nombre de Categoria</FormLabel>
                            <Select 
                            disabled={loading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value} >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona Categoria"
                                        />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {category.map((category) =>(
                                        <SelectItem key={category.id} value={category.id} >
                                            {category.name}
                                        </SelectItem>
                                        
                                        ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='storeID'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Nombre de Tienda</FormLabel>
                            <Select 
                            disabled={loading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value} >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona Tienda"
                                        />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>

                                     {store.map((store) =>(
                                        <SelectItem key={store.id} value={store.id} >
                                            {store.name}
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

/*

<Select 
                            disabled={loading} 
                            onValueChange={field.onChange}  >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 

                                        placeholder="¿Tiene Precio?"
                                        />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    
                                        <SelectItem 
                                            value={positive} 
                                            >
                                            Si
                                        </SelectItem>
                                        <SelectItem 
                                            value={negative} >
                                            No
                                        </SelectItem>

                                </SelectContent>
                            </Select>
*/