// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

// Cart types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
}

// API Error type
export interface ApiError {
  error: string;
  details?: string;
}