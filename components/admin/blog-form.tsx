"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  BlogBasicsSection,
  BlogPublishingSection,
  BlogSidebar,
} from "@/components/admin/blog-form-sections";
import { useBlogFormDerivedState } from "@/components/admin/blog-form-state";
import { AdminFormShell } from "@/components/admin/form-shell";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import {
  createBlogFormDefaults,
  type AdminBlogFormData,
} from "@/lib/blog-form";
import { normalizeBlogSlug } from "@/lib/blog-editor-config";
import { blogSchema, type BlogInput } from "@/lib/validations";

interface BlogFormProps {
  initialData?: AdminBlogFormData;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData);

  const form = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: createBlogFormDefaults(initialData),
  });

  const state = useBlogFormDerivedState(form.control);

  useEffect(() => {
    if (slugManuallyEdited) return;

    form.setValue("slug", normalizeBlogSlug(state.title || ""), {
      shouldValidate: true,
    });
  }, [form, slugManuallyEdited, state.title]);

  async function onSubmit(data: BlogInput) {
    setIsLoading(true);

    try {
      const isEdit = !!initialData;
      const url = isEdit ? `/api/admin/blogs/${initialData.id}` : "/api/admin/blogs";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

      toast({
        title: isEdit ? "Blog updated" : "Blog created",
        description: "Your article has been saved successfully.",
      });

      router.push("/admin/blogs");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-10">
        <AdminFormShell
          title={initialData ? "Edit Blog Post" : "Create Blog Post"}
          description="Write long-form content with a structured editor, Cloudinary-backed media, and publish-ready metadata."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              {initialData && initialData.status === "published" ? (
                <Button variant="outline" asChild>
                  <Link href={`/blogs/${initialData.slug}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View live
                  </Link>
                </Button>
              ) : null}
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/blogs")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Blog
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
                  {state.title || "Untitled article"}
                </h2>
              </div>
              <div className="rounded-2xl border border-border/60 p-3">
                <p className="font-medium text-foreground">
                  /blogs/{state.slug || "your-article-slug"}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {state.status === "published"
                    ? "Visible on the public site once saved."
                    : "Saved as a draft and hidden from public routes."}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-3">
                <p className="font-medium text-foreground">Content snapshot</p>
                <p className="mt-1 text-muted-foreground">
                  {state.tags.length} tag{state.tags.length === 1 ? "" : "s"} selected
                </p>
                <p className="mt-1 text-muted-foreground">
                  {state.contentStats.blocks} block
                  {state.contentStats.blocks === 1 ? "" : "s"} tracked
                </p>
              </div>
            </div>
          }
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-6">
              <BlogBasicsSection
                form={form}
                state={state}
                onSlugManualEdit={() => setSlugManuallyEdited(true)}
              />
              <BlogPublishingSection form={form} state={state} />
            </div>

            <BlogSidebar form={form} />
          </div>
        </AdminFormShell>
      </form>
    </Form>
  );
}
