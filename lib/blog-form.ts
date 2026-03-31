import type { JSONContent } from "@tiptap/core";

import { EMPTY_BLOG_CONTENT } from "./blog-editor-config";
import type { BlogInput } from "./validations";

export interface AdminBlogFormData extends BlogInput {
  id: string;
  publishedAt: string | null;
  readingTime: number | null;
}

export function createBlogFormDefaults(
  initialData?: AdminBlogFormData
): BlogInput {
  if (initialData) {
    return initialData;
  }

  return {
    slug: "",
    title: "",
    excerpt: "",
    tags: [],
    coverImageUrl: "",
    coverImagePublicId: "",
    status: "draft",
    contentJson: EMPTY_BLOG_CONTENT as JSONContent,
    seoTitle: "",
    seoDescription: "",
    isFeatured: false,
    sortOrder: 0,
  };
}
