import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { skillSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const data = await db.select().from(skills).orderBy(skills.sortOrder);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const body = await req.json();
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const [created] = await db.insert(skills).values(parsed.data).returning();
  revalidatePath("/");
  revalidateTag("skills", "max");
  return NextResponse.json(created, { status: 201 });
}
