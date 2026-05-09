import { Router } from "express";
import { sql } from "../config/db.js";
import { admin, protect } from "../middleware/auth-middleware.js";

const router = Router();

router.get("/status", protect, admin, async (req, res, next) => {
  try {
    const [dbCheck, usersCount, productsCount, cartsCount, ordersCount] = await Promise.all([
      sql<{ now: string }[]>`SELECT NOW()::text AS now`,
      sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM users`,
      sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM products`,
      sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM carts`,
      sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM orders`,
    ]);

    res.status(200).json({
      success: true,
      status: "ok",
      message: "System status fetched successfully",
      data: {
        database: "connected",
        databaseTime: dbCheck[0]?.now ?? null,
        users: Number(usersCount[0]?.count ?? "0"),
        products: Number(productsCount[0]?.count ?? "0"),
        carts: Number(cartsCount[0]?.count ?? "0"),
        orders: Number(ordersCount[0]?.count ?? "0"),
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
