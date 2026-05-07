import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
}

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: formatZodError(parsed.error),
      });
      return;
    }

    req.body = parsed.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: formatZodError(parsed.error),
      });
      return;
    }

    const mutableQuery = req.query as Record<string, unknown>;
    Object.keys(mutableQuery).forEach((key) => {
      delete mutableQuery[key];
    });
    Object.assign(mutableQuery, parsed.data as Record<string, unknown>);
    next();
  };
}
