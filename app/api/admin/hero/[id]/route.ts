import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { heroContentSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

// GET single hero content
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [hero] = await db.select().from(heroContent).where(eq(heroContent.id, id));
  if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(hero);
}

// PUT update hero content
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = heroContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
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

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  revalidateTag("hero-content", "page" as any);
  return NextResponse.json(updated);
}

// DELETE hero content
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [deleted] = await db.delete(heroContent).where(eq(heroContent.id, id)).returning();
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/");
  revalidateTag("hero-content", "page" as any);
  return NextResponse.json({ success: true });
}
