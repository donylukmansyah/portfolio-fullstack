"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { AdminTableRowActions } from "@/components/admin/table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteAdminRecord } from "@/lib/admin-client";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  isFeatured: boolean;
  publishedAt: string | Date | null;
  updatedAt: string | Date;
};

export function BlogsClient({ initialData }: { initialData: BlogRow[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();

  const publishedCount = data.filter((item) => item.status === "published").length;

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/blogs/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Blog deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const columns: Column<BlogRow>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "slug", label: "Slug", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value) =>
        value === "published" ? (
          <Badge>Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (value) =>
        value ? (
          <Badge variant="outline">Featured</Badge>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    {
      key: "publishedAt",
      label: "Published",
      sortable: true,
      render: (value) =>
        value ? new Date(value as string | Date).toLocaleDateString() : "—",
    },
    {
      key: "updatedAt",
      label: "Updated",
      sortable: true,
      render: (value) => new Date(value as string | Date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Editorial"
        title="Blogs"
        description="Manage drafts, publish long-form articles, and keep the public blog section in sync with the admin CMS."
        badge={`${publishedCount} published`}
        actions={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="mr-2 h-4 w-4" /> Add Blog
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search blog posts..."
        emptyMessage="No blog posts found."
        summary={<Badge variant="outline">Published: {publishedCount}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            previewHref={
              row.status === "published" ? `/blogs/${row.slug}` : undefined
            }
            editHref={`/admin/blogs/${row.id}`}
            deleteTitle="Delete blog post?"
            deleteDescription={`This will permanently delete the article "${row.title}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
