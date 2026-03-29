import type { Metadata } from "next";
import { db } from "@/db";
import { contributions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ContributionsClient } from "./contributions-client";

export const metadata: Metadata = { title: "Contributions" };
export const dynamic = "force-dynamic";

export default async function ContributionsPage() {
  const data = await db
    .select()
    .from(contributions)
    .orderBy(desc(contributions.sortOrder), desc(contributions.createdAt));

  return <ContributionsClient initialData={data} />;
}
