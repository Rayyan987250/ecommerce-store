"use client";

import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

type HomeOutdoorSectionProps = {
  items: Product[];
};

export default function HomeOutdoorSection({ items }: HomeOutdoorSectionProps) {
  const { formatPrice } = useCurrencyPricing();

  return (
    <section className="ui-fade-up overflow-hidden rounded-md border border-[#e3e6eb] bg-white transition-shadow duration-200 hover:shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <div className="relative min-h-[220px] overflow-hidden border-b border-[#e3e6eb] transition-all duration-200 hover:shadow-md lg:min-h-[255px] lg:border-b-0 lg:border-r">
          <Image
            src="/images/banners/homebanner.jpg"
            alt="Home and outdoor banner"
            fill
            sizes="(max-width: 1024px) 100vw, 280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffe9b8]/70 to-[#ffe9b8]/20" />
          <div className="relative z-10 p-5">
            <h3 className="mb-4 text-[30px] font-semibold leading-tight text-[#1c1c1c] sm:text-[34px]">
              Home and
              <br />
              outdoor
            </h3>
            <Link
              href="/products"
              className="ui-button-pop inline-block rounded-md border border-[#d9dfe7] bg-white px-5 py-2 text-[16px] font-medium text-[#1c1c1c] transition-all hover:border-[#c6d0dc]"
            >
              Source now
            </Link>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-px bg-[#e3e6eb] sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <Link
                href={`/products/${item.id}`}
                className="ui-surface flex min-h-[127px] flex-col justify-between bg-white p-3 hover:bg-[#fbfdff] sm:p-4"
                key={item.id}
              >
                <div>
                  <h4 className="min-h-[2.75rem] max-w-[72%] overflow-hidden text-[15px] font-medium leading-snug text-[#1c1c1c] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[16px] lg:text-[18px]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[13px] leading-snug text-[#8b96a5] sm:text-[14px] lg:text-[16px]">
                    From
                    <br />
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="relative mt-2 block h-[72px] w-[80px] shrink-0 self-end overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={72}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center bg-white px-4 py-6 text-center text-[14px] text-[#8b96a5]">
            Home and outdoor products are loading. Please refresh shortly.
          </div>
        )}
      </div>
    </section>
  );
}
