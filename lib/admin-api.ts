import "server-only";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function requireAuth() {
  return auth.api.getSession({ headers: await headers() });
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFoundResponse(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function validationErrorResponse(error: unknown, message?: string) {
  return NextResponse.json(
    message ? { error: message, details: error } : { error },
    { status: 400 }
  );
}

export async function getRouteId(params: Promise<{ id: string }>) {
  const resolved = await params;
  return resolved.id;
}
