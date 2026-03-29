import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Verifies the session server-side (with DB validation).
 * Memoized per render pass via React cache.
 * Redirects to /admin/login if unauthenticated.
 */
export const verifyAdminSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return session;
});
