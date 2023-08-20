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

        const { name, value, hasPrice, categoryID, storeID } = body

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }
        
        if(!name){
            return new NextResponse('name is required', {status: 400})
        }
        if(!value){
            return new NextResponse('value is required', {status: 400})
        }
        if(!categoryID){
            return new NextResponse('StoreID is required', {status: 400})
        }
        if(!storeID){
            return new NextResponse('StoreID is required 2', {status: 400})
        }


        const subcategory = await prismadb.subcategory.create({
            data:{
                name,
                value,
                hasPrice,
                storeId: storeID,
                categoryID,
            }
        })
        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('SUBCATEGORY_POST', error)

        return new NextResponse('internal error Aqui CAE', {status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params: {storeId: string}}
){
    try {

        if(!params.storeId){
            console.log('desde get')
            return new NextResponse('StoreID is required', {status: 400})
        }

        const subcategory = await prismadb.subcategory.findMany({
            where:{
                storeId: params.storeId
            }
        })
        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('SUBCATEGORY_GET', error)

        return new NextResponse('internal error', {status: 500})
    }
}