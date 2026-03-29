import type { Metadata } from "next";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SocialLinksClient } from "./social-links-client";

export const metadata: Metadata = { title: "Social Links" };
export const dynamic = "force-dynamic";

export default async function SocialLinksPage() {
  const data = await db
    .select()
    .from(socialLinks)
    .orderBy(desc(socialLinks.sortOrder), desc(socialLinks.createdAt));

  return <SocialLinksClient initialData={data} />;
}
