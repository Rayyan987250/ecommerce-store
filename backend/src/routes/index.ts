import { Router } from "express";
import authRoutes from "./auth-routes.js";
import productRoutes from "./product-routes.js";
import systemRoutes from "./system-routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/system", systemRoutes);

export default router;
