import { Router } from "express";
import { listFoods, getFood, listCategories, featuredFoods } from "../controllers/food.controller";

const router = Router();

router.get("/foods", listFoods);
router.get("/foods/featured", featuredFoods);
router.get("/foods/:id", getFood);
router.get("/categories", listCategories);

export default router;
