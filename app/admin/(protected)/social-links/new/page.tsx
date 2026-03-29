import type { Metadata } from "next";
import { SocialLinkForm } from "@/components/admin/social-link-form";

export const metadata: Metadata = { title: "Add Social Link" };

export default function NewSocialLinkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Social Link</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add a new social media or contact link.
        </p>
      </div>
      <SocialLinkForm />
    </div>
  );
}
