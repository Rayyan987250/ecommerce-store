import ConsumerElectronicsSection from "@/components/home/consumer-electronics-section";
import DealsSection from "@/components/home/deals-section";
import ExtraServicesSection from "@/components/home/extra-services-section";
import HeroSection from "@/components/home/hero-section";
import HomeFooterSection from "@/components/home/home-footer-section";
import HomeOutdoorSection from "@/components/home/home-outdoor-section";
import NewsletterSection from "@/components/home/newsletter-section";
import RecommendedItemsSection from "@/components/home/recommended-items-section";
import SupplierInquirySection from "@/components/home/supplier-inquiry-section";
import SuppliersRegionSection from "@/components/home/suppliers-region-section";
import { getProducts } from "@/services/api";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

function takeUniqueProducts(products: Product[], count: number, used: Set<string>) {
  const selected: Product[] = [];
  for (const product of products) {
    if (used.has(product.id)) continue;
    used.add(product.id);
    selected.push(product);
    if (selected.length >= count) break;
  }
  return selected;
}

function buildSectionProducts(
  products: Product[],
  definitions: Array<{ slug: string; title: string }>
): Product[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const configured = definitions
    .map((item) => {
      const product = bySlug.get(item.slug);
      return product ? { ...product, title: item.title } : null;
    })
    .filter((item): item is Product => Boolean(item));

  if (configured.length >= definitions.length) return configured;

  const usedIds = new Set(configured.map((item) => item.id));
  const fallback = products.filter((item) => !usedIds.has(item.id)).slice(0, definitions.length - configured.length);
  return [...configured, ...fallback];
}

export default async function ShopHomePage() {
  const catalog = await getProducts({ page: 1, pageSize: 60, sort: "featured" }).catch(() => null);
  const products = catalog?.items ?? [];
  const used = new Set<string>();

  const homeOutdoorPool = products.filter((item) => item.category === "Home interiors");
  const dealsPool = products.filter((item) => item.originalPrice && item.originalPrice > item.price);
  const homeOutdoorItems = buildSectionProducts(homeOutdoorPool, [
    { slug: "soft-chair-white", title: "Soft chairs" },
    { slug: "yellow-accent-chair", title: "Sofa & chair" },
    { slug: "electric-kettle-black", title: "Kitchen dishes" },
    { slug: "smart-watch-series-5-silver", title: "Smart watches" },
    { slug: "fruit-juicer-machine", title: "Kitchen mixer" },
    { slug: "blender-coffee-machine", title: "Blenders" },
    { slug: "front-load-washing-machine", title: "Home appliance" },
    { slug: "decorative-plant-pot", title: "Coffee maker" },
  ]);
  const electronicsItems = buildSectionProducts(products, [
    { slug: "smart-watch-series-5-silver", title: "Smart watches" },
    { slug: "gopro-hero10-4k-action-camera", title: "Cameras" },
    { slug: "sony-wireless-headphones", title: "Headphones" },
    { slug: "iphone-14-pro-deep-purple", title: "Smart watches" },
    { slug: "gaming-headset-white", title: "Gaming set" },
    { slug: "macbook-pro-m2-space-gray", title: "Laptops & PC" },
    { slug: "iphone-13-pro-max-blue", title: "Smartphones" },
    { slug: "electric-kettle-black", title: "Electric kattle" },
  ]);

  const dealDiscounts = ["-25%", "-15%", "-40%", "-25%", "-25%"];
  const dealItems = takeUniqueProducts(dealsPool.length ? dealsPool : products, 5, used).map((product, index) => ({
    product,
    discount: dealDiscounts[index] ?? "-20%",
  }));
  const recommendedItems = takeUniqueProducts(products, 10, new Set(used));

  return (
    <section className="mx-auto max-w-[1280px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:px-[22px] lg:py-6">
      <HeroSection />
      <DealsSection items={dealItems} />
      <HomeOutdoorSection items={homeOutdoorItems} />
      <ConsumerElectronicsSection items={electronicsItems} />
      <SupplierInquirySection />
      <RecommendedItemsSection items={recommendedItems} />
      <ExtraServicesSection />
      <SuppliersRegionSection />
      <NewsletterSection />
      <HomeFooterSection />
    </section>
  );
}
