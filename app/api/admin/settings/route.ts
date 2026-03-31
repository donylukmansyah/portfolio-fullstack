import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { siteSettingSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  const data = await db.select().from(siteSettings).orderBy(siteSettings.key);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();
  // Expects array of { key, value }
  const body: Array<{ key: string; value: string }> = await req.json();
  const results = await Promise.all(
    body.map(async (entry) => {
      const parsed = siteSettingSchema.safeParse(entry);
      if (!parsed.success) return null;
      return db
        .insert(siteSettings)
        .values(parsed.data)
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: parsed.data.value, updatedAt: new Date() } })
        .returning();
    })
  );
  revalidatePath("/");
  revalidateTag("site-settings", "max");
  return NextResponse.json(results.flat().filter(Boolean));
}
