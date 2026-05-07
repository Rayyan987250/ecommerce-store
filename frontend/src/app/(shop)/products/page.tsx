import ProductsListingPage from "@/components/product/products-listing-page";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search = "" } = await searchParams;

  return (
    <section className="mx-auto max-w-[1280px] px-3 py-4 sm:px-4 sm:py-5 lg:px-[22px] lg:py-6">
      <ProductsListingPage key={search} initialSearch={search} />
    </section>
  );
}
