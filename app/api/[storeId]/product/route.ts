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

        const { 
            name,
            price,
            categoryID,
            subcategoryID,
            images,
            isFeatured,
            isArchived,
            description
         } = body

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(!name){
            return new NextResponse('name is required', {status: 400})
        }
        if(!images || !images.length ){
            return new NextResponse('images is required', {status: 400})
        }

        if(!price){
            return new NextResponse('price is required', {status: 400})
        }
        if(!categoryID){
            return new NextResponse('categoryID is required', {status: 400})
        }
        if(!subcategoryID){
            return new NextResponse('subcategoryID is required', {status: 400})
        }
        if(!description){
            return new NextResponse('description is required', {status: 400})
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
        const product = await prismadb.product.create({
            data:{
                name,
                price, 
                isFeatured,
                isArchived,
                categoryID,
                subcategoryID,
                storeId: params.storeId,
                description,
                images:{
                    createMany: {
                        data: [
                            ...images.map( (image: {url:string}) => image)
                        ]
                    }
                },
                
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('PRODUCTS_POST', error)

        return new NextResponse('internal error en post', {status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params: {storeId: string}}
){
    try {
        const {searchParams} = new URL(req.url);
        const categoryID    = searchParams.get("categoryID") || undefined;
        const subcategoryID = searchParams.get("subcategoryID") || undefined;
        const isFeatured    = searchParams.get("isFeatured") || undefined;
        const isArchived    = searchParams.get("isArchived") || undefined;
        

        if(!params.storeId){
            return new NextResponse('StoreID is required', {status: 400})
        }

        const product = await prismadb.product.findMany({
            where:{
                storeId: params.storeId,
                categoryID,
                subcategoryID,
                isFeatured : isFeatured ? true : undefined,
                isArchived: isArchived ? true : undefined,
            },
            include:{
                images:true ,
                category:true ,
                subcategory: true,
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('PRODUCTS_GET', error)

        return new NextResponse('internal error', {status: 500})
    }
}