import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { heroContentSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

// GET all hero content entries
export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await db.select().from(heroContent).orderBy(desc(heroContent.createdAt));
  return NextResponse.json(data);
}

// POST create new hero content
export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = heroContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // If new entry is active, deactivate all others
  if (parsed.data.isActive) {
    await db.update(heroContent).set({ isActive: false, updatedAt: new Date() });
  }

  const [created] = await db.insert(heroContent).values(parsed.data).returning();

  revalidatePath("/");
  revalidateTag("hero-content", "page" as any);
  return NextResponse.json(created, { status: 201 });
}
