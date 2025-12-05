'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Product } from '@/app/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let url = '/api/products?';
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${searchQuery}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-100">
      
      <nav className="bg-red-300 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-red-400">
              ShopHub
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="secondary">🛒 Cart</Button>
              </Link>
              <Link href="/profile">
                <Button variant="secondary">👤 Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

  
      <div className="bg-red-200 shadow-sm mb-8">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl text-white font-bold mb-4">All Products</h1>
          
      
          <div className="max-w-md mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border text-white border-gray-100 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent"
            />
          </div>

          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-300 text-white'
                    : 'bg-white text-red-700 hover:bg-red-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="text-red-400 mt-4">{products.length} products found</p>
        </div>
      </div>

  
      <div className="container mx-auto px-4 pb-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try different filters or search terms</p>
          </div>
        ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <Link key={product._id} href={`/products/${product._id}`}>
      <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
      
        <div className="aspect-square bg-gray-200 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image';
            }}
          />
        </div>

    
        <div className="p-4 flex-1 flex flex-col bg-red-100">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
            {product.name}
          </h3>
          <p className="text-red-700 text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-red-800">
              ₹{product.price.toLocaleString()}
            </span>
            <span className={`text-sm px-3 py-1 rounded font-medium ${
              product.stock > 0 
                ? 'bg-red-100 text-gray-600' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-2 font-medium">
            {product.category}
          </span>
        </div>
      </Card>
    </Link>
  ))}
</div>
        )}
      </div>
    </div>
  );
}