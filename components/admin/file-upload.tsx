"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, File as FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export function FileUpload({ value, onChange, folder = "portfolio/docs", accept = ".pdf,.doc,.docx", label = "Upload File" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "File size must be less than 10MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        onChange(data.url);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="flex items-center gap-3 border p-3 rounded-md bg-muted/30">
          <FileIcon className="h-8 w-8 text-blue-500" />
          <div className="flex-1 overflow-hidden">
            <Link href={value} target="_blank" className="text-sm font-medium hover:underline truncate block w-full">
              {value.split('/').pop()}
            </Link>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="h-8 w-8 text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-24 rounded-md border border-dashed flex flex-col items-center justify-center bg-muted/50">
          {isUploading ? (
            <div className="flex items-center text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-muted/80 transition p-4">
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground text-center">{label}</span>
              <input type="file" className="hidden" accept={accept} onChange={handleUpload} disabled={isUploading} />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
