import { apiRequest } from "@/services/http";
import type { Product, ProductListResult, ProductQueryParams } from "@/types";

type ProductsResponse = ProductListResult;

export async function getProducts(params: ProductQueryParams = {}): Promise<ProductListResult> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.brands?.length) searchParams.set("brands", params.brands.join(","));
  if (params.features?.length) searchParams.set("features", params.features.join(","));
  if (params.condition && params.condition !== "any") searchParams.set("condition", params.condition);
  if (typeof params.minPrice === "number") searchParams.set("minPrice", String(params.minPrice));
  if (typeof params.maxPrice === "number") searchParams.set("maxPrice", String(params.maxPrice));
  if (typeof params.minRating === "number") searchParams.set("minRating", String(params.minRating));
  if (params.verifiedOnly) searchParams.set("verifiedOnly", "true");
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const response = await apiRequest<ProductsResponse>(`/products?${searchParams.toString()}`);
  return response.data as ProductListResult;
}

export async function getProductById(id: string) {
  const response = await apiRequest<Product>(`/products/${id}`);
  return response.data ?? null;
}

export async function getRelatedProducts(productId: string) {
  const response = await apiRequest<Product[]>(`/products/${productId}/related`);
  return response.data ?? [];
}

export async function getRecommendedProducts(productId?: string) {
  const search = productId ? `?excludeId=${encodeURIComponent(productId)}` : "";
  const response = await apiRequest<Product[]>(`/products/recommended/list${search}`);
  return response.data ?? [];
}
