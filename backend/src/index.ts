import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB, initializeSchemaAndSeed } from "./config/db.js";
import { errorHandler } from "./middleware/error-handler.js";
import { createRateLimiter } from "./middleware/rate-limit.js";
import { requestContext } from "./middleware/request-context.js";
import { requestLogger } from "./middleware/request-logger.js";
import routes from "./routes/index.js";

dotenv.config();

function getAllowedOrigins() {
  return (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = express();
  const frontendUrls = getAllowedOrigins();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    cors({
      origin: frontendUrls,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(requestContext);
  app.use(requestLogger);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(createRateLimiter({ windowMs: 60_000, maxRequests: 900, keyPrefix: "global" }));
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  });

  app.use("/api", routes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      requestId: req.requestId,
    });
  });

  app.use(errorHandler);
  return app;
}

const app = createApp();

async function startServer() {
  await connectDB();
  await initializeSchemaAndSeed();
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 CORS enabled for: ${getAllowedOrigins().join(", ")}`);
    console.log("🗃️ Neon schema initialized and seed ensured");
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch((error: unknown) => {
    console.error("❌ Neon startup connection failed", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (error: unknown) => {
    console.error("❌ Unhandled Promise Rejection:", error);
    process.exit(1);
  });

  process.on("uncaughtException", (error: unknown) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
  });
}

export default app;
