import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
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

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getPrimaryFrontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((url) => url.trim())
    .find(Boolean) || "http://localhost:3000";
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

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body as { email: string };
    const users = await sql<{ id: string }[]>`
      SELECT id::text AS id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    const user = users[0];
    let resetUrl: string | undefined;

    if (user) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(token);

      await sql.begin(async (tx) => {
        await tx`DELETE FROM password_reset_tokens WHERE user_id = ${user.id}::bigint`;
        await tx`
          INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
          VALUES (${user.id}::bigint, ${tokenHash}, NOW() + INTERVAL '30 minutes')
        `;
      });

      const frontendUrl = getPrimaryFrontendUrl().replace(/\/$/, "");
      resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    }

    res.status(200).json({
      success: true,
      message: "If an account exists for that email, a reset link has been generated.",
      ...(resetUrl ? { data: { resetUrl } } : {}),
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body as { token: string; password: string };
    const tokenHash = hashResetToken(token);
    const rows = await sql<{ id: string; user_id: string }[]>`
      SELECT id::text AS id, user_id::text AS user_id
      FROM password_reset_tokens
      WHERE token_hash = ${tokenHash}
      AND consumed_at IS NULL
      AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const resetToken = rows[0];

    if (!resetToken) {
      res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired.",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await sql.begin(async (tx) => {
      await tx`
        UPDATE users
        SET password_hash = ${passwordHash}, updated_at = NOW()
        WHERE id = ${resetToken.user_id}::bigint
      `;
      await tx`
        UPDATE password_reset_tokens
        SET consumed_at = NOW()
        WHERE id = ${resetToken.id}::bigint
      `;
      await tx`
        DELETE FROM password_reset_tokens
        WHERE user_id = ${resetToken.user_id}::bigint
        AND id <> ${resetToken.id}::bigint
      `;
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
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
