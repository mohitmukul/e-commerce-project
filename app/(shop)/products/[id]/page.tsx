'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Product } from '@/app/types';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      console.log(' Fetching product ID:', productId);
      const response = await fetch(`/api/products/${productId}`);
      console.log(' Response status:', response.status);
      
      const data = await response.json();
      console.log(' Response data:', data);

      if (response.ok && data.product) {
        setProduct(data.product);
        console.log(' Product loaded successfully!');
      } else {
        console.error(' Product not found in response');
        toast.error('Product not found');
        setTimeout(() => router.push('/products'), 2000);
      }
    } catch (error) {
      console.error(' Error fetching product:', error);
      toast.error('Failed to load product');
      setTimeout(() => router.push('/products'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product?._id,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-200">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-2xl text-gray-600 mb-4 font-semibold">Product not found</p>
          <p className="text-gray-500 mb-2">Product ID: {productId}</p>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist</p>
          <Link href="/products">
            <Button className="px-8 py-3">← Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-200">

      <nav className="bg-red-200 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-red-400">
              ShopHub
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="secondary">← Back to Products</Button>
              </Link>
              <Link href="/cart">
                <Button variant="secondary">🛒 Cart</Button>
              </Link>
              {session ? (
                <Link href="/profile">
                  <Button variant="secondary">👤 Profile</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="primary">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

    
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            
            <div className="aspect-square bg-red-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600?text=No+Image';
                }}
              />
            </div>

            
            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-red-200 text-red-400 rounded-full text-sm font-bold">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>

              <div className="mb-6">
                <span className="text-5xl font-bold text-red-400">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              <div className="mb-6 bg-red-100 p-4 rounded-lg">
                <h2 className="font-bold text-lg mb-2 text-gray-900">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6 bg-red-100 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">Availability:</span>
                  <span className={`px-4 py-2 rounded-lg font-bold ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                  </span>
                </div>
              </div>

              {product.stock > 0 && (
                <>
            
                  <div className="mb-6 bg-red-100 p-4 rounded-lg">
                    <label className="block font-bold mb-3 text-gray-900">Quantity:</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-lg bg-red-300 hover:bg-red-400 font-bold text-xl transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold w-16 text-center text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-12 rounded-lg bg-red-300 hover:bg-red-400 font-bold text-xl transition-colors"
                      >
                        +
                      </button>
                      <span className="text-gray-600 ml-4">
                        (Max: {product.stock})
                      </span>
                    </div>
                  </div>

          
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full text-xl py-4 font-bold"
                  >
                    {isAddingToCart ? '⏳ Adding to Cart...' : '🛒 Add to Cart'}
                  </Button>

                  {!session && (
                    <p className="text-center text-sm text-gray-600 mt-3">
                      Please <Link href="/login" className="text-red-300 underline font-semibold">login</Link> to add items to cart
                    </p>
                  )}
                </>
              )}

              {product.stock === 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
                  <p className="text-red-800 font-bold text-lg">⚠️ This product is currently out of stock</p>
                  <p className="text-red-600 mt-2">Check back later for availability</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}