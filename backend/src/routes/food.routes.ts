import { Router } from "express";
import { listFoods, getFood, listCategories, featuredFoods } from "../controllers/food.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/foods", asyncHandler(listFoods));
router.get("/foods/featured", asyncHandler(featuredFoods));
router.get("/foods/:id", asyncHandler(getFood));
router.get("/categories", asyncHandler(listCategories));

export default router;
