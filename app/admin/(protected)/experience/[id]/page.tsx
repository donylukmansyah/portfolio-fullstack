import type { Metadata } from "next";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ExperienceForm } from "@/components/admin/experience-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Experience" };

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { id } = await params;
  
  const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
  
  if (!experience) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Experience</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update your experience entry details.
        </p>
      </div>
      <ExperienceForm initialData={experience as any} />
    </div>
  );
}
