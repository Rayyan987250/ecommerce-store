import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../src/schemas/auth-schemas.js";
import { getProductsQuerySchema, productSchema } from "../src/schemas/product-schemas.js";

describe("zod request schemas", () => {
  it("validates auth payloads", () => {
    expect(() => loginSchema.parse({ email: "test@example.com", password: "password123" })).not.toThrow();
    expect(() => registerSchema.parse({ email: "bad-email", password: "12345678" })).toThrow();
  });

  it("validates product payload and query", () => {
    expect(() =>
      productSchema.parse({
        title: "Laptop",
        slug: "laptop-1",
        category: "Electronics",
        brand: "BrandX",
        features: ["wifi", "ssd"],
        condition: "new",
        verified: true,
        image: "/img.jpg",
        images: ["/img.jpg"],
        price: 1000,
        rating: 4.5,
        reviewCount: 10,
        orders: 100,
        sold: 90,
        freeShipping: true,
        shortDescription: "Great laptop for development.",
        description: "This laptop is designed for software developers with long battery life.",
        specs: { cpu: "i7", ram: "16GB" },
      })
    ).not.toThrow();

    const query = getProductsQuerySchema.parse({ page: "2", pageSize: "9", brands: "A,B", verifiedOnly: "true" });
    expect(query.page).toBe(2);
    expect(query.pageSize).toBe(9);
    expect(query.brands).toEqual(["A", "B"]);
    expect(query.verifiedOnly).toBe(true);
  });
});
