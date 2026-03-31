"use client";

import { FileUpload } from "@/components/admin/file-upload";
import { AdminFormShell } from "@/components/admin/form-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { heroContentSchema, type HeroContentInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface HeroFormProps {
  initialData?: {
    id: string;
    name: string;
    title: string;
    description: string;
    image?: string | null;
    resume?: string | null;
    isActive: boolean | null;
  };
}

export function HeroForm({ initialData }: HeroFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<HeroContentInput>({
    resolver: zodResolver(heroContentSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      image: initialData?.image ?? "",
      resume: initialData?.resume ?? "",
      isActive: initialData?.isActive ?? false,
    },
  });

  async function onSubmit(values: HeroContentInput) {
    setLoading(true);
    try {
      const url = isEditing
        ? `/api/admin/hero/${initialData.id}`
        : "/api/admin/hero";
      const method = isEditing ? "PUT" : "POST";

      await submitAdminForm(url, method, values);

      toast({
        title: isEditing ? "Hero content updated" : "Hero content created",
        description: values.isActive
          ? "This content is now live on the homepage."
          : "Content saved. Set it as active to display on the homepage.",
      });

      router.push("/admin/hero");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminFormShell
          title={isEditing ? "Edit Hero Content" : "Create Hero Content"}
          description="Update the homepage hero block with cleaner controls for status, media, and messaging."
          modeLabel={isEditing ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/hero")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </>
          }
          preview={
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Preview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {form.watch("name") || "Your name"}
                </h2>
                <p className="text-muted-foreground">
                  {form.watch("title") || "Professional title"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-3">
                <p className="font-medium text-foreground">
                  {form.watch("isActive")
                    ? "This hero entry is active."
                    : "Saved as draft / inactive."}
                </p>
                <p className="mt-1 line-clamp-4 text-muted-foreground">
                  {form.watch("description") ||
                    "Add a short introduction to preview homepage copy."}
                </p>
              </div>
              {form.watch("resume") ? (
                <a
                  href={form.watch("resume")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Open uploaded resume
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>
                Primary content shown on the landing page hero section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dony L" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name displayed in the hero section.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Full Stack Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your professional title shown below the name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short introduction about yourself..."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief introduction text displayed in the hero section.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        folder="portfolio/hero"
                      />
                    </FormControl>
                    <FormDescription>
                      The image shown alongside your hero section. If left
                      blank, default image is used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume (PDF/Doc)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        folder="portfolio/docs"
                        accept=".pdf,.doc,.docx"
                        label="Upload Resume"
                      />
                    </FormControl>
                    <FormDescription>
                      Your resume file. Will be linked to the Resume button.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Set as active to display on the homepage. Only one hero
                        can be active at a time.
                      </FormDescription>
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
            </CardContent>
          </Card>
        </AdminFormShell>
      </form>
    </Form>
  );
}
