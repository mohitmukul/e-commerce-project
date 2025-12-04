'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ShopHub
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="secondary">Browse Products</Button>
              </Link>
              <Link href="/cart">
                <Button variant="secondary">🛒 Cart</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* User Info Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
                <p className="text-gray-600">{session?.user?.email}</p>
                {session?.user?.isAdmin && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Name</span>
                <span className="font-semibold">{session?.user?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Email</span>
                <span className="font-semibold">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Account Type</span>
                <span className="font-semibold">
                  {session?.user?.isAdmin ? 'Admin' : 'Customer'}
                </span>
              </div>
            </div>
          </Card>

          {/* Admin Panel Link */}
          {session?.user?.isAdmin && (
            <Card className="p-6 bg-purple-50 border-purple-200">
              <h3 className="font-bold text-lg mb-2">Admin Access</h3>
              <p className="text-gray-600 mb-4">
                You have admin privileges. Manage products and orders from the admin panel.
              </p>
              <Link href="/admin/dashboard">
                <Button variant="primary">Go to Admin Panel</Button>
              </Link>
            </Card>
          )}

          {/* Quick Links */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/cart">
                <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                  🛒 View Cart
                </button>
              </Link>
              <Link href="/products">
                <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                  🛍️ Browse Products
                </button>
              </Link>
            </div>
          </Card>

          {/* Logout Button */}
          <Card className="p-6">
            <Button
              variant="danger"
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}