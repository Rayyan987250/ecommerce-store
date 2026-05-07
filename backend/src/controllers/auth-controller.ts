import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sql } from "../config/db.js";
import {
  clearAuthCookies,
  generateCsrfToken,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/auth-tokens.js";

function issueSessionCookies(res: Response, userId: string) {
  const accessToken = signAccessToken({ id: userId });
  const refreshToken = signRefreshToken({ id: userId });
  const csrfToken = generateCsrfToken();
  setAuthCookies(res, accessToken, refreshToken, csrfToken);
  return csrfToken;
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email: string;
      password: string;
    };

    const existing = await sql<{ id: string }[]>`SELECT id::text FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    const displayName = name?.trim() || email.split("@")[0] || "User";
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await sql<{ id: string; name: string; email: string; is_admin: boolean }[]>`
      INSERT INTO users (name, email, password_hash, is_admin)
      VALUES (${displayName}, ${email}, ${passwordHash}, FALSE)
      RETURNING id::text AS id, name, email, is_admin
    `;
    const user = created[0];
    if (!user) {
      res.status(500).json({ success: false, message: "Failed to create user" });
      return;
    }
    const csrfToken = issueSessionCookies(res, user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const users = await sql<
      { id: string; name: string; email: string; is_admin: boolean; password_hash: string }[]
    >`
      SELECT id::text AS id, name, email, is_admin, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    const user = users[0];

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const csrfToken = issueSessionCookies(res, user.id);

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }
    const users = await sql<{ id: string; name: string; email: string; is_admin: boolean }[]>`
      SELECT id::text AS id, name, email, is_admin
      FROM users
      WHERE id = ${userId}::bigint
      LIMIT 1
    `;
    const user = users[0];
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshSession(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: "Refresh token missing" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const users = await sql<{ id: string; name: string; email: string; is_admin: boolean }[]>`
      SELECT id::text AS id, name, email, is_admin
      FROM users
      WHERE id = ${decoded.id}::bigint
      LIMIT 1
    `;
    const user = users[0];
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    const csrfToken = issueSessionCookies(res, user.id);
    res.status(200).json({
      success: true,
      message: "Session refreshed",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
      csrfToken,
    });
  } catch (error) {
    next(error);
  }
}

export function logout(_req: Request, res: Response) {
  clearAuthCookies(res);
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
}

export function getCsrfToken(_req: Request, res: Response) {
  const csrfToken = generateCsrfToken();
  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    success: true,
    csrfToken,
  });
}
