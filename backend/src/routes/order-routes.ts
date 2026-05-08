import { Router } from "express";
import { checkout, getOrders } from "../controllers/order-controller.js";
import { protect } from "../middleware/auth-middleware.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";
import { checkoutSchema } from "../schemas/cart-schemas.js";

const router = Router();
const orderLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 60, keyPrefix: "orders" });

router.use(orderLimiter, protect);

router.get("/", getOrders);
router.post("/checkout", validateBody(checkoutSchema), checkout);

export default router;
