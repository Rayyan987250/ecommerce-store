import type { NextFunction, Request, Response } from "express";
import { sql } from "../config/db.js";
import type { CreateProductInput, GetProductsQueryInput, UpdateProductInput } from "../schemas/product-schemas.js";

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  features: unknown;
  condition: "new" | "refurbished" | "used";
  verified: boolean;
  image: string;
  images: unknown;
  price: string | number;
  original_price: string | number | null;
  rating: string | number;
  review_count: number;
  orders: number;
  sold: number;
  free_shipping: boolean;
  short_description: string;
  description: string;
  specs: unknown;
};

type NormalizedProductRow = Omit<ProductRow, "features" | "images" | "specs"> & {
  features: string[];
  images: string[];
  specs: Record<string, string>;
};

const selectProductFields = `
  id::text AS id, title, slug, category, brand, features, condition, verified,
  image, images, price, original_price, rating, review_count, orders, sold, free_shipping,
  short_description, description, specs
`;

function parseProductId(value: unknown): number | null {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseJsonRecord(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, String(entry)])
    );
  }
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).map(([key, entry]) => [key, String(entry)])
      );
    }
  } catch {
    return {};
  }
  return {};
}

function normalizeRow(row: ProductRow): NormalizedProductRow {
  return {
    ...row,
    features: parseJsonArray(row.features),
    images: parseJsonArray(row.images),
    specs: parseJsonRecord(row.specs),
  };
}

