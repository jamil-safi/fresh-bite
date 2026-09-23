export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Restaurant {
  id: string;
  name: string;
  kitchen: string | null;
  distanceMi: number | null;
  isOpen: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: string; // Prisma Decimal serializes as string
  imageUrl: string;
  rating: string;
  reviewCount: number;
  tag: string | null;
  category: Category;
  restaurant: Restaurant;
}

export interface CartItem {
  id: string;
  quantity: number;
  foodItem: FoodItem;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  promoDiscount: number;
  total: number;
  promoCode?: string;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
