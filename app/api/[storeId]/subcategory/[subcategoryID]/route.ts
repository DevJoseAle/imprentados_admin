import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    {params} : {params:{subcategoryID: string}}
){
    try {

        if(!params.subcategoryID){
            return new NextResponse('subcategory ID  is required',{status:400})
        }
        
        const subcategory = await prismadb.subcategory.findUnique({
            where:{
                id: params.subcategoryID,
                

            }
       
        })
        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('SUBCATEGORY_GET_BY_ID', error)

        return new NextResponse('internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params:{subcategoryID: string, storeId: string}}
){
    console.log(params)
    try {
        console.log('desde parch')
        const {userId} = auth();
        const body = await req.json()

        const { name, value, hasPrice } = body

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(!name){
            return new NextResponse('Name is required', {status: 400})
        }

        if(!value){
            return new NextResponse('Value is required', {status: 400})
        }

        if(!params.subcategoryID){
            return new NextResponse('subcategory ID is required',{status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        }) 
        if(!storeByUserId){
            return new NextResponse('Unauthorized', {status: 403})
        }
        const subcategory = await prismadb.subcategory.updateMany({
            where:{
                id: params.subcategoryID,
 

            },
            data:{
                name,
                value,
                hasPrice
            }
        })

       return NextResponse.json(subcategory)
    } catch (error) {
        console.log('SUBCATEGORY_PATCH_BY_ID', error)

        return new NextResponse('internal error', {status: 500})
    }
}

export async function DELETE(
    req: Request,
    {params} : {params:{storeId: string, subcategoryID: string}}
){
    try {

        const {userId} = auth();


        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }


        if(!params.subcategoryID){
            console.log('desde delete')
            return new NextResponse('SubCategory ID  is required',{status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        }) 
        if(!storeByUserId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        
        const subcategory = await prismadb.subcategory.deleteMany({
            where:{
                id: params.subcategoryID,
                

            }
       
        })
        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('SUBCATEGORY_DELETE-BY-ID', error)

        return new NextResponse('internal error', {status: 500})
    }
}