
import mongoose,{Schema,Model,Document} from "mongoose"

export interface cart {

    productId:mongoose.Types.ObjectId;
    name:string;
    price:number;
    quantity:number;
    image:string;

}

export interface cartI extends Document{

    userId:string;
    items:cart[];
    totalPrice:number;
    updatedAt:Date
}

const CartItemScheema= new Schema<cart>({

    productId:{
        type:Schema.Types.ObjectId,
        ref:'Products',
        required:true
    },
     name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  image: {
    type: String,
    required: true,
  },
})

const CartScheema=new Schema<cartI>({

    userId:{type:String,required:true,unique:true},
    items:[CartItemScheema],
    totalPrice:{type:Number,
        default:0
    }

},{timestamps:true})

CartScheema.pre<cartI>('save',async function (){
    this.totalPrice=this.items.reduce(
        (total,item)=>total+item.price*item.quantity,0
    );

})

const Cart:Model<cartI>=mongoose.models.CartI||mongoose.model<cartI>("Cart",CartScheema)

export default Cart;