import { NextResponse,NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";
import Products from "@/app/models/product";


export async function GET(request:NextRequest) {

    try{
        const session= await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {error:'Unauthorized'},
                {status:401}
            )
        }

        await connectDB();

        let cart= await Cart.findOne({userId:session.user.id});

        if(!cart){
            cart= await Cart.create({
                userId: session.user.id,
                items:[],
                totalPrice:0,
            })
        }

        return NextResponse.json(
            {cart},{status:200}
        )
    } catch(e:any){

        console.error('GET cart error:',e);
        return NextResponse.json(
            {error:'failed to fetch cart'},
            {status:500}
        )
    }
    
}

export async function POST(request:NextRequest){

    try{
          const session= await getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {error:'Unauthorized'},
                {status:404}
            );
        }

        await connectDB();

        const {productId,quantity=1}= await request.json()

        const product= await Products.findById(productId)

        if(!product){
            return NextResponse.json(
                {error:'product not found'},
                {status:401}
            )
        }

        if(product.stock<quantity){
            return NextResponse.json(
                {error:'insufficient stock'},
                {status:400}
            )
        }

        let cart= await Cart.findOne({userId:session.user.id})

        if(!cart){

            cart= new Cart({
                userId:session.user.id,
                items:[]
            })
        }


        const existingItems=cart.items.findIndex(
            (item)=>item.productId.toString()===productId
        )

        if(existingItems>-1){

            cart.items[existingItems].quantity+=quantity

        }else{
            cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,})
        }

        await cart.save()

        return NextResponse.json(
            {message:'items added to cart',cart},
            {status:200}
        )
    }catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }

}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (productId) {
      // Remove specific item
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      // Clear entire cart
      cart.items = [];
    }

    await cart.save();

    return NextResponse.json(
      { message: 'Cart updated', cart },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete from cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      const product = await Products.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      if (quantity > product.stock) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return NextResponse.json(
      { message: 'Cart updated', cart },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}