import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

async function getCartWithTotals(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { foodItem: { include: { restaurant: true, category: true } } },
    orderBy: { createdAt: "asc" },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.foodItem.price) * item.quantity,
    0
  );
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const tax = Number((subtotal * 0.0845).toFixed(2)); // estimated tax rate
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  return {
    items,
    summary: {
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee,
      tax,
      promoDiscount: 0,
      total,
    },
  };
}

export async function getCart(req: AuthRequest, res: Response) {
  const cart = await getCartWithTotals(req.user!.userId);
  res.json(cart);
}

const addSchema = z.object({
  foodItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20).default(1),
});

export async function addToCart(req: AuthRequest, res: Response) {
  const { foodItemId, quantity } = addSchema.parse(req.body);
  const food = await prisma.foodItem.findUnique({ where: { id: foodItemId } });
  if (!food) throw new ApiError(404, "Food item not found");

  await prisma.cartItem.upsert({
    where: { userId_foodItemId: { userId: req.user!.userId, foodItemId } },
    update: { quantity: { increment: quantity } },
    create: { userId: req.user!.userId, foodItemId, quantity },
  });

  const cart = await getCartWithTotals(req.user!.userId);
  res.status(201).json(cart);
}

const updateSchema = z.object({ quantity: z.number().int().min(1).max(20) });

export async function updateCartItem(req: AuthRequest, res: Response) {
  const { quantity } = updateSchema.parse(req.body);
  const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } });
  if (!item || item.userId !== req.user!.userId) {
    throw new ApiError(404, "Cart item not found");
  }
  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  const cart = await getCartWithTotals(req.user!.userId);
  res.json(cart);
}

export async function removeCartItem(req: AuthRequest, res: Response) {
  const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId } });
  if (!item || item.userId !== req.user!.userId) {
    throw new ApiError(404, "Cart item not found");
  }
  await prisma.cartItem.delete({ where: { id: item.id } });
  const cart = await getCartWithTotals(req.user!.userId);
  res.json(cart);
}

// Simple demo promo codes. In production, store these in the database.
const PROMO_CODES: Record<string, number> = {
  FRESH20: 0.2,
  FRESH10: 0.1,
};

const promoSchema = z.object({ code: z.string().min(1) });

export async function applyPromo(req: AuthRequest, res: Response) {
  const { code } = promoSchema.parse(req.body);
  const pct = PROMO_CODES[code.toUpperCase()];
  if (!pct) throw new ApiError(400, "Invalid or expired promo code");

  const cart = await getCartWithTotals(req.user!.userId);
  const promoDiscount = Number((cart.summary.subtotal * pct).toFixed(2));
  const total = Number(
    (cart.summary.subtotal + cart.summary.deliveryFee + cart.summary.tax - promoDiscount).toFixed(2)
  );

  res.json({
    ...cart,
    summary: { ...cart.summary, promoDiscount, total, promoCode: code.toUpperCase() },
  });
}
