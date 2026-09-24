import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getCart, addToCart, updateCartItem, removeCartItem, applyPromo } from "../controllers/cart.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(getCart));
router.post("/items", asyncHandler(addToCart));
router.patch("/items/:itemId", asyncHandler(updateCartItem));
router.delete("/items/:itemId", asyncHandler(removeCartItem));
router.post("/promo", asyncHandler(applyPromo));

export default router;
