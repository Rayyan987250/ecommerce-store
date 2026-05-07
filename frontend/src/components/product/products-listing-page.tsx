"use client";

import HomeFooterSection from "@/components/home/home-footer-section";
import NewsletterSection from "@/components/home/newsletter-section";
import ProductsResultsPanel from "@/components/product/products-results-panel";
import { useDebounce } from "@/hooks/use-debounce";
import { useProductsQuery } from "@/services/queries/products";
import type { ProductCondition } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type FiltersState = {
  category: string | null;
  brands: string[];
  features: string[];
  condition: ProductCondition | "any";
  minPrice: number;
  maxPrice: number;
  minRating: number;
  verifiedOnly: boolean;
  sort: "featured" | "price-asc" | "price-desc" | "rating-desc" | "orders-desc";
  page: number;
};

type ProductsListingPageProps = {
  initialSearch: string;
};

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#e3e6eb] py-4 last:border-b-0">
      <h3 className="mb-3 text-[15px] font-semibold text-[#1c1c1c]">{title}</h3>
      {children}
    </div>
  );
}

export default function ProductsListingPage({ initialSearch }: ProductsListingPageProps) {
  const search = useDebounce(initialSearch, 250);

  const [filters, setFilters] = useState<FiltersState>({
    category: null,
    brands: [],
    features: [],
    condition: "any",
    minPrice: 0,
    maxPrice: 1500,
    minRating: 0,
    verifiedOnly: false,
    sort: "featured",
    page: 1,
  });

  const query = useProductsQuery({
    search,
    category: filters.category,
    brands: filters.brands,
    features: filters.features,
    condition: filters.condition,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating || undefined,
    verifiedOnly: filters.verifiedOnly,
    sort: filters.sort,
    page: filters.page,
    pageSize: 9,
  });

  const availableCategories = query.data?.availableCategories ?? [];
  const availableBrands = query.data?.availableBrands ?? [];
  const availableFeatures = query.data?.availableFeatures ?? [];

  const activeChips = useMemo(() => {
    return [
      ...(filters.category ? [filters.category] : []),
      ...filters.brands,
      ...filters.features,
      ...(filters.minRating ? [`${filters.minRating}+ stars`] : []),
      ...(filters.verifiedOnly ? ["Verified only"] : []),
    ];
  }, [filters]);

  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value as number : 1 }));
  };

  const toggleInArray = (values: string[], item: string) =>
    values.includes(item) ? values.filter((entry) => entry !== item) : [...values, item];

  const clearFilters = () => {
    setFilters((current) => ({
      ...current,
      category: null,
      brands: [],
      features: [],
      condition: "any",
      minPrice: 0,
      maxPrice: 1500,
      minRating: 0,
      verifiedOnly: false,
      page: 1,
    }));
  };

  return (
    <section className="space-y-5">
      <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#8b96a5]">
        <Link href="/" className="hover:text-[#127fff]">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-[#127fff]">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#1c1c1c]">{search ? `Results for "${search}"` : filters.category ?? "Browse catalog"}</span>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-md border border-[#e3e6eb] bg-white px-4">
          <FilterSection title="Category">
            <ul className="space-y-2 text-[14px] text-[#505050]">
              {availableCategories.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => updateFilter("category", filters.category === item ? null : item)}
                    className={filters.category === item ? "font-semibold text-[#127fff]" : "transition-colors hover:text-[#127fff]"}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </FilterSection>

          <FilterSection title="Brands">
            <div className="space-y-2 text-[14px] text-[#505050]">
              {availableBrands.map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(item)}
                    onChange={() => updateFilter("brands", toggleInArray(filters.brands, item))}
                    className="h-4 w-4 rounded border-[#c7ced9] accent-[#127fff]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Features">
            <div className="space-y-2 text-[14px] text-[#505050]">
              {availableFeatures.slice(0, 6).map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(item)}
                    onChange={() => updateFilter("features", toggleInArray(filters.features, item))}
                    className="h-4 w-4 rounded border-[#c7ced9] accent-[#127fff]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price range">
            <div className="space-y-3">
              <input
                type="range"
                min={0}
                max={1500}
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
                aria-label="Maximum price range"
                className="w-full accent-[#127fff]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={String(filters.minPrice)}
                  onChange={(event) => updateFilter("minPrice", Number(event.target.value) || 0)}
                  aria-label="Minimum price"
                  className="h-9 rounded border border-[#d9dfe7] px-2 text-[13px] text-[#505050]"
                />
                <input
                  value={String(filters.maxPrice)}
                  onChange={(event) => updateFilter("maxPrice", Number(event.target.value) || 0)}
                  aria-label="Maximum price"
                  className="h-9 rounded border border-[#d9dfe7] px-2 text-[13px] text-[#505050]"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Condition">
            <div className="space-y-2 text-[14px] text-[#505050]">
              {[
                ["any", "Any"],
                ["refurbished", "Refurbished"],
                ["new", "Brand new"],
                ["used", "Used"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="condition"
                    checked={filters.condition === value}
                    onChange={() => updateFilter("condition", value as FiltersState["condition"])}
                    className="h-4 w-4 accent-[#127fff]"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Ratings">
            <div className="space-y-2 text-[14px] text-[#505050]">
              {[4, 3, 2].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => updateFilter("minRating", filters.minRating === rating ? 0 : rating)}
                  className={`block ${filters.minRating === rating ? "font-semibold text-[#127fff]" : "hover:text-[#127fff]"}`}
                >
                  {rating}+ stars
                </button>
              ))}
            </div>
          </FilterSection>
        </aside>

        <ProductsResultsPanel
          query={query}
          filters={filters}
          activeChips={activeChips}
          onClearFilters={clearFilters}
          onToggleVerified={() => updateFilter("verifiedOnly", !filters.verifiedOnly)}
          onSortChange={(value) => updateFilter("sort", value)}
          onPageChange={(page) => updateFilter("page", page)}
        />
      </div>

      <NewsletterSection />
      <HomeFooterSection />
    </section>
  );
}
