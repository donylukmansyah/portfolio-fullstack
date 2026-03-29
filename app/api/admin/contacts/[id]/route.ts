import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/contacts/[id] — toggle read/unread
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { isRead } = await req.json();
  const [updated] = await db
    .update(contactSubmissions)
    .set({ isRead: Boolean(isRead) })
    .where(eq(contactSubmissions.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/admin/contacts/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  return NextResponse.json({ success: true });
}
