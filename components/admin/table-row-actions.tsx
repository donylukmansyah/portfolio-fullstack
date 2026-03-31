"use client";

import Link from "next/link";
import { Edit, ExternalLink, Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";

interface AdminTableRowActionsProps {
  editHref?: string;
  previewHref?: string;
  previewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
  deleteDescription: string;
  onDelete?: () => void | Promise<void>;
}

export function AdminTableRowActions({
  editHref,
  previewHref,
  previewTitle = "View live",
  editTitle = "Edit",
  deleteTitle = "Delete item?",
  deleteDescription,
  onDelete,
}: AdminTableRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {previewHref ? (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            title={previewTitle}
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </Button>
      ) : null}

      {editHref ? (
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={editHref} title={editTitle}>
            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </Button>
      ) : null}

      {onDelete ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}
