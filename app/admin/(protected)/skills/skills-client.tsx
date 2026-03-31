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

type Skill = {
  id: string;
  name: string;
  description: string;
  rating: number;
  iconKey: string;
  isFeatured: boolean | null;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export function SkillsClient({ initialData }: { initialData: Skill[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();
  const featuredCount = data.filter((item) => item.isFeatured).length;

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/skills/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Skill deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<Skill>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "rating", label: "Rating", sortable: true },
    {
      key: "isFeatured",
      label: "Featured",
      sortable: true,
      render: (val) => (val ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>),
    },
    { key: "sortOrder", label: "Sort Order", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRUD"
        title="Skills"
        description="Organize your skill taxonomy, feature the strongest competencies, and keep ratings consistent across the public portfolio."
        badge={`${featuredCount} featured`}
        actions={
          <Button asChild>
            <Link href="/admin/skills/new">
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search skills by name..."
        emptyMessage="No skills found."
        summary={<Badge variant="outline">Featured: {featuredCount}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            editHref={`/admin/skills/${row.id}`}
            deleteTitle="Delete skill?"
            deleteDescription={`This will permanently delete "${row.name}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
