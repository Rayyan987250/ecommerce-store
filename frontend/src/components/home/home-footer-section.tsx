import { FlagComponents, type CountryCode } from "@/components/shared/flag-icons";
import {
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

const footerColumns = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "/" },
      { label: "Find store", href: "/products" },
      { label: "Categories", href: "/products" },
      { label: "Blogs", href: "/" },
    ],
  },
  {
    title: "Partnership",
    links: [
      { label: "About Us", href: "/" },
      { label: "Find store", href: "/products" },
      { label: "Categories", href: "/products" },
      { label: "Blogs", href: "/" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Help Center", href: "/" },
      { label: "Money Refund", href: "/" },
      { label: "Shipping", href: "/" },
      { label: "Contact us", href: "/" },
    ],
  },
  {
    title: "For users",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/signup" },
      { label: "Settings", href: "/" },
      { label: "My Orders", href: "/account" },
    ],
  },
];

const socialIcons = [
  { name: "Facebook", href: "https://facebook.com", Icon: FaFacebookF, hoverText: "hover:text-[#1877F2]" },
  { name: "Twitter", href: "https://twitter.com", Icon: FaTwitter, hoverText: "hover:text-[#1DA1F2]" },
  { name: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn, hoverText: "hover:text-[#0A66C2]" },
  { name: "Instagram", href: "https://instagram.com", Icon: FaInstagram, hoverText: "hover:text-[#E1306C]" },
  { name: "YouTube", href: "https://youtube.com", Icon: FaYoutube, hoverText: "hover:text-[#FF0000]" },
];

function FlagBadge({ code }: { code: CountryCode }) {
  const Icon = FlagComponents[code];
  return (
    <Icon
      title={`${code} flag`}
      className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] border border-[#d7dce3] object-cover"
    />
  );
}

function StoreBadge({ top, bottom, href }: { top: string; bottom: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex h-[42px] w-[124px] flex-col items-center justify-center rounded-md bg-[#1c1c1c] text-white transition-all duration-150 hover:-translate-y-[1px] hover:bg-black"
    >
      <span className="text-[10px] uppercase leading-none text-white/85">{top}</span>
      <span className="mt-0.5 text-[16px] font-semibold leading-none">{bottom}</span>
    </Link>
  );
}

export default function HomeFooterSection() {
  return (
    <footer className="overflow-hidden rounded-md border border-[#e3e6eb] bg-white">
      <div className="grid gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1.2fr_repeat(4,1fr)_1fr]">
        <div>
          <Link href="/" className="mb-3 inline-flex items-center gap-2 no-underline">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#5f95e9]">
              <ShoppingBag className="h-5 w-5 text-white" strokeWidth={1.8} />
            </span>
            <span className="text-[40px] font-bold leading-none tracking-[-0.3px] text-[#82a6dc]">Brand</span>
          </Link>
          <p className="max-w-[240px] text-[16px] text-[#505050]">
            Best information about the company goes here but now ipsum is
          </p>
          <div className="mt-4 flex gap-2">
            {socialIcons.map(({ name, href, Icon, hoverText }: { name: string; href: string; Icon: IconType; hoverText: string }) => (
              <Link
                href={href}
                key={name}
                aria-label={name}
                title={name}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#edf0f3] text-[#8b96a5] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#dceeff] ${hoverText}`}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-2 text-[20px] font-semibold text-[#1c1c1c]">{column.title}</h4>
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[16px] text-[#8b96a5] transition-colors hover:text-[#127fff]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-2 text-[20px] font-semibold text-[#1c1c1c]">Get app</h4>
          <div className="space-y-2">
            <StoreBadge top="Download on the" bottom="App Store" href="/" />
            <StoreBadge top="Get it on" bottom="Google Play" href="/" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-2 border-t border-[#e3e6eb] bg-[#eff2f4] px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-[15px] text-[#606060]">© 2026 Ecommerce.</p>
        <Link
          href="#"
          className="inline-flex items-center gap-2 text-[16px] text-[#606060] transition-colors hover:text-[#127fff]"
        >
          <FlagBadge code="US" />
          English
          <ChevronUp className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
