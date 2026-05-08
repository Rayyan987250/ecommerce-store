import AdminGuard from "@/components/admin/admin-guard";
import AdminProductsPage from "@/components/admin/admin-products-page";
import AdminShell from "@/components/admin/admin-shell";

export default function AdminProductsRoutePage() {
  return (
    <AdminGuard>
      <AdminShell title="Products">
        <AdminProductsPage />
      </AdminShell>
    </AdminGuard>
  );
}
