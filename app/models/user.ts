
import  mongoose, {Schema,Model,Document} from "mongoose";

export interface user extends Document{

    name:string;
    email:string;
    password:string;
    image?:string;
    isAdmin:boolean;
    createdAt:Date;
    updatedAt:Date;

}

const UserScheema= new Schema<user>({
    name:{type:String,required:[true,'please enter name'],trim:true},
     email:{type:String,required:[true,'please enter email'],trim:true},
      password:{type:String,required:[true,'please enter password'],minLength:[6,'password must be atleast 6 characters'],trim:true,select:false},
      image:{type:String, default:null},
      isAdmin:{type:Boolean,default:false},

},{timestamps:true})


const User:Model<user>= mongoose.models.User||mongoose.model<user>("Users",UserScheema)

export default User;