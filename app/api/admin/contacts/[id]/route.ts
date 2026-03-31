import { NextRequest, NextResponse } from "next/server";
import {
  getRouteId,
  notFoundResponse,
  requireAuth,
  unauthorizedResponse,
} from "@/lib/admin-api";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/contacts/[id] — toggle read/unread
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const id = await getRouteId(params);
  const { isRead } = await req.json();
  const [updated] = await db
    .update(contactSubmissions)
    .set({ isRead: Boolean(isRead) })
    .where(eq(contactSubmissions.id, id))
    .returning();
  if (!updated) return notFoundResponse();
  return NextResponse.json(updated);
}

// DELETE /api/admin/contacts/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const id = await getRouteId(params);
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  return NextResponse.json({ success: true });
}
