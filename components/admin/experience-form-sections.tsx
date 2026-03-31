"use client";

import type { UseFormReturn } from "react-hook-form";
import { Briefcase, ExternalLink } from "lucide-react";

import { ImageUpload } from "@/components/admin/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ExperienceInput } from "@/lib/validations";

export function getExperienceFormDefaultValues(
  initialData?: ExperienceInput
): ExperienceInput {
  return (
    initialData || {
      slug: "",
      position: "",
      company: "",
      location: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      isCurrent: false,
      description: [""],
      achievements: [""],
      skills: [],
      companyUrl: "",
      logo: "",
      sortOrder: 0,
    }
  );
}

export function ExperienceFormPreview({
  form,
  descriptionCount,
  achievementCount,
}: {
  form: UseFormReturn<ExperienceInput>;
  descriptionCount: number;
  achievementCount: number;
}) {
  const isCurrent = form.watch("isCurrent");

  return (
    <>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Quick Preview
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          {form.watch("position") || "Untitled role"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {form.watch("company") ||
            "Add company info to preview the public timeline entry."}
        </p>
      </div>
      <div className="space-y-3 text-sm">
        <div className="rounded-2xl border border-border/60 p-3">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            Timeline
          </div>
          <p className="mt-1 text-muted-foreground">
            {form.watch("startDate") || "Start"} to{" "}
            {isCurrent ? "Present" : form.watch("endDate") || "End date"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="font-medium text-foreground">Public slug</p>
          <p className="mt-1 break-all text-muted-foreground">
            /experience/{form.watch("slug") || "experience-slug"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="font-medium text-foreground">Structured content</p>
          <p className="mt-1 text-muted-foreground">
            {descriptionCount} description item
            {descriptionCount === 1 ? "" : "s"} and {achievementCount} achievement
            {achievementCount === 1 ? "" : "s"}
          </p>
        </div>
        {form.watch("companyUrl") ? (
          <a
            href={form.watch("companyUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Open company website
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </>
  );
}

export function ExperienceBasicsSection({
  form,
}: {
  form: UseFormReturn<ExperienceInput>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {([
          ["company", "Company Name", "E.g. Acme Corp"],
          ["position", "Position / Role", "E.g. Senior Developer"],
          ["slug", "Slug", "acme-corp-senior-dev"],
          ["location", "Location", "E.g. Remote, NY"],
        ] as const).map(([name, label, placeholder]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="companyUrl"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Company Website Link</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export function ExperienceTimelineSection({
  form,
}: {
  form: UseFormReturn<ExperienceInput>;
}) {
  const isCurrent = form.watch("isCurrent");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline & Media</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="isCurrent"
          render={({ field }) => (
            <FormItem className="md:col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Current Role</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Is this your current position?
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value);
                    if (value) {
                      form.setValue("endDate", null);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isCurrent ? (
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem className="mt-4 md:col-span-2">
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value || ""}
                  onChange={field.onChange}
                  folder="portfolio/experience/logos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
