"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/admin/data-table";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
      const res = await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast({ title: "Social link deleted successfully" });
      } else {
        throw new Error("Failed to delete social link");
      }
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage links to your social profiles.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/social-links/new">
            <Plus className="mr-2 h-4 w-4" /> Add Social Link
          </Link>
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search platforms..."
        emptyMessage="No social links found."
        actions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={row.link} target="_blank" rel="noopener noreferrer" title="Visit link">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/social-links/${row.id}`} title="Edit">
                <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete social link?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the link for "{row.name}".
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(row.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      />
    </div>
  );
}
