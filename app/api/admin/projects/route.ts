import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { projectSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

// GET /api/admin/projects
export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const data = await db.select().from(projects).orderBy(projects.sortOrder, projects.createdAt);
  return NextResponse.json(data);
}

// POST /api/admin/projects
export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [created] = await db.insert(projects).values(parsed.data).returning();
  revalidatePath("/");
  revalidatePath("/projects");
  revalidateTag("projects", "max");

  return NextResponse.json(created, { status: 201 });
}
