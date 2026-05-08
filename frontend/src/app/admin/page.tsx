import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminGuard from "@/components/admin/admin-guard";
import AdminShell from "@/components/admin/admin-shell";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminShell title="Dashboard">
        <AdminDashboard />
      </AdminShell>
    </AdminGuard>
  );
}
