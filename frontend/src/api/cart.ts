import { apiClient } from "./client";
import { Cart } from "../types";

export async function fetchCart(): Promise<Cart> {
  const { data } = await apiClient.get<Cart>("/cart");
  return data;
}

export async function addToCartRequest(foodItemId: string, quantity = 1): Promise<Cart> {
  const { data } = await apiClient.post<Cart>("/cart/items", { foodItemId, quantity });
  return data;
}

export async function updateCartItemRequest(itemId: string, quantity: number): Promise<Cart> {
  const { data } = await apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeCartItemRequest(itemId: string): Promise<Cart> {
  const { data } = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
  return data;
}

export async function applyPromoRequest(code: string): Promise<Cart> {
  const { data } = await apiClient.post<Cart>("/cart/promo", { code });
  return data;
}

export async function checkoutRequest(promoCode?: string) {
  const { data } = await apiClient.post("/orders/checkout", { promoCode });
  return data;
}
