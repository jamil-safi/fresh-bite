import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

const checkoutSchema = z.object({
  promoCode: z.string().optional(),
});

export async function checkout(req: AuthRequest, res: Response) {
  const { promoCode } = checkoutSchema.parse(req.body);
  const userId = req.user!.userId;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { foodItem: true },
  });
  if (cartItems.length === 0) throw new ApiError(400, "Your cart is empty");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.foodItem.price) * item.quantity,
    0
  );
  const deliveryFee = 3.99;
  const tax = Number((subtotal * 0.0845).toFixed(2));

  const PROMO_CODES: Record<string, number> = { FRESH20: 0.2, FRESH10: 0.1 };
  const pct = promoCode ? PROMO_CODES[promoCode.toUpperCase()] ?? 0 : 0;
  const promoDiscount = Number((subtotal * pct).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax - promoDiscount).toFixed(2));

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        subtotal,
        deliveryFee,
        tax,
        promoDiscount,
        promoCode: promoCode?.toUpperCase(),
        total,
        status: "CONFIRMED",
        items: {
          create: cartItems.map((item) => ({
            foodItemId: item.foodItemId,
            quantity: item.quantity,
            price: item.foodItem.price,
          })),
        },
      },
      include: { items: { include: { foodItem: true } } },
    });
    await tx.cartItem.deleteMany({ where: { userId } });
    return created;
  });

  res.status(201).json({ order });
}

export async function listOrders(req: AuthRequest, res: Response) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { foodItem: true } } },
  });
  res.json({ orders });
}

export async function getOrder(req: AuthRequest, res: Response) {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { foodItem: true } } },
  });
  if (!order || order.userId !== req.user!.userId) {
    throw new ApiError(404, "Order not found");
  }
  res.json({ order });
}
