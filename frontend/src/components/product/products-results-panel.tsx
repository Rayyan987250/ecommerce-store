"use client";

import ProductGrid from "@/components/product/product-grid";
import ProductSkeleton from "@/components/product/product-skeleton";
import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import { useCartStore } from "@/store/use-cart-store";
import type { Product, ProductListResult } from "@/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { Grid2X2, Heart, List, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

type ViewMode = "grid" | "list";
type PaginationItem = number | "left-dots" | "right-dots";

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  const sorted = [...pages].filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];
    if (previous && page - previous > 1) {
      items.push(previous < currentPage ? "left-dots" : "right-dots");
    }
    items.push(page);
  }

  return items;
}

type ProductsResultsPanelProps = {
  query: UseQueryResult<ProductListResult, Error>;
  filters: {
    verifiedOnly: boolean;
    sort: "featured" | "price-asc" | "price-desc" | "rating-desc" | "orders-desc";
    page: number;
  };
  activeChips: string[];
  onClearFilters: () => void;
  onToggleVerified: () => void;
  onSortChange: (value: ProductsResultsPanelProps["filters"]["sort"]) => void;
  onPageChange: (page: number) => void;
};

function ProductListRow({ product }: { product: Product }) {
  const { formatPrice } = useCurrencyPricing();
  const addItem = useCartStore((state) => state.addItem);
  const saveProduct = useCartStore((state) => state.saveProduct);
  const saved = useCartStore((state) => state.isSaved(product.id));

  return (
    <article className="ui-surface rounded-md border border-[#e3e6eb] bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-[140px_1fr_112px]">
        <div className="flex h-[140px] items-center justify-center rounded-md border border-[#eef1f4]">
          <Image
            src={product.image}
            alt={product.title}
            width={130}
            height={130}
            sizes="130px"
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-[#1c1c1c]">{product.title}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[22px] font-semibold text-[#1c1c1c]">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-[14px] text-[#8b96a5] line-through">{formatPrice(product.originalPrice)}</span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-[#8b96a5]">
            <span className="flex items-center gap-0.5 text-[#ff9017]">
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar key={index} className={`h-3 w-3 ${index < Math.round(product.rating) ? "" : "opacity-25"}`} />
              ))}
            </span>
            <span>{product.rating.toFixed(1)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{product.orders} orders</span>
            <span aria-hidden="true">&middot;</span>
            <span className={product.freeShipping ? "text-[#00b517]" : ""}>
              {product.freeShipping ? "Free shipping" : "Standard delivery"}
            </span>
          </div>
          <p className="mt-2 max-w-[760px] text-[14px] text-[#505050]">{product.shortDescription}</p>
          <Link href={`/products/${product.id}`} className="ui-link-motion mt-2 inline-block text-[14px] font-semibold text-[#127fff] hover:underline">
            View details
          </Link>
        </div>
        <div className="flex flex-row gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="ui-button-pop inline-flex items-center justify-center gap-1 rounded-md bg-[#127fff] px-3 py-2 text-[13px] font-semibold text-white hover:bg-[#0f73e6]"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
          <button
            type="button"
            onClick={() => saveProduct(product)}
            className={`ui-button-pop rounded-md border px-3 py-2 text-[13px] font-semibold ${
              saved ? "border-[#127fff] bg-[#f1f7ff] text-[#127fff]" : "border-[#d9dfe7] text-[#505050] hover:bg-[#f7fbff]"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              Save
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductsResultsPanel({
  query,
  filters,
  activeChips,
  onClearFilters,
  onToggleVerified,
  onSortChange,
  onPageChange,
}: ProductsResultsPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const data = query.data;
  const currentPage = data?.page ?? filters.page;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#e3e6eb] bg-white p-3">
        <p className="text-[15px] text-[#1c1c1c]">{data?.total ?? 0} items</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-[14px] text-[#505050]">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={onToggleVerified}
              className="h-4 w-4 rounded border-[#c7ced9] accent-[#127fff]"
            />
            Verified only
          </label>
          <select
            aria-label="Sort products"
            value={filters.sort}
            onChange={(event) => onSortChange(event.target.value as ProductsResultsPanelProps["filters"]["sort"])}
            className="h-9 rounded border border-[#d9dfe7] px-3 text-[14px] text-[#505050]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="rating-desc">Highest rated</option>
            <option value="orders-desc">Best selling</option>
          </select>
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => setViewMode("grid")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded border text-[#505050] ${
              viewMode === "grid" ? "border-[#127fff] bg-[#f1f7ff] text-[#127fff]" : "border-[#d9dfe7] hover:bg-[#f5f9ff]"
            }`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => setViewMode("list")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded border text-[#505050] ${
              viewMode === "list" ? "border-[#127fff] bg-[#f1f7ff] text-[#127fff]" : "border-[#d9dfe7] hover:bg-[#f5f9ff]"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {activeChips.length ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-[#e3e6eb] bg-white px-3 py-2">
          {activeChips.map((chip) => (
            <span key={chip} className="inline-flex items-center gap-1 rounded border border-[#d9dfe7] bg-[#f8fbff] px-2 py-1 text-[12px] text-[#505050]">
              {chip}
            </span>
          ))}
          <button type="button" onClick={onClearFilters} className="text-[13px] font-semibold text-[#127fff] hover:underline">
            Clear filters
          </button>
        </div>
      ) : null}

      {query.isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : query.isError ? (
        <div className="rounded-md border border-[#ffd6d6] bg-white p-4 text-[14px] text-[#fa3434]">
          <p className="font-medium">The product catalog could not be loaded.</p>
          <p className="mt-1 text-[13px] text-[#b94b4b]">{query.error?.message ?? "Please refresh and try again."}</p>
        </div>
      ) : !data?.items.length ? (
        <div className="rounded-md border border-[#e3e6eb] bg-white p-8 text-center">
          <p className="text-[18px] font-semibold text-[#1c1c1c]">No products matched these filters.</p>
          <p className="mt-2 text-[14px] text-[#6c788a]">Try clearing a few filters or broadening your search.</p>
          <button type="button" onClick={onClearFilters} className="mt-4 rounded-md bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]">
            Reset filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <ProductGrid products={data.items} />
      ) : (
        <div className="space-y-3">
          {data.items.map((product) => (
            <ProductListRow key={product.id} product={product} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-end gap-2 rounded-md border border-[#e3e6eb] bg-white p-3">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-9 rounded border border-[#d9dfe7] px-3 text-[#505050] hover:bg-[#f5f9ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          {buildPaginationItems(currentPage, data.totalPages).map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`h-9 w-9 rounded border ${
                  currentPage === item ? "border-[#127fff] bg-[#127fff] text-white" : "border-[#d9dfe7] text-[#505050] hover:bg-[#f5f9ff]"
                }`}
              >
                {item}
              </button>
            ) : (
              <span key={`${item}-${currentPage}`} aria-hidden="true" className="px-1 text-[#8b96a5]">
                ...
              </span>
            )
          )}
          <button
            type="button"
            disabled={currentPage >= data.totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-9 rounded border border-[#d9dfe7] px-3 text-[#505050] hover:bg-[#f5f9ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
