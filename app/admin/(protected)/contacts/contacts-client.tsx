"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { deleteAdminRecord, submitAdminForm } from "@/lib/admin-client";
import { Eye, Trash2, Mail, MailOpen, ExternalLink } from "lucide-react";
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

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  social: string | null;
  ipAddress: string | null;
  isRead: boolean | null;
  createdAt: Date;
};

export function ContactsClient({ initialData }: { initialData: ContactSubmission[] }) {
  const [messages, setMessages] = useState(initialData);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const toggleRead = async (msg: ContactSubmission) => {
    try {
      await submitAdminForm(`/api/admin/contacts/${msg.id}`, "PATCH", {
        isRead: !msg.isRead,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: !m.isRead } : m))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteAdminRecord(`/api/admin/contacts/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast({ title: "Message deleted" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openMessage = async (msg: ContactSubmission) => {
    setSelected(msg);
    if (!msg.isRead) await toggleRead(msg);
  };

  const columns: Column<ContactSubmission>[] = [
    {
      key: "isRead",
      label: "Status",
      render: (_, row) =>
        row.isRead ? (
          <Badge variant="outline" className="text-muted-foreground">Read</Badge>
        ) : (
          <Badge variant="destructive">Unread</Badge>
        ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_, row) => (
        <span className={row.isRead ? "text-muted-foreground" : "font-medium"}>
          {row.name}
        </span>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    {
      key: "message",
      label: "Preview",
      render: (val) => (
        <span className="text-muted-foreground text-sm line-clamp-1 max-w-xs">
          {String(val).substring(0, 80)}…
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Received",
      sortable: true,
      render: (val) => new Date(val as Date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Review incoming contact requests, triage unread conversations, and resolve each message without leaving the table."
        badge={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      />

      <DataTable
        data={messages}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search by name..."
        emptyMessage="No messages yet."
        summary={<Badge variant="outline">Total messages: {messages.length}</Badge>}
        actions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openMessage(row)}
              title="View"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toggleRead(row)}
              title={row.isRead ? "Mark unread" : "Mark read"}
            >
              {row.isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
            </Button>
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
                  <AlertDialogTitle>Delete message?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the message from {row.name}. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMessage(row.id)}
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

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-[480px]">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Message from {selected.name}</SheetTitle>
                <SheetDescription>
                  {new Date(selected.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                    {selected.email} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {selected.social && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Social / Link</p>
                    <a href={selected.social} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                      {selected.social} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Message</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                {selected.ipAddress && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">IP Address</p>
                    <p className="text-xs text-muted-foreground font-mono">{selected.ipAddress}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
