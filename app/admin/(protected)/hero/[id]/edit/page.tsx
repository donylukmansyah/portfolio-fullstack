import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HeroForm } from "@/components/admin/hero-form";

export const metadata: Metadata = { title: "Edit Hero Content" };

export default async function EditHeroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [hero] = await db.select().from(heroContent).where(eq(heroContent.id, id));

  if (!hero) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Hero Content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update the content for &quot;{hero.name}&quot;.
        </p>
      </div>
      <HeroForm
        initialData={{
          id: hero.id,
          name: hero.name,
          title: hero.title,
          description: hero.description,
          image: hero.image,
          resume: hero.resume,
          isActive: hero.isActive,
        }}
      />
    </div>
  );
}
