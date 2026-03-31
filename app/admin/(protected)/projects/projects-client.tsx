"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminTableRowActions } from "@/components/admin/table-row-actions";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { useToast } from "@/hooks/use-toast";
import { deleteAdminRecord } from "@/lib/admin-client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: string;
  companyName: string;
  slug: string;
  type: string;
  isFeatured: boolean | null;
  createdAt: Date;
};

export function ProjectsClient({ initialData }: { initialData: Project[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();
  const featuredCount = data.filter((item) => item.isFeatured).length;

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/projects/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Project deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<Project>[] = [
    { key: "companyName", label: "Name", sortable: true },
    { key: "slug", label: "Slug", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "isFeatured",
      label: "Featured",
      render: (val) => val ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (val) => new Date(val as Date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRUD"
        title="Projects"
        description="Manage portfolio entries, keep featured work visible, and jump directly to edit or public preview from one workspace."
        badge={`${featuredCount} featured`}
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="companyName"
        searchPlaceholder="Search projects by name..."
        emptyMessage="No projects found."
        summary={<Badge variant="outline">Featured: {featuredCount}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            previewHref={`/projects/${row.slug}`}
            editHref={`/admin/projects/${row.id}`}
            deleteTitle="Delete project?"
            deleteDescription={`This will permanently delete the project "${row.companyName}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
