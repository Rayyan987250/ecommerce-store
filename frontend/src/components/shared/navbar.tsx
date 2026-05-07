"use client";

import { ChevronDown, Menu } from "lucide-react";
import { FlagComponents, type CountryCode } from "@/components/shared/flag-icons";
import { useCurrencyStore } from "@/store/use-currency-store";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

export type NavbarItem = {
  label: string;
  href?: string;
  withIcon?: boolean;
  withChevron?: boolean;
};

const defaultLeftItems: NavbarItem[] = [
  { label: "All category", href: "/products", withIcon: true },
  { label: "Hot offers", href: "/products" },
  { label: "Gift boxes", href: "/products" },
  { label: "Projects", href: "/products" },
  { label: "Menu item", href: "/products" },
  { label: "Help", href: "/login", withChevron: true },
];

export type LocaleOption = {
  code: CountryCode;
  country: string;
  language: string;
  currency: string;
};

export type ShippingOption = {
  code: CountryCode;
  country: string;
  language: string;
  currency: string;
};

const defaultLocaleOptions: LocaleOption[] = [
  { code: "IN", country: "India", language: "Hindi", currency: "INR" },
  { code: "AU", country: "Australia", language: "English", currency: "AUD" },
  { code: "CN", country: "China", language: "Chinese", currency: "CNY" },
  { code: "DE", country: "Germany", language: "German", currency: "EUR" },
  { code: "DK", country: "Denmark", language: "Danish", currency: "DKK" },
  { code: "FR", country: "France", language: "French", currency: "EUR" },
  { code: "GB", country: "United Kingdom", language: "English", currency: "GBP" },
  { code: "IT", country: "Italy", language: "Italian", currency: "EUR" },
  { code: "RU", country: "Russia", language: "Russian", currency: "RUB" },
  { code: "US", country: "United States", language: "English", currency: "USD" },
  { code: "PK", country: "Pakistan", language: "Urdu", currency: "PKR" },
];

const defaultShippingOptions: ShippingOption[] = [
  { code: "IN", country: "India", language: "Hindi", currency: "INR" },
  { code: "AU", country: "Australia", language: "English", currency: "AUD" },
  { code: "CN", country: "China", language: "Chinese", currency: "CNY" },
  { code: "DE", country: "Germany", language: "German", currency: "EUR" },
  { code: "DK", country: "Denmark", language: "Danish", currency: "DKK" },
  { code: "FR", country: "France", language: "French", currency: "EUR" },
  { code: "GB", country: "United Kingdom", language: "English", currency: "GBP" },
  { code: "IT", country: "Italy", language: "Italian", currency: "EUR" },
  { code: "RU", country: "Russia", language: "Russian", currency: "RUB" },
  { code: "US", country: "United States", language: "English", currency: "USD" },
  { code: "PK", country: "Pakistan", language: "Urdu", currency: "PKR" },
];

function FlagIcon({ code, className }: { code: CountryCode; className?: string }) {
  const Icon = FlagComponents[code];
  return (
    <Icon
      title={`${code} flag`}
      className={`inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] border border-[#d7dce3] object-cover ${className ?? ""}`}
    />
  );
}

type NavbarProps = {
  leftItems?: NavbarItem[];
  localeOptions?: LocaleOption[];
  shippingOptions?: ShippingOption[];
  defaultLocaleCode?: LocaleOption["code"];
  defaultShippingCode?: ShippingOption["code"];
  onLocaleChange?: (value: LocaleOption) => void;
  onShippingChange?: (value: ShippingOption) => void;
};

