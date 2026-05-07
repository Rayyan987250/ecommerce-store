import { Router } from "express";
import { sql } from "../config/db.js";

const router = Router();

router.get("/status", async (req, res, next) => {
  try {
    const [dbCheck, usersCount, productsCount] = await Promise.all([
      sql<{ now: string }[]>`SELECT NOW()::text AS now`,
      sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM users`,
      sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM products`,
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
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
