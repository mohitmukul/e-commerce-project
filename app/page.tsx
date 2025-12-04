import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <Link href="/login">
                <Button variant="primary">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
<div className="text-center max-w-4xl mx-auto">
<h1 className="text-6xl font-bold text-gray-900 mb-6">
Welcome to <span className="text-blue-600">ShopHub</span>
</h1>
<p className="text-2xl text-gray-600 mb-12">
Your one-stop destination for all your shopping needs
</p>
<div className="flex gap-6 justify-center mb-16">
        <Link href="/products">
          <Button className="text-xl px-10 py-4">
            🛍️ Start Shopping
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="secondary" className="text-xl px-10 py-4">
            Create Account
          </Button>
        </Link>
      </div>

      
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-5xl mb-4">🚚</div>
          <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
          <p className="text-gray-600">On all orders above ₹500</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
          <p className="text-gray-600">100% secure transactions</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
          <p className="text-gray-600">30-day return policy</p>
        </div>
      </div>
    </div>
  </div>

  <footer className="bg-gray-900 text-white py-8 mt-20">
    <div className="container mx-auto px-4 text-center">
      <p>&copy; 2025 ShopHub. All rights reserved.</p>
      <p className="text-gray-400 mt-2">Built with Next.js & MongoDB</p>
    </div>
  </footer>
  </div>

)}
