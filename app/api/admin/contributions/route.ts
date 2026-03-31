import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { db } from "@/db";
import { contributions } from "@/db/schema";
import { contributionSchema } from "@/lib/validations";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const data = await db.select().from(contributions).orderBy(contributions.sortOrder);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const body = await req.json();
  const parsed = contributionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const [created] = await db.insert(contributions).values(parsed.data).returning();
  revalidatePath("/");
  revalidateTag("contributions", "max");
  return NextResponse.json(created, { status: 201 });
}
