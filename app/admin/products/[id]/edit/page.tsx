'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Product } from '@/app/types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: '',
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !session?.user?.isAdmin) {
      alert('Access denied! Admin only.');
      router.push('/');
      return;
    }

    if (session?.user?.isAdmin) {
      fetchProduct();
    }
  }, [status, session]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        const product = data.product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image,
          stock: product.stock.toString(),
        });
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-2xl font-bold">
                🛡️ Admin Panel
              </Link>
              <Link href="/admin/products" className="hover:text-purple-200">
                Products
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button variant="secondary">← Back to Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <Input
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Gaming Laptop"
                required
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Price */}
              <Input
                label="Price (₹) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="1"
              />

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
{categories.map((cat) => (
<option key={cat} value={cat}>
{cat}
</option>
))}
</select>
</div>
{/* Image URL */}
          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />

          {/* Stock */}
          <Input
            label="Stock Quantity *"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            step="1"
          />

          {/* Image Preview */}
          {formData.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <img
                src={formData.image}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300?text=Invalid+URL';
                }}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </Button>
            <Link href="/admin/products" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  </div>
</div>);
}