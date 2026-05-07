export default function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-[#e3e6eb] bg-white p-3">
      <div className="mb-3 h-36 rounded bg-[#eef2f6]" />
      <div className="mb-2 h-5 w-1/2 rounded bg-[#eef2f6]" />
      <div className="mb-2 h-4 w-4/5 rounded bg-[#eef2f6]" />
      <div className="h-4 w-1/3 rounded bg-[#eef2f6]" />
    </div>
  );
}
