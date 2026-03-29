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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast({ title: "Project deleted successfully" });
      } else {
        throw new Error("Failed to delete project");
      }
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your portfolio projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="companyName"
        searchPlaceholder="Search projects by name..."
        emptyMessage="No projects found."
        actions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={`/projects/${row.slug}`} target="_blank" rel="noopener noreferrer" title="View live">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/projects/${row.id}`} title="Edit">
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
                  <AlertDialogTitle>Delete project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project "{row.companyName}".
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
