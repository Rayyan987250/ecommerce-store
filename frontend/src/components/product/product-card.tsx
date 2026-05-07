"use client";

import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import { useCartStore } from "@/store/use-cart-store";
import type { Product } from "@/types";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { formatPrice } = useCurrencyPricing();
  const addItem = useCartStore((state) => state.addItem);
  const saveProduct = useCartStore((state) => state.saveProduct);
  const saved = useCartStore((state) => state.isSaved(product.id));

  return (
    <article className="ui-surface ui-fade-up rounded-md border border-[#e3e6eb] bg-white p-3">
      <div className="mb-3 flex h-[160px] items-center justify-center rounded border border-[#eef1f4]">
        <div className="relative block h-[130px] w-[130px] shrink-0 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            width={130}
            height={130}
            sizes="130px"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[18px] font-semibold text-[#1c1c1c]">{formatPrice(product.price)}</p>
          {product.originalPrice ? (
            <p className="text-[12px] text-[#8b96a5] line-through">{formatPrice(product.originalPrice)}</p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label={saved ? "Saved product" : "Save product"}
          onClick={() => saveProduct(product)}
          className={`ui-button-pop rounded border p-1.5 transition ${saved ? "border-[#127fff] bg-[#f1f7ff] text-[#127fff]" : "border-[#d9dfe7] text-[#8b96a5] hover:bg-[#f5f9ff] hover:text-[#127fff]"}`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      <h3 className="mt-1.5 text-[14px] text-[#505050]">{product.title}</h3>
      <p className="mt-1 text-[12px] text-[#8b96a5]">{product.brand} | {product.category}</p>
      {!compact ? <p className="mt-2 text-[13px] text-[#6c788a]">{product.shortDescription}</p> : null}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => addItem(product, 1)}
          className="ui-button-pop inline-flex items-center gap-1 rounded-md bg-[#127fff] px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-[#0f73e6]"
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </button>
        <Link href={`/products/${product.id}`} className="ui-link-motion text-[13px] font-semibold text-[#127fff] hover:underline">
          View details
        </Link>
      </div>
    </article>
  );
}
