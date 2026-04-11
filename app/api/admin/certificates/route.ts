import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { certificateSchema } from "@/lib/validations";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const data = await db.select().from(certificates).orderBy(certificates.sortOrder);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const body = await req.json();
  const parsed = certificateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const [created] = await db.insert(certificates).values(parsed.data).returning();
  revalidatePath("/");
  revalidateTag("certificates");
  return NextResponse.json(created, { status: 201 });
}
