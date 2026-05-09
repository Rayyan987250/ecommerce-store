"use client";

import { createProduct, deleteProduct, getProducts, updateProduct } from "@/services/api";
import type { Product, ProductCondition } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PencilLine, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type ProductFormState = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  featuresText: string;
  condition: ProductCondition;
  verified: boolean;
  image: string;
  imagesText: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviewCount: string;
  orders: string;
  sold: string;
  freeShipping: boolean;
  shortDescription: string;
  description: string;
  specsText: string;
};

const productsQueryKey = ["admin-products"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyForm(): ProductFormState {
  return {
    title: "",
    slug: "",
    category: "",
    brand: "",
    featuresText: "",
    condition: "new",
    verified: false,
    image: "/images/products/backpack.png",
    imagesText: "/images/products/backpack.png",
    price: "",
    originalPrice: "",
    rating: "0",
    reviewCount: "0",
    orders: "0",
    sold: "0",
    freeShipping: false,
    shortDescription: "",
    description: "",
    specsText: "",
  };
}

function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    brand: product.brand,
    featuresText: product.features.join(", "),
    condition: product.condition,
    verified: product.verified,
    image: product.image,
    imagesText: product.images.join(", "),
    price: String(product.price),
    originalPrice: product.originalPrice === undefined ? "" : String(product.originalPrice),
    rating: String(product.rating),
    reviewCount: String(product.reviewCount),
    orders: String(product.orders),
    sold: String(product.sold),
    freeShipping: product.freeShipping,
    shortDescription: product.shortDescription,
    description: product.description,
    specsText: Object.entries(product.specs)
      .map(([key, value]) => `${key}:${value}`)
      .join("\n"),
  };
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpecs(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex < 0) return acc;
      const key = line.slice(0, separatorIndex).trim();
      const entry = line.slice(separatorIndex + 1).trim();
      if (key && entry) acc[key] = entry;
      return acc;
    }, {});
}

