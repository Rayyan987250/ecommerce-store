"use client";

import HomeFooterSection from "@/components/home/home-footer-section";
import NewsletterSection from "@/components/home/newsletter-section";
import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import {
  useProductQuery,
  useRecommendedProductsQuery,
  useRelatedProductsQuery,
} from "@/services/queries/products";
import { useCartStore } from "@/store/use-cart-store";
import type { Product } from "@/types";
import { Check, ChevronRight, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProductDetailsPageProps = {
  id: string;
};

type TabKey = "description" | "reviews" | "shipping" | "seller";

function ProductDetailsContent({
  id,
  product,
  relatedItems,
  recommendedItems,
}: {
  id: string;
  product: Product;
  relatedItems: Product[];
  recommendedItems: Product[];
}) {
  const { formatPrice } = useCurrencyPricing();
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [activeImage, setActiveImage] = useState(product.images[0] ?? product.image);
  const addItem = useCartStore((state) => state.addItem);
  const saveProduct = useCartStore((state) => state.saveProduct);
  const saved = useCartStore((state) => state.isSaved(id));

  return (
    <section className="space-y-5">
      <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#8b96a5]">
        <Link href="/" className="hover:text-[#127fff]">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-[#127fff]">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{product.title}</span>
      </nav>

      <div className="rounded-md border border-[#e3e6eb] bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[380px_1fr_280px]">
          <div>
            <div className="mb-3 flex h-[320px] items-center justify-center rounded-md border border-[#e3e6eb] bg-[#fafafa]">
              <Image
                src={activeImage}
                alt={product.title}
                width={280}
                height={280}
                sizes="(max-width: 1024px) 280px, 33vw"
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
                priority
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`Select image ${index + 1}`}
                  className={`rounded border p-1 transition ${activeImage === image ? "border-[#127fff]" : "border-[#e3e6eb] hover:border-[#b8cff0]"}`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} thumbnail`}
                    width={56}
                    height={56}
                    sizes="56px"
                    style={{ width: "auto", height: "auto" }}
                    className="mx-auto object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-[13px] text-[#00b517]">
              <Check className="h-4 w-4" />
              In stock
            </div>
            <h1 className="text-[24px] font-semibold leading-tight text-[#1c1c1c]">{product.title}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#8b96a5]">
              <span className="flex items-center gap-0.5 text-[#ff9017]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-[#ff9017] text-[#ff9017]" : "text-[#d9dfe7]"}`} />
                ))}
              </span>
              <span>{product.rating.toFixed(1)}</span>
              <span>|</span>
              <span>{product.reviewCount} reviews</span>
              <span>|</span>
              <span>{product.sold} sold</span>
            </div>

            <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-md border border-[#f0d9c7] bg-[#fff5ea]">
              {[
                { price: formatPrice(product.price), qty: "Single item" },
                { price: formatPrice(product.originalPrice ?? product.price), qty: "Compare price" },
                { price: product.freeShipping ? "Free shipping" : "Standard delivery", qty: "Delivery" },
              ].map((tier) => (
                <div key={tier.qty} className="border-r border-[#f0d9c7] p-3 last:border-r-0">
                  <p className="text-[18px] font-semibold text-[#fa3434]">{tier.price}</p>
                  <p className="text-[13px] text-[#8b96a5]">{tier.qty}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[14px] text-[#505050]">{product.description}</p>

            <div className="mt-4 space-y-2 text-[14px]">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[130px_1fr] border-b border-[#eff2f4] py-1.5">
                  <span className="text-[#8b96a5]">{key}:</span>
                  <span className="text-[#505050]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="rounded-md border border-[#e3e6eb] p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded bg-[#d9f3f0] text-[#4ca7a0]">{product.brand[0]}</div>
                <div>
                  <p className="text-[13px] text-[#8b96a5]">Supplier</p>
                  <p className="text-[14px] font-semibold text-[#1c1c1c]">{product.brand} Trading LLC</p>
                </div>
              </div>
              <div className="space-y-2 text-[13px] text-[#8b96a5]">
                <p>{product.category}</p>
                <p className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#00b517]" /> {product.verified ? "Verified seller" : "Standard seller"}</p>
                <p>{product.freeShipping ? "Worldwide shipping" : "Standard regional shipping"}</p>
              </div>
              <button
                type="button"
                onClick={() => addItem(product, 1)}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-[#2f8ef6] to-[#0d6efd] text-[15px] font-medium text-white transition hover:from-[#2a86ee] hover:to-[#0b63d8]"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => saveProduct(product)}
                className={`mt-2 h-10 w-full rounded-md border text-[14px] font-medium transition ${saved ? "border-[#127fff] bg-[#f1f7ff] text-[#127fff]" : "border-[#d9dfe7] text-[#127fff] hover:bg-[#f7fbff]"}`}
              >
                {saved ? "Saved for later" : "Save for later"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <section className="rounded-md border border-[#e3e6eb] bg-white">
          <div role="tablist" aria-label="Product details tabs" className="flex flex-wrap border-b border-[#e3e6eb]">
            {[
              { key: "description", label: "Description" },
              { key: "reviews", label: "Reviews" },
              { key: "shipping", label: "Shipping" },
              { key: "seller", label: "About seller" },
            ].map((tab) =>
              activeTab === tab.key ? (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  role="tab"
                  id={`product-tab-${tab.key}`}
                  aria-controls={`product-panel-${tab.key}`}
                  aria-selected="true"
                  tabIndex={0}
                  className="border-b-2 border-[#127fff] px-4 py-3 text-[14px] font-medium text-[#127fff] transition"
                >
                  {tab.label}
                </button>
              ) : (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  role="tab"
                  id={`product-tab-${tab.key}`}
                  aria-controls={`product-panel-${tab.key}`}
                  aria-selected="false"
                  tabIndex={-1}
                  className="px-4 py-3 text-[14px] font-medium text-[#8b96a5] transition hover:text-[#505050]"
                >
                  {tab.label}
                </button>
              )
            )}
          </div>
          <div
            role="tabpanel"
            id={`product-panel-${activeTab}`}
            aria-labelledby={`product-tab-${activeTab}`}
            className="p-4 text-[14px] text-[#505050]"
          >
            {activeTab === "description" ? (
              <>
                <p>{product.description}</p>
                <div className="mt-4 overflow-hidden rounded border border-[#e3e6eb]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[140px_1fr] border-b border-[#e3e6eb] px-3 py-2 last:border-b-0">
                      <span className="text-[#8b96a5]">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : activeTab === "reviews" ? (
              <p>{product.reviewCount} buyers reviewed this item. Average rating: {product.rating.toFixed(1)} / 5.</p>
            ) : activeTab === "shipping" ? (
              <p>{product.freeShipping ? "This item ships free in the current mock storefront." : "This item ships with standard delivery charges in the current mock storefront."}</p>
            ) : (
              <p>{product.brand} is presented as a {product.verified ? "verified" : "standard"} supplier in this frontend demo catalog.</p>
            )}
          </div>
        </section>

        <aside className="rounded-md border border-[#e3e6eb] bg-white p-3">
          <h3 className="mb-2 text-[16px] font-semibold text-[#1c1c1c]">You may like</h3>
          <div className="space-y-2">
            {recommendedItems.map((item) => (
              <Link href={`/products/${item.id}`} key={item.id} className="flex gap-2 rounded p-2 transition hover:bg-[#f9fbff]">
                <div className="flex h-16 w-16 items-center justify-center rounded border border-[#e3e6eb]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={56}
                    height={56}
                    sizes="56px"
                    style={{ width: "auto", height: "auto" }}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-[13px] text-[#1c1c1c]">{item.title}</p>
                  <p className="text-[12px] text-[#8b96a5]">{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <section className="rounded-md border border-[#e3e6eb] bg-white p-3">
        <h3 className="mb-3 text-[18px] font-semibold text-[#1c1c1c]">Related products</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {relatedItems.map((item) => (
            <Link href={`/products/${item.id}`} key={item.id} className="rounded-md border border-[#e3e6eb] p-2 transition hover:shadow-sm">
              <div className="mb-2 flex h-[90px] items-center justify-center rounded bg-[#fafafa]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={70}
                  height={70}
                  sizes="70px"
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
              </div>
              <p className="text-[12px] text-[#1c1c1c]">{item.title}</p>
              <p className="text-[12px] text-[#8b96a5]">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <NewsletterSection />
      <HomeFooterSection />
    </section>
  );
}

export default function ProductDetailsPage({ id }: ProductDetailsPageProps) {
  const productQuery = useProductQuery(id);
  const relatedQuery = useRelatedProductsQuery(id);
  const recommendedQuery = useRecommendedProductsQuery(id);
  const product = productQuery.data;

  if (productQuery.isLoading) {
    return <section className="rounded-md border border-[#e3e6eb] bg-white p-6">Loading product details...</section>;
  }

  if (productQuery.isError) {
    return (
      <section className="rounded-md border border-[#ffd6d6] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Product could not be loaded</h1>
        <p className="mt-2 text-[14px] text-[#6c788a]">A network issue occurred while loading this item. Please try again.</p>
        <p className="mt-1 text-[13px] text-[#b94b4b]">{productQuery.error?.message ?? "Request failed."}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => productQuery.refetch()}
            className="rounded-md bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#0f73e6]"
          >
            Retry
          </button>
          <Link href="/products" className="rounded-md border border-[#d9dfe7] px-4 py-2 text-[14px] font-semibold text-[#1c1c1c]">
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="rounded-md border border-[#e3e6eb] bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Product not found</h1>
        <p className="mt-2 text-[14px] text-[#6c788a]">This catalog item does not exist in the current frontend dataset.</p>
        <Link href="/products" className="mt-4 inline-block rounded-md bg-[#127fff] px-4 py-2 text-[14px] font-semibold text-white">
          Back to products
        </Link>
      </section>
    );
  }

  return (
    <ProductDetailsContent
      key={id}
      id={id}
      product={product}
      relatedItems={relatedQuery.data ?? []}
      recommendedItems={recommendedQuery.data ?? []}
    />
  );
}
