import type { Metadata } from "next";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ExperienceClient } from "./experience-client";

export const metadata: Metadata = { title: "Experience" };
export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const data = await db
    .select()
    .from(experiences)
    .orderBy(desc(experiences.sortOrder), desc(experiences.startDate));

  return <ExperienceClient initialData={data} />;
}
