import type { NextFunction, Request, Response } from "express";

type ErrorWithStatus = Error & {
  statusCode?: number;
  code?: number | string;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
};

export function errorHandler(err: ErrorWithStatus, req: Request, res: Response, _next: NextFunction) {
  let statusCode = err.statusCode ?? 500;
  let message = err.message || "Internal Server Error";
  let errorCode = "INTERNAL_ERROR";

  if (err.code === 11000 && err.keyValue) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errorCode = "DUPLICATE_RESOURCE";
  }

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    errorCode = "VALIDATION_ERROR";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    errorCode = "INVALID_ID";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errorCode = "INVALID_TOKEN";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errorCode = "TOKEN_EXPIRED";
  }

  // Postgres-specific common errors
  if (err.code === "23505") {
    statusCode = 409;
    message = "Resource already exists";
    errorCode = "DUPLICATE_RESOURCE";
  } else if (err.code === "23503") {
    statusCode = 409;
    message = "Operation violates a relationship constraint";
    errorCode = "FOREIGN_KEY_CONSTRAINT";
  } else if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid input format";
    errorCode = "INVALID_INPUT";
  }

  if (process.env.NODE_ENV === "development") {
    console.error(`[${req.requestId ?? "unknown"}] ❌ Error:`, err);
  }

  res.status(statusCode).json({
    success: false,
    errorCode,
    message,
    requestId: req.requestId,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

export default errorHandler;