export default function Navbar({
  leftItems = defaultLeftItems,
  localeOptions = defaultLocaleOptions,
  shippingOptions = defaultShippingOptions,
  defaultLocaleCode,
  defaultShippingCode,
  onLocaleChange,
  onShippingChange,
}: NavbarProps) {
  const localeItems = localeOptions.length ? localeOptions : defaultLocaleOptions;
  const shipItems = shippingOptions.length ? shippingOptions : defaultShippingOptions;
  const initialLocale =
    localeItems.find((item) => item.code === defaultLocaleCode) ?? localeItems[0];
  const initialShipping =
    shipItems.find((item) => item.code === defaultShippingCode) ?? shipItems[0];

  const [selectedLocale, setSelectedLocale] = useState<LocaleOption>(initialLocale);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(initialShipping);
  const setSelectedCurrency = useCurrencyStore((state) => state.setSelectedCurrency);
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement>(null);
  const countryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedLocale = localeMenuRef.current?.contains(target);
      const clickedCountry = countryMenuRef.current?.contains(target);
      if (!clickedLocale) setIsLocaleOpen(false);
      if (!clickedCountry) setIsShippingOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocaleOpen(false);
        setIsShippingOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    setSelectedCurrency(selectedLocale.currency);
  }, [selectedLocale.currency, setSelectedCurrency]);

  return (
    <nav className="w-full border-b border-[#e3e6eb] bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-3 py-2 sm:px-4 md:flex-row md:items-center md:justify-between md:px-[22px]">
        <div className="flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap md:w-auto">
          {leftItems.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? "/products"}
              className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium text-[#1c1c1c] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#f3f6fb] hover:text-[#0d6efd] hover:shadow-sm sm:px-3 sm:text-[14px]"
            >
              {item.withIcon ? <Menu className="mr-1 h-4 w-4" /> : null}
              <span>{item.label}</span>
              {item.withChevron ? <ChevronDown className="h-4 w-4 text-[#8b96a5]" /> : null}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="relative" ref={localeMenuRef}>
            {isLocaleOpen ? (
              <button
                type="button"
                onClick={() => setIsLocaleOpen(false)}
                aria-expanded="true"
                aria-haspopup="menu"
                aria-controls="locale-menu"
                className="inline-flex h-9 items-center gap-1 rounded-md bg-[#f3f6fb] px-2.5 text-[13px] font-medium text-[#0d6efd] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#f3f6fb] hover:text-[#0d6efd] hover:shadow-sm sm:px-3 sm:text-[14px]"
              >
                <span>{selectedLocale.language}, {selectedLocale.currency}</span>
                <ChevronDown className="h-4 w-4 text-[#8b96a5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLocaleOpen(true)}
                aria-expanded="false"
                aria-haspopup="menu"
                aria-controls="locale-menu"
                className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium text-[#1c1c1c] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#f3f6fb] hover:text-[#0d6efd] hover:shadow-sm sm:px-3 sm:text-[14px]"
              >
                <span>{selectedLocale.language}, {selectedLocale.currency}</span>
                <ChevronDown className="h-4 w-4 text-[#8b96a5]" />
              </button>
            )}

            {isLocaleOpen ? (
              <ul
                id="locale-menu"
                className="absolute right-0 top-[40px] z-30 max-h-[260px] min-w-[250px] overflow-y-auto rounded-md border border-[#e3e6eb] bg-white p-1 shadow-lg"
              >
                {localeItems.map((option) => (
                  <li key={option.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocale(option);
                        onLocaleChange?.(option);
                        setIsLocaleOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors hover:bg-[#f3f6fb] ${selectedLocale.code === option.code ? "bg-[#edf3fb]" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <FlagIcon code={option.code} />
                        <span className="text-[14px] font-medium text-[#1c1c1c]">{option.country}</span>
                      </span>
                      <span className="text-[13px] text-[#6c788a]">
                        {option.language}, {option.currency}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="relative" ref={countryMenuRef}>
            {isShippingOpen ? (
              <button
                type="button"
                onClick={() => setIsShippingOpen(false)}
                aria-expanded="true"
                aria-haspopup="menu"
                aria-controls="shipping-menu"
                className="inline-flex h-9 items-center gap-1 rounded-md bg-[#f3f6fb] px-2.5 text-[13px] font-medium text-[#0d6efd] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#f3f6fb] hover:text-[#0d6efd] hover:shadow-sm sm:px-3 sm:text-[14px]"
              >
                <span>Ship to</span>
                <FlagIcon code={selectedShipping.code} />
                <ChevronDown className="h-4 w-4 text-[#8b96a5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsShippingOpen(true)}
                aria-expanded="false"
                aria-haspopup="menu"
                aria-controls="shipping-menu"
                className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium text-[#1c1c1c] transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#f3f6fb] hover:text-[#0d6efd] hover:shadow-sm sm:px-3 sm:text-[14px]"
              >
                <span>Ship to</span>
                <FlagIcon code={selectedShipping.code} />
                <ChevronDown className="h-4 w-4 text-[#8b96a5]" />
              </button>
            )}

            {isShippingOpen ? (
              <ul
                id="shipping-menu"
                className="absolute right-0 top-[40px] z-30 max-h-[260px] min-w-[280px] overflow-y-auto rounded-md border border-[#e3e6eb] bg-white p-1 shadow-lg"
              >
                {shipItems.map((option) => (
                  <li key={`country-${option.code}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShipping(option);
                        onShippingChange?.(option);
                        setIsShippingOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors hover:bg-[#f3f6fb] ${selectedShipping.code === option.code ? "bg-[#edf3fb]" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <FlagIcon code={option.code} />
                        <span className="text-[14px] font-medium text-[#1c1c1c]">{option.country}</span>
                      </span>
                      <span className="text-[13px] text-[#6c788a]">
                        {option.language} - {option.currency}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
