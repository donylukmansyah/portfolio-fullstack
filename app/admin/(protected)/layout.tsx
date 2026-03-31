import { verifyAdminSession } from "@/lib/auth-guard";
import { AdminSidebarNav } from "@/components/admin/sidebar-nav";
import { AdminTopbar } from "@/components/admin/topbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full DB session validation — redirects to /admin/login if unauthenticated
  await verifyAdminSession();

  return (
    <SidebarProvider>
      <AdminSidebarNav />
      <SidebarInset>
        <AdminTopbar />
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.08),_transparent_32%),linear-gradient(to_bottom,_hsl(var(--muted)/0.45),_transparent_20%)] p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
