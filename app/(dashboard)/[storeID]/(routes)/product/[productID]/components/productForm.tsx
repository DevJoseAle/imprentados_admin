"use client"
import  * as z from "zod";
import { useState } from "react";
import { Category, Image, Product, Subcategory} from "@prisma/client"
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
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem  } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";




const formSchema = z.object({

    name:  z.string().min(1),
    images: z.object({ url: z.string()}).array(),
    price: z.coerce.number().min(3),
    categoryID:  z.string().min(1),
    subcategoryID: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    description: z.string().min(10).max(200),
   
})
interface ProductFormProps{
    initialData: Product & {
        images: Image[]
    } | null; 
    category: Category[];
    subcategory: Subcategory[]
} 

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps>= (
     {
        initialData,
        category,
        subcategory
    }
    ) => {

        const params = useParams();
        const router = useRouter();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const origin = useOrigin()

        const title = initialData ? 'Editar Producto' : 'Crear Producto';
        const action = initialData ? 'Guardar Cambios' : 'Crear';
        const description = initialData ? 'Edita tu billboard  ' : 'Agrega nuevo Producto';
        const toastMessage = initialData ? 'Producto Actualizado' : ' Producto creado';
        

        const form = useForm<ProductFormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData ? {
                ...initialData,
                price: parseFloat(String(initialData?.price)),
            } : { 
                name: '', 
                images: [],
                price: 0,
                categoryID: '',
                subcategoryID: '',
                isArchived: false,
                isFeatured: false,
                description: ''

            }
        })

        const onSubmit = async(data:ProductFormValues)=>{
            try {
                setLoading(true)
                if(initialData){
                    await axios.patch(`/api/${params.storeID}/product/${params.productID}`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/product`);
                }else{
                   
                    await axios.post(`/api/${params.storeID}/product`, data)
                    router.refresh();
                    router.push(`/${params.storeID}/product`);      
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
                await axios.delete(`/api/${params.storeID}/product/${params.productID}`);
                router.refresh();
                router.push(`/${params.storeID}/product`)
                toast.success('Producto Eliminado =(')
            } catch (error) {
                toast.error('Ups!! Algo ha sucedió')
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
                    name='images'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Imagenes de Producto</FormLabel>
                            <FormControl>
                               <ImageUpload 
                                value={ field.value.map((image) => image.url)} 
                                disabled={loading}
                                onChange={(url) => field.onChange([...field.value, {url}])}
                                onRemove={(url) => field.onChange([...field.value.filter((curr) => curr.url !== url)])}

                               />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />

                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name='name'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Nombre de Producto</FormLabel>
                            <FormControl>
                                <Input
                                disabled={loading}
                                placeholder={'Nombre de producto'} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='price'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                disabled={loading}
                                placeholder={'19.990'} 
                                {...field}
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
                            <FormLabel>Selecciona Categoria</FormLabel>
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
                    name='subcategoryID'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Selecciona Subcategoria</FormLabel>
                            <Select 
                            disabled={loading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value} >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona Subcategoria"
                                        />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {subcategory.map((subcategory) =>(
                                        <SelectItem key={subcategory.id} value={subcategory.id} >
                                            {subcategory.name}
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
                                    Mostrar
                                </FormLabel>
                                <FormDescription>
                                    Este producto Aparecerá en el homepage
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                    
                    />
                    <FormField
                    control={form.control}
                    name='isArchived'
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
                                    Archivar
                                </FormLabel>
                                <FormDescription>
                                    Este producto NO aparecerá en las tiendas
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                    
                    />
                     <div className="gap-8">
                    <FormField
                    control={form.control}
                    name='description'
                    render={ ({field}) => (
                        <FormItem>
                            <FormLabel>Descripcion</FormLabel>
                            <FormControl>
                                <Textarea
                                disabled={loading}
                                placeholder={'Describe tu producto'} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    
                    />

                </div>

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
