import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(50).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().email(),
});

export const confirmPasswordResetSchema = z.object({
  token: z.string().trim().min(20).max(256),
  password: z.string().min(8).max(128),
});
