import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const data = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return <ProjectsClient initialData={data} />;
}
