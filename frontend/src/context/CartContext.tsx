import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from "react";
import { Cart } from "../types";
import { fetchCart, addToCartRequest, updateCartItemRequest, removeCartItemRequest, applyPromoRequest } from "../api/cart";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (foodItemId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(foodItemId: string, quantity = 1) {
    const data = await addToCartRequest(foodItemId, quantity);
    setCart(data);
  }

  async function updateItem(itemId: string, quantity: number) {
    const data = await updateCartItemRequest(itemId, quantity);
    setCart(data);
  }

  async function removeItem(itemId: string) {
    const data = await removeCartItemRequest(itemId);
    setCart(data);
  }

  async function applyPromo(code: string) {
    const data = await applyPromoRequest(code);
    setCart(data);
  }

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, itemCount, loading, refresh, addItem, updateItem, removeItem, applyPromo }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
