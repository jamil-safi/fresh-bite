import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getCart, addToCart, updateCartItem, removeCartItem, applyPromo } from "../controllers/cart.controller";

const router = Router();

router.use(requireAuth);
router.get("/", getCart);
router.post("/items", addToCart);
router.patch("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", removeCartItem);
router.post("/promo", applyPromo);

export default router;