function toPayload(form: ProductFormState) {
  return {
    title: form.title.trim(),
    slug: (form.slug.trim() || slugify(form.title)).trim(),
    category: form.category.trim(),
    brand: form.brand.trim(),
    features: parseCsv(form.featuresText),
    condition: form.condition,
    verified: form.verified,
    image: form.image.trim(),
    images: parseCsv(form.imagesText),
    price: Number(form.price || 0),
    originalPrice: form.originalPrice.trim().length ? Number(form.originalPrice) : undefined,
    rating: Number(form.rating || 0),
    reviewCount: Number(form.reviewCount || 0),
    orders: Number(form.orders || 0),
    sold: Number(form.sold || 0),
    freeShipping: form.freeShipping,
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    specs: parseSpecs(form.specsText),
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="space-y-1 text-[13px] font-semibold text-[#445368]">{children}</label>;
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: () => getProducts({ page: 1, pageSize: 100, sort: "featured" }),
  });

  const sortedProducts = useMemo(
    () => [...(productsQuery.data?.items ?? [])].sort((a, b) => a.title.localeCompare(b.title)),
    [productsQuery.data?.items]
  );

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      setMessage("Product created successfully.");
      setErrorMessage(null);
      setForm(emptyForm());
      await queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setMessage(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<Product, "id">> }) => updateProduct(id, payload),
    onSuccess: async () => {
      setMessage("Product updated successfully.");
      setErrorMessage(null);
      setForm(emptyForm());
      await queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setMessage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      setMessage("Product deleted successfully.");
      setErrorMessage(null);
      if (form.id) {
        setForm(emptyForm());
      }
      await queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setMessage(null);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = toPayload(form);

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-2xl border border-[#dde5ef] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold text-[#10233d]">
              {form.id ? "Edit product" : "Create product"}
            </h2>
            <p className="mt-1 text-[14px] text-[#5f6f84]">
              Update the storefront catalog and push changes through the admin API.
            </p>
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm());
                setMessage(null);
                setErrorMessage(null);
              }}
              className="rounded-xl border border-[#d9dfe7] px-3 py-2 text-[13px] font-semibold text-[#505050] hover:bg-[#f7fbff]"
            >
              Reset
            </button>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel>
              <span>Title</span>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                    slug: current.id ? current.slug : slugify(event.target.value),
                  }))
                }
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
            <FieldLabel>
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel>
              <span>Category</span>
              <input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
            <FieldLabel>
              <span>Brand</span>
              <input
                value={form.brand}
                onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel>
              <span>Price</span>
              <input
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
            <FieldLabel>
              <span>Original price</span>
              <input
                value={form.originalPrice}
                onChange={(event) => setForm((current) => ({ ...current, originalPrice: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel>
              <span>Condition</span>
              <select
                value={form.condition}
                onChange={(event) =>
                  setForm((current) => ({ ...current, condition: event.target.value as ProductCondition }))
                }
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              >
                <option value="new">New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Used</option>
              </select>
            </FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-[#d9dfe7] px-3 py-2 text-[14px] text-[#10233d]">
                <input
                  type="checkbox"
                  checked={form.verified}
                  onChange={(event) => setForm((current) => ({ ...current, verified: event.target.checked }))}
                  className="h-4 w-4 accent-[#127fff]"
                />
                Verified
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-[#d9dfe7] px-3 py-2 text-[14px] text-[#10233d]">
                <input
                  type="checkbox"
                  checked={form.freeShipping}
                  onChange={(event) => setForm((current) => ({ ...current, freeShipping: event.target.checked }))}
                  className="h-4 w-4 accent-[#127fff]"
                />
                Free shipping
              </label>
            </div>
          </div>

          <FieldLabel>
            <span>Primary image</span>
            <input
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
              className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
            />
          </FieldLabel>

          <FieldLabel>
            <span>Gallery images</span>
            <input
              value={form.imagesText}
              onChange={(event) => setForm((current) => ({ ...current, imagesText: event.target.value }))}
              placeholder="/images/products/backpack.png, /images/products/headphones.png"
              className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
            />
          </FieldLabel>

          <FieldLabel>
            <span>Features</span>
            <input
              value={form.featuresText}
              onChange={(event) => setForm((current) => ({ ...current, featuresText: event.target.value }))}
              placeholder="GPS, Waterproof, Bluetooth"
              className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
            />
          </FieldLabel>

          <div className="grid gap-4 sm:grid-cols-4">
            <FieldLabel>
              <span>Rating</span>
              <input
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
            <FieldLabel>
              <span>Reviews</span>
              <input
                value={form.reviewCount}
                onChange={(event) => setForm((current) => ({ ...current, reviewCount: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
            <FieldLabel>
              <span>Orders</span>
              <input
                value={form.orders}
                onChange={(event) => setForm((current) => ({ ...current, orders: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
            <FieldLabel>
              <span>Sold</span>
              <input
                value={form.sold}
                onChange={(event) => setForm((current) => ({ ...current, sold: event.target.value }))}
                className="h-10 w-full rounded-xl border border-[#d9dfe7] px-3 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
              />
            </FieldLabel>
          </div>

          <FieldLabel>
            <span>Short description</span>
            <textarea
              value={form.shortDescription}
              onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
              rows={3}
              className="w-full rounded-2xl border border-[#d9dfe7] px-3 py-2 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
            />
          </FieldLabel>

          <FieldLabel>
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              className="w-full rounded-2xl border border-[#d9dfe7] px-3 py-2 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
            />
          </FieldLabel>

          <FieldLabel>
            <span>Specs</span>
            <textarea
              value={form.specsText}
              onChange={(event) => setForm((current) => ({ ...current, specsText: event.target.value }))}
              rows={4}
              placeholder={"Model:A1\nMemory:256GB\nWarranty:1 year"}
              className="w-full rounded-2xl border border-[#d9dfe7] px-3 py-2 text-[14px] text-[#10233d] focus:outline-none focus:ring-2 focus:ring-[#127fff]/20"
            />
          </FieldLabel>

          {message ? <p className="rounded-xl border border-[#cce7d1] bg-[#f3fcf5] px-4 py-3 text-[13px] font-medium text-[#1e7b37]">{message}</p> : null}
          {errorMessage ? <p className="rounded-xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[13px] font-medium text-[#d63b42]">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#127fff] px-4 py-3 text-[15px] font-semibold text-white hover:bg-[#0f73e6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {form.id ? "Save product" : "Create product"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#dde5ef] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-semibold text-[#10233d]">Catalog inventory</h2>
            <p className="mt-1 text-[14px] text-[#5f6f84]">
              {productsQuery.data?.total ?? 0} products currently available.
            </p>
          </div>
          {productsQuery.isFetching ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#edf4ff] px-3 py-1 text-[13px] font-semibold text-[#127fff]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Refreshing
            </span>
          ) : null}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#e5ebf2]">
          <div className="hidden grid-cols-[1.5fr_1fr_120px_190px] gap-4 bg-[#f7f9fc] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#748397] lg:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Actions</span>
          </div>

          {productsQuery.isLoading ? (
            <div className="p-6 text-[14px] text-[#5f6f84]">Loading products...</div>
          ) : productsQuery.isError ? (
            <div className="p-6 text-[14px] text-[#d63b42]">
              {productsQuery.error.message || "Products could not be loaded."}
            </div>
          ) : (
            <div className="divide-y divide-[#edf1f5]">
              {sortedProducts.map((product) => (
                <article key={product.id} className="grid gap-4 px-4 py-4 lg:grid-cols-[1.5fr_1fr_120px_190px] lg:items-center">
                  <div>
                    <p className="text-[15px] font-semibold text-[#10233d]">{product.title}</p>
                    <p className="mt-1 text-[13px] text-[#6a788b]">{product.brand}</p>
                    <p className="mt-1 text-[12px] text-[#8794a8]">{product.slug}</p>
                  </div>
                  <div className="text-[14px] text-[#505050]">
                    <p>{product.category}</p>
                    <p className="mt-1 text-[12px] text-[#8794a8]">{product.condition}</p>
                  </div>
                  <div className="text-[15px] font-semibold text-[#10233d]">${product.price.toFixed(2)}</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(productToForm(product));
                        setMessage(null);
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#d9dfe7] px-3 py-2 text-[13px] font-semibold text-[#505050] hover:bg-[#f7fbff]"
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Delete ${product.title}?`)) return;
                        deleteMutation.mutate(product.id);
                      }}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#ffe3e3] px-3 py-2 text-[13px] font-semibold text-[#d63b42] hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
