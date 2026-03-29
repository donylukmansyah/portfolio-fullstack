import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { siteSettingSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await db.select().from(siteSettings).orderBy(siteSettings.key);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  revalidateTag("site-settings", "page" as any);
  return NextResponse.json(results.flat().filter(Boolean));
}
