import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/lib/mongodb";
import Products from "@/app/models/product";



export async function GET(request:NextRequest) {

    try{

        await connectDB();

        const {searchParams}= new URL(request.url)

        const category= searchParams.get('category');
        const search= searchParams.get('search')

        let query:any={};

        if(category && category !== 'all'){
            query.category=category;
        }

        if(search){
            query.name={$regex:search, $option:'i'}
        }

        const products= await Products.find(query).sort({createdAt:-1});

        return NextResponse.json(
            {products},{status:200}
        )

    }catch(e:any){
        console.error('Get products error:',e)

        NextResponse.json(
            {error:'failed to fetch promise'},
        {status:500})
    }
    
}

export async function POST(request:NextRequest) {

    try{

        const session= await getServerSession(authOptions)

        if(!session|| !session.user.isAdmin){
            return NextResponse.json(
                {error:'Unauthorized:Admin access required'},
                {status:401}
            );
        }
        await connectDB();

        const body=await request.json()
        const{name, description,price,category,image,stock}= body;

        if(!name||!description||!price||!category||!image||!stock){
            return NextResponse.json(
                {error:'please provide all required feilds'},
                {status:400}
            )
        }

        const products= await Products.create({
            name,
            description,
            price,
            category,
            image: image || 'https://via.placeholder.com/300',
            stock:Number(stock)||0
        })

        return NextResponse.json(
            {message:'Product created successfully',products},
            {status:201}
        )
    }catch(e:any){

        console.error('create product error:',e)

        return NextResponse.json(
            {error:'failed to create product'},
            {status:500}
        )
    }
    
}