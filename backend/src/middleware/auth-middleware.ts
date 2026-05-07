import type { NextFunction, Request, Response } from "express";
import { sql } from "../config/db.js";
import { verifyAccessToken } from "../utils/auth-tokens.js";

type DecodedToken = {
  id: string;
};

export async function protect(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.access_token as string | undefined;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
      return;
    }

    const decoded = verifyAccessToken(token) as DecodedToken;
    const users = await sql<{ id: string; email: string; name: string; is_admin: boolean }[]>`
      SELECT id::text AS id, email, name, is_admin
      FROM users
      WHERE id = ${decoded.id}::bigint
      LIMIT 1
    `;
    const user = users[0];

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.is_admin,
    };
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const csrfCookie = req.cookies?.csrf_token as string | undefined;
  const csrfHeader = req.header("x-csrf-token");

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
    return;
  }

  next();
}

export function admin(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.isAdmin) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: "Not authorized as admin",
  });
}
