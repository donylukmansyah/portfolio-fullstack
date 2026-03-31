"use client";

import type { UseFormReturn } from "react-hook-form";
import { ExternalLink, Sparkles } from "lucide-react";

import type { ProjectInput } from "@/lib/validations";

export function ProjectFormPreview({
  form,
  galleryCount,
}: {
  form: UseFormReturn<ProjectInput>;
  galleryCount: number;
}) {
  return (
    <>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Quick Preview
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          {form.watch("companyName") || "Untitled project"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {form.watch("shortDescription") ||
            "Add a short summary so admins can sanity-check the public card copy."}
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="font-medium text-foreground">Public slug</p>
          <p className="mt-1 break-all text-muted-foreground">
            /projects/{form.watch("slug") || "your-project-slug"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Visibility
          </div>
          <p className="mt-1 text-muted-foreground">
            {form.watch("isFeatured")
              ? "Featured project on portfolio highlights."
              : "Regular project listing."}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="font-medium text-foreground">Gallery coverage</p>
          <p className="mt-1 text-muted-foreground">
            {galleryCount} image{galleryCount === 1 ? "" : "s"} attached
          </p>
        </div>
        {form.watch("websiteLink") ? (
          <a
            href={form.watch("websiteLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Open website link
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </>
  );
}
