"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { certificateSchema, type CertificateInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CertificateFormProps {
  initialData?: CertificateInput & { id: string };
}

export function CertificateForm({ initialData }: CertificateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      issuer: "",
      imageUrl: "",
      imagePublicId: "",
      isFeatured: false,
      sortOrder: 0,
    },
  });

  async function onSubmit(data: CertificateInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit
        ? `/api/admin/certificates/${initialData.id}`
        : "/api/admin/certificates";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

      toast({
        title: isEdit ? "Certificate updated" : "Certificate added",
        description: "Your changes have been saved successfully.",
      });

      router.push("/admin/certificates");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminFormShell
          title={initialData ? "Edit Certificate" : "Create Certificate"}
          description="Tambahkan atau perbarui sertifikat, upload gambar sertifikat, dan atur visibilitas."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/certificates")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Certificate
              </Button>
            </>
          }
          preview={
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Preview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {form.watch("name") || "Untitled certificate"}
                </h2>
                <p className="text-muted-foreground">
                  {form.watch("description") ||
                    "Add a short description for this certificate."}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  Certificate Info
                </div>
                <p className="mt-2 text-muted-foreground">
                  Issuer: {form.watch("issuer") || "—"} •{" "}
                  {form.watch("isFeatured") ? "Featured" : "Standard"}
                </p>
              </div>
              {form.watch("imageUrl") && (
                <div className="rounded-xl overflow-hidden border">
                  {form.watch("imageUrl")?.toLowerCase().endsWith(".pdf") ||
                  form.watch("imageUrl")?.includes("/raw/") ? (
                    <div className="flex items-center gap-3 p-4 bg-muted/50">
                      <FileText className="h-6 w-6 text-red-500" />
                      <a
                        href={form.watch("imageUrl") || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Preview PDF ↗
                      </a>
                    </div>
                  ) : (
                    <img
                      src={form.watch("imageUrl") || ""}
                      alt="Certificate preview"
                      className="w-full h-auto"
                    />
                  )}
                </div>
              )}
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Belajar Membuat Aplikasi Web dengan React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deskripsi singkat tentang sertifikat..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Dicoding, Google, Coursera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate File</FormLabel>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload gambar (JPG, PNG, WebP) atau file PDF sertifikat.
                    </p>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={(url) => field.onChange(url)}
                        folder="portfolio/certificates"
                        accept="image/*,application/pdf"
                        label="Upload Image / PDF"
                        onUploadComplete={(asset) => {
                          form.setValue("imagePublicId", asset.publicId || "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Tampilkan sertifikat ini di halaman utama.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </AdminFormShell>
      </form>
    </Form>
  );
}
