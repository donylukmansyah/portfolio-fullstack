import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16+ uses `proxy` (not `middleware`) as the export name.
 * We use `getSessionCookie` for an optimistic, fast cookie-presence check
 * (no DB round-trip). Actual session validation is done server-side
 * inside each admin page / API route via `auth.api.getSession`.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Redirect unauthenticated users away from protected admin routes
  if (isAdminRoute && !isLoginPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Redirect already-authenticated users away from the login page
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
