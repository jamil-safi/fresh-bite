import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { checkout, listOrders, getOrder } from "../controllers/order.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(requireAuth);
router.post("/checkout", asyncHandler(checkout));
router.get("/", asyncHandler(listOrders));
router.get("/:id", asyncHandler(getOrder));

export default router;
