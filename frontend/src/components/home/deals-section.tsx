"use client";

import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

const timeBoxes = [
  { value: "04", label: "Days" },
  { value: "13", label: "Hour" },
  { value: "34", label: "Min" },
  { value: "56", label: "Sec" },
];

type DealsSectionProps = {
  items: Array<{
    product: Product;
    discount: string;
  }>;
};

export default function DealsSection({ items }: DealsSectionProps) {
  const { formatPrice } = useCurrencyPricing();

  return (
    <section className="ui-fade-up overflow-hidden rounded-md border border-[#e3e6eb] bg-white transition-shadow duration-200 hover:shadow-sm">
      <div className="grid md:grid-cols-[240px_1fr]">
        <div className="border-b border-[#e3e6eb] p-4 transition-colors duration-150 hover:bg-[#fafcff] md:border-b-0 md:border-r md:p-5">
          <h3 className="text-[20px] font-semibold leading-tight text-[#1c1c1c] sm:text-[25px]">Deals and offers</h3>
          <p className="mb-4 text-[14px] text-[#8b96a5] sm:text-[16px]">Hygiene equipments</p>

          <div className="flex flex-wrap gap-1.5">
            {timeBoxes.map((box) => (
              <div
                key={box.label}
                className="flex h-[54px] w-[46px] flex-col items-center justify-center rounded-[4px] bg-[#606060] text-white transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#4f4f4f]"
              >
                <span className="text-[16px] font-semibold leading-none">{box.value}</span>
                <span className="mt-1 text-[12px] leading-none text-[#d1d1d1]">{box.label}</span>
              </div>
            ))}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(({ product, discount }, index) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className={`ui-surface flex min-h-[170px] flex-col items-center justify-center px-3 py-4 text-center hover:bg-[#fbfdff] ${
                  index % 2 === 0 ? "border-r border-[#e3e6eb] sm:border-r-0 lg:border-r" : ""
                } ${index < 4 ? "border-b border-[#e3e6eb] lg:border-b-0" : ""} ${
                  index % 3 !== 2 ? "sm:border-r sm:border-[#e3e6eb] lg:border-r-0" : ""
                } ${index % 5 !== 4 ? "lg:border-r lg:border-[#e3e6eb]" : ""}`}
              >
                <div className="relative mb-3 block h-[74px] w-[96px] shrink-0 overflow-hidden sm:h-[84px] sm:w-[110px]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={110}
                    height={84}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <p className="mb-1 min-h-[2.75rem] overflow-hidden text-[15px] font-medium text-[#1c1c1c] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[18px]">
                  {product.title}
                </p>
                <p className="mb-2 text-[13px] text-[#8b96a5]">{formatPrice(product.price)}</p>
                <span className="rounded-full bg-[#ffe3e3] px-3 py-1 text-[12px] font-semibold leading-none text-[#eb001b] sm:text-[14px]">
                  {discount}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[170px] items-center justify-center px-4 py-6 text-center text-[14px] text-[#8b96a5]">
            Deals are loading. Please check back in a moment.
          </div>
        )}
      </div>
    </section>
  );
}
