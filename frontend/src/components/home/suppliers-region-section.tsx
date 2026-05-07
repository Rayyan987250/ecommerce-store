import { FlagComponents, type CountryCode } from "@/components/shared/flag-icons";

type SupplierRegion = {
  code: CountryCode;
  country: string;
  domain: string;
};

const suppliers: SupplierRegion[] = [
  { code: "AE", country: "United Arab Emirates", domain: "shopname.ae" },
  { code: "AU", country: "Australia", domain: "shopname.au" },
  { code: "US", country: "United States", domain: "shopname.us" },
  { code: "RU", country: "Russia", domain: "shopname.ru" },
  { code: "IT", country: "Italy", domain: "shopname.it" },
  { code: "DK", country: "Denmark", domain: "shopname.dk" },
  { code: "FR", country: "France", domain: "shopname.com.fr" },
  { code: "DE", country: "Germany", domain: "shopname.de" },
  { code: "CN", country: "China", domain: "shopname.cn" },
  { code: "GB", country: "Great Britain", domain: "shopname.co.uk" },
];

function FlagIcon({ code }: { code: CountryCode }) {
  const Icon = FlagComponents[code];
  return (
    <Icon
      title={`${code} flag`}
      className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] border border-[#d7dce3] object-cover"
    />
  );
}

export default function SuppliersRegionSection() {
  return (
    <section className="rounded-md border border-[#e3e6eb] bg-white p-4 transition-shadow duration-200 hover:shadow-sm sm:p-5">
      <h2 className="mb-4 text-[28px] font-semibold text-[#1c1c1c] sm:text-[34px]">Suppliers by region</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {suppliers.map((supplier, index) => (
          <article
            key={`${supplier.country}-${index}`}
            className="rounded-md p-2 transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#f8fbff]"
          >
            <div className="flex items-start gap-2">
              <FlagIcon code={supplier.code} />
              <div>
                <p className="text-[15px] font-medium leading-tight text-[#1c1c1c] sm:text-[17px]">{supplier.country}</p>
                <p className="mt-0.5 text-[13px] text-[#8b96a5] sm:text-[14px]">{supplier.domain}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
