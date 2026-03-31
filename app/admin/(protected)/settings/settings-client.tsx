"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AdminFormShell } from "@/components/admin/form-shell";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { Globe, ImageIcon, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  initialData: Record<string, string>;
}

// Map settings to exactly what we need
type SettingsFormValues = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  aboutImage: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

export function SettingsClient({ initialData }: SettingsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      heroTitle: initialData.heroTitle || "",
      heroSubtitle: initialData.heroSubtitle || "",
      heroImage: initialData.heroImage || "",
      aboutText: initialData.aboutText || "",
      aboutImage: initialData.aboutImage || "",
      contactEmail: initialData.contactEmail || "",
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      seoImage: initialData.seoImage || "",
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    try {
      // Convert flat object back to array of {key, value} for the put API
      const body = Object.entries(data).map(([key, value]) => ({ key, value }));

      await submitAdminForm("/api/admin/settings", "PUT", body);

      toast({
        title: "Settings saved",
        description: "Site settings have been successfully updated.",
      });
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Globals"
        title="Site Settings"
        description="Manage global content defaults, hero copy, contact destination, and SEO metadata from one place."
        badge={`${Object.keys(initialData).length} setting values loaded`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-10">
          <AdminFormShell
            title="Global Site Settings"
            description="Update homepage defaults, SEO metadata, and contact information. Changes here affect multiple parts of the portfolio."
            modeLabel="Live Settings"
            actions={
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            }
            preview={
              <>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Snapshot
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">Current output</h2>
                  <p className="text-sm text-muted-foreground">
                    A quick sanity check for the most visible global settings.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-border/60 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      Hero
                    </div>
                    <p className="mt-2 text-sm">{form.watch("heroTitle") || "No hero title yet"}</p>
                    <p className="text-xs text-muted-foreground">{form.watch("heroSubtitle") || "No subtitle yet"}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      Contact
                    </div>
                    <p className="mt-2 break-all text-sm">{form.watch("contactEmail") || "No contact email set"}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      SEO
                    </div>
                    <p className="mt-2 text-sm">{form.watch("seoTitle") || "No SEO title yet"}</p>
                    <p className="line-clamp-3 text-xs text-muted-foreground">
                      {form.watch("seoDescription") || "No SEO description yet"}
                    </p>
                  </div>
                </div>
              </>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Main content on your landing page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="heroTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Title</FormLabel>
                    <FormControl><Input placeholder="Hi, I'm..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heroSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle (Role)</FormLabel>
                    <FormControl><Input placeholder="Fullstack Developer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Profile Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value || ""} onChange={field.onChange} folder="portfolio/assets" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Personal details and bio.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="aboutText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio / About Text</FormLabel>
                    <FormControl><Textarea placeholder="Write a short summary about yourself..." className="min-h-[120px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Section Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value || ""} onChange={field.onChange} folder="portfolio/assets" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO & Global Details</CardTitle>
                <CardDescription>Default meta tags for sharing and search engines.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Primary Contact Email</FormLabel>
                    <FormControl><Input type="email" placeholder="hello@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default SEO Title</FormLabel>
                    <FormControl><Input placeholder="My Portfolio" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default SEO Description</FormLabel>
                    <FormControl><Textarea placeholder="Meta description..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seoImage"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>OpenGraph / OG Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value || ""} onChange={field.onChange} folder="portfolio/assets" />
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
    </div>
  );
}
