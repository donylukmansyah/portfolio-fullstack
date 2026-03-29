import type { Metadata } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SkillForm } from "@/components/admin/skill-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Skill" };

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id } = await params;
  
  const [skill] = await db.select().from(skills).where(eq(skills.id, id));
  
  if (!skill) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Skill</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update the details of your skill.
        </p>
      </div>
      <SkillForm initialData={skill as any} />
    </div>
  );
}
