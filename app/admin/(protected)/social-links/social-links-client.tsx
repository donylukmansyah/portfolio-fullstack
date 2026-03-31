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

type SocialLink = {
  id: string;
  name: string;
  username: string;
  iconKey: string;
  link: string;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export function SocialLinksClient({ initialData }: { initialData: SocialLink[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/social-links/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Social link deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<SocialLink>[] = [
    { key: "name", label: "Platform", sortable: true },
    { key: "username", label: "Username", sortable: true },
    { key: "link", label: "Link", sortable: true },
    { key: "sortOrder", label: "Sort Order", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="CRUD"
        title="Social Links"
        description="Maintain your public profile links, keep ordering intentional, and validate outbound destinations quickly."
        badge={`${data.length} total link${data.length === 1 ? "" : "s"}`}
        actions={
          <Button asChild>
            <Link href="/admin/social-links/new">
              <Plus className="mr-2 h-4 w-4" /> Add Social Link
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search platforms..."
        emptyMessage="No social links found."
        summary={<Badge variant="outline">Ordered links: {data.length}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            previewHref={row.link}
            editHref={`/admin/social-links/${row.id}`}
            deleteTitle="Delete social link?"
            deleteDescription={`This will permanently delete the link for "${row.name}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
