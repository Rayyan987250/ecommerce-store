import { Palette, Search, Send, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

const services: {
  title: string;
  image: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Source from Industry Hubs",
    image: "/images/banners/supplier-quote-banner.png",
    Icon: Search,
  },
  {
    title: "Customize Your Products",
    image: "/images/banners/homebanner.jpg",
    Icon: Palette,
  },
  {
    title: "Fast, reliable shipping by ocean or air",
    image: "/images/banners/consumer-electronics-banner.png",
    Icon: Send,
  },
  {
    title: "Product monitoring and inspection",
    image: "/images/banners/banner_board.png",
    Icon: ShieldCheck,
  },
];

export default function ExtraServicesSection() {
  return (
    <section className="ui-fade-up">
      <h2 className="mb-3 text-[28px] font-semibold text-[#1c1c1c] sm:text-[34px]">Our extra services</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <article
            key={service.title}
            className="ui-surface group overflow-hidden rounded-md border border-[#e3e6eb] bg-white"
          >
            <div className="relative h-[120px] overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/15" />
            </div>

            <div className="relative p-4">
              <div className="absolute -top-6 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#dff0ff] text-[#1c1c1c] transition-all duration-150 group-hover:bg-[#127fff] group-hover:text-white">
                <service.Icon className="h-5 w-5" />
              </div>
              <p className="max-w-[85%] text-[16px] font-medium leading-snug text-[#1c1c1c] sm:text-[18px]">{service.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
