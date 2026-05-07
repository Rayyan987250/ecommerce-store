import ProductDetailsPage from "@/components/product/product-details-page";

type ProductDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsRoute({ params }: ProductDetailsRouteProps) {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-[1280px] px-3 py-4 sm:px-4 sm:py-5 lg:px-[22px] lg:py-6">
      <ProductDetailsPage id={id} />
    </section>
  );
}
