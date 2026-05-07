"use client";

import { useCurrencyPricing } from "@/hooks/use-currency-pricing";
import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

type ConsumerElectronicsSectionProps = {
  items: Product[];
};

export default function ConsumerElectronicsSection({ items }: ConsumerElectronicsSectionProps) {
  const { formatPrice } = useCurrencyPricing();

  return (
    <section className="ui-fade-up overflow-hidden rounded-md border border-[#e3e6eb] bg-white transition-shadow duration-200 hover:shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <div className="relative min-h-[220px] overflow-hidden border-b border-[#e3e6eb] transition-all duration-200 hover:shadow-md lg:min-h-[250px] lg:border-b-0 lg:border-r">
          <Image
            src="/images/banners/consumer-electronics-banner.png"
            alt="Consumer electronics and gadgets banner"
            fill
            sizes="(max-width: 1024px) 100vw, 300px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#dbe4ee]/90 to-[#dbe4ee]/30" />
          <div className="relative z-10 p-5">
            <h3 className="mb-4 text-[32px] font-semibold leading-tight text-[#1c1c1c]">
              Consumer
              <br />
              electronics and
              <br />
              gadgets
            </h3>
            <Link
              href="/products"
              className="ui-button-pop inline-block rounded-md border border-[#d9dfe7] bg-white px-5 py-2 text-[16px] font-medium text-[#1c1c1c] transition-all duration-150 hover:border-[#c6d0dc]"
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
                key={item.id}
                className="ui-surface flex min-h-[124px] flex-col justify-between bg-white p-3 hover:bg-[#fbfdff] sm:p-4"
              >
                <div>
                  <h4 className="min-h-[2.75rem] max-w-[72%] overflow-hidden text-[15px] font-medium leading-snug text-[#1c1c1c] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[16px] lg:text-[19px]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[13px] leading-snug text-[#8b96a5] sm:text-[14px] lg:text-[16px]">
                    From
                    <br />
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="relative mt-2 block h-[76px] w-[84px] shrink-0 self-end overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={84}
                    height={76}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center bg-white px-4 py-6 text-center text-[14px] text-[#8b96a5]">
            Consumer electronics items are not available right now.
          </div>
        )}
      </div>
    </section>
  );
}
