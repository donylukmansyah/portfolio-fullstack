"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SocialLinkFormProps {
  initialData?: SocialLinkInput & { id: string };
}

export function SocialLinkForm({ initialData }: SocialLinkFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: initialData || {
      name: "",
      username: "",
      iconKey: "",
      link: "",
      sortOrder: 0,
    },
  });

  async function onSubmit(data: SocialLinkInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit
        ? `/api/admin/social-links/${initialData.id}`
        : "/api/admin/social-links";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

      toast({
        title: isEdit ? "Social link updated" : "Social link created",
        description: "Your changes have been saved successfully.",
      });

      router.push("/admin/social-links");
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
          title={initialData ? "Edit Social Link" : "Create Social Link"}
          description="Maintain clean outbound profile links with clear ordering and platform metadata."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/social-links")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Social Link
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
                  {form.watch("name") || "Untitled platform"}
                </h2>
              </div>
              <div className="rounded-2xl border border-border/60 p-3">
                <p className="font-medium text-foreground">
                  @{form.watch("username") || "username"}
                </p>
                <p className="mt-1 break-all text-muted-foreground">
                  {form.watch("link") || "https://..."}
                </p>
              </div>
              {form.watch("link") ? (
                <a
                  href={form.watch("link")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Open link
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Social Link Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. GitHub, LinkedIn, Twitter..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. namanbarkiya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. github, linkedin..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
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
