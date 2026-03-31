"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { AdminTableRowActions } from "@/components/admin/table-row-actions";
import { useToast } from "@/hooks/use-toast";
import { deleteAdminRecord } from "@/lib/admin-client";
import { Plus } from "lucide-react";
import Link from "next/link";

type Contribution = {
  id: string;
  repo: string;
  description: string;
  repoOwner: string;
  link: string;
  isFeatured: boolean | null;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export function ContributionsClient({ initialData }: { initialData: Contribution[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();
  const featuredCount = data.filter((item) => item.isFeatured).length;

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/contributions/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Contribution deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<Contribution>[] = [
    { key: "repo", label: "Repository", sortable: true },
    { key: "repoOwner", label: "Owner", sortable: true },
    {
      key: "isFeatured",
      label: "Featured",
      sortable: true,
      render: (val) => (val ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>),
    },
    { key: "sortOrder", label: "Sort Order", sortable: true },
    {
      key: "createdAt",
      label: "Added On",
      sortable: true,
      render: (val) => new Date(val as Date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRUD"
        title="Contributions"
        description="Track open-source work, highlight the best contributions, and keep repository links easy to verify."
        badge={`${featuredCount} featured`}
        actions={
          <Button asChild>
            <Link href="/admin/contributions/new">
              <Plus className="mr-2 h-4 w-4" /> Add Contribution
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="repo"
        searchPlaceholder="Search by repository name..."
        emptyMessage="No contributions found."
        summary={<Badge variant="outline">Featured: {featuredCount}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            previewHref={row.link}
            editHref={`/admin/contributions/${row.id}`}
            deleteTitle="Delete contribution?"
            deleteDescription={`This will permanently delete the contribution for "${row.repo}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
