import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Admin — Portfolio CMS",
    template: "%s | Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * Base admin layout — shared by ALL /admin/* routes including /admin/login.
 * Does NOT include the auth guard here; the guard is applied inside
 * the (protected) route group layout instead.
 */
export default function AdminBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
