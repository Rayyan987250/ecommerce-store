import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getRecommendedProducts,
  getRelatedProducts,
  updateProduct,
} from "../controllers/product-controller.js";
import { admin, protect, requireCsrf } from "../middleware/auth-middleware.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { getProductsQuerySchema, productSchema, updateProductSchema } from "../schemas/product-schemas.js";

const router = Router();
const readLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 500, keyPrefix: "products-read" });
const writeLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 50, keyPrefix: "products-write" });

router.get("/", readLimiter, validateQuery(getProductsQuerySchema), getProducts);
router.get("/recommended/list", readLimiter, getRecommendedProducts);
router.get("/:id/related", readLimiter, getRelatedProducts);
router.get("/:id", readLimiter, getProductById);

router.post("/", writeLimiter, protect, requireCsrf, admin, validateBody(productSchema), createProduct);
router.put("/:id", writeLimiter, protect, requireCsrf, admin, validateBody(updateProductSchema), updateProduct);
router.delete("/:id", writeLimiter, protect, requireCsrf, admin, deleteProduct);

export default router;
