import mongoose,{ Schema,Model,Document } from "mongoose";

export interface product extends Document{

    id:string;
    name:string;
    description:string;
    price:number;
    category:string;
    image:string;
    stock:number;
    createdAt:Date;
    updatedAt:Date
}

const ProductScheema= new Schema<product>({

    name:{type:String,required:[true,'product name is required'],trim:true,maxLength:[100,"product name cannot exeed 100 character"]},
    description:{type:String, required:[true,'product description is required'],trim:true, maxlength:[2000,"product description cannot exeed 2000 character"]},
    price:{type:Number,required:[true,'product price is required'],min:[0,'price cannot be negative']},
    category:{type:String, required:[true,'product category is required'], enum:{values:['Electronics','Clothing','Books','Home','Sports'],
            message:'please select a valid category'}},

    image:{type:String,required:[true,'product image is required'],default:'https://via.placeholder.com/300'},      
    stock:{type:Number, required:[true,'product stock is required'],minlength:[0,'stock cannot be negative'],default:0}

},{timestamps:true});

const Products:Model<product>= mongoose.models.Products||mongoose.model<product>("Products",ProductScheema);

export default Products;
