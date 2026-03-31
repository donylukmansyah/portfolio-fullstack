import { NextRequest, NextResponse } from "next/server";
import {
  getRouteId,
  notFoundResponse,
  requireAuth,
  unauthorizedResponse,
} from "@/lib/admin-api";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { socialLinkSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const id = await getRouteId(params);
  const body = await req.json();
  const parsed = socialLinkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const [updated] = await db.update(socialLinks).set({ ...parsed.data, updatedAt: new Date() }).where(eq(socialLinks.id, id)).returning();
  if (!updated) return notFoundResponse();
  revalidatePath("/");
  revalidateTag("social-links", "max");
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const id = await getRouteId(params);
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  revalidatePath("/");
  revalidateTag("social-links", "max");
  return NextResponse.json({ success: true });
}
