import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm } from "@/components/admin/project-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Project" };

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  
  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update the details of your project.
        </p>
      </div>
      <ProjectForm initialData={project as any} />
    </div>
  );
}
