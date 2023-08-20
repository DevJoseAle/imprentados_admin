import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
){
    try {


        const billboards = await prismadb.billboard.findMany()
        return NextResponse.json(billboards)
    } catch (error) {
        console.log('BILLBOARD_POST', error)

        return new NextResponse('internal error', {status: 500})
    }
}