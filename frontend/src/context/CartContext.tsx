import { createContext, useContext, useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { Cart, CartItem, CartSummary, FoodItem } from "../types";
import { fetchCart, addToCartRequest, updateCartItemRequest, removeCartItemRequest, applyPromoRequest } from "../api/cart";
import { useAuth } from "./AuthContext";

const GUEST_CART_KEY = "freshbites_guest_cart";

// Kept in sync with the backend's PROMO_CODES (backend/src/controllers/cart.controller.ts)
// so guest checkout previews match what the server will actually apply after login.
const PROMO_CODES: Record<string, number> = {
  FRESH20: 0.2,
  FRESH10: 0.1,
};

function computeSummary(items: CartItem[], promo: { code: string; pct: number } | null): CartSummary {
  const subtotal = items.reduce((sum, i) => sum + Number(i.foodItem.price) * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const tax = Number((subtotal * 0.0845).toFixed(2));
  const promoDiscount = promo ? Number((subtotal * promo.pct).toFixed(2)) : 0;
  const total = Number((subtotal + deliveryFee + tax - promoDiscount).toFixed(2));
  return {
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    tax,
    promoDiscount,
    total,
    promoCode: promo?.code,
  };
}

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (e.g. private browsing) — guest cart just won't persist across reloads
  }
}

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  isGuest: boolean;
  refresh: () => Promise<void>;
  addItem: (food: FoodItem, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [serverCart, setServerCart] = useState<Cart | null>(null);
  const [guestItems, setGuestItems] = useState<CartItem[]>(() => loadGuestCart());
  const [guestPromo, setGuestPromo] = useState<{ code: string; pct: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const mergingRef = useRef(false);

  const refreshServerCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchCart();
      setServerCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Whenever a user is present (fresh login, signup, or an already-logged-in
  // session on page load), merge any items added as a guest into their real
  // account cart, then load the account cart as the source of truth.
  useEffect(() => {
    if (!user) {
      setServerCart(null);
      return;
    }
    if (mergingRef.current) return;
    mergingRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const pending = loadGuestCart();
        for (const item of pending) {
          await addToCartRequest(item.foodItem.id, item.quantity);
        }
        if (pending.length > 0) {
          localStorage.removeItem(GUEST_CART_KEY);
          setGuestItems([]);
          setGuestPromo(null);
        }
        const data = await fetchCart();
        setServerCart(data);
      } catch {
        await refreshServerCart();
      } finally {
        setLoading(false);
        mergingRef.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function addItem(food: FoodItem, quantity = 1) {
    if (user) {
      const data = await addToCartRequest(food.id, quantity);
      setServerCart(data);
      return;
    }
    setGuestItems((prev) => {
      const existing = prev.find((i) => i.foodItem.id === food.id);
      const next = existing
        ? prev.map((i) => (i.foodItem.id === food.id ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { id: food.id, quantity, foodItem: food }];
      saveGuestCart(next);
      return next;
    });
  }

  async function updateItem(itemId: string, quantity: number) {
    if (user) {
      const data = await updateCartItemRequest(itemId, quantity);
      setServerCart(data);
      return;
    }
    setGuestItems((prev) => {
      const next = prev.map((i) => (i.id === itemId ? { ...i, quantity } : i));
      saveGuestCart(next);
      return next;
    });
  }

  async function removeItem(itemId: string) {
    if (user) {
      const data = await removeCartItemRequest(itemId);
      setServerCart(data);
      return;
    }
    setGuestItems((prev) => {
      const next = prev.filter((i) => i.id !== itemId);
      saveGuestCart(next);
      return next;
    });
  }

  async function applyPromo(code: string) {
    if (user) {
      const data = await applyPromoRequest(code);
      setServerCart(data);
      return;
    }
    const pct = PROMO_CODES[code.toUpperCase()];
    if (!pct) throw new Error("Invalid or expired promo code");
    setGuestPromo({ code: code.toUpperCase(), pct });
  }

  const cart: Cart | null = user
    ? serverCart
    : { items: guestItems, summary: computeSummary(guestItems, guestPromo) };

  const itemCount = (cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        loading,
        isGuest: !user,
        refresh: refreshServerCart,
        addItem,
        updateItem,
        removeItem,
        applyPromo,
      }}
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
