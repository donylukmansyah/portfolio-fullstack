"use client";

import dynamic from "next/dynamic";
import type { JSONContent } from "@tiptap/core";
import type { UseFormReturn } from "react-hook-form";

import { ImageUpload } from "@/components/admin/image-upload";
import { TagsInput } from "@/components/admin/tags-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  EMPTY_BLOG_CONTENT,
  normalizeBlogSlug,
} from "@/lib/blog-editor-config";
import type { BlogInput } from "@/lib/validations";

import { BlogFormSidebar } from "./blog-form-sidebar";
import type { BlogFormDerivedState } from "./blog-form-state";

const BlogEditor = dynamic(
  () =>
    import("@/components/admin/blog-editor").then((mod) => mod.BlogEditor),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-border/60 bg-background p-4 text-sm text-muted-foreground">
        Loading editor...
      </div>
    ),
  }
);

interface BlogFormSectionProps {
  form: UseFormReturn<BlogInput>;
  state: BlogFormDerivedState;
}

interface BlogBasicsSectionProps extends BlogFormSectionProps {
  onSlugManualEdit: () => void;
}

export function BlogBasicsSection({
  form,
  state,
  onSlugManualEdit,
}: BlogBasicsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Basics</CardTitle>
        <CardDescription>
          Control the public URL, summary copy, and the main body content.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="How I built a dynamic CMS in Next.js"
                    {...field}
                  />
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
                  <Input
                    placeholder="how-i-built-a-dynamic-cms"
                    {...field}
                    onChange={(event) => {
                      onSlugManualEdit();
                      field.onChange(normalizeBlogSlug(event.target.value));
                    }}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Public URL: /blogs/{state.slug || "your-article-slug"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A concise summary used on the blog card, metadata, and article lead paragraph."
                  className="min-h-[110px]"
                  {...field}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                {state.excerpt.length}/320 characters
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentJson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Article Body</FormLabel>
              <FormControl>
                <BlogEditor
                  value={(field.value as JSONContent) || EMPTY_BLOG_CONTENT}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                {state.contentStats.blocks} top-level block
                {state.contentStats.blocks === 1 ? "" : "s"} tracked in the
                editor.
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export function BlogPublishingSection({
  form,
}: BlogFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing</CardTitle>
        <CardDescription>
          Set visibility, tags, featuring, and manual ordering.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="tags"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Next.js, CMS, Tiptap"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="md:col-span-2 flex flex-row items-center justify-between rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="space-y-1">
                <FormLabel className="text-base">
                  Feature on homepage
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Highlight this article in the featured blog section.
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

export { BlogFormSidebar as BlogSidebar };
