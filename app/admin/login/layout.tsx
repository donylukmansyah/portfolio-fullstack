import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — Portfolio CMS",
  robots: { index: false, follow: false },
};

/**
 * Standalone layout for the login page — no sidebar, no auth guard.
 * This layout file scopes only to /admin/login since it's placed
 * directly in app/admin/login/layout.tsx.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
