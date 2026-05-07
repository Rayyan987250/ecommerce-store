export type ProductCondition = "new" | "refurbished" | "used";

export type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  features: string[];
  condition: ProductCondition;
  verified: boolean;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  orders: number;
  sold: number;
  freeShipping: boolean;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
};

export type ProductQueryParams = {
  search?: string;
  category?: string | null;
  brands?: string[];
  features?: string[];
  condition?: ProductCondition | "any";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "rating-desc" | "orders-desc";
  page?: number;
  pageSize?: number;
};

export type ProductListResult = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  availableBrands: string[];
  availableFeatures: string[];
  availableCategories: string[];
};

export type CartLineItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
};

export type SavedProduct = {
  id: string;
  title: string;
  image: string;
  price: number;
};
