import { NextRequest, NextResponse } from "next/server";
import {
  getRouteId,
  notFoundResponse,
  requireAuth,
  unauthorizedResponse,
} from "@/lib/admin-api";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { projectSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

type Params = { params: Promise<{ id: string }> };

// PUT /api/admin/projects/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [updated] = await db
    .update(projects)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  if (!updated) return notFoundResponse();

  revalidatePath("/");
  revalidatePath("/projects");
  revalidateTag("projects", "max");

  return NextResponse.json(updated);
}

// DELETE /api/admin/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/");
  revalidatePath("/projects");
  revalidateTag("projects", "max");

  return NextResponse.json({ success: true });
}
