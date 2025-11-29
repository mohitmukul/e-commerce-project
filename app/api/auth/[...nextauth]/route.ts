import NextAuth ,{NextAuthOptions}from "next-auth";
import bcrypt from "bcryptjs";
import  CredentialsProvider  from "next-auth/providers/credentials";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/user";


export const authOptions: NextAuthOptions={

    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                email:{label:'Email',type:'email'},
                password:{label:'Passwore',type:'password'},
            },

            async authorize(credentials){
                if(!credentials?.email ||! credentials?.password){
                    throw new Error('please enter email and password')
                }

                await connectDB()

                const user=await User.findOne({
                    email:credentials.email
                }).select('+password')

                if(!user){
                    throw new Error('Invalid email or password')
                }

                const isPasswordvalid=await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if(!isPasswordvalid){
                    throw new Error('Invalid email or password')
                }

                return {
                    id:user._id.toString(),
                    email:user.email,
                    name:user.name,
                    isAdmin:user.isAdmin,
                }
            },
        }),
    ],

    session:{
        strategy:'jwt',
        maxAge:7 * 24 * 60 * 40
    },

    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id=user.id;
                token.email=user.email;
                token.name=user.name;
                token.isAdmin=user.isAdmin;
            }
            return token
        },

        async session({session,token}){
            if(session.user){
                session.user.id=token.id as string;
                session.user.email=token.email as string;
                session.user.name=token.name as string;
                session.user.isAdmin=token.isAdmin as boolean;

            }
            return session
        }

    },

//    pages: {
//     signIn: '/auth/signin',
//     },

    
    


    secret:process.env.NEXTAUTH_SECRET,

    debug:process.env.NODE_ENV=== 'development'
};

const handler= NextAuth(authOptions);
export {handler as GET , handler as POST}