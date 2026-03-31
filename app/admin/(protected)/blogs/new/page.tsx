import type { Metadata } from "next";

import { BlogForm } from "@/components/admin/blog-form";

export const metadata: Metadata = { title: "Add Blog" };

export default function NewBlogPage() {
  return <BlogForm />;
}
