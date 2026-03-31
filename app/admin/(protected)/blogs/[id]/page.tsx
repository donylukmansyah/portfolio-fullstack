import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogForm } from "@/components/admin/blog-form";
import { getAdminBlogFormData } from "@/lib/blogs";

export const metadata: Metadata = { title: "Edit Blog" };

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blog = await getAdminBlogFormData(id);

  if (!blog) {
    notFound();
  }

  return <BlogForm initialData={blog} />;
}
