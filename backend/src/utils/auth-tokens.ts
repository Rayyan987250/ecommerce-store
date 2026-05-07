import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { randomBytes } from "node:crypto";

type TokenPayload = { id: string };
type TokenKind = "access" | "refresh";

function getSecret(kind: TokenKind): string {
  const fallback = "dev-only-insecure-secret-change-me";
  if (kind === "access") {
    return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || fallback;
  }
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || fallback;
}

function getExpiry(kind: TokenKind): string {
  return kind === "access"
    ? process.env.JWT_ACCESS_EXPIRE || "15m"
    : process.env.JWT_REFRESH_EXPIRE || process.env.JWT_EXPIRE || "7d";
}

export function signAccessToken(payload: TokenPayload): string {
  const expiresIn = getExpiry("access") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign(payload, getSecret("access"), {
    expiresIn,
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  const expiresIn = getExpiry("refresh") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign(payload, getSecret("refresh"), {
    expiresIn,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret("access")) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret("refresh")) as TokenPayload;
}

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string, csrfToken: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "strict" : "lax";

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProduction,
    sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
  res.clearCookie("csrf_token", { path: "/" });
}
