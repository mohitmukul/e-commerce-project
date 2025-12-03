import  jwt, { JwtPayload }  from "jsonwebtoken";


const JWT_SECRET = process.env.NEXTAUTH_SECRET as string;

if(!JWT_SECRET){
    throw new Error('please add AUTH_SECRET to env.local')
}

export interface JWTpayload{

    userId:string,
    email:string,
    isAdmin:boolean
}

export function generateToken(payload:JWTpayload):string{

    return jwt.sign(payload,JWT_SECRET,{expiresIn:'7d'})
}

export function verifyToken(token: string): JWTpayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTpayload;
    
    // TEMPORARY FIX - Force admin for your user ID
    if (decoded.userId === '692c202c46d72a339d5a6a8b') {
      decoded.isAdmin = true;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}
    
