"use client";

import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

type RecommendedItemsSectionProps = {
  items: Product[];
};

export default function RecommendedItemsSection({ items }: RecommendedItemsSectionProps) {
  const { formatPrice } = useCurrencyPricing();

  return (
    <section className="ui-fade-up">
      <h2 className="mb-3 text-[28px] font-semibold text-[#1c1c1c] sm:text-[34px]">Recommended items</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, index) => (
            <Link
              href={`/products/${item.id}`}
              key={`${item.id}-${index}`}
              className="ui-surface rounded-md border border-[#e3e6eb] bg-white p-3 sm:p-4"
            >
              <div className="mb-3 flex h-[160px] items-center justify-center rounded-md bg-[#ffffff]">
                <div className="relative block h-[150px] w-[170px] shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={170}
                    height={150}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              </div>
              <p className="text-[18px] font-semibold leading-tight text-[#1c1c1c] sm:text-[22px]">{formatPrice(item.price)}</p>
              <p className="mt-1 text-[14px] leading-snug text-[#8b96a5] sm:text-[16px]">{item.title}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-[#e3e6eb] bg-white p-6 text-center text-[14px] text-[#8b96a5]">
          Recommended items will appear once products are available.
        </div>
      )}
    </section>
  );
}