function toApiProduct(row: ProductRow | NormalizedProductRow) {
  const product = "features" in row && Array.isArray(row.features) ? row : normalizeRow(row as ProductRow);
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    brand: product.brand,
    features: product.features,
    condition: product.condition,
    verified: product.verified,
    image: product.image,
    images: product.images,
    price: Number(product.price),
    originalPrice: product.original_price === null ? undefined : Number(product.original_price),
    rating: Number(product.rating),
    reviewCount: product.review_count,
    orders: product.orders,
    sold: product.sold,
    freeShipping: product.free_shipping,
    shortDescription: product.short_description,
    description: product.description,
    specs: product.specs,
  };
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query as unknown as GetProductsQueryInput;
    const brands = filters.brands ?? [];
    const features = filters.features ?? [];
    const pageNumber = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 9;

    const rows = await sql<ProductRow[]>`SELECT ${sql.unsafe(selectProductFields)} FROM products`;
    const allProducts = rows.map(normalizeRow);

    const search = filters.search?.trim().toLowerCase();
    let filtered = allProducts.filter((product) => {
      if (search) {
        const haystack =
          `${product.title} ${product.brand} ${product.category} ${product.short_description}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (filters.category && product.category !== filters.category) return false;
      if (brands.length > 0 && !brands.includes(product.brand)) return false;
      if (features.length > 0 && !features.every((feature) => product.features.includes(feature))) return false;
      if (filters.condition && product.condition !== filters.condition) return false;
      if (filters.verifiedOnly && !product.verified) return false;
      if (filters.minRating !== undefined && Number(product.rating) < filters.minRating) return false;
      if (filters.minPrice !== undefined && Number(product.price) < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && Number(product.price) > filters.maxPrice) return false;
      return true;
    });

    const sortType = filters.sort ?? "featured";
    filtered.sort((a, b) => {
      switch (sortType) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "rating-desc":
          return Number(b.rating) - Number(a.rating);
        case "orders-desc":
          return b.orders - a.orders;
        default:
          return Number(b.verified) - Number(a.verified) || Number(b.rating) - Number(a.rating) || b.orders - a.orders;
      }
    });

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    const safePage = Math.min(pageNumber, totalPages);
    const paged = filtered.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize);

    const availableBrands = [...new Set(allProducts.map((item) => item.brand))].sort();
    const availableFeatures = [...new Set(allProducts.flatMap((item) => item.features))].sort();
    const availableCategories = [...new Set(allProducts.map((item) => item.category))].sort();

    res.status(200).json({
      success: true,
      data: {
        total,
        page: safePage,
        pageSize,
        totalPages,
        items: paged.map(toApiProduct),
        availableBrands,
        availableFeatures,
        availableCategories,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseProductId(req.params.id);
    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }

    const products = await sql<{ id: string; category: string; brand: string }[]>`
      SELECT id::text AS id, category, brand
      FROM products
      WHERE id = ${productId}::bigint
      LIMIT 1
    `;
    const product = products[0];
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const related = await sql<ProductRow[]>`
      SELECT ${sql.unsafe(selectProductFields)}
      FROM products
      WHERE id <> ${productId}::bigint
      AND (category = ${product.category} OR brand = ${product.brand})
      ORDER BY rating DESC, orders DESC
      LIMIT 6
    `;

    res.status(200).json({
      success: true,
      data: related.map(toApiProduct),
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendedProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const excludeId = req.query.excludeId ? parseProductId(req.query.excludeId) : null;
    const items = excludeId
      ? await sql<ProductRow[]>`
          SELECT ${sql.unsafe(selectProductFields)}
          FROM products
          WHERE id <> ${excludeId}::bigint
          ORDER BY rating DESC, orders DESC
          LIMIT 5
        `
      : await sql<ProductRow[]>`
          SELECT ${sql.unsafe(selectProductFields)}
          FROM products
          ORDER BY rating DESC, orders DESC
          LIMIT 5
        `;
    res.status(200).json({
      success: true,
      data: items.map(toApiProduct),
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseProductId(req.params.id);
    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }
    const products = await sql<ProductRow[]>`
      SELECT ${sql.unsafe(selectProductFields)}
      FROM products
      WHERE id = ${productId}::bigint
      LIMIT 1
    `;
    const product = products[0];

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({ success: true, data: toApiProduct(product) });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as CreateProductInput;
    const rows = await sql<ProductRow[]>`
      INSERT INTO products (
        title, slug, category, brand, features, condition, verified, image, images,
        price, original_price, rating, review_count, orders, sold, free_shipping,
        short_description, description, specs
      ) VALUES (
        ${payload.title},
        ${payload.slug},
        ${payload.category},
        ${payload.brand},
        ${JSON.stringify(payload.features)}::jsonb,
        ${payload.condition},
        ${payload.verified},
        ${payload.image},
        ${JSON.stringify(payload.images)}::jsonb,
        ${payload.price},
        ${payload.originalPrice ?? null},
        ${payload.rating},
        ${payload.reviewCount},
        ${payload.orders},
        ${payload.sold},
        ${payload.freeShipping},
        ${payload.shortDescription},
        ${payload.description},
        ${JSON.stringify(payload.specs)}::jsonb
      )
      RETURNING ${sql.unsafe(selectProductFields)}
    `;
    const created = rows[0];
    if (!created) {
      res.status(500).json({ success: false, message: "Product creation failed" });
      return;
    }
    res.status(201).json({ success: true, data: toApiProduct(created) });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseProductId(req.params.id);
    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }

    const payload = req.body as UpdateProductInput;
    if (Object.keys(payload).length === 0) {
      res.status(400).json({ success: false, message: "No update fields provided" });
      return;
    }

    const existingRows = await sql<ProductRow[]>`
      SELECT ${sql.unsafe(selectProductFields)}
      FROM products
      WHERE id = ${productId}::bigint
      LIMIT 1
    `;
    const existing = existingRows[0];
    if (!existing) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const current = toApiProduct(existing);
    const merged = {
      title: payload.title ?? current.title,
      slug: payload.slug ?? current.slug,
      category: payload.category ?? current.category,
      brand: payload.brand ?? current.brand,
      features: payload.features ?? current.features,
      condition: payload.condition ?? current.condition,
      verified: payload.verified === undefined ? current.verified : payload.verified,
      image: payload.image ?? current.image,
      images: payload.images ?? current.images,
      price: payload.price ?? current.price,
      originalPrice: payload.originalPrice === undefined ? (current.originalPrice ?? null) : payload.originalPrice,
      rating: payload.rating ?? current.rating,
      reviewCount: payload.reviewCount ?? current.reviewCount,
      orders: payload.orders ?? current.orders,
      sold: payload.sold ?? current.sold,
      freeShipping: payload.freeShipping === undefined ? current.freeShipping : payload.freeShipping,
      shortDescription: payload.shortDescription ?? current.shortDescription,
      description: payload.description ?? current.description,
      specs: payload.specs ?? current.specs,
    };

    const rows = await sql<ProductRow[]>`
      UPDATE products
      SET
        title = ${merged.title},
        slug = ${merged.slug},
        category = ${merged.category},
        brand = ${merged.brand},
        features = ${JSON.stringify(merged.features)}::jsonb,
        condition = ${merged.condition},
        verified = ${merged.verified},
        image = ${merged.image},
        images = ${JSON.stringify(merged.images)}::jsonb,
        price = ${merged.price},
        original_price = ${merged.originalPrice},
        rating = ${merged.rating},
        review_count = ${merged.reviewCount},
        orders = ${merged.orders},
        sold = ${merged.sold},
        free_shipping = ${merged.freeShipping},
        short_description = ${merged.shortDescription},
        description = ${merged.description},
        specs = ${JSON.stringify(merged.specs)}::jsonb,
        updated_at = NOW()
      WHERE id = ${productId}::bigint
      RETURNING ${sql.unsafe(selectProductFields)}
    `;
    const product = rows[0];

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({ success: true, data: toApiProduct(product) });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseProductId(req.params.id);
    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }
    const deletedRows = await sql<{ id: string }[]>`
      DELETE FROM products
      WHERE id = ${productId}::bigint
      RETURNING id::text AS id
    `;
    const product = deletedRows[0];

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
