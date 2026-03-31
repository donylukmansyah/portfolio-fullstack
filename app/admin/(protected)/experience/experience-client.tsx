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

type Experience = {
  id: string;
  company: string;
  position: string;
  isCurrent: boolean | null;
  startDate: string;
  endDate: string | null;
};

export function ExperienceClient({ initialData }: { initialData: Experience[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();
  const currentCount = data.filter((item) => item.isCurrent).length;

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/experience/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Experience deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<Experience>[] = [
    { key: "company", label: "Company", sortable: true },
    { key: "position", label: "Position", sortable: true },
    {
      key: "isCurrent",
      label: "Status",
      render: (val) => val ? <Badge variant="default">Current</Badge> : <Badge variant="secondary">Past</Badge>,
    },
    {
      key: "startDate",
      label: "Timeline",
      sortable: false,
      render: (_, row) => (
        <span className="text-sm text-muted-foreground">
          {row.startDate} - {row.isCurrent ? "Present" : row.endDate}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRUD"
        title="Experience"
        description="Keep your timeline current, update role details, and maintain a clean work-history narrative for visitors."
        badge={`${currentCount} active role${currentCount === 1 ? "" : "s"}`}
        actions={
          <Button asChild>
            <Link href="/admin/experience/new">
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="company"
        searchPlaceholder="Search experiences by company..."
        emptyMessage="No experiences found."
        summary={<Badge variant="outline">Current roles: {currentCount}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            editHref={`/admin/experience/${row.id}`}
            deleteTitle="Delete experience?"
            deleteDescription={`This will permanently delete the experience at "${row.company}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
