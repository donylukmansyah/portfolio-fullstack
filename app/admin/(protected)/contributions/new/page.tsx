import type { Metadata } from "next";
import { ContributionForm } from "@/components/admin/contribution-form";

export const metadata: Metadata = { title: "Add Contribution" };

export default function NewContributionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Contribution</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Record a new open-source contribution.
        </p>
      </div>
      <ContributionForm />
    </div>
  );
}
