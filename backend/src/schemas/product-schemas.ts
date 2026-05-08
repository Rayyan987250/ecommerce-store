import { z } from "zod";

export const productConditionSchema = z.enum(["new", "refurbished", "used"]);

const productTitleSchema = z.string().trim().min(3).max(180);
const productSlugSchema = z.string().trim().min(3).max(200);
const productCategorySchema = z.string().trim().min(2).max(80);
const productBrandSchema = z.string().trim().min(2).max(80);
const productFeatureArraySchema = z.array(z.string().trim().min(1)).max(30);
const productImageSchema = z.string().trim().min(1);
const productImagesSchema = z.array(productImageSchema).min(1);
const productPriceSchema = z.number().min(0);
const productRatingSchema = z.number().min(0).max(5);
const productCountSchema = z.number().int().min(0);
const productShortDescriptionSchema = z.string().trim().min(5).max(280);
const productDescriptionSchema = z.string().trim().min(10).max(3000);
const productSpecsSchema = z.record(z.string(), z.string());

export const productSchema = z.object({
  title: productTitleSchema,
  slug: productSlugSchema,
  category: productCategorySchema,
  brand: productBrandSchema,
  features: productFeatureArraySchema.default([]),
  condition: productConditionSchema.default("new"),
  verified: z.boolean().default(false),
  image: productImageSchema,
  images: productImagesSchema,
  price: productPriceSchema,
  originalPrice: productPriceSchema.nullable().optional(),
  rating: productRatingSchema.default(0),
  reviewCount: productCountSchema.default(0),
  orders: productCountSchema.default(0),
  sold: productCountSchema.default(0),
  freeShipping: z.boolean().default(false),
  shortDescription: productShortDescriptionSchema,
  description: productDescriptionSchema,
  specs: productSpecsSchema.default({}),
});

export const updateProductSchema = z.object({
  title: productTitleSchema.optional(),
  slug: productSlugSchema.optional(),
  category: productCategorySchema.optional(),
  brand: productBrandSchema.optional(),
  features: productFeatureArraySchema.optional(),
  condition: productConditionSchema.optional(),
  verified: z.boolean().optional(),
  image: productImageSchema.optional(),
  images: productImagesSchema.optional(),
  price: productPriceSchema.optional(),
  originalPrice: productPriceSchema.nullable().optional(),
  rating: productRatingSchema.optional(),
  reviewCount: productCountSchema.optional(),
  orders: productCountSchema.optional(),
  sold: productCountSchema.optional(),
  freeShipping: z.boolean().optional(),
  shortDescription: productShortDescriptionSchema.optional(),
  description: productDescriptionSchema.optional(),
  specs: productSpecsSchema.optional(),
});

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

export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQueryInput = z.infer<typeof getProductsQuerySchema>;
