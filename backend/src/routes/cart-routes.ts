import { Router } from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  mergeCart,
  removeCartItem,
  syncCart,
  updateCartItem,
} from "../controllers/cart-controller.js";
import { protect } from "../middleware/auth-middleware.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";
import { cartItemMutationSchema, cartQtyUpdateSchema, cartSyncSchema } from "../schemas/cart-schemas.js";

const router = Router();
const cartLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 120, keyPrefix: "cart" });

router.use(cartLimiter, protect);

router.get("/", getCart);
router.post("/merge", validateBody(cartSyncSchema), mergeCart);
router.put("/sync", validateBody(cartSyncSchema), syncCart);
router.post("/items", validateBody(cartItemMutationSchema), addCartItem);
router.put("/items/:productId", validateBody(cartQtyUpdateSchema), updateCartItem);
router.delete("/items/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;
