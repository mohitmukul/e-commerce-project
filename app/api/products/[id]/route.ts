import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/app/lib/mongodb';
import Products from '@/app/models/product';
import { error } from 'console';


export async function GET(request:NextRequest,{params}:{params:{id:string}}) {

    try{

        await connectDB();

        const product = await Products.findById(params.id)

        if(!product){
            return NextResponse.json(
                {error:'product not found'},
                {status:404}
            )
        }

        return NextResponse.json(
            {product},{status:200}
        )
    }catch(e:any){

        console.error('Get product error:',e)

        return NextResponse.json(
            {error:'failed to fetch this product'},
            {status:500}
        )
    }

   
    
    
}

 export async function PUT(request:NextRequest,{params}:{params:{id:string}}) {

        try {   const session= await getServerSession(authOptions)

            if(!session||!session.user.isAdmin){

                return NextResponse.json(
                    {error:'Unauthorized - Admin access required'},
                    {status:401}
                )
            }

            await connectDB();

            const body= await request.json();

            const product= await Products.findByIdAndUpdate(params.id,
                body,
                {new:true, runValidators:true}
            );

            if(!product){
                 return NextResponse.json(
                    {error:'product not found'},
                    {status:404}
                 )
            }

            return NextResponse.json(
                {message:'product updated successfully',product},
                {status:200}
            )}
            catch(e:any){

                console.error('Update product error:', e);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }

    )}
        
    }

    export async function DELETE(request:NextRequest,{params}:{params:{id:string}}) {

        try{

            const session= await getServerSession(authOptions);

            if(!session || !session.user.isAdmin){

                return NextResponse.json(
                    {error:'Unauthorized - Admin access required'},
                    {status:401}
                )
            }

            await connectDB();

            const product= await Products.findByIdAndDelete(params.id)

            if(!product){
                return NextResponse.json(
                    {error:'product not found'},
                    {status:404}
                )
            }

            return NextResponse.json(
                {message:'product deleted successfully'},
                {status:200}
            )
        }
        catch(e:any){
            console.error('Delete Product error',e)
            return NextResponse.json(
                 { error: 'Failed to delete product' },
      { status: 500 }
            )
        }
    }

