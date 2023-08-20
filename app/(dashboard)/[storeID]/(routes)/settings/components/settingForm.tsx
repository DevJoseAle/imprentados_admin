"use client"
import  * as z from "zod";
import { useState } from "react";
import { Store } from "@prisma/client"
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
import { AlertModal } from '../../../../../../components/modals/alert-modal';
import { ApiAlert } from '../../../../../../components/ui/api-alert';
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage } from "@/components/ui/form";
import { useOrigin } from "@/hooks/use-origin";
import { Checkbox } from "@/components/ui/checkbox";


 interface SettingFormProps{
    initialData: Store; 
} 
const formSchema = z.object({
    name: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
})

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm: React.FC<SettingFormProps>= (
     {initialData}
    ) => {

        const params = useParams();
        const router = useRouter();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        const origin = useOrigin()


        const form= useForm<SettingsFormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData,
        })

        const onSubmit = async(data:SettingsFormValues)=>{
            try {
                setLoading(true)
                await axios.patch(`/api/stores/${params.storeID}`, data);
                router.refresh();
                toast.success('Tienda Actualizada')
                
            } catch (error) {
                toast.error('Ups! Algo pasó')
            }finally{
                setLoading(false)
            }
        }
        const onDelete = async()=>{
            try {
                setLoading(true)
                await axios.delete(`/api/stores/${params.storeID}`);
                router.refresh();
                router.push('/')
                toast.success('Categoria Eliminada =( ')
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
            title="Settings"
            description="Edita tus preferencias"
            />
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
                            <FormLabel>Name</FormLabel>
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

                </div>
                <Button
                disabled={loading}
                className="ml-auto"
                type="submit"
                >
                    Guardar Cambios
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
