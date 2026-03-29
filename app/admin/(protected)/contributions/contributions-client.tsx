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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contributions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast({ title: "Contribution deleted successfully" });
      } else {
        throw new Error("Failed to delete contribution");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const columns: Column<Contribution>[] = [
    { key: "repo", label: "Repository", sortable: true },
    { key: "repoOwner", label: "Owner", sortable: true },
    { key: "isFeatured", label: "Featured", sortable: true, render: (val) => val ? "Yes" : "No" },
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contributions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your open-source contributions.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/contributions/new">
            <Plus className="mr-2 h-4 w-4" /> Add Contribution
          </Link>
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="repo"
        searchPlaceholder="Search by repository name..."
        emptyMessage="No contributions found."
        actions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={row.link} target="_blank" rel="noopener noreferrer" title="View Repo/PR">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/contributions/${row.id}`} title="Edit">
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
                  <AlertDialogTitle>Delete contribution?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the contribution for "{row.repo}".
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
