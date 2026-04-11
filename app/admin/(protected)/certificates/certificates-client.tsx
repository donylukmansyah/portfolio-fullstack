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

type Certificate = {
  id: string;
  name: string;
  description: string;
  issuer: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  isFeatured: boolean | null;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export function CertificatesClient({ initialData }: { initialData: Certificate[] }) {
  const [data, setData] = useState(initialData);
  const { toast } = useToast();
  const featuredCount = data.filter((item) => item.isFeatured).length;

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/certificates/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Certificate deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<Certificate>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "issuer", label: "Issuer", sortable: true },
    {
      key: "imageUrl",
      label: "Image",
      render: (val) =>
        val ? (
          <img
            src={val as string}
            alt="cert"
            className="h-8 w-12 rounded object-cover"
          />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        ),
    },
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
        title="Certificates"
        description="Kelola sertifikasi profesional, upload gambar sertifikat, dan atur visibilitas di portfolio publik."
        badge={`${featuredCount} featured`}
        actions={
          <Button asChild>
            <Link href="/admin/certificates/new">
              <Plus className="mr-2 h-4 w-4" /> Add Certificate
            </Link>
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search certificates by name..."
        emptyMessage="No certificates found."
        summary={<Badge variant="outline">Featured: {featuredCount}</Badge>}
        actions={(row) => (
          <AdminTableRowActions
            editHref={`/admin/certificates/${row.id}`}
            deleteTitle="Delete certificate?"
            deleteDescription={`This will permanently delete "${row.name}". This action cannot be undone.`}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />
    </div>
  );
}
