import { NextRequest,NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/app/models/user";

export async function POST(request:NextRequest) {
    try{
        const body= await request.json();
        const {name,email,password}=body;

        if(!name||!email||!password){
            return NextResponse.json(
                {error:'please provide all feilds'},
                {status:400}
            );

        }

       await connectDB()

        const existUser= await User.findOne({email});
        if(existUser){
            return NextResponse.json(
                {error:'user already exist with this email'},
                {status:400}
            );
        }


        const hashedPassword= await bcrypt.hash(password,10);


        const user= await User.create({
            name,
            email,
            password:hashedPassword,
            isAdmin:false,
        })

        return NextResponse.json(
            {
                message:'user created successfully',
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                },

            },
            {status:200}
        )

    }catch(e:any){
        console.error('signup error:',e);

        return NextResponse.json(
            {
            error:'something went wrong'  
        },
        {
            status:500
        }
    )
    }
    
}