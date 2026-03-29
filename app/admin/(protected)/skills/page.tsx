import type { Metadata } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SkillsClient } from "./skills-client";

export const metadata: Metadata = { title: "Skills" };
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const data = await db
    .select()
    .from(skills)
    .orderBy(desc(skills.sortOrder), desc(skills.createdAt));

  return <SkillsClient initialData={data} />;
}
