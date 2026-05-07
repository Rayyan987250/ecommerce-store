import { UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Automobiles", href: "/products" },
  { name: "Clothes and wear", href: "/products" },
  { name: "Home interiors", href: "/products" },
  { name: "Computer and tech", href: "/products" },
  { name: "Tools, equipments", href: "/products" },
  { name: "Sports and outdoor", href: "/products" },
  { name: "Animal and pets", href: "/products" },
  { name: "Machinery tools", href: "/products" },
  { name: "More category", href: "/products" },
];

export default function HeroSection() {
  return (
    <section className="ui-fade-up rounded-md border border-[#e3e6eb] bg-white p-2 transition-shadow duration-200 hover:shadow-sm sm:p-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[220px_1fr_200px]">
        <aside className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1 lg:gap-1">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className={`ui-link-motion block w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors sm:text-[14px] lg:text-[15px] ${
                index === 0
                  ? "bg-[#e9f2ff] font-medium text-[#1c1c1c]"
                  : "text-[#505050] hover:bg-[#f4f7fb]"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </aside>

        <div className="relative min-h-[230px] overflow-hidden rounded-md transition-all duration-200 hover:shadow-md sm:min-h-[280px] lg:min-h-[310px]">
          <Image
            src="/images/banners/banner_board.png"
            alt="Latest trending electronic items"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 60vw"
            className="object-cover object-center"
          />
          <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
            <p className="text-[20px] leading-tight text-[#1c1c1c] sm:text-[24px]">Latest trending</p>
            <h2 className="text-[34px] font-bold leading-tight text-[#1c1c1c] sm:text-[48px]">Electronic items</h2>
            <Link
              href="/products"
            className="ui-button-pop mt-4 inline-block rounded-md border border-[#d9dfe7] bg-white px-4 py-2 text-[14px] font-medium text-[#1c1c1c] transition-all hover:border-[#c6d0dc] sm:mt-5 sm:px-6 sm:text-[16px]"
            >
              Learn more
            </Link>
          </div>
        </div>

        <aside className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="ui-surface rounded-md bg-[#e3f0ff] p-3">
            <div className="mb-3 flex items-start gap-2">
              <UserCircle2 className="h-9 w-9 text-[#b8c5d9]" />
              <p className="text-[14px] font-medium leading-tight text-[#1c1c1c]">
                Hi, user
                <br />
                let&apos;s get started
              </p>
            </div>
            <Link
              href="/signup"
              className="ui-button-pop mb-2 inline-block w-full rounded-md bg-gradient-to-b from-[#2f8ef6] to-[#0d6efd] py-1.5 text-center text-[16px] font-medium text-white transition hover:from-[#2a86ee] hover:to-[#0b63d8]"
            >
              Join now
            </Link>
            <Link
              href="/login"
              className="ui-button-pop inline-block w-full rounded-md border border-[#d9dfe7] bg-white py-1.5 text-center text-[16px] font-medium text-[#0d6efd] transition hover:bg-[#f7fbff]"
            >
              Log in
            </Link>
          </div>

          <div className="ui-surface rounded-md bg-[#f07f2f] p-4 text-[18px] font-medium leading-tight text-white hover:brightness-95 sm:text-[20px]">
            Get US $10 off
            <br />
            with a new
            <br />
            supplier
          </div>

          <div className="ui-surface rounded-md bg-[#55b4c3] p-4 text-[18px] font-medium leading-tight text-white hover:brightness-95 sm:text-[20px]">
            Send quotes with
            <br />
            supplier
            <br />
            preferences
          </div>
        </aside>
      </div>
    </section>
  );
}
