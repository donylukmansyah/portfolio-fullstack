import type { Metadata } from "next";
import { HeroForm } from "@/components/admin/hero-form";

export const metadata: Metadata = { title: "New Hero Content" };

export default function NewHeroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Hero Content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add new content for the homepage hero section.
        </p>
      </div>
      <HeroForm />
    </div>
  );
}
