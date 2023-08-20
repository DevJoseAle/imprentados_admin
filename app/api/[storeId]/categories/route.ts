import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
){
    try {

        const {userId} = auth();
        const body = await req.json()
        const { name, billboardID } = body
        
        console.log(body.billboardID)

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(!name){
            return new NextResponse('name is required', {status: 400})
        }

        if(!billboardID){
            return new NextResponse('ID is required', {status: 400})
        }
        if(!params.storeId){
            return new NextResponse('StoreID is required, no esta pasando de acá', {status: 400})
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
        const category = await prismadb.category.create({
            data:{
                name,
                billboardID,
                storeId: params.storeId
            }
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log('CATEGORY_POST', error)

        return new NextResponse('internal error', {status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params: {storeId: string}}
){
    try {

        if(!params.storeId){
            return new NextResponse('StoreID is required', {status: 400})
        }

        const categories = await prismadb.category.findMany({
            where:{
                storeId: params.storeId
            }
        })
        return NextResponse.json(categories)
    } catch (error) {
        console.log('CATEGORY_POST', error)

        return new NextResponse('internal error', {status: 500})
    }
}