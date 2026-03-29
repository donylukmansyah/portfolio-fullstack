import type { Metadata } from "next";
import { SkillForm } from "@/components/admin/skill-form";

export const metadata: Metadata = { title: "Add Skill" };

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Skill</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add a new technical skill to your portfolio.
        </p>
      </div>
      <SkillForm />
    </div>
  );
}
