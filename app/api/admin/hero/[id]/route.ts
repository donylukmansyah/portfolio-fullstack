import { NextRequest, NextResponse } from "next/server";
import {
  getRouteId,
  notFoundResponse,
  requireAuth,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/admin-api";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { heroContentSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

// GET single hero content
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  const [hero] = await db.select().from(heroContent).where(eq(heroContent.id, id));
  if (!hero) return notFoundResponse();
  return NextResponse.json(hero);
}

// PUT update hero content
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  const body = await req.json();
  const parsed = heroContentSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(
      parsed.error.flatten().fieldErrors,
      "Validation failed"
    );
  }

  // If setting this entry to active, deactivate all others first
  if (parsed.data.isActive) {
    await db.update(heroContent).set({ isActive: false, updatedAt: new Date() });
  }

  const [updated] = await db
    .update(heroContent)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(heroContent.id, id))
    .returning();

  if (!updated) return notFoundResponse();

  revalidatePath("/");
  revalidateTag("hero-content", "max");
  return NextResponse.json(updated);
}

// DELETE hero content
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  const [deleted] = await db.delete(heroContent).where(eq(heroContent.id, id)).returning();
  if (!deleted) return notFoundResponse();

  revalidatePath("/");
  revalidateTag("hero-content", "max");
  return NextResponse.json({ success: true });
}
