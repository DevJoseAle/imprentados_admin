import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    {params} : {params:{categoryID: string}}
){ 
    try {

        if(!params.categoryID){
            return new NextResponse('Billboard ID  is required',{status:400})
        }
        
        const category = await prismadb.category.findUnique({
            where:{
                id: params.categoryID,

            },
            include:{
               billboard: true 
            }
       
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log('CATEGORY_GET', error)

        return new NextResponse('internal error', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params:{categoryID: string, storeId: string}}
){
    try {

        const {userId} = auth();
        const body = await req.json()

        const { name, billboardID } = body

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(!name){
            return new NextResponse('name is required', {status: 400})
        }
        if(!billboardID){
            return new NextResponse('billboard id is required', {status: 400})
        }

        if(!params.categoryID){
            return new NextResponse('ID is required',{status:400})
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
        const category = await prismadb.category.updateMany({
            where:{
                id: params.categoryID,
 

            },
            data:{
                name,
                billboardID
            }
        })

       return NextResponse.json(category)
    } catch (error) {
        console.log('CATEGORY_PATCH', error)

        return new NextResponse('internal error', {status: 500})
    }
}

export async function DELETE(
    req: Request,
    {params} : {params:{storeId: string, categoryID: string}}
){
    try {

        const {userId} = auth();


        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }


        if(!params.categoryID){
            return new NextResponse('Category ID  is required',{status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        }) 
        
        const category = await prismadb.category.deleteMany({
            where:{
                id: params.categoryID,
                

            }
       
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log('CATEGORY_DELETE', error)

        return new NextResponse('internal error', {status: 500})
    }
}