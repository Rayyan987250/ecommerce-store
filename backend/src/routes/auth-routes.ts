import { Router } from "express";
import { getCsrfToken, getProfile, login, logout, refreshSession, register } from "../controllers/auth-controller.js";
import { protect, requireCsrf } from "../middleware/auth-middleware.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../schemas/auth-schemas.js";

const router = Router();
const authRateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 20, keyPrefix: "auth" });

router.get("/csrf-token", getCsrfToken);
router.post("/register", authRateLimiter, validateBody(registerSchema), register);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.post("/refresh", authRateLimiter, requireCsrf, refreshSession);
router.post("/logout", requireCsrf, logout);
router.get("/profile", protect, getProfile);

export default router;
