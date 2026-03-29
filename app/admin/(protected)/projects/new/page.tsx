import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "Add Project" };

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a new project for your portfolio.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
