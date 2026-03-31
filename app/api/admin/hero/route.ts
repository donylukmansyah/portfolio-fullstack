import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/admin-api";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { heroContentSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

// GET all hero content entries
export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const data = await db.select().from(heroContent).orderBy(desc(heroContent.createdAt));
  return NextResponse.json(data);
}

// POST create new hero content
export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const body = await req.json();
  const parsed = heroContentSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(
      parsed.error.flatten().fieldErrors,
      "Validation failed"
    );
  }

  // If new entry is active, deactivate all others
  if (parsed.data.isActive) {
    await db.update(heroContent).set({ isActive: false, updatedAt: new Date() });
  }

  const [created] = await db.insert(heroContent).values(parsed.data).returning();

  revalidatePath("/");
  revalidateTag("hero-content", "max");
  return NextResponse.json(created, { status: 201 });
}
