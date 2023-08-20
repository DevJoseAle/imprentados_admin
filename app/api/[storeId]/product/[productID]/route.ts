import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    {params} : {params:{productID: string}}
){
    try {

        if(!params.productID){
            return new NextResponse('Product ID  is required',{status:400})
        }
        
        const product = await prismadb.product.findUnique({
            where:{
                id: params.productID,
            },
            include: {
                images: true ,
                category:true ,
                subcategory: true,
            }
       
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('PRODUCTS_GET_BY_ID', error)

        return new NextResponse('internal error en', {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params} : {params:{productID: string, storeId: string}}
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
        if(!images || !images.length){
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

        if(!params.productID){
            return new NextResponse('product ID is required',{status:400})
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
        await prismadb.product.update({
            where:{
                id: params.productID,
 

            },
            data:{
                name,
                price, 
                categoryID,
                subcategoryID,
                images:{
                    deleteMany:{}
                },
                isFeatured,
                isArchived,
                storeId: params.storeId,
                description

            }
        })

        const product = await prismadb.product.update({
            where:{
                id: params.productID,

            },
            data: {
                images: {
                    createMany:{
                        data: [
                            ...images.map((image:{url:string}) => image)
                        ]
                    }
                }
            }
    })

       return NextResponse.json(product)
    } catch (error) {
        console.log('PRODUCT _PATCH_BY_ID', error)

        return new NextResponse('internal error', {status: 500})
    }
}

export async function DELETE(
    req: Request,
    {params} : {params:{storeId: string, productID: string}}
){
    try {

        const {userId} = auth();


        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }


        if(!params.productID){
            return new NextResponse('Product ID  is required',{status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        }) 
        
        const product = await prismadb.product.deleteMany({
            where:{
                id: params.productID,
                

            }
       
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('STORES_PATCH', error)

        return new NextResponse('internal error', {status: 500})
    }
}