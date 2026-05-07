import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { requireCsrf } from "../src/middleware/auth-middleware.js";

describe("csrf middleware", () => {
  it("rejects when csrf token header does not match cookie", async () => {
    const app = express();
    app.use(cookieParser());
    app.post("/secure", requireCsrf, (_req, res) => res.status(200).json({ ok: true }));

    await request(app)
      .post("/secure")
      .set("Cookie", ["csrf_token=abc"])
      .set("x-csrf-token", "wrong")
      .expect(403);
  });

  it("allows when csrf token header matches cookie", async () => {
    const app = express();
    app.use(cookieParser());
    app.post("/secure", requireCsrf, (_req, res) => res.status(200).json({ ok: true }));

    const response = await request(app)
      .post("/secure")
      .set("Cookie", ["csrf_token=abc"])
      .set("x-csrf-token", "abc")
      .expect(200);

    expect(response.body.ok).toBe(true);
  });
});
