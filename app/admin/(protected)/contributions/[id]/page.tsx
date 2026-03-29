import type { Metadata } from "next";
import { db } from "@/db";
import { contributions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ContributionForm } from "@/components/admin/contribution-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Contribution" };

interface EditContributionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContributionPage({ params }: EditContributionPageProps) {
  const { id } = await params;
  
  const [contribution] = await db.select().from(contributions).where(eq(contributions.id, id));
  
  if (!contribution) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Contribution</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update the details of your open-source contribution.
        </p>
      </div>
      <ContributionForm initialData={contribution as any} />
    </div>
  );
}
