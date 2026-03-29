import type { Metadata } from "next";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SocialLinkForm } from "@/components/admin/social-link-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Social Link" };

interface EditSocialLinkPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSocialLinkPage({ params }: EditSocialLinkPageProps) {
  const { id } = await params;
  
  const [socialLink] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
  
  if (!socialLink) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Social Link</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update your social link details.
        </p>
      </div>
      <SocialLinkForm initialData={socialLink as any} />
    </div>
  );
}
