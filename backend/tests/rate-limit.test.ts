import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../src/middleware/rate-limit.js";

describe("rate limiter", () => {
  it("blocks requests after configured threshold", async () => {
    const app = express();
    app.use(createRateLimiter({ windowMs: 60_000, maxRequests: 2, keyPrefix: "test-limit" }));
    app.get("/ping", (_req, res) => res.status(200).json({ ok: true }));

    await request(app).get("/ping").expect(200);
    await request(app).get("/ping").expect(200);
    const blocked = await request(app).get("/ping").expect(429);
    expect(blocked.body.success).toBe(false);
  });
});
