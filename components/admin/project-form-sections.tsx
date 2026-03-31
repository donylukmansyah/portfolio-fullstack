"use client";

import type { UseFormReturn } from "react-hook-form";

import { TagsInput } from "@/components/admin/tags-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectInput } from "@/lib/validations";

export function getProjectFormDefaultValues(
  initialData?: ProjectInput
): ProjectInput {
  return (
    initialData || {
      slug: "",
      companyName: "",
      type: "Personal",
      category: [],
      shortDescription: "",
      websiteLink: "",
      githubLink: "",
      techStack: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      companyLogoImg: "",
      descriptionDetails: {
        paragraphs: [""],
        bullets: [""],
      },
      pagesInfo: {
        title: "",
        description: "",
        imgArr: [""],
      },
      isFeatured: false,
      sortOrder: 0,
    }
  );
}

export function ProjectBasicsSection({
  form,
}: {
  form: UseFormReturn<ProjectInput>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g. E-commerce App" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="e-commerce-app" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Display this project prominently.
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief summary of the project..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export function ProjectScheduleSection({
  form,
}: {
  form: UseFormReturn<ProjectInput>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Links & Dates</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {[
          ["websiteLink", "Website Link", "https://..."],
          ["githubLink", "GitHub Link", "https://github.com/..."],
        ].map(([name, label, placeholder]) => (
          <FormField
            key={name}
            control={form.control}
            name={name as "websiteLink" | "githubLink"}
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
        {(["startDate", "endDate"] as const).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name === "startDate" ? "Start Date" : "End Date"}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
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
      </CardContent>
    </Card>
  );
}

export function ProjectTaxonomySection({
  form,
}: {
  form: UseFormReturn<ProjectInput>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories & Tech Stack</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        {([
          ["category", "Categories", "E.g. Fullstack"],
          ["techStack", "Tech Stack", "E.g. React"],
        ] as const).map(([name, label, placeholder]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder={placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
}
