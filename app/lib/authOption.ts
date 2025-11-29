import  jwt, { JwtPayload }  from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET as string;

if(!JWT_SECRET){
    throw new Error('please add AUTH_SECRET to env.local')
}

export interface JWTpayload{

    userID:string,
    email:string,
    isAdmin:boolean
}

export function generateToken(payload:JWTpayload):string{

    return jwt.sign(payload,JWT_SECRET,{expiresIn:'7d'})
}

export function verifyToken(token:string):JwtPayload|null{
    try{
         const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
    }
