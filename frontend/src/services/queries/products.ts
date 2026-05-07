"use client";

import { getProductById, getProducts, getRecommendedProducts, getRelatedProducts } from "@/services/api";
import type { ProductQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useProductsQuery(params: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}

export function useRelatedProductsQuery(id: string) {
  return useQuery({
    queryKey: ["related-products", id],
    queryFn: () => getRelatedProducts(id),
    enabled: Boolean(id),
  });
}

export function useRecommendedProductsQuery(id?: string) {
  return useQuery({
    queryKey: ["recommended-products", id ?? "default"],
    queryFn: () => getRecommendedProducts(id),
  });
}
