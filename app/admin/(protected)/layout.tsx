import { verifyAdminSession } from "@/lib/auth-guard";
import { AdminSidebarNav } from "@/components/admin/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

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
        <header className="flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur px-4 lg:px-6 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex-1" />
          <div className="text-xs text-muted-foreground">
            Portfolio Admin v2.0
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 bg-muted/20 min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
