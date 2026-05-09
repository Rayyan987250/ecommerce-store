import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { randomBytes } from "node:crypto";

type TokenPayload = { id: string };
type TokenKind = "access" | "refresh";

function requireStrongSecret(name: string, legacyName?: string): string {
  const candidates = [name, legacyName].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const value = process.env[candidate]?.trim();
    if (!value) continue;
    if (value.length < 32 || value.toLowerCase().includes("replace-with")) {
      throw new Error(`${candidate} must be a strong random secret with at least 32 characters`);
    }
    return value;
  }

  throw new Error(`${name}${legacyName ? ` or ${legacyName}` : ""} is required`);
}

function getSecret(kind: TokenKind): string {
  if (kind === "access") {
    return requireStrongSecret("JWT_ACCESS_SECRET", "JWT_SECRET");
  }
  return requireStrongSecret("JWT_REFRESH_SECRET", "JWT_SECRET");
}

function getExpiry(kind: TokenKind): string {
  return kind === "access"
    ? process.env.JWT_ACCESS_EXPIRE || "15m"
    : process.env.JWT_REFRESH_EXPIRE || process.env.JWT_EXPIRE || "7d";
}

function getSameSite(): "lax" | "strict" | "none" {
  const configured = process.env.COOKIE_SAME_SITE?.trim().toLowerCase();
  if (configured === "lax" || configured === "strict" || configured === "none") {
    return configured;
  }

  return process.env.NODE_ENV === "production" ? "lax" : "lax";
}

function isSecureCookie(): boolean {
  const secure = process.env.COOKIE_SECURE?.trim().toLowerCase();
  if (secure === "true") return true;
  if (secure === "false") return false;
  return process.env.NODE_ENV === "production" || getSameSite() === "none";
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
  const secure = isSecureCookie();
  const sameSite = getSameSite();

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure,
    sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  const secure = isSecureCookie();
  const sameSite = getSameSite();
  res.clearCookie("access_token", { path: "/", secure, sameSite });
  res.clearCookie("refresh_token", { path: "/", secure, sameSite });
  res.clearCookie("csrf_token", { path: "/", secure, sameSite });
}
