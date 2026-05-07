import { z } from "zod";

export const productConditionSchema = z.enum(["new", "refurbished", "used"]);

export const productSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(80),
  brand: z.string().trim().min(2).max(80),
  features: z.array(z.string().trim().min(1)).max(30).default([]),
  condition: productConditionSchema.default("new"),
  verified: z.boolean().default(false),
  image: z.string().trim().min(1),
  images: z.array(z.string().trim().min(1)).min(1),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  orders: z.number().int().min(0).default(0),
  sold: z.number().int().min(0).default(0),
  freeShipping: z.boolean().default(false),
  shortDescription: z.string().trim().min(5).max(280),
  description: z.string().trim().min(10).max(3000),
  specs: z.record(z.string(), z.string()),
});

export const updateProductSchema = productSchema.partial();

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length > 0) return Number(value);
  return undefined;
};

export const getProductsQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brands: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) return [];
      const values = Array.isArray(value) ? value : value.split(",");
      return values.map((item) => item.trim()).filter(Boolean);
    }),
  features: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) return [];
      const values = Array.isArray(value) ? value : value.split(",");
      return values.map((item) => item.trim()).filter(Boolean);
    }),
  condition: productConditionSchema.optional(),
  minPrice: z.preprocess(toNumber, z.number().min(0).optional()),
  maxPrice: z.preprocess(toNumber, z.number().min(0).optional()),
  minRating: z.preprocess(toNumber, z.number().min(0).max(5).optional()),
  verifiedOnly: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (typeof value === "boolean") return value;
      if (!value) return false;
      return value === "true";
    }),
  sort: z.enum(["featured", "price-asc", "price-desc", "rating-desc", "orders-desc"]).optional(),
  page: z.preprocess(toNumber, z.number().int().min(1).optional()),
  pageSize: z.preprocess(toNumber, z.number().int().min(1).max(100).optional()),
});
