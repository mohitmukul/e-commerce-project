import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to ShopHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your one-stop shop for everything you need
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button variant="primary" className="text-lg px-8 py-3">
                Browse Products
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}