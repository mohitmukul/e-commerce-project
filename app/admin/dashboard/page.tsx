'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    categories: 0,
  });

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
      fetchStats();
    }
  }, [status, session]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      const products = data.products || [];

      const lowStockProducts = products.filter((p: any) => p.stock < 5);
      const categories = [...new Set(products.map((p: any) => p.category))];

      setStats({
        totalProducts: products.length,
        lowStock: lowStockProducts.length,
        categories: categories.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (status === 'loading') {
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
    <div className="min-h-screen bg-red-100">
      
      <nav className="bg-red-300 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-2xl text-red-800 font-bold">
                🛡️ Admin Panel
              </Link>
              <Link href="/admin/products" className="hover:text-red-800">
                Products
              </Link>
              <Link href="/admin/products/new" className="hover:text-red-800">
                Add Product
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="secondary">View Store</Button>
              </Link>
              <Link href="/profile">
                <Button variant="secondary">Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-white font-bold mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-red-200 to-blue-300 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white mb-1">Total Products</p>
                <p className="text-4xl text-red-800 font-bold">{stats.totalProducts}</p>
              </div>
              <div className="text-6xl opacity-50">📦</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-200 to-orange-300 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-500 mb-1">Low Stock Items</p>
                <p className="text-4xl font-bold">{stats.lowStock}</p>
              </div>
              <div className="text-6xl opacity-50">⚠️</div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-300 to-red-400 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 mb-1">Categories</p>
                <p className="text-4xl text-white font-bold">{stats.categories}</p>
              </div>
              <div className="text-6xl opacity-50">📑</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl text-white font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/admin/products/new">
              <button className="w-full p-6 bg-red-100 hover:bg-red-300 rounded-lg text-left transition-colors border-2 border-blue-200">
                <div className="text-3xl mb-2">➕</div>
                <h3 className="font-bold text-white text-lg mb-1">Add New Product</h3>
                <p className="text-red-800 text-sm">Create a new product listing</p>
              </button>
            </Link>

            <Link href="/admin/products">
              <button className="w-full p-6 bg-red-100 hover:bg-red-200 rounded-lg text-left transition-colors border-2 border-purple-200">
                <div className="text-3xl mb-2">✏️</div>
                <h3 className="font-bold text-lg mb-1">Manage Products</h3>
                <p className="text-red-800 text-sm">Edit or delete existing products</p>
              </button>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Admin Info</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-semibold">{session?.user?.name}</p>
                <p className="text-sm text-red-800">{session?.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-semibold">Admin Access Level</p>
                <p className="text-sm text-red-800">Full access to all features</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}