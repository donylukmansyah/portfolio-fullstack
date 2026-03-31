"use client";

import { useMemo } from "react";
import type { JSONContent } from "@tiptap/core";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { EMPTY_BLOG_CONTENT } from "@/lib/blog-editor-config";
import type { BlogInput } from "@/lib/validations";

export interface BlogFormDerivedState {
  title: string;
  slug: string;
  excerpt: string;
  status: BlogInput["status"];
  tags: string[];
  contentJson: JSONContent;
  contentStats: {
    blocks: number;
    chars: number;
  };
}

export function useBlogFormDerivedState(control: Control<BlogInput>) {
  const values = useWatch({ control });
  const contentJson =
    (values.contentJson as JSONContent | undefined) ?? EMPTY_BLOG_CONTENT;

  return useMemo<BlogFormDerivedState>(() => {
    const blocks = Array.isArray(contentJson.content)
      ? contentJson.content.length
      : 0;

    return {
      title: values.title ?? "",
      slug: values.slug ?? "",
      excerpt: values.excerpt ?? "",
      status: values.status ?? "draft",
      tags: values.tags ?? [],
      contentJson,
      contentStats: {
        blocks,
        chars: JSON.stringify(contentJson).length,
      },
    };
  }, [
    contentJson,
    values.excerpt,
    values.slug,
    values.status,
    values.tags,
    values.title,
  ]);
}
