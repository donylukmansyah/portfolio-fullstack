"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/admin/data-table";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus } from "lucide-react";
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast({ title: "Experience deleted successfully" });
      } else {
        throw new Error("Failed to delete experience");
      }
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your work history.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/experience/new">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Link>
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="company"
        searchPlaceholder="Search experiences by company..."
        emptyMessage="No experiences found."
        actions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/admin/experience/${row.id}`} title="Edit">
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
                  <AlertDialogTitle>Delete experience?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the experience at "{row.company}".
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
