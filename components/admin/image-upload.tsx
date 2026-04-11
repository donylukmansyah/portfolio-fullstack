"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { uploadAdminFile, type UploadedAdminAsset } from "@/lib/admin-upload";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  onUploadComplete?: (asset: UploadedAdminAsset) => void;
}

function isPdfUrl(url: string) {
  return url.toLowerCase().endsWith(".pdf") || url.includes("/raw/") || url.includes("resource_type=raw");
}

export function ImageUpload({
  value,
  onChange,
  folder = "portfolio/misc",
  accept = "image/*",
  label = "Upload Image",
  onUploadComplete,
}: ImageUploadProps) {
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

    try {
      const asset = await uploadAdminFile(file, folder);
      onChange(asset.url);
      onUploadComplete?.(asset);
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const isPdf = value && isPdfUrl(value);

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className={`relative rounded-md overflow-hidden border ${isPdf ? "w-full max-w-md" : "w-40 h-40"}`}>
          {isPdf ? (
            <div className="flex items-center gap-3 p-4 bg-muted/50">
              <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">PDF Certificate</p>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Preview in new tab ↗
                </a>
              </div>
            </div>
          ) : (
            <Image src={value} alt="Upload" fill className="object-cover" />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-40 h-40 rounded-md border border-dashed flex flex-col items-center justify-center bg-muted/50">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-muted/80 transition p-4">
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center">{label}</span>
              <input type="file" className="hidden" accept={accept} onChange={handleUpload} disabled={isUploading} />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
