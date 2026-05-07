import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();
  const id = req.requestId || "unknown";

  console.log(`[${id}] -> ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const durationMs = Math.round(performance.now() - start);
    console.log(`[${id}] <- ${req.method} ${req.originalUrl} ${res.statusCode} (${durationMs}ms)`);
  });

  next();
}
