import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const config = {
    runtime: 'edge',
}

export async function GET(
    req: Request,
){
    try {


        const stores = await prismadb.store.findMany({
            where:{
                isFeatured: true
            },
            include:{
               billboards: true,
               products: {
                include:{
                    images: true
                }
               }

            }
        })
        return NextResponse.json(stores)
    
    } catch (error) {
        console.log('BILLBOARD_POST', error)

        return new NextResponse('internal error', {status: 500})
    }
}