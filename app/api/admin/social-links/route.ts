import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { socialLinkSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const data = await db.select().from(socialLinks).orderBy(socialLinks.sortOrder);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const body = await req.json();
  const parsed = socialLinkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const [created] = await db.insert(socialLinks).values(parsed.data).returning();
  revalidatePath("/");
  revalidateTag("social-links", "max");
  return NextResponse.json(created, { status: 201 });
}
