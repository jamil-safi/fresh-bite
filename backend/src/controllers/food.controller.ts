import { Request, Response } from "express";
import { prisma } from "../config/db";
import { ApiError } from "../middleware/errorHandler";

export async function listCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json({ categories });
}

// GET /api/foods?category=Pizza&search=truffle&sort=recommended|price_asc|price_desc|rating
export async function listFoods(req: Request, res: Response) {
  const { category, search, sort } = req.query as {
    category?: string;
    search?: string;
    sort?: string;
  };

  const where: any = {};
  if (category && category !== "All Foods") {
    where.category = { name: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  const foods = await prisma.foodItem.findMany({
    where,
    orderBy,
    include: { category: true, restaurant: true },
  });
  res.json({ foods });
}

export async function getFood(req: Request, res: Response) {
  const food = await prisma.foodItem.findUnique({
    where: { id: req.params.id },
    include: { category: true, restaurant: true },
  });
  if (!food) throw new ApiError(404, "Food item not found");
  res.json({ food });
}

export async function featuredFoods(_req: Request, res: Response) {
  const foods = await prisma.foodItem.findMany({
    where: { tag: { not: null } },
    take: 3,
    orderBy: { rating: "desc" },
    include: { category: true, restaurant: true },
  });
  res.json({ foods });
}
